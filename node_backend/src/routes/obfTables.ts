import express, { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';

const router = express.Router();

/**
 * @route GET /obf-tables/:obfId/input-result
 * @desc Get OBF input result data
 */
router.get('/:obfId/input-result', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    const inputResult = await sequelize.query(
      `SELECT * FROM obf_input_result WHERE project_id = :obfId`,
      { 
        replacements: { obfId },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(inputResult[0] || {});
  } catch (error) {
    console.error('Error fetching OBF input result:', error);
    return res.status(500).json({ message: 'Failed to fetch OBF input result data' });
  }
});

/**
 * @route POST /obf-tables/:obfId/input-result
 * @desc Create or update OBF input result
 */
router.post('/:obfId/input-result', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    const inputData = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if record exists
      const existing = await sequelize.query(
        `SELECT id FROM obf_input_result WHERE project_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (existing && existing.length > 0) {
        // Update existing record
        await sequelize.query(
          `UPDATE obf_input_result SET
            project_name = :projectName,
            opportunity_id = :opportunityId,
            location = :location,
            state = :state,
            vertical = :vertical,
            project_type = :projectType,
            projection_period = :projectionPeriod,
            customer_payment_terms = :customerPaymentTerms,
            capex_amortisation = :capexAmortisation,
            amc_first_year = :amcFirstYear,
            depreciation = :depreciation,
            interest = :interest,
            asset_backing = :assetBacking,
            redeploy_asset = :redeployAsset,
            rentals_escalation = :rentalsEscalation,
            manpower_mgmt_escalation = :manpowerMgmtEscalation,
            manpower_min_wage_escalation = :manpowerMinWageEscalation,
            capex_cost_escalation = :capexCostEscalation,
            operating_cost_escalation = :operatingCostEscalation,
            rentals_credit_period = :rentalsCreditPeriod,
            manpower_mgmt_credit_period = :manpowerMgmtCreditPeriod,
            manpower_min_wage_credit_period = :manpowerMinWageCreditPeriod,
            capex_cost_credit_period = :capexCostCreditPeriod,
            operating_cost_credit_period = :operatingCostCreditPeriod,
            updated_at = CURRENT_TIMESTAMP
          WHERE project_id = :obfId`,
          { 
            replacements: { 
              obfId,
              projectName: inputData.project_name,
              opportunityId: inputData.opportunity_id,
              location: inputData.location,
              state: inputData.state,
              vertical: inputData.vertical,
              projectType: inputData.project_type,
              projectionPeriod: inputData.projection_period,
              customerPaymentTerms: inputData.customer_payment_terms,
              capexAmortisation: inputData.capex_amortisation,
              amcFirstYear: inputData.amc_first_year,
              depreciation: inputData.depreciation,
              interest: inputData.interest,
              assetBacking: inputData.asset_backing,
              redeployAsset: inputData.redeploy_asset,
              rentalsEscalation: inputData.rentals_escalation,
              manpowerMgmtEscalation: inputData.manpower_mgmt_escalation,
              manpowerMinWageEscalation: inputData.manpower_min_wage_escalation,
              capexCostEscalation: inputData.capex_cost_escalation,
              operatingCostEscalation: inputData.operating_cost_escalation,
              rentalsCreditPeriod: inputData.rentals_credit_period,
              manpowerMgmtCreditPeriod: inputData.manpower_mgmt_credit_period,
              manpowerMinWageCreditPeriod: inputData.manpower_min_wage_credit_period,
              capexCostCreditPeriod: inputData.capex_cost_credit_period,
              operatingCostCreditPeriod: inputData.operating_cost_credit_period
            },
            type: QueryTypes.UPDATE,
            transaction 
          }
        );
      } else {
        // Insert new record
        await sequelize.query(
          `INSERT INTO obf_input_result (
            id, project_id, project_name, opportunity_id, location, state, vertical, project_type,
            projection_period, customer_payment_terms, capex_amortisation, amc_first_year,
            depreciation, interest, asset_backing, redeploy_asset, 
            rentals_escalation, manpower_mgmt_escalation, manpower_min_wage_escalation,
            capex_cost_escalation, operating_cost_escalation,
            rentals_credit_period, manpower_mgmt_credit_period, manpower_min_wage_credit_period,
            capex_cost_credit_period, operating_cost_credit_period,
            created_at, updated_at
          ) VALUES (
            uuid_generate_v4(), :obfId, :projectName, :opportunityId, :location, :state, :vertical, :projectType,
            :projectionPeriod, :customerPaymentTerms, :capexAmortisation, :amcFirstYear,
            :depreciation, :interest, :assetBacking, :redeployAsset,
            :rentalsEscalation, :manpowerMgmtEscalation, :manpowerMinWageEscalation,
            :capexCostEscalation, :operatingCostEscalation,
            :rentalsCreditPeriod, :manpowerMgmtCreditPeriod, :manpowerMinWageCreditPeriod,
            :capexCostCreditPeriod, :operatingCostCreditPeriod,
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )`,
          { 
            replacements: { 
              obfId,
              projectName: inputData.project_name,
              opportunityId: inputData.opportunity_id,
              location: inputData.location,
              state: inputData.state,
              vertical: inputData.vertical,
              projectType: inputData.project_type,
              projectionPeriod: inputData.projection_period,
              customerPaymentTerms: inputData.customer_payment_terms,
              capexAmortisation: inputData.capex_amortisation,
              amcFirstYear: inputData.amc_first_year,
              depreciation: inputData.depreciation,
              interest: inputData.interest,
              assetBacking: inputData.asset_backing,
              redeployAsset: inputData.redeploy_asset,
              rentalsEscalation: inputData.rentals_escalation,
              manpowerMgmtEscalation: inputData.manpower_mgmt_escalation,
              manpowerMinWageEscalation: inputData.manpower_min_wage_escalation,
              capexCostEscalation: inputData.capex_cost_escalation,
              operatingCostEscalation: inputData.operating_cost_escalation,
              rentalsCreditPeriod: inputData.rentals_credit_period,
              manpowerMgmtCreditPeriod: inputData.manpower_mgmt_credit_period,
              manpowerMinWageCreditPeriod: inputData.manpower_min_wage_credit_period,
              capexCostCreditPeriod: inputData.capex_cost_credit_period,
              operatingCostCreditPeriod: inputData.operating_cost_credit_period
            },
            type: QueryTypes.INSERT,
            transaction 
          }
        );
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(201).json({ message: 'OBF input result updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating OBF input result:', error);
    return res.status(500).json({ message: 'Failed to update OBF input result' });
  }
});

/**
 * @route GET /obf-tables/:obfId/revenue
 * @desc Get OBF revenue data
 */
router.get('/:obfId/revenue', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    const revenue = await sequelize.query(
      `SELECT * FROM obf_revenue WHERE obf_id = :obfId`,
      { 
        replacements: { obfId },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(revenue[0] || {});
  } catch (error) {
    console.error('Error fetching OBF revenue:', error);
    return res.status(500).json({ message: 'Failed to fetch OBF revenue data' });
  }
});

/**
 * @route POST /obf-tables/:obfId/revenue
 * @desc Create or update OBF revenue
 */
router.post('/:obfId/revenue', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    const revenueData = req.body;

    // Begin transaction
    const transaction = await sequelize.transaction();

    try {
      // Check if record exists
      const existing = await sequelize.query(
        `SELECT id FROM obf_revenue WHERE obf_id = :obfId`,
        {
          replacements: { obfId },
          type: QueryTypes.SELECT,
          transaction
        }
      );

      if (existing && existing.length > 0) {
        // Update existing record
        await sequelize.query(
          `UPDATE obf_revenue SET
            monthly_fixed_revenue_qty = :monthlyFixedRevenueQty,
            monthly_fixed_revenue_rate = :monthlyFixedRevenueRate,
            monthly_fixed_revenue_amt_year1 = :monthlyFixedRevenueAmtYear1,
            monthly_fixed_revenue_amt_fy2026 = :monthlyFixedRevenueAmtFy2026,
            monthly_fixed_revenue_amt_contract = :monthlyFixedRevenueAmtContract,
            monthly_variable_revenue_qty = :monthlyVariableRevenueQty,
            monthly_variable_revenue_rate = :monthlyVariableRevenueRate,
            monthly_variable_revenue_amt_year1 = :monthlyVariableRevenueAmtYear1,
            monthly_variable_revenue_amt_fy2026 = :monthlyVariableRevenueAmtFy2026,
            monthly_variable_revenue_amt_contract = :monthlyVariableRevenueAmtContract,
            transport_value_added_revenue_year1 = :transportValueAddedRevenueYear1,
            transport_value_added_revenue_fy2026 = :transportValueAddedRevenueFy2026,
            transport_value_added_revenue_contract = :transportValueAddedRevenueContract,
            total_revenue_year1 = :totalRevenueYear1,
            total_revenue_fy2026 = :totalRevenueFy2026,
            total_revenue_contract = :totalRevenueContract,
            yoy_escalation_percent = :yoyEscalationPercent,
            go_live_date = :goLiveDate,
            updated_at = CURRENT_TIMESTAMP
          WHERE obf_id = :obfId`,
          {
            replacements: {
              obfId,
              monthlyFixedRevenueQty: revenueData.monthly_fixed_revenue_qty,
              monthlyFixedRevenueRate: revenueData.monthly_fixed_revenue_rate,
              monthlyFixedRevenueAmtYear1: revenueData.monthly_fixed_revenue_amt_year1,
              monthlyFixedRevenueAmtFy2026: revenueData.monthly_fixed_revenue_amt_fy2026,
              monthlyFixedRevenueAmtContract: revenueData.monthly_fixed_revenue_amt_contract,
              monthlyVariableRevenueQty: revenueData.monthly_variable_revenue_qty,
              monthlyVariableRevenueRate: revenueData.monthly_variable_revenue_rate,
              monthlyVariableRevenueAmtYear1: revenueData.monthly_variable_revenue_amt_year1,
              monthlyVariableRevenueAmtFy2026: revenueData.monthly_variable_revenue_amt_fy2026,
              monthlyVariableRevenueAmtContract: revenueData.monthly_variable_revenue_amt_contract,
              transportValueAddedRevenueYear1: revenueData.transport_value_added_revenue_year1,
              transportValueAddedRevenueFy2026: revenueData.transport_value_added_revenue_fy2026,
              transportValueAddedRevenueContract: revenueData.transport_value_added_revenue_contract,
              totalRevenueYear1: revenueData.total_revenue_year1,
              totalRevenueFy2026: revenueData.total_revenue_fy2026,
              totalRevenueContract: revenueData.total_revenue_contract,
              yoyEscalationPercent: revenueData.yoy_escalation_percent,
              goLiveDate: revenueData.go_live_date
            },
            type: QueryTypes.UPDATE,
            transaction
          }
        );
      } else {
        // Insert new record
        await sequelize.query(
          `INSERT INTO obf_revenue (
            id, obf_id, monthly_fixed_revenue_qty, monthly_fixed_revenue_rate, monthly_fixed_revenue_amt_year1, monthly_fixed_revenue_amt_fy2026, monthly_fixed_revenue_amt_contract, monthly_variable_revenue_qty, monthly_variable_revenue_rate, monthly_variable_revenue_amt_year1, monthly_variable_revenue_amt_fy2026, monthly_variable_revenue_amt_contract, transport_value_added_revenue_year1, transport_value_added_revenue_fy2026, transport_value_added_revenue_contract, total_revenue_year1, total_revenue_fy2026, total_revenue_contract, yoy_escalation_percent, go_live_date, created_at, updated_at
          ) VALUES (
            uuid_generate_v4(), :obfId, :monthlyFixedRevenueQty, :monthlyFixedRevenueRate, :monthlyFixedRevenueAmtYear1, :monthlyFixedRevenueAmtFy2026, :monthlyFixedRevenueAmtContract, :monthlyVariableRevenueQty, :monthlyVariableRevenueRate, :monthlyVariableRevenueAmtYear1, :monthlyVariableRevenueAmtFy2026, :monthlyVariableRevenueAmtContract, :transportValueAddedRevenueYear1, :transportValueAddedRevenueFy2026, :transportValueAddedRevenueContract, :totalRevenueYear1, :totalRevenueFy2026, :totalRevenueContract, :yoyEscalationPercent, :goLiveDate, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )`,
          {
            replacements: {
              obfId,
              monthlyFixedRevenueQty: revenueData.monthly_fixed_revenue_qty,
              monthlyFixedRevenueRate: revenueData.monthly_fixed_revenue_rate,
              monthlyFixedRevenueAmtYear1: revenueData.monthly_fixed_revenue_amt_year1,
              monthlyFixedRevenueAmtFy2026: revenueData.monthly_fixed_revenue_amt_fy2026,
              monthlyFixedRevenueAmtContract: revenueData.monthly_fixed_revenue_amt_contract,
              monthlyVariableRevenueQty: revenueData.monthly_variable_revenue_qty,
              monthlyVariableRevenueRate: revenueData.monthly_variable_revenue_rate,
              monthlyVariableRevenueAmtYear1: revenueData.monthly_variable_revenue_amt_year1,
              monthlyVariableRevenueAmtFy2026: revenueData.monthly_variable_revenue_amt_fy2026,
              monthlyVariableRevenueAmtContract: revenueData.monthly_variable_revenue_amt_contract,
              transportValueAddedRevenueYear1: revenueData.transport_value_added_revenue_year1,
              transportValueAddedRevenueFy2026: revenueData.transport_value_added_revenue_fy2026,
              transportValueAddedRevenueContract: revenueData.transport_value_added_revenue_contract,
              totalRevenueYear1: revenueData.total_revenue_year1,
              totalRevenueFy2026: revenueData.total_revenue_fy2026,
              totalRevenueContract: revenueData.total_revenue_contract,
              yoyEscalationPercent: revenueData.yoy_escalation_percent,
              goLiveDate: revenueData.go_live_date
            },
            type: QueryTypes.INSERT,
            transaction
          }
        );
      }

      // Commit transaction
      await transaction.commit();
      return res.status(201).json({ message: 'OBF revenue updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating OBF revenue:', error);
    return res.status(500).json({ message: 'Failed to update OBF revenue' });
  }
});

/**
 * @route GET /obf-tables/:obfId/financial-metrics
 * @desc Get OBF financial metrics
 */
router.get('/:obfId/financial-metrics', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    const financialMetrics = await sequelize.query(
      `SELECT * FROM obf_financial_metrics WHERE obf_id = :obfId`,
      { 
        replacements: { obfId },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(financialMetrics[0] || {});
  } catch (error) {
    console.error('Error fetching OBF financial metrics:', error);
    return res.status(500).json({ message: 'Failed to fetch OBF financial metrics data' });
  }
});

/**
 * @route POST /obf-tables/:obfId/financial-metrics
 * @desc Create or update OBF financial metrics
 */
router.post('/:obfId/financial-metrics', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    const metrics = req.body;
    const transaction = await sequelize.transaction();
    try {
      // Check if record exists
      const existing = await sequelize.query(
        `SELECT id FROM obf_financial_metrics WHERE obf_id = :obfId`,
        { replacements: { obfId }, type: QueryTypes.SELECT, transaction }
      );
      if (existing && existing.length > 0) {
        // Update
        await sequelize.query(
          `UPDATE obf_financial_metrics SET
            gross_margin_year1 = :gross_margin_year1,
            gross_margin_fy2026 = :gross_margin_fy2026,
            gross_margin_contract = :gross_margin_contract,
            gross_percent_year1 = :gross_percent_year1,
            gross_percent_fy2026 = :gross_percent_fy2026,
            gross_percent_contract = :gross_percent_contract,
            trade_discount_year1 = :trade_discount_year1,
            trade_discount_fy2026 = :trade_discount_fy2026,
            trade_discount_contract = :trade_discount_contract,
            gross_margin_after_discount_year1 = :gross_margin_after_discount_year1,
            gross_margin_after_discount_fy2026 = :gross_margin_after_discount_fy2026,
            gross_margin_after_discount_contract = :gross_margin_after_discount_contract,
            gross_margin_after_discount_percent_year1 = :gross_margin_after_discount_percent_year1,
            gross_margin_after_discount_percent_fy2026 = :gross_margin_after_discount_percent_fy2026,
            gross_margin_after_discount_percent_contract = :gross_margin_after_discount_percent_contract,
            depreciation_ammortisation_year1 = :depreciation_ammortisation_year1,
            depreciation_ammortisation_fy2026 = :depreciation_ammortisation_fy2026,
            depreciation_ammortisation_contract = :depreciation_ammortisation_contract,
            ebit_year1 = :ebit_year1,
            ebit_fy2026 = :ebit_fy2026,
            ebit_contract = :ebit_contract,
            ebit_percent_year1 = :ebit_percent_year1,
            ebit_percent_fy2026 = :ebit_percent_fy2026,
            ebit_percent_contract = :ebit_percent_contract,
            interest_cost_year1 = :interest_cost_year1,
            interest_cost_fy2026 = :interest_cost_fy2026,
            interest_cost_contract = :interest_cost_contract,
            ebt_year1 = :ebt_year1,
            ebt_fy2026 = :ebt_fy2026,
            ebt_contract = :ebt_contract,
            ebt_percent_year1 = :ebt_percent_year1,
            ebt_percent_fy2026 = :ebt_percent_fy2026,
            ebt_percent_contract = :ebt_percent_contract,
            updated_at = CURRENT_TIMESTAMP
          WHERE obf_id = :obfId`,
          { replacements: { obfId, ...metrics }, type: QueryTypes.UPDATE, transaction }
        );
      } else {
        // Insert
        await sequelize.query(
          `INSERT INTO obf_financial_metrics (
            id, obf_id, gross_margin_year1, gross_margin_fy2026, gross_margin_contract, gross_percent_year1, gross_percent_fy2026, gross_percent_contract, trade_discount_year1, trade_discount_fy2026, trade_discount_contract, gross_margin_after_discount_year1, gross_margin_after_discount_fy2026, gross_margin_after_discount_contract, gross_margin_after_discount_percent_year1, gross_margin_after_discount_percent_fy2026, gross_margin_after_discount_percent_contract, depreciation_ammortisation_year1, depreciation_ammortisation_fy2026, depreciation_ammortisation_contract, ebit_year1, ebit_fy2026, ebit_contract, ebit_percent_year1, ebit_percent_fy2026, ebit_percent_contract, interest_cost_year1, interest_cost_fy2026, interest_cost_contract, ebt_year1, ebt_fy2026, ebt_contract, ebt_percent_year1, ebt_percent_fy2026, ebt_percent_contract, created_at, updated_at
          ) VALUES (
            uuid_generate_v4(), :obfId, :gross_margin_year1, :gross_margin_fy2026, :gross_margin_contract, :gross_percent_year1, :gross_percent_fy2026, :gross_percent_contract, :trade_discount_year1, :trade_discount_fy2026, :trade_discount_contract, :gross_margin_after_discount_year1, :gross_margin_after_discount_fy2026, :gross_margin_after_discount_contract, :gross_margin_after_discount_percent_year1, :gross_margin_after_discount_percent_fy2026, :gross_margin_after_discount_percent_contract, :depreciation_ammortisation_year1, :depreciation_ammortisation_fy2026, :depreciation_ammortisation_contract, :ebit_year1, :ebit_fy2026, :ebit_contract, :ebit_percent_year1, :ebit_percent_fy2026, :ebit_percent_contract, :interest_cost_year1, :interest_cost_fy2026, :interest_cost_contract, :ebt_year1, :ebt_fy2026, :ebt_contract, :ebt_percent_year1, :ebt_percent_fy2026, :ebt_percent_contract, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )`,
          { replacements: { obfId, ...metrics }, type: QueryTypes.INSERT, transaction }
        );
      }
      await transaction.commit();
      return res.status(201).json({ message: 'OBF financial metrics updated successfully' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating OBF financial metrics:', error);
    return res.status(500).json({ message: 'Failed to update OBF financial metrics' });
  }
});

/**
 * @route DELETE /obf-tables/:obfId/input-result
 * @desc Delete an OBF input result by ID
 */
router.delete('/:obfId/input-result', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if input result exists
      const inputResultExists = await sequelize.query(
        `SELECT id FROM obf_input_result WHERE project_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!inputResultExists || inputResultExists.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Input result not found' });
      }
      
      // Delete input result
      await sequelize.query(
        `DELETE FROM obf_input_result WHERE project_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Input result deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting input result:', error);
    return res.status(500).json({ message: 'Failed to delete input result' });
  }
});

/**
 * @route DELETE /obf-tables/:obfId/revenue
 * @desc Delete an OBF revenue by ID
 */
router.delete('/:obfId/revenue', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if revenue exists
      const revenueExists = await sequelize.query(
        `SELECT id FROM obf_revenue WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!revenueExists || revenueExists.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Revenue not found' });
      }
      
      // Delete revenue
      await sequelize.query(
        `DELETE FROM obf_revenue WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Revenue deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting revenue:', error);
    return res.status(500).json({ message: 'Failed to delete revenue' });
  }
});

/**
 * @route DELETE /obf-tables/:obfId/financial-metrics
 * @desc Delete an OBF financial metrics by ID
 */
router.delete('/:obfId/financial-metrics', async (req: Request, res: Response) => {
  try {
    const { obfId } = req.params;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if financial metrics exist
      const metricsExist = await sequelize.query(
        `SELECT id FROM obf_financial_metrics WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!metricsExist || metricsExist.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Financial metrics not found' });
      }
      
      // Delete financial metrics
      await sequelize.query(
        `DELETE FROM obf_financial_metrics WHERE obf_id = :obfId`,
        { 
          replacements: { obfId },
          type: QueryTypes.DELETE,
          transaction 
        }
      );
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'Financial metrics deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting financial metrics:', error);
    return res.status(500).json({ message: 'Failed to delete financial metrics' });
  }
});

export default router; 