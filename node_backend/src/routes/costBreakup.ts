import express, { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';

const router = express.Router();

/**
 * @route GET /cost-breakup/:obfId/manpower
 * @desc Get manpower cost breakup for an OBF
 */
router.get('/:obfId/manpower', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    const manpowerBreakup = await sequelize.query(
      `SELECT * FROM obf_manpower_breakup WHERE obf_id = :obfId ORDER BY sr_no ASC`,
      { 
        replacements: { obfId },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(manpowerBreakup);
  } catch (error) {
    console.error('Error fetching manpower breakup:', error);
    return res.status(500).json({ message: 'Failed to fetch manpower breakup data' });
  }
});

/**
 * @route POST /cost-breakup/:obfId/manpower
 * @desc Create or update manpower cost breakup for an OBF
 */
router.post('/:obfId/manpower', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    const breakupData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Delete existing records for this OBF
      await sequelize.query(
        `DELETE FROM obf_manpower_breakup WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Insert new records
      if (Array.isArray(breakupData) && breakupData.length > 0) {
        for (const item of breakupData) {
          await sequelize.query(
            `INSERT INTO obf_manpower_breakup (
              id, obf_id, sr_no, role_description, mll_grade, category, roll, ctc, nos, master_id, created_at, updated_at
            ) VALUES (
              uuid_generate_v4(), :obfId, :srNo, :roleDescription, :mllGrade, :category, :roll, :ctc, :nos, :masterId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )`,
            { 
              replacements: { 
                obfId,
                srNo: item.sr_no,
                roleDescription: item.role_description,
                mllGrade: item.mll_grade || null,
                category: item.category || null,
                roll: item.roll || null,
                ctc: item.ctc || null,
                nos: item.nos,
                masterId: item.master_id || null
              },
              type: QueryTypes.INSERT,
              transaction 
            }
          );
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(201).json({ message: 'Manpower breakup updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating manpower breakup:', error);
    return res.status(500).json({ message: 'Failed to update manpower breakup data' });
  }
});

/**
 * @route GET /cost-breakup/:obfId/capex
 * @desc Get capex cost breakup for an OBF
 */
router.get('/:obfId/capex', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    const capexBreakup = await sequelize.query(
      `SELECT * FROM obf_capex_breakup WHERE obf_id = :obfId ORDER BY sr_no ASC`,
      { 
        replacements: { obfId },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(capexBreakup);
  } catch (error) {
    console.error('Error fetching capex breakup:', error);
    return res.status(500).json({ message: 'Failed to fetch capex breakup data' });
  }
});

/**
 * @route POST /cost-breakup/:obfId/capex
 * @desc Create or update capex cost breakup for an OBF
 */
router.post('/:obfId/capex', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    const breakupData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Delete existing records for this OBF
      await sequelize.query(
        `DELETE FROM obf_capex_breakup WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Insert new records
      if (Array.isArray(breakupData) && breakupData.length > 0) {
        for (const item of breakupData) {
          await sequelize.query(
            `INSERT INTO obf_capex_breakup (
              id, obf_id, sr_no, asset, asset_description, category, period, amc, unit_cost, nos, master_id, created_at, updated_at
            ) VALUES (
              uuid_generate_v4(), :obfId, :srNo, :asset, :assetDescription, :category, :period, :amc, :unitCost, :nos, :masterId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )`,
            { 
              replacements: { 
                obfId,
                srNo: item.sr_no,
                asset: item.asset,
                assetDescription: item.asset_description || null,
                category: item.category || null,
                period: item.period || null,
                amc: item.amc || null,
                unitCost: item.unit_cost || null,
                nos: item.nos,
                masterId: item.master_id || null
              },
              type: QueryTypes.INSERT,
              transaction 
            }
          );
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(201).json({ message: 'Capex breakup updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating capex breakup:', error);
    return res.status(500).json({ message: 'Failed to update capex breakup data' });
  }
});

/**
 * @route GET /cost-breakup/:obfId/opex
 * @desc Get opex cost breakup for an OBF
 */
router.get('/:obfId/opex', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    const opexBreakup = await sequelize.query(
      `SELECT * FROM obf_opex_breakup WHERE obf_id = :obfId ORDER BY sr_no ASC`,
      { 
        replacements: { obfId },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(opexBreakup);
  } catch (error) {
    console.error('Error fetching opex breakup:', error);
    return res.status(500).json({ message: 'Failed to fetch opex breakup data' });
  }
});

/**
 * @route POST /cost-breakup/:obfId/opex
 * @desc Create or update opex cost breakup for an OBF
 */
router.post('/:obfId/opex', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    const breakupData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Delete existing records for this OBF
      await sequelize.query(
        `DELETE FROM obf_opex_breakup WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Insert new records
      if (Array.isArray(breakupData) && breakupData.length > 0) {
        for (const item of breakupData) {
          await sequelize.query(
            `INSERT INTO obf_opex_breakup (
              id, obf_id, sr_no, cost_description, unit_cost_per_month, nos, master_id, created_at, updated_at
            ) VALUES (
              uuid_generate_v4(), :obfId, :srNo, :costDescription, :unitCostPerMonth, :nos, :masterId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )`,
            { 
              replacements: { 
                obfId,
                srNo: item.sr_no,
                costDescription: item.cost_description,
                unitCostPerMonth: item.unit_cost_per_month,
                nos: item.nos,
                masterId: item.master_id || null
              },
              type: QueryTypes.INSERT,
              transaction 
            }
          );
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(201).json({ message: 'Opex breakup updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating opex breakup:', error);
    return res.status(500).json({ message: 'Failed to update opex breakup data' });
  }
});

/**
 * @route GET /cost-breakup/:obfId/rental
 * @desc Get rental cost breakup for an OBF
 */
router.get('/:obfId/rental', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    const rentalBreakup = await sequelize.query(
      `SELECT * FROM obf_rent_breakup WHERE obf_id = :obfId`,
      { 
        replacements: { obfId },
        type: QueryTypes.SELECT 
      }
    );
    // Ensure all fields are present in the response, even if null
    const defaultRental = {
      built_up_to_carpet_ratio: null,
      rent_per_sqft_on_built_up: null,
      built_up_area_sqft: null,
      building_maintenance: null,
      warai_charges: null,
      interest_on_security_deposit: null,
      security_deposit: null,
      brokerage: null,
      pre_go_live_rental: null,
      stamp_duty_amount: null,
      registration_amount: null,
      master_id: null,
      location: null,
      area: null
    };
    const result = rentalBreakup[0] ? { ...defaultRental, ...rentalBreakup[0] } : defaultRental;
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching rental breakup:', error);
    return res.status(500).json({ message: 'Failed to fetch rental breakup data' });
  }
});

/**
 * @route POST /cost-breakup/:obfId/rental
 * @desc Create or update rental cost breakup for an OBF
 */
router.post('/:obfId/rental', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    const rentalData = req.body;
    console.log("Received rental data:", rentalData);
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Delete existing record for this OBF
      await sequelize.query(
        `DELETE FROM obf_rent_breakup WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Insert new record
      if (Array.isArray(rentalData) && rentalData.length > 0) {
        for (const item of rentalData) {
          const replacements = { 
            obfId,
            builtUpToCarpetRatio: item.built_up_to_carpet_ratio || null,
            rentPerSqftOnBuiltUp: item.rent_per_sqft_on_built_up || null,
            builtUpAreaSqft: item.built_up_area_sqft || null,
            buildingMaintenance: item.building_maintenance || null,
            waraiCharges: item.warai_charges || null,
            interestOnSecurityDeposit: item.interest_on_security_deposit || null,
            securityDeposit: item.security_deposit || null,
            brokerage: item.brokerage || null,
            preGoLiveRental: item.pre_go_live_rental || null,
            stampDutyAmount: item.stamp_duty_amount || null,
            registrationAmount: item.registration_amount || null,
            masterId: item.master_id || null,
            location: item.location || null,
            area: item.area || null
          };
          console.log("Replacements object:", replacements);
          await sequelize.query(
            `INSERT INTO obf_rent_breakup (
              id, obf_id, built_up_to_carpet_ratio, rent_per_sqft_on_built_up, 
              built_up_area_sqft, building_maintenance, warai_charges, 
              interest_on_security_deposit, security_deposit, brokerage, pre_go_live_rental, 
              stamp_duty_amount, registration_amount, master_id, location, area, created_at, updated_at
            ) VALUES (
              uuid_generate_v4(), :obfId, :builtUpToCarpetRatio, :rentPerSqftOnBuiltUp,
              :builtUpAreaSqft, :buildingMaintenance, :waraiCharges,
              :interestOnSecurityDeposit, :securityDeposit, :brokerage, :preGoLiveRental,
              :stampDutyAmount, :registrationAmount, :masterId, :location, :area, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )`,
            { 
              replacements,
              type: QueryTypes.INSERT,
              transaction 
            }
          );
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(201).json({ message: 'Rental breakup updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating rental breakup:', error);
    return res.status(500).json({ message: 'Failed to update rental breakup data' });
  }
});

/**
 * @route GET /cost-breakup/:obfId/implementation-cost
 * @desc Get implementation cost breakup for an OBF
 */
router.get('/:obfId/implementation-cost', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    const implementationCost = await sequelize.query(
      `SELECT * FROM obf_implementation_cost WHERE obf_id = :obfId ORDER BY cost_type ASC`,
      { 
        replacements: { obfId },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(implementationCost);
  } catch (error) {
    console.error('Error fetching implementation cost:', error);
    return res.status(500).json({ message: 'Failed to fetch implementation cost data' });
  }
});

/**
 * @route POST /cost-breakup/:obfId/implementation-cost
 * @desc Create or update implementation cost breakup for an OBF
 */
router.post('/:obfId/implementation-cost', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    const breakupData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Delete existing records for this OBF
      await sequelize.query(
        `DELETE FROM obf_implementation_cost WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Insert new records
      if (Array.isArray(breakupData) && breakupData.length > 0) {
        for (const item of breakupData) {
          await sequelize.query(
            `INSERT INTO obf_implementation_cost (
              id, obf_id, cost_type, unit_cost, nos, created_at, updated_at
            ) VALUES (
              uuid_generate_v4(), :obfId, :costType, :unitCost, :nos, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )`,
            { 
              replacements: { 
                obfId,
                costType: item.cost_type,
                unitCost: item.unit_cost || null,
                nos: item.nos
              },
              type: QueryTypes.INSERT,
              transaction 
            }
          );
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(201).json({ message: 'Implementation cost updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating implementation cost:', error);
    return res.status(500).json({ message: 'Failed to update implementation cost data' });
  }
});

/**
 * @route GET /cost-breakup/:obfId/pre-go-live-manpower
 * @desc Get pre go live manpower breakup for an OBF
 */
router.get('/:obfId/pre-go-live-manpower', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    const preGoLiveManpower = await sequelize.query(
      `SELECT * FROM obf_pre_go_live_manpower WHERE obf_id = :obfId ORDER BY manpower_type ASC`,
      { 
        replacements: { obfId },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(preGoLiveManpower);
  } catch (error) {
    console.error('Error fetching pre go live manpower:', error);
    return res.status(500).json({ message: 'Failed to fetch pre go live manpower data' });
  }
});

/**
 * @route POST /cost-breakup/:obfId/pre-go-live-manpower
 * @desc Create or update pre go live manpower breakup for an OBF
 */
router.post('/:obfId/pre-go-live-manpower', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    const breakupData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Delete existing records for this OBF
      await sequelize.query(
        `DELETE FROM obf_pre_go_live_manpower WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Insert new records
      if (Array.isArray(breakupData) && breakupData.length > 0) {
        for (const item of breakupData) {
          await sequelize.query(
            `INSERT INTO obf_pre_go_live_manpower (
              id, obf_id, manpower_type, nos, cost_per_month, created_at, updated_at
            ) VALUES (
              uuid_generate_v4(), :obfId, :manpowerType, :nos, :costPerMonth, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )`,
            { 
              replacements: { 
                obfId,
                manpowerType: item.manpower_type,
                nos: item.nos || 0,
                costPerMonth: item.cost_per_month || 0
              },
              type: QueryTypes.INSERT,
              transaction 
            }
          );
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(201).json({ message: 'Pre go live manpower updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating pre go live manpower:', error);
    return res.status(500).json({ message: 'Failed to update pre go live manpower data' });
  }
});

/**
 * @route GET /cost-breakup/:obfId/additional-implementation-cost
 * @desc Get additional implementation cost breakup for an OBF
 */
router.get('/:obfId/additional-implementation-cost', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    const additionalImplementationCost = await sequelize.query(
      `SELECT * FROM obf_additional_implementation_cost WHERE obf_id = :obfId ORDER BY description ASC`,
      { 
        replacements: { obfId },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(additionalImplementationCost);
  } catch (error) {
    console.error('Error fetching additional implementation cost:', error);
    return res.status(500).json({ message: 'Failed to fetch additional implementation cost data' });
  }
});

/**
 * @route POST /cost-breakup/:obfId/additional-implementation-cost
 * @desc Create or update additional implementation cost breakup for an OBF
 */
router.post('/:obfId/additional-implementation-cost', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    const breakupData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Delete existing records for this OBF
      await sequelize.query(
        `DELETE FROM obf_additional_implementation_cost WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Insert new records
      if (Array.isArray(breakupData) && breakupData.length > 0) {
        for (const item of breakupData) {
          await sequelize.query(
            `INSERT INTO obf_additional_implementation_cost (
              id, obf_id, description, unit_cost, nos, created_at, updated_at
            ) VALUES (
              uuid_generate_v4(), :obfId, :description, :unitCost, :nos, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )`,
            { 
              replacements: { 
                obfId,
                description: item.description,
                unitCost: item.unit_cost || null,
                nos: item.nos
              },
              type: QueryTypes.INSERT,
              transaction 
            }
          );
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(201).json({ message: 'Additional implementation cost updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating additional implementation cost:', error);
    return res.status(500).json({ message: 'Failed to update additional implementation cost data' });
  }
});

/**
 * Helper function to reorder sr_no values in a table
 */
async function reorderSrNo(tableName: string, obfId: string, transaction: any) {
  // Get all records ordered by current sr_no
  const records = await sequelize.query(
    `SELECT id FROM ${tableName} WHERE obf_id = :obfId ORDER BY sr_no ASC`,
    { 
      replacements: { obfId },
      type: QueryTypes.SELECT,
      transaction 
    }
  );
  
  // Update sr_no for each record
  for (let i = 0; i < records.length; i++) {
    await sequelize.query(
      `UPDATE ${tableName} SET sr_no = :newSrNo WHERE id = :id`,
      { 
        replacements: { 
          newSrNo: i + 1,
          id: (records[i] as { id: string }).id
        },
        type: QueryTypes.UPDATE,
        transaction 
      }
    );
  }
}

/**
 * @route DELETE /cost-breakup/:obfId/manpower/:id
 * @desc Delete a manpower breakup entry by ID and reorder remaining entries
 */
router.delete('/:obfId/manpower/:id', async (req: Request, res: Response) => {
  try {
    const { obfId, id } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if manpower exists
      const manpowerExists = await sequelize.query(
        `SELECT id FROM obf_manpower_breakup WHERE id = :id AND obf_id = :obfId`,
        { 
          replacements: { id, obfId },
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
        `DELETE FROM obf_manpower_breakup WHERE id = :id AND obf_id = :obfId`,
        { 
          replacements: { id, obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Reorder remaining entries
      await reorderSrNo('obf_manpower_breakup', obfId, transaction);
      
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
 * @route DELETE /cost-breakup/:obfId/capex/:id
 * @desc Delete a capex breakup entry by ID and reorder remaining entries
 */
router.delete('/:obfId/capex/:id', async (req: Request, res: Response) => {
  try {
    const { obfId, id } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if capex exists
      const capexExists = await sequelize.query(
        `SELECT id FROM obf_capex_breakup WHERE id = :id AND obf_id = :obfId`,
        { 
          replacements: { id, obfId },
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
        `DELETE FROM obf_capex_breakup WHERE id = :id AND obf_id = :obfId`,
        { 
          replacements: { id, obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Reorder remaining entries
      await reorderSrNo('obf_capex_breakup', obfId, transaction);
      
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
 * @route DELETE /cost-breakup/:obfId/opex/:id
 * @desc Delete an opex breakup entry by ID and reorder remaining entries
 */
router.delete('/:obfId/opex/:id', async (req: Request, res: Response) => {
  try {
    const { obfId, id } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if opex exists
      const opexExists = await sequelize.query(
        `SELECT id FROM obf_opex_breakup WHERE id = :id AND obf_id = :obfId`,
        { 
          replacements: { id, obfId },
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
        `DELETE FROM obf_opex_breakup WHERE id = :id AND obf_id = :obfId`,
        { 
          replacements: { id, obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Reorder remaining entries
      await reorderSrNo('obf_opex_breakup', obfId, transaction);
      
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
 * @route DELETE /cost-breakup/:obfId/implementation-cost/:costId
 * @desc Delete an implementation cost entry by ID
 */
router.delete('/:obfId/implementation-cost/:costId', async (req: Request, res: Response) => {
  try {
    const { obfId, costId } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if implementation cost exists
      const costExists = await sequelize.query(
        `SELECT id FROM obf_implementation_cost WHERE id = :costId AND obf_id = :obfId`,
        { 
          replacements: { costId, obfId },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!costExists || costExists.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Implementation cost not found' });
      }
      
      // Delete implementation cost
      await sequelize.query(
        `DELETE FROM obf_implementation_cost WHERE id = :costId`,
        { 
          replacements: { costId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Implementation cost deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting implementation cost:', error);
    return res.status(500).json({ message: 'Failed to delete implementation cost' });
  }
});

/**
 * @route DELETE /cost-breakup/:obfId/pre-go-live-manpower/:manpowerId
 * @desc Delete a pre go live manpower entry by ID
 */
router.delete('/:obfId/pre-go-live-manpower/:manpowerId', async (req: Request, res: Response) => {
  try {
    const { obfId, manpowerId } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if pre go live manpower exists
      const manpowerExists = await sequelize.query(
        `SELECT id FROM obf_pre_go_live_manpower WHERE id = :manpowerId AND obf_id = :obfId`,
        { 
          replacements: { manpowerId, obfId },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!manpowerExists || manpowerExists.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Pre go live manpower not found' });
      }
      
      // Delete pre go live manpower
      await sequelize.query(
        `DELETE FROM obf_pre_go_live_manpower WHERE id = :manpowerId`,
        { 
          replacements: { manpowerId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Pre go live manpower deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting pre go live manpower:', error);
    return res.status(500).json({ message: 'Failed to delete pre go live manpower' });
  }
});

/**
 * @route DELETE /cost-breakup/:obfId/additional-implementation-cost/:costId
 * @desc Delete an additional implementation cost entry by ID
 */
router.delete('/:obfId/additional-implementation-cost/:costId', async (req: Request, res: Response) => {
  try {
    const { obfId, costId } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if additional implementation cost exists
      const costExists = await sequelize.query(
        `SELECT id FROM obf_additional_implementation_cost WHERE id = :costId AND obf_id = :obfId`,
        { 
          replacements: { costId, obfId },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!costExists || costExists.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Additional implementation cost not found' });
      }
      
      // Delete additional implementation cost
      await sequelize.query(
        `DELETE FROM obf_additional_implementation_cost WHERE id = :costId`,
        { 
          replacements: { costId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Additional implementation cost deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting additional implementation cost:', error);
    return res.status(500).json({ message: 'Failed to delete additional implementation cost' });
  }
});

export default router; 