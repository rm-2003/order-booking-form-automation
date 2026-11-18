import express, { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';
import { isAuthenticated } from '../middleware/auth';
import Threshold from '../models/Threshold';

const router = express.Router();

// Add these interfaces at the top of the file after the imports
interface ManpowerRecord {
  id: string;
  sr_no: number;
  role_description: string;
  mll_grade: string | null;
  category: string | null;
  roll: string | null;
  ctc: number | null;
  created_at: Date;
  updated_at: Date;
}

interface CapexRecord {
  id: string;
  sr_no: number;
  asset: string;
  asset_description: string | null;
  category: string | null;
  period: number | null;
  amc: number | null;
  unit_cost: number | null;
  created_at: Date;
  updated_at: Date;
}

interface OpexRecord {
  id: string;
  sr_no: number;
  item: string;
  item_description: string | null;
  category: string | null;
  period: number | null;
  unit_cost: number | null;
  created_at: Date;
  updated_at: Date;
}

interface RentalRecord {
  id: string;
  sr_no: number;
  location: string;
  area: number;
  rate_per_sqft: number;
  period: number | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * @route GET /masters/manpower
 * @desc Get all manpower master data
 */
router.get('/manpower', async (_req: Request, res: Response) => {
  try {
    const manpower = await sequelize.query(
      'SELECT * FROM manpower ORDER BY sr_no ASC',
      { type: QueryTypes.SELECT }
    );
    
    return res.status(200).json(manpower);
  } catch (error) {
    console.error('Error fetching manpower data:', error);
    return res.status(500).json({ message: 'Failed to fetch manpower data' });
  }
});

/**
 * @route GET /masters/capex
 * @desc Get all capex master data
 */
router.get('/capex', async (_req: Request, res: Response) => {
  try {
    const capex = await sequelize.query(
      'SELECT * FROM capex ORDER BY sr_no ASC',
      { type: QueryTypes.SELECT }
    );
    
    return res.status(200).json(capex);
  } catch (error) {
    console.error('Error fetching capex data:', error);
    return res.status(500).json({ message: 'Failed to fetch capex data' });
  }
});

/**
 * @route GET /masters/opex
 * @desc Get all opex master data
 */
router.get('/opex', async (_req: Request, res: Response) => {
  try {
    const opex = await sequelize.query(
      'SELECT * FROM opex ORDER BY sr_no ASC',
      { type: QueryTypes.SELECT }
    );
    
    return res.status(200).json(opex);
  } catch (error) {
    console.error('Error fetching opex data:', error);
    return res.status(500).json({ message: 'Failed to fetch opex data' });
  }
});

/**
 * @route GET /masters/rental
 * @desc Get all rental master data
 */
router.get('/rental', async (_req: Request, res: Response) => {
  try {
    const rental = await sequelize.query(
      'SELECT * FROM rental ORDER BY sr_no ASC',
      { type: QueryTypes.SELECT }
    );
    
    return res.status(200).json(rental);
  } catch (error) {
    console.error('Error fetching rental data:', error);
    return res.status(500).json({ message: 'Failed to fetch rental data' });
  }
});

/**
 * @route GET /masters/locations
 * @desc Get distinct locations from rental
 */
router.get('/locations', async (_req: Request, res: Response) => {
  try {
    const locations = await sequelize.query(
      'SELECT DISTINCT location FROM rental ORDER BY location ASC',
      { type: QueryTypes.SELECT }
    );
    
    return res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching location data:', error);
    return res.status(500).json({ message: 'Failed to fetch location data' });
  }
});

/**
 * @route POST /masters/manpower
 * @desc Create or update manpower master data
 */
router.post('/manpower', async (req: Request, res: Response) => {
  try {
    const manpowerData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if the request is for bulk update (array) or single record
      if (Array.isArray(manpowerData)) {
        // Bulk update - delete existing records and insert new ones
        await sequelize.query(
          'DELETE FROM manpower',
          { type: QueryTypes.DELETE, transaction }
        );
        
        if (manpowerData.length > 0) {
          for (const item of manpowerData) {
            await sequelize.query(
              `INSERT INTO manpower (
                id, sr_no, role_description, mll_grade, category, roll, ctc, created_at, updated_at
              ) VALUES (
                uuid_generate_v4(), :srNo, :roleDescription, :mllGrade, :category, :roll, :ctc, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
              )`,
              { 
                replacements: { 
                  srNo: item.sr_no,
                  roleDescription: item.role_description,
                  mllGrade: item.mll_grade || null,
                  category: item.category || null,
                  roll: item.roll || null,
                  ctc: item.ctc || null
                },
                type: QueryTypes.INSERT,
                transaction 
              }
            );
          }
        }
      } else {
        // Single record creation
        const result = (await sequelize.query(
          `INSERT INTO manpower (
            id, sr_no, role_description, mll_grade, category, roll, ctc, created_at, updated_at
          ) VALUES (
            uuid_generate_v4(), :srNo, :roleDescription, :mllGrade, :category, :roll, :ctc, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          ) RETURNING 
            id, 
            sr_no, 
            role_description, 
            mll_grade, 
            category, 
            roll, 
            ctc, 
            COALESCE(created_at, CURRENT_TIMESTAMP) as created_at, 
            COALESCE(updated_at, CURRENT_TIMESTAMP) as updated_at`,
          { 
            replacements: { 
              srNo: manpowerData.sr_no,
              roleDescription: manpowerData.role_description,
              mllGrade: manpowerData.mll_grade || null,
              category: manpowerData.category || null,
              roll: manpowerData.roll || null,
              ctc: manpowerData.ctc || null
            },
            type: QueryTypes.INSERT,
            transaction 
          }
        ) as unknown) as [ManpowerRecord[], any];
        
        // Commit transaction
        await transaction.commit();
        return res.status(201).json(result[0][0]);
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(201).json({ message: 'Manpower master data updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating manpower master data:', error);
    return res.status(500).json({ message: 'Failed to update manpower master data' });
  }
});

/**
 * @route POST /masters/capex
 * @desc Create or update capex master data
 */
router.post('/capex', async (req: Request, res: Response) => {
  try {
    const capexData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if the request is for bulk update (array) or single record
      if (Array.isArray(capexData)) {
        // Bulk update - delete existing records and insert new ones
        await sequelize.query(
          'DELETE FROM capex',
          { type: QueryTypes.DELETE, transaction }
        );
        
        if (capexData.length > 0) {
          for (const item of capexData) {
            await sequelize.query(
              `INSERT INTO capex (
                id, sr_no, asset, asset_description, category, period, amc, unit_cost, created_at, updated_at
              ) VALUES (
                uuid_generate_v4(), :srNo, :asset, :assetDescription, :category, :period, :amc, :unitCost, NOW(), NOW()
              )`,
              { 
                replacements: { 
                  srNo: item.sr_no,
                  asset: item.asset,
                  assetDescription: item.asset_description || null,
                  category: item.category || null,
                  period: item.period || null,
                  amc: item.amc || null,
                  unitCost: item.unit_cost === '' || item.unit_cost === null ? 0 : Number(item.unit_cost)
                },
                type: QueryTypes.INSERT,
                transaction 
              }
            );
          }
        }
        
        // Commit transaction
        await transaction.commit();
        return res.status(201).json({ message: 'Capex master data updated successfully' });
      } else {
        // Single record creation
        const result = (await sequelize.query(
          `INSERT INTO capex (
            id, sr_no, asset, asset_description, category, period, amc, unit_cost, created_at, updated_at
          ) VALUES (
            uuid_generate_v4(), :srNo, :asset, :assetDescription, :category, :period, :amc, :unitCost, NOW(), NOW()
          ) RETURNING 
            id, 
            sr_no, 
            asset, 
            asset_description, 
            category, 
            period, 
            amc, 
            unit_cost, 
            created_at, 
            updated_at`,
          { 
            replacements: { 
              srNo: capexData.sr_no,
              asset: capexData.asset,
              assetDescription: capexData.asset_description || null,
              category: capexData.category || null,
              period: capexData.period || null,
              amc: capexData.amc || null,
              unitCost: capexData.unit_cost === '' || capexData.unit_cost === null ? 0 : Number(capexData.unit_cost)
            },
            type: QueryTypes.INSERT,
            transaction 
          }
        ) as unknown) as [CapexRecord[], any];
        
        // Commit transaction
        await transaction.commit();
        return res.status(201).json(result[0][0]);
      }
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating capex master data:', error);
    return res.status(500).json({ message: 'Failed to update capex master data' });
  }
});

/**
 * @route POST /masters/opex
 * @desc Create or update opex master data
 */
router.post('/opex', async (req: Request, res: Response) => {
  try {
    const opexData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if the request is for bulk update (array) or single record
      if (Array.isArray(opexData)) {
        // Bulk update - delete existing records and insert new ones
        await sequelize.query(
          'DELETE FROM opex',
          { type: QueryTypes.DELETE, transaction }
        );
        
        if (opexData.length > 0) {
          for (const item of opexData) {
            await sequelize.query(
              `INSERT INTO opex (
                id, sr_no, cost_description, category, unit_cost, nos, created_at, updated_at
              ) VALUES (
                uuid_generate_v4(), :srNo, :costDescription, :category, :unitCost, :nos, NOW(), NOW()
              )`,
              { 
                replacements: { 
                  srNo: item.sr_no,
                  costDescription: item.cost_description,
                  category: item.category || null,
                  unitCost: item.unit_cost === '' || item.unit_cost === null ? 0 : Number(item.unit_cost),
                  nos: item.nos || 1
                },
                type: QueryTypes.INSERT,
                transaction 
              }
            );
          }
        }
        
        // Commit transaction
        await transaction.commit();
        return res.status(201).json({ message: 'Opex master data updated successfully' });
      } else {
        // Single record creation
        const result = (await sequelize.query(
          `INSERT INTO opex (
            id, sr_no, cost_description, category, unit_cost, nos, created_at, updated_at
          ) VALUES (
            uuid_generate_v4(), :srNo, :costDescription, :category, :unitCost, :nos, NOW(), NOW()
          ) RETURNING 
            id, 
            sr_no, 
            cost_description, 
            category, 
            unit_cost, 
            nos,
            created_at, 
            updated_at`,
          { 
            replacements: { 
              srNo: opexData.sr_no,
              costDescription: opexData.cost_description,
              category: opexData.category || null,
              unitCost: opexData.unit_cost === '' || opexData.unit_cost === null ? 0 : Number(opexData.unit_cost),
              nos: opexData.nos || 1
            },
            type: QueryTypes.INSERT,
            transaction 
          }
        ) as unknown) as [OpexRecord[], any];
        
        // Commit transaction
        await transaction.commit();
        return res.status(201).json(result[0][0]);
      }
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating opex master data:', error);
    return res.status(500).json({ message: 'Failed to update opex master data' });
  }
});

/**
 * @route POST /masters/rental
 * @desc Create or update rental master data
 */
router.post('/rental', async (req: Request, res: Response) => {
  try {
    const rentalData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if the request is for bulk update (array) or single record
      if (Array.isArray(rentalData)) {
        // Bulk update - delete existing records and insert new ones
        await sequelize.query(
          'DELETE FROM rental',
          { type: QueryTypes.DELETE, transaction }
        );
        
        if (rentalData.length > 0) {
          for (const item of rentalData) {
            await sequelize.query(
              `INSERT INTO rental (
                id, sr_no, location, area_sqft, rent_per_sqft, created_at, updated_at
              ) VALUES (
                uuid_generate_v4(), :srNo, :location, :areaSqft, :rentPerSqft, NOW(), NOW()
              )`,
              { 
                replacements: { 
                  srNo: item.sr_no,
                  location: item.location,
                  areaSqft: item.area_sqft,
                  rentPerSqft: item.rent_per_sqft
                },
                type: QueryTypes.INSERT,
                transaction 
              }
            );
          }
        }
        
        // Commit transaction
        await transaction.commit();
        return res.status(201).json({ message: 'Rental master data updated successfully' });
      } else {
        // Single record creation
        const result = (await sequelize.query(
          `INSERT INTO rental (
            id, sr_no, location, area_sqft, rent_per_sqft, created_at, updated_at
          ) VALUES (
            uuid_generate_v4(), :srNo, :location, :areaSqft, :rentPerSqft, NOW(), NOW()
          ) RETURNING 
            id, 
            sr_no, 
            location, 
            area_sqft, 
            rent_per_sqft, 
            created_at, 
            updated_at`,
          { 
            replacements: { 
              srNo: rentalData.sr_no,
              location: rentalData.location,
              areaSqft: rentalData.area_sqft,
              rentPerSqft: rentalData.rent_per_sqft
            },
            type: QueryTypes.INSERT,
            transaction 
          }
        ) as unknown) as [RentalRecord[], any];
        
        // Commit transaction
        await transaction.commit();
        return res.status(201).json(result[0][0]);
      }
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating rental master data:', error);
    return res.status(500).json({ message: 'Failed to update rental master data' });
  }
});

/**
 * @route DELETE /masters/manpower/:id
 * @desc Delete a manpower master entry by ID
 */
router.delete('/manpower/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if manpower exists
      const manpowerExists = await sequelize.query(
        `SELECT id FROM manpower WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!manpowerExists || manpowerExists.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Manpower not found' });
      }
      
      // Delete manpower
      await sequelize.query(
        `DELETE FROM manpower WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Manpower deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting manpower:', error);
    return res.status(500).json({ message: 'Failed to delete manpower' });
  }
});

/**
 * @route DELETE /masters/capex/:id
 * @desc Delete a capex master entry by ID
 */
router.delete('/capex/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if capex exists
      const capexExists = await sequelize.query(
        `SELECT id FROM capex WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!capexExists || capexExists.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Capex not found' });
      }
      
      // Delete capex
      await sequelize.query(
        `DELETE FROM capex WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Capex deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting capex:', error);
    return res.status(500).json({ message: 'Failed to delete capex' });
  }
});

/**
 * @route DELETE /masters/opex/:id
 * @desc Delete an opex master entry by ID
 */
router.delete('/opex/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if opex exists
      const opexExists = await sequelize.query(
        `SELECT id FROM opex WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!opexExists || opexExists.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Opex not found' });
      }
      
      // Delete opex
      await sequelize.query(
        `DELETE FROM opex WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Opex deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting opex:', error);
    return res.status(500).json({ message: 'Failed to delete opex' });
  }
});

/**
 * @route DELETE /masters/rental/:id
 * @desc Delete a rental master entry by ID
 */
router.delete('/rental/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if rental exists
      const rentalExists = await sequelize.query(
        `SELECT id FROM rental WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!rentalExists || rentalExists.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Rental not found' });
      }
      
      // Delete rental
      await sequelize.query(
        `DELETE FROM rental WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Rental deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting rental:', error);
    return res.status(500).json({ message: 'Failed to delete rental' });
  }
});

/**
 * @route PUT /masters/rental/:id
 * @desc Update a rental master entry by ID
 */
router.put('/rental/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rentalData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if rental exists
      const rentalExists = await sequelize.query(
        `SELECT id FROM rental WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!rentalExists || rentalExists.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Rental not found' });
      }
      
      // Update rental
      const result = await sequelize.query(
        `UPDATE rental SET 
          sr_no = :srNo,
          location = :location,
          area_sqft = :areaSqft,
          rent_per_sqft = :rentPerSqft,
          updated_at = NOW()
        WHERE id = :id
        RETURNING *`,
        { 
          replacements: { 
            id,
            srNo: rentalData.sr_no,
            location: rentalData.location,
            areaSqft: rentalData.area,
            rentPerSqft: rentalData.rate_per_sqft
          },
          type: QueryTypes.UPDATE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      if (!result[0] || !result[0][0]) {
        throw new Error('Failed to update rental record');
      }
      
      return res.status(200).json(result[0][0]);
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating rental:', error);
    return res.status(500).json({ message: 'Failed to update rental' });
  }
});

// Thresholds routes
router.get('/thresholds', isAuthenticated, async (_req: Request, res: Response) => {
  try {
    const thresholds = await Threshold.findAll({
      order: [['vertical', 'ASC'], ['project_type', 'ASC']]
    });
    return res.json(thresholds);
  } catch (error) {
    console.error('Error fetching thresholds:', error);
    return res.status(500).json({ message: 'Failed to fetch thresholds' });
  }
});

router.post('/thresholds', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const {
      vertical,
      project_type,
      gross_margin_percent_min,
      credit_period_days,
      capex_min_lakhs,
      ebit_percent_min,
      ebt_percent_min
    } = req.body;

    // Check if threshold already exists for this vertical and project type
    const existingThreshold = await Threshold.findOne({
      where: { vertical, project_type }
    });

    if (existingThreshold) {
      return res.status(400).json({
        message: 'Threshold already exists for this vertical and project type'
      });
    }

    const threshold = await Threshold.create({
      vertical,
      project_type,
      gross_margin_percent_min,
      credit_period_days,
      capex_min_lakhs,
      ebit_percent_min,
      ebt_percent_min
    });

    return res.status(201).json(threshold);
  } catch (error) {
    console.error('Error creating threshold:', error);
    return res.status(500).json({ message: 'Failed to create threshold' });
  }
});

router.put('/thresholds/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      vertical,
      project_type,
      gross_margin_percent_min,
      credit_period_days,
      capex_min_lakhs,
      ebit_percent_min,
      ebt_percent_min
    } = req.body;

    const threshold = await Threshold.findByPk(id);
    if (!threshold) {
      return res.status(404).json({ message: 'Threshold not found' });
    }

    // Check if updating to a combination that already exists
    if (vertical !== threshold.vertical || project_type !== threshold.project_type) {
      const existingThreshold = await Threshold.findOne({
        where: { vertical, project_type }
      });

      if (existingThreshold) {
        return res.status(400).json({
          message: 'Threshold already exists for this vertical and project type'
        });
      }
    }

    await threshold.update({
      vertical,
      project_type,
      gross_margin_percent_min,
      credit_period_days,
      capex_min_lakhs,
      ebit_percent_min,
      ebt_percent_min
    });

    return res.json(threshold);
  } catch (error) {
    console.error('Error updating threshold:', error);
    return res.status(500).json({ message: 'Failed to update threshold' });
  }
});

router.delete('/thresholds/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const threshold = await Threshold.findByPk(id);
    
    if (!threshold) {
      return res.status(404).json({ message: 'Threshold not found' });
    }

    await threshold.destroy();
    return res.json({ message: 'Threshold deleted successfully' });
  } catch (error) {
    console.error('Error deleting threshold:', error);
    return res.status(500).json({ message: 'Failed to delete threshold' });
  }
});

export default router; 