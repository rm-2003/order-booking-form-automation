import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';
import config from './config';
import { Profile } from 'passport';
import { v4 as uuidv4 } from 'uuid';

const baseUrl = process.env.API_URL || 'http://localhost:4000/api';

// Configure Google Strategy only if client ID exists
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: `${baseUrl}/auth/google/callback`,
      },
      async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
        try {
          // Check if user exists
          let user = await User.findOne({
            where: {
              provider: 'google',
              providerId: profile.id,
            },
          });

          if (!user) {
            // Create new user if doesn't exist
            const userData = {
              id: uuidv4(), // Generate a UUID for the user ID
              email: profile.emails?.[0].value || '',
              name: profile.displayName,
              provider: 'google' as const,
              providerId: profile.id,
              picture: profile.photos?.[0].value,
              accessToken,
              refreshToken,
            };
            user = await User.create(userData);
          } else {
            // Update existing user's tokens
            await user.update({
              accessToken,
              refreshToken,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Configure Microsoft Strategy only if client ID exists
if (process.env.MICROSOFT_CLIENT_ID) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
        callbackURL: `${baseUrl}/api/auth/microsoft/callback`,
        scope: ['user.read', 'mail.read'],
      },
      async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
        try {
          // Check if user exists
          let user = await User.findOne({
            where: {
              provider: 'microsoft',
              providerId: profile.id,
            },
          });

          if (!user) {
            // Create new user if doesn't exist
            const userData = {
              id: uuidv4(), // Generate a UUID for the user ID
              email: profile.emails?.[0].value || '',
              name: profile.displayName,
              provider: 'microsoft' as const,
              providerId: profile.id,
              picture: profile.photos?.[0].value,
              accessToken,
              refreshToken,
            };
            user = await User.create(userData);
          } else {
            // Update existing user's tokens
            await user.update({
              accessToken,
              refreshToken,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Configure JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    },
    async (payload, done) => {
      try {
        const user = await User.findByPk(payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
});

export default passport; 