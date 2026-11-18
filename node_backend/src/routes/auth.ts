import express from 'express';
import passport from 'passport';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import config from '../config/config';
import { sequelize } from '../config/database';

const router = express.Router();

// Local registration
router.post('/register', async (_req, res): Promise<void> => {
  try {
    const { email, password, name } = _req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    const user = await User.create({
      id: uuidv4(),
      email,
      password,
      name,
      provider: 'local',
    });

    // Generate JWT
    const signOptions: SignOptions = {
      expiresIn: config.jwt.expire
    };
    const token = jwt.sign(
      { id: user.id },
      config.jwt.secret,
      signOptions
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Local login
router.post('/login', async (_req, res): Promise<void> => {
  try {
    const { email, password } = _req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const signOptions: SignOptions = {
      expiresIn: config.jwt.expire
    };
    const token = jwt.sign(
      { id: user.id },
      config.jwt.secret,
      signOptions
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get current user
router.get('/me', passport.authenticate('jwt', { session: false }), (_req, res) => {
  const user = _req.user as any;
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
      picture: user.picture,
    }
  });
});

// Google OAuth routes - only if Google strategy is configured
if (process.env.GOOGLE_CLIENT_ID) {
  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (_req, res) => {
      // Generate JWT token
      const signOptions: SignOptions = {
        expiresIn: config.jwt.expire
      };
      const token = jwt.sign(
        { id: (_req.user as any).id },
        config.jwt.secret,
        signOptions
      );
      
      // Check if user needs to set role
      const user = _req.user as any;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      if (!user.role) {
        // Redirect to role selection page
        res.redirect(`${frontendUrl}/auth/select-role?token=${token}`);
      } else {
        // Redirect to home page
        res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
      }
    }
  );
}

// Microsoft OAuth routes - only if Microsoft strategy is configured
if (process.env.MICROSOFT_CLIENT_ID) {
  router.get('/microsoft',
    passport.authenticate('microsoft', { scope: ['user.read', 'mail.read'] })
  );

  router.get('/microsoft/callback',
    passport.authenticate('microsoft', { session: false }),
    (_req, res) => {
      // Generate JWT token
      const signOptions: SignOptions = {
        expiresIn: config.jwt.expire
      };
      const token = jwt.sign(
        { id: (_req.user as any).id },
        config.jwt.secret,
        signOptions
      );
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    }
  );
}

// Logout
router.post('/logout', passport.authenticate('jwt', { session: false }), (_req, res) => {
  // Since we're using JWT, we don't need to do anything on the server
  // The client will remove the token from localStorage
  res.json({ message: 'Logged out successfully' });
});

// Get all users
router.get('/users', passport.authenticate('jwt', { session: false }), async (_req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'picture', 'role'],
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Add endpoint to update user role
router.post('/update-role',
  passport.authenticate('jwt', { session: false }),
  async (_req, res) => {
    try {
      const { role } = _req.body;
      const user = _req.user as any;

      if (!role) {
        return res.status(400).json({ message: 'Role is required' });
      }

      await user.update({ role });

      // Also update all obf_access rows for this user
      await sequelize.query(
        `UPDATE obf_access SET role = :role WHERE "userId" = :userId`,
        { replacements: { role, userId: user.id } }
      );

      return res.json({
        message: 'Role updated successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Error updating role:', error);
      return res.status(500).json({ message: 'Error updating role' });
    }
  }
);

export default router; 