import express, { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';
import { isAuthenticated } from '../middleware/auth';
import User from '../models/User';
import Notification from '../models/Notification';

const router = express.Router();

// Add type definitions at the top of the file
interface OBFData {
  id: string;
  project_code: string;
  project_name: string;
  opportunity_id: string;
  client_name: string;
  description: string | null;
  project_type: string;
  project_category: string;
  project_priority: string;
  project_status: string;
  status: string;
  working_data: any;
  created_at: Date;
  updated_at: Date;
}

interface ThresholdData {
  gross_margin_percent_min: number;
  ebit_percent_min: number;
  ebt_percent_min: number;
  capex_min_lakhs: number;
  credit_period_days: number;
}

interface FinalOutputData {
  id: string;
  project_code: string;
  project_name: string;
  opportunity_id: string;
  client_name: string;
  description: string | null;
  project_type: string;
  project_category: string;
  project_priority: string;
  project_status: string;
  status: string;
  working_data: any;
  created_at: Date;
  updated_at: Date;
  vertical: string;
  location: string;
  state: string;
  gross_margin_year1: number;
  gross_margin_fy2026: number;
  gross_margin_contract: number;
  gross_percent_year1: number;
  gross_percent_fy2026: number;
  gross_percent_contract: number;
  trade_discount_year1: number;
  trade_discount_fy2026: number;
  trade_discount_contract: number;
  gross_margin_after_discount_year1: number;
  gross_margin_after_discount_fy2026: number;
  gross_margin_after_discount_contract: number;
  gross_margin_after_discount_percent_year1: number;
  gross_margin_after_discount_percent_fy2026: number;
  gross_margin_after_discount_percent_contract: number;
  depreciation_ammortisation_year1: number;
  depreciation_ammortisation_fy2026: number;
  depreciation_ammortisation_contract: number;
  ebit_year1: number;
  ebit_fy2026: number;
  ebit_contract: number;
  ebit_percent_year1: number;
  ebit_percent_fy2026: number;
  ebit_percent_contract: number;
  interest_cost_year1: number;
  interest_cost_fy2026: number;
  interest_cost_contract: number;
  ebt_year1: number;
  ebt_fy2026: number;
  ebt_contract: number;
  ebt_percent_year1: number;
  ebt_percent_fy2026: number;
  ebt_percent_contract: number;
  mll: number;
  ba: number;
  security: number;
  total: number;
  storage: number;
  mhe: number;
  facility: number;
  other: number;
  rentals: number;
  rent_related: number;
  impl_cost: number;
  capex_1st_month_write_off: number;
  go_live_date: Date;
  total_capex: number;
  customer_payment_terms: number;
}

interface UserData {
  id: string;
  role: string;
  name: string;
  email: string;
}

// Approval flow constants
const APPROVAL_FLOW = [
  'Salesperson',
  'BSH',
  'Pricing',
  'BUSH',
  'Business Finance',
  'BUH'
];
const DOA_FLOW = ['CFO', 'MD & CEO'];

/**
 * @route GET /obf
 * @desc Get all OBFs
 */
router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    
    const obfs = await sequelize.query(
      `SELECT 
        o.id, o.project_code, o.project_name, o.opportunity_id, 
        o.client_name, o.description, o.project_type, o.project_category,
        o.project_priority, o.project_status, o.status, 
        o.created_at, o.updated_at, o."creatorId"
      FROM obf o
      LEFT JOIN obf_access oa ON o.id = oa."obfId" AND oa."userId" = :userId
      WHERE o."creatorId" = :userId OR oa.id IS NOT NULL
      ORDER BY o.created_at DESC`,
      { 
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );
    
    // For each OBF, fetch user access list
    const obfIds = obfs.map((o: any) => o.id);
    let userAccessMap: Record<string, any[]> = {};
    if (obfIds.length > 0) {
      const accessRows = await sequelize.query(
        `SELECT "obfId", "userId", "accessLevel", "role" FROM obf_access WHERE "obfId" IN (:obfIds)`,
        {
          replacements: { obfIds },
          type: QueryTypes.SELECT
        }
      );
      userAccessMap = accessRows.reduce((acc: any, row: any) => {
        if (!acc[row.obfId]) acc[row.obfId] = [];
        acc[row.obfId].push({ userId: row.userId, accessLevel: row.accessLevel, role: row.role });
        return acc;
      }, {});
    }
    const obfsWithAccess = obfs.map((obf: any) => ({
      ...obf,
      userAccess: userAccessMap[obf.id] || []
    }));

    return res.status(200).json(obfsWithAccess);
  } catch (error) {
    console.error('Error fetching OBFs:', error);
    return res.status(500).json({ message: 'Failed to fetch OBFs' });
  }
});

/**
 * @route GET /obf/:id/revenue
 * @desc Get revenue data for a single OBF
 */
router.get('/:id/revenue', async (req: Request, res: Response) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    
    const { id } = req.params;
    
    // Check if OBF exists
    const obf = await sequelize.query<OBFData>(
      `SELECT id FROM obf WHERE id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    if (!obf || obf.length === 0) {
      return res.status(404).json({ message: 'OBF not found' });
    }
    
    // Get revenue data with explicit column selection
    const revenueData = await sequelize.query(
      `SELECT 
        id, obf_id, 
        monthly_fixed_revenue_qty, monthly_fixed_revenue_rate,
        monthly_fixed_revenue_amt_year1, monthly_fixed_revenue_amt_fy2026,
        monthly_fixed_revenue_amt_contract, monthly_variable_revenue_qty,
        monthly_variable_revenue_rate, monthly_variable_revenue_amt_year1,
        monthly_variable_revenue_amt_fy2026, monthly_variable_revenue_amt_contract,
        transport_value_added_revenue_year1, transport_value_added_revenue_fy2026,
        transport_value_added_revenue_contract, total_revenue_year1,
        total_revenue_fy2026, total_revenue_contract,
        yoy_escalation_percent,
        go_live_date,
        created_at, updated_at
      FROM obf_revenue 
      WHERE obf_id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(revenueData[0] || {});
  } catch (error) {
    console.error('Error fetching OBF revenue data:', error);
    return res.status(500).json({ message: 'Failed to fetch OBF revenue data' });
  }
});

/**
 * @route GET /obf/:id/ba-rates
 * @desc Get BA rates data for a single OBF
 */
router.get('/:id/ba-rates', async (req: Request, res: Response) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    
    const { id } = req.params;
    
    // Check if OBF exists
    const obf = await sequelize.query<OBFData>(
      `SELECT id FROM obf WHERE id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    if (!obf || obf.length === 0) {
      return res.status(404).json({ message: 'OBF not found' });
    }
    
    // Get BA rates data with explicit column selection
    const baRatesData = await sequelize.query(
      `SELECT 
        id, obf_id,
        warehouse_rent_qty, warehouse_rent_rate,
        warehouse_rent_amt_year1, warehouse_rent_amt_fy2026,
        warehouse_rent_amt_contract, manpower_cost_mgmt_qty,
        manpower_cost_mgmt_rate, manpower_cost_mgmt_amt_year1,
        manpower_cost_mgmt_amt_fy2026, manpower_cost_mgmt_amt_contract,
        manpower_cost_min_wage_qty, manpower_cost_min_wage_rate,
        manpower_cost_min_wage_amt_year1, manpower_cost_min_wage_amt_fy2026,
        manpower_cost_min_wage_amt_contract, consumables_qty,
        consumables_rate, consumables_amt_year1, consumables_amt_fy2026,
        consumables_amt_contract, one_time_ammortised_cost_qty,
        one_time_ammortised_cost_rate, one_time_ammortised_cost_amt_year1,
        one_time_ammortised_cost_amt_fy2026, one_time_ammortised_cost_amt_contract,
        capex_write_off_qty, capex_write_off_rate, capex_write_off_amt_year1,
        capex_write_off_amt_fy2026, capex_write_off_amt_contract,
        one_time_ammortised_cost_impl_qty, one_time_ammortised_cost_impl_rate,
        one_time_ammortised_cost_impl_amt_year1, one_time_ammortised_cost_impl_amt_fy2026,
        one_time_ammortised_cost_impl_amt_contract, total_ba_cost_year1,
        total_ba_cost_fy2026, total_ba_cost_contract,
        yoy_escalation_percent,
        created_at, updated_at
      FROM obf_ba_rates 
      WHERE obf_id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(baRatesData[0] || {});
  } catch (error) {
    console.error('Error fetching OBF BA rates:', error);
    return res.status(500).json({ message: 'Failed to fetch OBF BA rates' });
  }
});

/**
 * @route GET /obf/:id/direct-expenses
 * @desc Get direct expenses data for a single OBF
 */
router.get('/:id/direct-expenses', async (req: Request, res: Response) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    
    const { id } = req.params;
    
    // Check if OBF exists
    const obf = await sequelize.query<OBFData>(
      `SELECT id FROM obf WHERE id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    if (!obf || obf.length === 0) {
      return res.status(404).json({ message: 'OBF not found' });
    }
    
    // Get direct expenses data with explicit column selection
    const expensesData = await sequelize.query(
      `SELECT 
        id, obf_id,
        transport_cost_qty, transport_cost_rate,
        transport_cost_amt_year1, transport_cost_amt_fy2026,
        transport_cost_amt_contract, transport_manpower_cost_qty,
        transport_manpower_cost_rate, transport_manpower_cost_amt_year1,
        transport_manpower_cost_amt_fy2026, transport_manpower_cost_amt_contract,
        gps_ct_running_expenses_qty, gps_ct_running_expenses_rate,
        gps_ct_running_expenses_amt_year1, gps_ct_running_expenses_amt_fy2026,
        gps_ct_running_expenses_amt_contract, total_direct_expenses_year1,
        total_direct_expenses_fy2026, total_direct_expenses_contract,
        yoy_escalation_percent,
        created_at, updated_at
      FROM obf_direct_expenses 
      WHERE obf_id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(expensesData[0] || {});
  } catch (error) {
    console.error('Error fetching OBF direct expenses:', error);
    return res.status(500).json({ message: 'Failed to fetch OBF direct expenses' });
  }
});

/**
 * @route GET /obf/:id/financial-metrics
 * @desc Get financial metrics data for a single OBF
 */
router.get('/:id/financial-metrics', async (req: Request, res: Response) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    
    const { id } = req.params;
    
    // Check if OBF exists
    const obf = await sequelize.query<OBFData>(
      `SELECT id FROM obf WHERE id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    if (!obf || obf.length === 0) {
      return res.status(404).json({ message: 'OBF not found' });
    }
    
    // Get financial metrics data with explicit column selection
    const metricsData = await sequelize.query(
      `SELECT 
        id, obf_id,
        gross_margin_year1, gross_margin_fy2026,
        gross_margin_contract, gross_percent_year1, gross_percent_fy2026,
        gross_percent_contract, trade_discount_year1, trade_discount_fy2026,
        trade_discount_contract, gross_margin_after_discount_year1,
        gross_margin_after_discount_fy2026, gross_margin_after_discount_contract,
        gross_margin_after_discount_percent_year1, gross_margin_after_discount_percent_fy2026,
        gross_margin_after_discount_percent_contract, depreciation_ammortisation_year1,
        depreciation_ammortisation_fy2026, depreciation_ammortisation_contract,
        ebit_year1, ebit_fy2026, ebit_contract, ebit_percent_year1,
        ebit_percent_fy2026, ebit_percent_contract, interest_cost_year1,
        interest_cost_fy2026, interest_cost_contract, ebt_year1, ebt_fy2026,
        ebt_contract, ebt_percent_year1, ebt_percent_fy2026, ebt_percent_contract,
        created_at, updated_at
      FROM obf_financial_metrics 
      WHERE obf_id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(metricsData[0] || {});
  } catch (error) {
    console.error('Error fetching OBF financial metrics:', error);
    return res.status(500).json({ message: 'Failed to fetch OBF financial metrics' });
  }
});

/**
 * @route GET /obf/:id/input
 * @desc Get input data for a single OBF
 */
router.get('/:id/input', async (req: Request, res: Response) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    
    const { id } = req.params;
    
    // Check if OBF exists
    const obf = await sequelize.query<OBFData>(
      `SELECT id, project_name, opportunity_id FROM obf WHERE id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    if (!obf || obf.length === 0) {
      return res.status(404).json({ message: 'OBF not found' });
    }
    
    // Get input data
    const inputData = await sequelize.query(
      `SELECT * FROM obf_input_result WHERE project_id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    return res.status(200).json(inputData[0] || {});
  } catch (error) {
    console.error('Error fetching OBF input data:', error);
    return res.status(500).json({ message: 'Failed to fetch OBF input data' });
  }
});

/**
 * @route GET /obf/:id
 * @desc Get a single OBF by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const obf = await sequelize.query(
      `SELECT 
        o.id, o.project_code, o.project_name, o.opportunity_id, 
        o.client_name, o.description, o.project_type, o.project_category,
        o.project_priority, o.project_status, o.status, o.working_data,
        o.created_at, o.updated_at
      FROM obf o
      WHERE o.id = :id`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    
    if (!obf || obf.length === 0) {
      return res.status(404).json({ message: 'OBF not found' });
    }
    
    return res.status(200).json(obf[0]);
  } catch (error) {
    console.error('Error fetching OBF:', error);
    return res.status(500).json({ message: 'Failed to fetch OBF' });
  }
});

/**
 * @route POST /obf
 * @desc Create a new OBF
 */
router.post('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const {
      project_code,
      project_name,
      opportunity_id,
      client_name,
      description,
      project_type,
      project_category,
      project_priority,
      project_status,
      working_data
    } = req.body;
    
    const userId = (req.user as User).id;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if project_code or opportunity_id already exist
      const existing = await sequelize.query(
        `SELECT id FROM obf WHERE project_code = :project_code OR opportunity_id = :opportunity_id`,
        { 
          replacements: { project_code, opportunity_id },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (existing && existing.length > 0) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: 'An OBF with this project code or opportunity ID already exists' 
        });
      }
      
      // Insert new OBF
      const [result] = await sequelize.query(
        `INSERT INTO obf (
          id, project_code, project_name, opportunity_id, client_name, 
          description, project_type, project_category, project_priority, 
          project_status, status, working_data, created_at, updated_at, "creatorId"
        ) VALUES (
          uuid_generate_v4(), :project_code, :project_name, :opportunity_id, :client_name,
          :description, :project_type, :project_category, :project_priority,
          :project_status, 'draft', :working_data, NOW(), NOW(), :userId
        ) RETURNING id`,
        { 
          replacements: { 
            project_code,
            project_name,
            opportunity_id,
            client_name,
            description: description || null,
            project_type,
            project_category,
            project_priority,
            project_status: project_status || 'draft',
            working_data: working_data ? JSON.stringify(working_data) : null,
            userId
          },
          type: QueryTypes.INSERT,
          transaction 
        }
      );
      
      const id = (result as any)[0].id;

      // Insert default Implementation Cost Break-up rows
      const implRows = [
        'Project Manager',
        'SD Resource',
        'Travelling Cost',
        'Stay + Food Cost',
        'Conveyance Cost'
      ];
      for (const cost_type of implRows) {
        await sequelize.query(
          `INSERT INTO obf_implementation_cost (obf_id, cost_type, unit_cost, nos, created_at, updated_at)
           VALUES (:obf_id, :cost_type, 0, 0, NOW(), NOW())`,
          {
            replacements: { obf_id: id, cost_type },
            type: QueryTypes.INSERT,
            transaction
          }
        );
      }

      // Insert default Pre Go Live Manpower cost rows
      const preGoLiveRows = [
        'Supervisory',
        'Management',
        'Labour',
        'Security',
        'Recruitement Cost'
      ];
      for (const manpower_type of preGoLiveRows) {
        await sequelize.query(
          `INSERT INTO obf_pre_go_live_manpower (obf_id, manpower_type, nos, cost_per_month, created_at, updated_at)
           VALUES (:obf_id, :manpower_type, 0, 0, NOW(), NOW())`,
          {
            replacements: { obf_id: id, manpower_type },
            type: QueryTypes.INSERT,
            transaction
          }
        );
      }

      // Insert user access records if provided
      const userAccess = req.body.userAccess || [];
      for (const access of userAccess) {
        // Get user's actual role
        const [user] = await sequelize.query<UserData>(
          `SELECT role FROM users WHERE id = :userId`,
          {
            replacements: { userId: access.userId },
            type: QueryTypes.SELECT,
            transaction
          }
        );

        if (!user) {
          throw new Error(`User ${access.userId} not found`);
        }

        // Use the user's actual role from the database
        await sequelize.query(
          `INSERT INTO obf_access (id, "obfId", "userId", "accessLevel", "role", created_at, updated_at)
           VALUES (uuid_generate_v4(), :obfId, :userId, :accessLevel, :role, NOW(), NOW())`,
          {
            replacements: {
              obfId: id,
              userId: access.userId,
              accessLevel: access.accessLevel,
              role: user.role // Always use the role from the database
            },
            type: QueryTypes.INSERT,
            transaction
          }
        );
      }

      // Commit transaction after all operations
      await transaction.commit();

      // Notify all users with access to this OBF
      await notifyAllAccessUsers(id, 'obf_created', `You have been granted access to OBF ${id}`);

      // Fetch the full OBF object
      const [obf] = await sequelize.query(
        `SELECT 
          o.id, o.project_code, o.project_name, o.opportunity_id, 
          o.client_name, o.description, o.project_type, o.project_category,
          o.project_priority, o.project_status, o.status, o.working_data,
          o.created_at, o.updated_at, o."creatorId"
        FROM obf o
        WHERE o.id = :id`,
        {
          replacements: { id },
          type: QueryTypes.SELECT
        }
      );

      return res.status(201).json({ 
        message: 'OBF created successfully',
        data: obf
      });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating OBF:', error);
    return res.status(500).json({ message: 'Failed to create OBF' });
  }
});

/**
 * @route POST /obf/:id/validate
 * @desc Validate an OBF against thresholds
 */
router.post('/:id/validate', async (_req: Request, res: Response) => {
  try {
    const { id } = _req.params;
    
    // Get final output data
    const [finalOutput] = await sequelize.query<FinalOutputData>(
      `SELECT 
        o.*,
        ir.vertical,
        ir.location,
        ir.state,
        ir.customer_payment_terms,
        ir.project_type,
        metrics.*,
        mp.manpower_mll,
        mp.manpower_ba,
        mp.manpower_security,
        mp.manpower_total,
        fc.total_capex,
        fo.rentals as one_time_rentals,
        fo.rent_related as one_time_rent_related,
        fo.impl_cost as one_time_impl_cost,
        fo.capex_1st_month_write_off as one_time_capex_1st_month_write_off,
        r.go_live_date as one_time_go_live_date
      FROM obf o
      LEFT JOIN obf_input_result ir ON o.id = ir.project_id
      LEFT JOIN obf_financial_metrics metrics ON o.id = metrics.obf_id
      LEFT JOIN obf_revenue r ON o.id = r.obf_id
      LEFT JOIN (
        SELECT 
          obf_id,
          SUM(CASE WHEN roll = 'MLL' THEN nos ELSE 0 END) as manpower_mll,
          SUM(nos) - SUM(CASE WHEN roll = 'MLL' THEN nos ELSE 0 END) - SUM(CASE WHEN category = 'Security' THEN nos ELSE 0 END) as manpower_ba,
          SUM(CASE WHEN category = 'Security' THEN nos ELSE 0 END) as manpower_security,
          SUM(nos) as manpower_total
        FROM obf_manpower_breakup
        GROUP BY obf_id
      ) mp ON o.id = mp.obf_id
      LEFT JOIN (
        SELECT 
          obf_id,
          COALESCE(SUM(unit_cost * nos), 0) as total_capex
        FROM obf_capex_breakup
        GROUP BY obf_id
      ) fc ON o.id = fc.obf_id
      LEFT JOIN (
        SELECT 
          obf_id,
          SUM(pre_go_live_rental) as rentals,
          SUM(stamp_duty_amount + registration_amount) as rent_related,
          (
            SELECT COALESCE(SUM(unit_cost * nos), 0)
            FROM obf_implementation_cost
            WHERE obf_id = rb.obf_id
          ) + (
            SELECT COALESCE(SUM(cost_per_month * nos), 0)
            FROM obf_pre_go_live_manpower
            WHERE obf_id = rb.obf_id
          ) + (
            SELECT COALESCE(SUM(unit_cost * nos), 0)
            FROM obf_additional_implementation_cost
            WHERE obf_id = rb.obf_id
          ) as impl_cost,
          0 as capex_1st_month_write_off
        FROM obf_rent_breakup rb
        GROUP BY obf_id
      ) fo ON o.id = fo.obf_id
      WHERE o.id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    if (!finalOutput) {
      return res.status(404).json({ message: 'OBF not found' });
    }

    // Get thresholds for this vertical and project type
    const [threshold] = await sequelize.query<ThresholdData>(
      `SELECT * FROM thresholds 
       WHERE vertical = :vertical 
       AND project_type = :project_type`,
      { 
        replacements: { 
          vertical: finalOutput.vertical,
          project_type: finalOutput.project_type 
        },
        type: QueryTypes.SELECT 
      }
    );

    if (!threshold) {
      return res.status(400).json({ 
        message: 'No thresholds found for this vertical and project type',
        vertical: finalOutput.vertical,
        project_type: finalOutput.project_type
      });
    }

    // Validate against thresholds
    const validationResults = {
      gross_margin_percent: {
        value: Number(finalOutput.gross_percent_year1),
        threshold: Number(threshold.gross_margin_percent_min),
        passed: Number(finalOutput.gross_percent_year1) >= Number(threshold.gross_margin_percent_min),
        needs_doa: Number(finalOutput.gross_percent_year1) < Number(threshold.gross_margin_percent_min) // DOA if lower
      },
      ebit_percent: {
        value: Number(finalOutput.ebit_percent_year1),
        threshold: Number(threshold.ebit_percent_min),
        passed: Number(finalOutput.ebit_percent_year1) >= Number(threshold.ebit_percent_min),
        needs_doa: Number(finalOutput.ebit_percent_year1) < Number(threshold.ebit_percent_min) // DOA if lower
      },
      ebt_percent: {
        value: Number(finalOutput.ebt_percent_year1),
        threshold: Number(threshold.ebt_percent_min),
        passed: Number(finalOutput.ebt_percent_year1) >= Number(threshold.ebt_percent_min),
        needs_doa: Number(finalOutput.ebt_percent_year1) < Number(threshold.ebt_percent_min) // DOA if lower
      },
      capex: {
        value: Number((finalOutput.total_capex || 0) / 100000), // Convert to lakhs
        threshold: Number(threshold.capex_min_lakhs),
        passed: Number((finalOutput.total_capex || 0) / 100000) <= Number(threshold.capex_min_lakhs), // Pass if less than or equal to threshold
        needs_doa: Number((finalOutput.total_capex || 0) / 100000) > Number(threshold.capex_min_lakhs) // DOA if higher than threshold
      },
      credit_period: {
        value: Number(finalOutput.customer_payment_terms),
        threshold: Number(threshold.credit_period_days),
        passed: Number(finalOutput.customer_payment_terms) <= Number(threshold.credit_period_days),
        needs_doa: Number(finalOutput.customer_payment_terms) > Number(threshold.credit_period_days) // DOA if higher
      }
    };

    // Add debug logging
    console.log('EBIT Validation Debug:', {
      ebit_value: Number(finalOutput.ebit_percent_year1),
      ebit_threshold: Number(threshold.ebit_percent_min),
      comparison: Number(finalOutput.ebit_percent_year1) >= Number(threshold.ebit_percent_min),
      validation_result: validationResults.ebit_percent
    });

    // Check if all validations passed
    const allPassed = Object.values(validationResults).every(result => result.passed);
    // Check if any metric needs DOA approval
    const needsDoa = Object.values(validationResults).some(result => result.needs_doa);

    // Determine validation status string
    let validationStatus = 'passed';
    let approvalStatus = null;
    let currentApproverRole = null;
    let currentApproverUserId = null;
    let flow = APPROVAL_FLOW;

    if (allPassed) {
      validationStatus = 'passed';
      approvalStatus = 'pending';
      flow = APPROVAL_FLOW;
    } else if (needsDoa) {
      validationStatus = 'needs_doa';
      approvalStatus = 'pending';
      flow = APPROVAL_FLOW.concat(DOA_FLOW);
    } else {
      validationStatus = 'failed';
      // No approval flow for failed validations
    }

    // If approval is needed, determine the next approver
    if (approvalStatus === 'pending') {
      const next = await getNextApprover(id, flow);
      if (next) {
        currentApproverRole = next.role;
        currentApproverUserId = next.userId;
      }
    }

    // Store validation_status, validation_result, and approval details in obf table
    await sequelize.query(
      `UPDATE obf 
       SET validation_status = :validationStatus, 
           validation_result = :validationResult,
           approval_status = :approvalStatus,
           current_approver_role = :currentApproverRole,
           current_approver_user_id = :currentApproverUserId,
           project_status = 'submitted',
           updated_at = NOW() 
       WHERE id = :id`,
      {
        replacements: {
          id,
          validationStatus,
          validationResult: JSON.stringify({
            message: allPassed ? 'OBF validation successful' : 'OBF validation failed',
            passed: allPassed,
            needs_doa: needsDoa,
            results: validationResults,
            thresholds: {
              vertical: finalOutput.vertical,
              project_type: finalOutput.project_type,
              gross_margin_percent_min: threshold.gross_margin_percent_min,
              ebit_percent_min: threshold.ebit_percent_min,
              ebt_percent_min: threshold.ebt_percent_min,
              capex_min_lakhs: threshold.capex_min_lakhs,
              credit_period_days: threshold.credit_period_days
            }
          }),
          approvalStatus,
          currentApproverRole,
          currentApproverUserId
        },
        type: QueryTypes.UPDATE
      }
    );

    // If approval is needed, notify the first approver
    if (approvalStatus === 'pending' && currentApproverUserId) {
      await createNotification({
        userId: currentApproverUserId,
        obfId: id,
        type: 'approval_required',
        message: `OBF ${finalOutput.project_code} requires your approval`
      });
    }

    return res.status(200).json({
      message: allPassed ? 'OBF validation successful' : 'OBF validation failed',
      passed: allPassed,
      needs_doa: needsDoa,
      results: validationResults,
      thresholds: {
        vertical: finalOutput.vertical,
        project_type: finalOutput.project_type,
        gross_margin_percent_min: threshold.gross_margin_percent_min,
        ebit_percent_min: threshold.ebit_percent_min,
        ebt_percent_min: threshold.ebt_percent_min,
        capex_min_lakhs: threshold.capex_min_lakhs,
        credit_period_days: threshold.credit_period_days
      }
    });
  } catch (error) {
    console.error('Error validating OBF:', error);
    return res.status(500).json({ message: 'Failed to validate OBF' });
  }
});

/**
 * @route PUT /obf/:id
 * @desc Update an existing OBF
 * @access Private
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      project_code,
      project_name,
      opportunity_id,
      client_name,
      description,
      project_type,
      project_category,
      project_priority,
      project_status,
      status,
      working_data
    } = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Get current OBF data for comparison
      const currentObf = await sequelize.query<OBFData>(
        `SELECT * FROM obf WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!currentObf || currentObf.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'OBF not found' });
      }
      
      // Check if project_code or opportunity_id conflicts with existing entries
      if (project_code || opportunity_id) {
        const existing = await sequelize.query(
          `SELECT id FROM obf 
           WHERE (project_code = :project_code OR opportunity_id = :opportunity_id) 
           AND id != :id`,
          { 
            replacements: { 
              project_code: project_code || '', 
              opportunity_id: opportunity_id || '', 
              id 
            },
            type: QueryTypes.SELECT,
            transaction 
          }
        );
        
        if (existing && existing.length > 0) {
          await transaction.rollback();
          return res.status(400).json({ 
            message: 'Another OBF with this project code or opportunity ID already exists' 
          });
        }
      }
      
      // Update OBF
      await sequelize.query(
        `UPDATE obf SET
          project_code = COALESCE(:project_code, project_code),
          project_name = COALESCE(:project_name, project_name),
          opportunity_id = COALESCE(:opportunity_id, opportunity_id),
          client_name = COALESCE(:client_name, client_name),
          description = COALESCE(:description, description),
          project_type = COALESCE(:project_type, project_type),
          project_category = COALESCE(:project_category, project_category),
          project_priority = COALESCE(:project_priority, project_priority),
          project_status = COALESCE(:project_status, project_status),
          status = COALESCE(:status, status),
          working_data = COALESCE(:working_data, working_data),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = :id`,
        { 
          replacements: { 
            id,
            project_code: project_code || null,
            project_name: project_name || null,
            opportunity_id: opportunity_id || null,
            client_name: client_name || null,
            description: description !== undefined ? description : null,
            project_type: project_type || null,
            project_category: project_category || null,
            project_priority: project_priority || null,
            project_status: project_status || null,
            status: status || null,
            working_data: working_data ? JSON.stringify(working_data) : null
          },
          type: QueryTypes.UPDATE,
          transaction 
        }
      );
      
      // Get updated OBF data
      const updatedObf = await sequelize.query<OBFData>(
        `SELECT * FROM obf WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      // Compare changes and create history entry
      const changes: Record<string, { old: any; new: any }> = {};
      const current = currentObf[0];
      const updated = updatedObf[0];
      
      // Compare each field
      const fields = [
        'project_code', 'project_name', 'opportunity_id', 'client_name',
        'description', 'project_type', 'project_category', 'project_priority',
        'project_status', 'status', 'working_data'
      ] as const;
      
      for (const field of fields) {
        if (current[field] !== updated[field]) {
          changes[field] = {
            old: current[field],
            new: updated[field]
          };
        }
      }
      
      // Only create history entry if there are changes
      if (Object.keys(changes).length > 0) {
        // Get the latest version number
        const versionResult = await sequelize.query<{ max_version: number }>(
          `SELECT COALESCE(MAX(version), 0) as max_version 
           FROM obf_history 
           WHERE obf_id = :obf_id`,
          { 
            replacements: { obf_id: id },
            type: QueryTypes.SELECT,
            transaction 
          }
        );
        
        const nextVersion = versionResult[0].max_version + 1;
        
        // Create history entry
        await sequelize.query(
          `INSERT INTO obf_history (
            id, obf_id, version, changes, changed_by, created_at
          ) VALUES (
            uuid_generate_v4(), :obf_id, :version, :changes, :changed_by, CURRENT_TIMESTAMP
          )`,
          { 
            replacements: { 
              obf_id: id,
              version: nextVersion,
              changes: JSON.stringify(changes),
              changed_by: req.body.changed_by || 'system'
            },
            type: QueryTypes.INSERT,
            transaction 
          }
        );
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json({ message: 'OBF updated successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating OBF:', error);
    return res.status(500).json({ message: 'Failed to update OBF' });
  }
});

/**
 * @route DELETE /obf/:id
 * @desc Delete an OBF by ID
 */
router.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as { id: string }).id;
  const transaction = await sequelize.transaction();

  try {
    // Check if user has access to this OBF
    const [access] = await sequelize.query(
      `SELECT * FROM obf_access WHERE "obfId" = :obfId AND "userId" = :userId`,
      {
        replacements: { obfId: id, userId },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (!access) {
      await transaction.rollback();
      return res.status(403).json({ message: 'You do not have access to this OBF' });
    }

    // Delete related records first
    await sequelize.query(
      `DELETE FROM obf_access WHERE "obfId" = :obfId`,
      { replacements: { obfId: id }, transaction }
    );

    await sequelize.query(
      `DELETE FROM obf_implementation_cost WHERE obf_id = :obfId`,
      { replacements: { obfId: id }, transaction }
    );

    await sequelize.query(
      `DELETE FROM obf_pre_go_live_manpower WHERE obf_id = :obfId`,
      { replacements: { obfId: id }, transaction }
    );

    await sequelize.query(
      `DELETE FROM obf_revenue WHERE obf_id = :obfId`,
      { replacements: { obfId: id }, transaction }
    );

    await sequelize.query(
      `DELETE FROM obf_ba_rates WHERE obf_id = :obfId`,
      { replacements: { obfId: id }, transaction }
    );

    await sequelize.query(
      `DELETE FROM obf_direct_expenses WHERE obf_id = :obfId`,
      { replacements: { obfId: id }, transaction }
    );

    await sequelize.query(
      `DELETE FROM obf_financial_metrics WHERE obf_id = :obfId`,
      { replacements: { obfId: id }, transaction }
    );

    await sequelize.query(
      `DELETE FROM obf_input_result WHERE project_id = :obfId`,
      { replacements: { obfId: id }, transaction }
    );

    await sequelize.query(
      `DELETE FROM obf_history WHERE obf_id = :obfId`,
      { replacements: { obfId: id }, transaction }
    );

    // Finally delete the OBF
    await sequelize.query(
      `DELETE FROM obf WHERE id = :obfId`,
      { replacements: { obfId: id }, transaction }
    );

    await transaction.commit();
    return res.json({ message: 'OBF deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting OBF:', error);
    return res.status(500).json({ message: 'Failed to delete OBF' });
  }
});

/**
 * @route POST /obf/:id/revenue
 * @desc Create or update revenue data for an OBF
 */
router.post('/:id/revenue', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      monthly_fixed_revenue_qty,
      monthly_fixed_revenue_rate,
      monthly_fixed_revenue_amt_year1,
      monthly_fixed_revenue_amt_fy2026,
      monthly_fixed_revenue_amt_contract,
      monthly_variable_revenue_qty,
      monthly_variable_revenue_rate,
      monthly_variable_revenue_amt_year1,
      monthly_variable_revenue_amt_fy2026,
      monthly_variable_revenue_amt_contract,
      transport_value_added_revenue_year1,
      transport_value_added_revenue_fy2026,
      transport_value_added_revenue_contract,
      total_revenue_year1,
      total_revenue_fy2026,
      total_revenue_contract,
      yoy_escalation_percent,
      go_live_date
    } = req.body;

      // Check if OBF exists
      const obf = await sequelize.query<OBFData>(
        `SELECT id FROM obf WHERE id = :id`,
        { 
          replacements: { id },
        type: QueryTypes.SELECT 
        }
      );
      
      if (!obf || obf.length === 0) {
        return res.status(404).json({ message: 'OBF not found' });
      }
      
      // Check if revenue data exists
    const existingRevenue = await sequelize.query(
        `SELECT id FROM obf_revenue WHERE obf_id = :id`,
        { 
          replacements: { id },
        type: QueryTypes.SELECT 
        }
      );
      
    if (existingRevenue && existingRevenue.length > 0) {
        // Update existing revenue data
      await sequelize.query(
          `UPDATE obf_revenue SET
            monthly_fixed_revenue_qty = :monthly_fixed_revenue_qty,
            monthly_fixed_revenue_rate = :monthly_fixed_revenue_rate,
            monthly_fixed_revenue_amt_year1 = :monthly_fixed_revenue_amt_year1,
            monthly_fixed_revenue_amt_fy2026 = :monthly_fixed_revenue_amt_fy2026,
            monthly_fixed_revenue_amt_contract = :monthly_fixed_revenue_amt_contract,
            monthly_variable_revenue_qty = :monthly_variable_revenue_qty,
            monthly_variable_revenue_rate = :monthly_variable_revenue_rate,
            monthly_variable_revenue_amt_year1 = :monthly_variable_revenue_amt_year1,
            monthly_variable_revenue_amt_fy2026 = :monthly_variable_revenue_amt_fy2026,
            monthly_variable_revenue_amt_contract = :monthly_variable_revenue_amt_contract,
            transport_value_added_revenue_year1 = :transport_value_added_revenue_year1,
            transport_value_added_revenue_fy2026 = :transport_value_added_revenue_fy2026,
            transport_value_added_revenue_contract = :transport_value_added_revenue_contract,
            total_revenue_year1 = :total_revenue_year1,
            total_revenue_fy2026 = :total_revenue_fy2026,
            total_revenue_contract = :total_revenue_contract,
          yoy_escalation_percent = :yoy_escalation_percent,
          go_live_date = :go_live_date,
            updated_at = CURRENT_TIMESTAMP
        WHERE obf_id = :id`,
          { 
          replacements: { 
            id,
            monthly_fixed_revenue_qty,
            monthly_fixed_revenue_rate,
            monthly_fixed_revenue_amt_year1,
            monthly_fixed_revenue_amt_fy2026,
            monthly_fixed_revenue_amt_contract,
            monthly_variable_revenue_qty,
            monthly_variable_revenue_rate,
            monthly_variable_revenue_amt_year1,
            monthly_variable_revenue_amt_fy2026,
            monthly_variable_revenue_amt_contract,
            transport_value_added_revenue_year1,
            transport_value_added_revenue_fy2026,
            transport_value_added_revenue_contract,
            total_revenue_year1,
            total_revenue_fy2026,
            total_revenue_contract,
            yoy_escalation_percent,
            go_live_date
          },
          type: QueryTypes.UPDATE 
          }
        );
      } else {
        // Insert new revenue data
      await sequelize.query(
          `INSERT INTO obf_revenue (
          obf_id,
          monthly_fixed_revenue_qty,
          monthly_fixed_revenue_rate,
          monthly_fixed_revenue_amt_year1,
          monthly_fixed_revenue_amt_fy2026,
          monthly_fixed_revenue_amt_contract,
          monthly_variable_revenue_qty,
          monthly_variable_revenue_rate,
          monthly_variable_revenue_amt_year1,
          monthly_variable_revenue_amt_fy2026,
          monthly_variable_revenue_amt_contract,
          transport_value_added_revenue_year1,
          transport_value_added_revenue_fy2026,
          transport_value_added_revenue_contract,
          total_revenue_year1,
          total_revenue_fy2026,
          total_revenue_contract,
          yoy_escalation_percent,
          go_live_date,
          created_at,
          updated_at
          ) VALUES (
          :id,
          :monthly_fixed_revenue_qty,
          :monthly_fixed_revenue_rate,
          :monthly_fixed_revenue_amt_year1,
          :monthly_fixed_revenue_amt_fy2026,
          :monthly_fixed_revenue_amt_contract,
          :monthly_variable_revenue_qty,
          :monthly_variable_revenue_rate,
          :monthly_variable_revenue_amt_year1,
          :monthly_variable_revenue_amt_fy2026,
          :monthly_variable_revenue_amt_contract,
          :transport_value_added_revenue_year1,
          :transport_value_added_revenue_fy2026,
          :transport_value_added_revenue_contract,
          :total_revenue_year1,
          :total_revenue_fy2026,
          :total_revenue_contract,
          :yoy_escalation_percent,
          :go_live_date,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )`,
          { 
          replacements: { 
            id,
            monthly_fixed_revenue_qty,
            monthly_fixed_revenue_rate,
            monthly_fixed_revenue_amt_year1,
            monthly_fixed_revenue_amt_fy2026,
            monthly_fixed_revenue_amt_contract,
            monthly_variable_revenue_qty,
            monthly_variable_revenue_rate,
            monthly_variable_revenue_amt_year1,
            monthly_variable_revenue_amt_fy2026,
            monthly_variable_revenue_amt_contract,
            transport_value_added_revenue_year1,
            transport_value_added_revenue_fy2026,
            transport_value_added_revenue_contract,
            total_revenue_year1,
            total_revenue_fy2026,
            total_revenue_contract,
            yoy_escalation_percent,
            go_live_date
          },
          type: QueryTypes.INSERT 
        }
      );
    }
      
    return res.status(200).json({ message: 'Revenue data saved successfully' });
  } catch (error) {
    console.error('Error saving OBF revenue data:', error);
    return res.status(500).json({ message: 'Failed to save OBF revenue data' });
  }
});

/**
 * @route POST /obf/:id/ba-rates
 * @desc Create or update BA rates for an OBF
 */
router.post('/:id/ba-rates', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      warehouse_rent_qty,
      warehouse_rent_rate,
      warehouse_rent_amt_year1,
      warehouse_rent_amt_fy2026,
      warehouse_rent_amt_contract,
      manpower_cost_mgmt_qty,
      manpower_cost_mgmt_rate,
      manpower_cost_mgmt_amt_year1,
      manpower_cost_mgmt_amt_fy2026,
      manpower_cost_mgmt_amt_contract,
      manpower_cost_min_wage_qty,
      manpower_cost_min_wage_rate,
      manpower_cost_min_wage_amt_year1,
      manpower_cost_min_wage_amt_fy2026,
      manpower_cost_min_wage_amt_contract,
      consumables_qty,
      consumables_rate,
      consumables_amt_year1,
      consumables_amt_fy2026,
      consumables_amt_contract,
      one_time_ammortised_cost_qty,
      one_time_ammortised_cost_rate,
      one_time_ammortised_cost_amt_year1,
      one_time_ammortised_cost_amt_fy2026,
      one_time_ammortised_cost_amt_contract,
      capex_write_off_qty,
      capex_write_off_rate,
      capex_write_off_amt_year1,
      capex_write_off_amt_fy2026,
      capex_write_off_amt_contract,
      one_time_ammortised_cost_impl_qty,
      one_time_ammortised_cost_impl_rate,
      one_time_ammortised_cost_impl_amt_year1,
      one_time_ammortised_cost_impl_amt_fy2026,
      one_time_ammortised_cost_impl_amt_contract,
      total_ba_cost_year1,
      total_ba_cost_fy2026,
      total_ba_cost_contract,
      yoy_escalation_percent
    } = req.body;

      // Check if OBF exists
      const obf = await sequelize.query<OBFData>(
        `SELECT id FROM obf WHERE id = :id`,
        { 
          replacements: { id },
        type: QueryTypes.SELECT 
        }
      );
      
      if (!obf || obf.length === 0) {
        return res.status(404).json({ message: 'OBF not found' });
      }
      
    // Check if BA rates data exists
    const existingBARates = await sequelize.query(
        `SELECT id FROM obf_ba_rates WHERE obf_id = :id`,
        { 
          replacements: { id },
        type: QueryTypes.SELECT 
        }
      );
      
    if (existingBARates && existingBARates.length > 0) {
      // Update existing BA rates data
      await sequelize.query(
          `UPDATE obf_ba_rates SET
            warehouse_rent_qty = :warehouse_rent_qty,
            warehouse_rent_rate = :warehouse_rent_rate,
            warehouse_rent_amt_year1 = :warehouse_rent_amt_year1,
            warehouse_rent_amt_fy2026 = :warehouse_rent_amt_fy2026,
            warehouse_rent_amt_contract = :warehouse_rent_amt_contract,
            manpower_cost_mgmt_qty = :manpower_cost_mgmt_qty,
            manpower_cost_mgmt_rate = :manpower_cost_mgmt_rate,
            manpower_cost_mgmt_amt_year1 = :manpower_cost_mgmt_amt_year1,
            manpower_cost_mgmt_amt_fy2026 = :manpower_cost_mgmt_amt_fy2026,
            manpower_cost_mgmt_amt_contract = :manpower_cost_mgmt_amt_contract,
            manpower_cost_min_wage_qty = :manpower_cost_min_wage_qty,
            manpower_cost_min_wage_rate = :manpower_cost_min_wage_rate,
            manpower_cost_min_wage_amt_year1 = :manpower_cost_min_wage_amt_year1,
            manpower_cost_min_wage_amt_fy2026 = :manpower_cost_min_wage_amt_fy2026,
            manpower_cost_min_wage_amt_contract = :manpower_cost_min_wage_amt_contract,
            consumables_qty = :consumables_qty,
            consumables_rate = :consumables_rate,
            consumables_amt_year1 = :consumables_amt_year1,
            consumables_amt_fy2026 = :consumables_amt_fy2026,
            consumables_amt_contract = :consumables_amt_contract,
            one_time_ammortised_cost_qty = :one_time_ammortised_cost_qty,
            one_time_ammortised_cost_rate = :one_time_ammortised_cost_rate,
            one_time_ammortised_cost_amt_year1 = :one_time_ammortised_cost_amt_year1,
            one_time_ammortised_cost_amt_fy2026 = :one_time_ammortised_cost_amt_fy2026,
            one_time_ammortised_cost_amt_contract = :one_time_ammortised_cost_amt_contract,
            capex_write_off_qty = :capex_write_off_qty,
            capex_write_off_rate = :capex_write_off_rate,
            capex_write_off_amt_year1 = :capex_write_off_amt_year1,
            capex_write_off_amt_fy2026 = :capex_write_off_amt_fy2026,
            capex_write_off_amt_contract = :capex_write_off_amt_contract,
            one_time_ammortised_cost_impl_qty = :one_time_ammortised_cost_impl_qty,
            one_time_ammortised_cost_impl_rate = :one_time_ammortised_cost_impl_rate,
            one_time_ammortised_cost_impl_amt_year1 = :one_time_ammortised_cost_impl_amt_year1,
            one_time_ammortised_cost_impl_amt_fy2026 = :one_time_ammortised_cost_impl_amt_fy2026,
            one_time_ammortised_cost_impl_amt_contract = :one_time_ammortised_cost_impl_amt_contract,
            total_ba_cost_year1 = :total_ba_cost_year1,
            total_ba_cost_fy2026 = :total_ba_cost_fy2026,
            total_ba_cost_contract = :total_ba_cost_contract,
          yoy_escalation_percent = :yoy_escalation_percent,
            updated_at = CURRENT_TIMESTAMP
        WHERE obf_id = :id`,
          { 
          replacements: { 
            id,
            warehouse_rent_qty,
            warehouse_rent_rate,
            warehouse_rent_amt_year1,
            warehouse_rent_amt_fy2026,
            warehouse_rent_amt_contract,
            manpower_cost_mgmt_qty,
            manpower_cost_mgmt_rate,
            manpower_cost_mgmt_amt_year1,
            manpower_cost_mgmt_amt_fy2026,
            manpower_cost_mgmt_amt_contract,
            manpower_cost_min_wage_qty,
            manpower_cost_min_wage_rate,
            manpower_cost_min_wage_amt_year1,
            manpower_cost_min_wage_amt_fy2026,
            manpower_cost_min_wage_amt_contract,
            consumables_qty,
            consumables_rate,
            consumables_amt_year1,
            consumables_amt_fy2026,
            consumables_amt_contract,
            one_time_ammortised_cost_qty,
            one_time_ammortised_cost_rate,
            one_time_ammortised_cost_amt_year1,
            one_time_ammortised_cost_amt_fy2026,
            one_time_ammortised_cost_amt_contract,
            capex_write_off_qty,
            capex_write_off_rate,
            capex_write_off_amt_year1,
            capex_write_off_amt_fy2026,
            capex_write_off_amt_contract,
            one_time_ammortised_cost_impl_qty,
            one_time_ammortised_cost_impl_rate,
            one_time_ammortised_cost_impl_amt_year1,
            one_time_ammortised_cost_impl_amt_fy2026,
            one_time_ammortised_cost_impl_amt_contract,
            total_ba_cost_year1,
            total_ba_cost_fy2026,
            total_ba_cost_contract,
            yoy_escalation_percent
          },
          type: QueryTypes.UPDATE 
          }
        );
      } else {
      // Insert new BA rates data
      await sequelize.query(
          `INSERT INTO obf_ba_rates (
          obf_id,
          warehouse_rent_qty,
          warehouse_rent_rate,
          warehouse_rent_amt_year1,
          warehouse_rent_amt_fy2026,
          warehouse_rent_amt_contract,
          manpower_cost_mgmt_qty,
          manpower_cost_mgmt_rate,
          manpower_cost_mgmt_amt_year1,
          manpower_cost_mgmt_amt_fy2026,
          manpower_cost_mgmt_amt_contract,
          manpower_cost_min_wage_qty,
          manpower_cost_min_wage_rate,
          manpower_cost_min_wage_amt_year1,
          manpower_cost_min_wage_amt_fy2026,
          manpower_cost_min_wage_amt_contract,
          consumables_qty,
          consumables_rate,
          consumables_amt_year1,
          consumables_amt_fy2026,
          consumables_amt_contract,
          one_time_ammortised_cost_qty,
          one_time_ammortised_cost_rate,
          one_time_ammortised_cost_amt_year1,
          one_time_ammortised_cost_amt_fy2026,
          one_time_ammortised_cost_amt_contract,
          capex_write_off_qty,
          capex_write_off_rate,
          capex_write_off_amt_year1,
          capex_write_off_amt_fy2026,
          capex_write_off_amt_contract,
          one_time_ammortised_cost_impl_qty,
          one_time_ammortised_cost_impl_rate,
          one_time_ammortised_cost_impl_amt_year1,
          one_time_ammortised_cost_impl_amt_fy2026,
          one_time_ammortised_cost_impl_amt_contract,
          total_ba_cost_year1,
          total_ba_cost_fy2026,
          total_ba_cost_contract,
          yoy_escalation_percent,
          created_at,
          updated_at
          ) VALUES (
          :id,
          :warehouse_rent_qty,
          :warehouse_rent_rate,
          :warehouse_rent_amt_year1,
          :warehouse_rent_amt_fy2026,
          :warehouse_rent_amt_contract,
          :manpower_cost_mgmt_qty,
          :manpower_cost_mgmt_rate,
          :manpower_cost_mgmt_amt_year1,
          :manpower_cost_mgmt_amt_fy2026,
          :manpower_cost_mgmt_amt_contract,
          :manpower_cost_min_wage_qty,
          :manpower_cost_min_wage_rate,
          :manpower_cost_min_wage_amt_year1,
          :manpower_cost_min_wage_amt_fy2026,
          :manpower_cost_min_wage_amt_contract,
          :consumables_qty,
          :consumables_rate,
          :consumables_amt_year1,
          :consumables_amt_fy2026,
          :consumables_amt_contract,
          :one_time_ammortised_cost_qty,
          :one_time_ammortised_cost_rate,
          :one_time_ammortised_cost_amt_year1,
          :one_time_ammortised_cost_amt_fy2026,
          :one_time_ammortised_cost_amt_contract,
          :capex_write_off_qty,
          :capex_write_off_rate,
          :capex_write_off_amt_year1,
          :capex_write_off_amt_fy2026,
          :capex_write_off_amt_contract,
          :one_time_ammortised_cost_impl_qty,
          :one_time_ammortised_cost_impl_rate,
          :one_time_ammortised_cost_impl_amt_year1,
          :one_time_ammortised_cost_impl_amt_fy2026,
          :one_time_ammortised_cost_impl_amt_contract,
          :total_ba_cost_year1,
          :total_ba_cost_fy2026,
          :total_ba_cost_contract,
          :yoy_escalation_percent,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )`,
          { 
          replacements: { 
            id,
            warehouse_rent_qty,
            warehouse_rent_rate,
            warehouse_rent_amt_year1,
            warehouse_rent_amt_fy2026,
            warehouse_rent_amt_contract,
            manpower_cost_mgmt_qty,
            manpower_cost_mgmt_rate,
            manpower_cost_mgmt_amt_year1,
            manpower_cost_mgmt_amt_fy2026,
            manpower_cost_mgmt_amt_contract,
            manpower_cost_min_wage_qty,
            manpower_cost_min_wage_rate,
            manpower_cost_min_wage_amt_year1,
            manpower_cost_min_wage_amt_fy2026,
            manpower_cost_min_wage_amt_contract,
            consumables_qty,
            consumables_rate,
            consumables_amt_year1,
            consumables_amt_fy2026,
            consumables_amt_contract,
            one_time_ammortised_cost_qty,
            one_time_ammortised_cost_rate,
            one_time_ammortised_cost_amt_year1,
            one_time_ammortised_cost_amt_fy2026,
            one_time_ammortised_cost_amt_contract,
            capex_write_off_qty,
            capex_write_off_rate,
            capex_write_off_amt_year1,
            capex_write_off_amt_fy2026,
            capex_write_off_amt_contract,
            one_time_ammortised_cost_impl_qty,
            one_time_ammortised_cost_impl_rate,
            one_time_ammortised_cost_impl_amt_year1,
            one_time_ammortised_cost_impl_amt_fy2026,
            one_time_ammortised_cost_impl_amt_contract,
            total_ba_cost_year1,
            total_ba_cost_fy2026,
            total_ba_cost_contract,
            yoy_escalation_percent
          },
          type: QueryTypes.INSERT 
        }
      );
    }

    return res.status(200).json({ message: 'BA rates data saved successfully' });
  } catch (error) {
    console.error('Error saving OBF BA rates:', error);
    return res.status(500).json({ message: 'Failed to save OBF BA rates' });
  }
});

/**
 * @route POST /obf/:id/direct-expenses
 * @desc Create or update direct expenses for an OBF
 */
router.post('/:id/direct-expenses', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      transport_cost_qty,
      transport_cost_rate,
      transport_cost_amt_year1,
      transport_cost_amt_fy2026,
      transport_cost_amt_contract,
      transport_manpower_cost_qty,
      transport_manpower_cost_rate,
      transport_manpower_cost_amt_year1,
      transport_manpower_cost_amt_fy2026,
      transport_manpower_cost_amt_contract,
      gps_ct_running_expenses_qty,
      gps_ct_running_expenses_rate,
      gps_ct_running_expenses_amt_year1,
      gps_ct_running_expenses_amt_fy2026,
      gps_ct_running_expenses_amt_contract,
      total_direct_expenses_year1,
      total_direct_expenses_fy2026,
      total_direct_expenses_contract,
      yoy_escalation_percent
    } = req.body;

      // Check if OBF exists
      const obf = await sequelize.query<OBFData>(
        `SELECT id FROM obf WHERE id = :id`,
        { 
          replacements: { id },
        type: QueryTypes.SELECT 
        }
      );
      
      if (!obf || obf.length === 0) {
        return res.status(404).json({ message: 'OBF not found' });
      }
      
    // Check if direct expenses data exists
    const existingExpenses = await sequelize.query(
        `SELECT id FROM obf_direct_expenses WHERE obf_id = :id`,
        { 
          replacements: { id },
        type: QueryTypes.SELECT 
        }
      );
      
    if (existingExpenses && existingExpenses.length > 0) {
      // Update existing direct expenses data
      await sequelize.query(
          `UPDATE obf_direct_expenses SET
            transport_cost_qty = :transport_cost_qty,
            transport_cost_rate = :transport_cost_rate,
            transport_cost_amt_year1 = :transport_cost_amt_year1,
            transport_cost_amt_fy2026 = :transport_cost_amt_fy2026,
            transport_cost_amt_contract = :transport_cost_amt_contract,
            transport_manpower_cost_qty = :transport_manpower_cost_qty,
            transport_manpower_cost_rate = :transport_manpower_cost_rate,
            transport_manpower_cost_amt_year1 = :transport_manpower_cost_amt_year1,
            transport_manpower_cost_amt_fy2026 = :transport_manpower_cost_amt_fy2026,
            transport_manpower_cost_amt_contract = :transport_manpower_cost_amt_contract,
            gps_ct_running_expenses_qty = :gps_ct_running_expenses_qty,
            gps_ct_running_expenses_rate = :gps_ct_running_expenses_rate,
            gps_ct_running_expenses_amt_year1 = :gps_ct_running_expenses_amt_year1,
            gps_ct_running_expenses_amt_fy2026 = :gps_ct_running_expenses_amt_fy2026,
            gps_ct_running_expenses_amt_contract = :gps_ct_running_expenses_amt_contract,
            total_direct_expenses_year1 = :total_direct_expenses_year1,
            total_direct_expenses_fy2026 = :total_direct_expenses_fy2026,
            total_direct_expenses_contract = :total_direct_expenses_contract,
          yoy_escalation_percent = :yoy_escalation_percent,
            updated_at = CURRENT_TIMESTAMP
        WHERE obf_id = :id`,
          { 
          replacements: { 
            id,
            transport_cost_qty,
            transport_cost_rate,
            transport_cost_amt_year1,
            transport_cost_amt_fy2026,
            transport_cost_amt_contract,
            transport_manpower_cost_qty,
            transport_manpower_cost_rate,
            transport_manpower_cost_amt_year1,
            transport_manpower_cost_amt_fy2026,
            transport_manpower_cost_amt_contract,
            gps_ct_running_expenses_qty,
            gps_ct_running_expenses_rate,
            gps_ct_running_expenses_amt_year1,
            gps_ct_running_expenses_amt_fy2026,
            gps_ct_running_expenses_amt_contract,
            total_direct_expenses_year1,
            total_direct_expenses_fy2026,
            total_direct_expenses_contract,
            yoy_escalation_percent
          },
          type: QueryTypes.UPDATE 
          }
        );
      } else {
      // Insert new direct expenses data
      await sequelize.query(
          `INSERT INTO obf_direct_expenses (
          obf_id,
          transport_cost_qty,
          transport_cost_rate,
          transport_cost_amt_year1,
          transport_cost_amt_fy2026,
          transport_cost_amt_contract,
          transport_manpower_cost_qty,
          transport_manpower_cost_rate,
          transport_manpower_cost_amt_year1,
          transport_manpower_cost_amt_fy2026,
          transport_manpower_cost_amt_contract,
          gps_ct_running_expenses_qty,
          gps_ct_running_expenses_rate,
          gps_ct_running_expenses_amt_year1,
          gps_ct_running_expenses_amt_fy2026,
          gps_ct_running_expenses_amt_contract,
          total_direct_expenses_year1,
          total_direct_expenses_fy2026,
          total_direct_expenses_contract,
          yoy_escalation_percent,
          created_at,
          updated_at
          ) VALUES (
          :id,
          :transport_cost_qty,
          :transport_cost_rate,
          :transport_cost_amt_year1,
          :transport_cost_amt_fy2026,
          :transport_cost_amt_contract,
          :transport_manpower_cost_qty,
          :transport_manpower_cost_rate,
          :transport_manpower_cost_amt_year1,
          :transport_manpower_cost_amt_fy2026,
          :transport_manpower_cost_amt_contract,
          :gps_ct_running_expenses_qty,
          :gps_ct_running_expenses_rate,
          :gps_ct_running_expenses_amt_year1,
          :gps_ct_running_expenses_amt_fy2026,
          :gps_ct_running_expenses_amt_contract,
          :total_direct_expenses_year1,
          :total_direct_expenses_fy2026,
          :total_direct_expenses_contract,
          :yoy_escalation_percent,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )`,
          { 
          replacements: { 
            id,
            transport_cost_qty,
            transport_cost_rate,
            transport_cost_amt_year1,
            transport_cost_amt_fy2026,
            transport_cost_amt_contract,
            transport_manpower_cost_qty,
            transport_manpower_cost_rate,
            transport_manpower_cost_amt_year1,
            transport_manpower_cost_amt_fy2026,
            transport_manpower_cost_amt_contract,
            gps_ct_running_expenses_qty,
            gps_ct_running_expenses_rate,
            gps_ct_running_expenses_amt_year1,
            gps_ct_running_expenses_amt_fy2026,
            gps_ct_running_expenses_amt_contract,
            total_direct_expenses_year1,
            total_direct_expenses_fy2026,
            total_direct_expenses_contract,
            yoy_escalation_percent
          },
          type: QueryTypes.INSERT 
        }
      );
    }

    return res.status(200).json({ message: 'Direct expenses data saved successfully' });
  } catch (error) {
    console.error('Error saving OBF direct expenses:', error);
    return res.status(500).json({ message: 'Failed to save OBF direct expenses' });
  }
});

/**
 * @route POST /obf/:id/financial-metrics
 * @desc Create or update financial metrics for an OBF
 */
router.post('/:id/financial-metrics', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      gross_margin_year1,
      gross_margin_fy2026,
      gross_margin_contract,
      gross_percent_year1,
      gross_percent_fy2026,
      gross_percent_contract,
      trade_discount_year1,
      trade_discount_fy2026,
      trade_discount_contract,
      gross_margin_after_discount_year1,
      gross_margin_after_discount_fy2026,
      gross_margin_after_discount_contract,
      gross_margin_after_discount_percent_year1,
      gross_margin_after_discount_percent_fy2026,
      gross_margin_after_discount_percent_contract,
      depreciation_ammortisation_year1,
      depreciation_ammortisation_fy2026,
      depreciation_ammortisation_contract,
      ebit_year1,
      ebit_fy2026,
      ebit_contract,
      ebit_percent_year1,
      ebit_percent_fy2026,
      ebit_percent_contract,
      interest_cost_year1,
      interest_cost_fy2026,
      interest_cost_contract,
      ebt_year1,
      ebt_fy2026,
      ebt_contract,
      ebt_percent_year1,
      ebt_percent_fy2026,
      ebt_percent_contract
    } = req.body;
    
    // Begin transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Check if OBF exists
      const obf = await sequelize.query<OBFData>(
        `SELECT id FROM obf WHERE id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (!obf || obf.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'OBF not found' });
      }
      
      // Check if financial metrics exist
      const existing = await sequelize.query(
        `SELECT id FROM obf_financial_metrics WHERE obf_id = :id`,
        { 
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction 
        }
      );
      
      let result;
      if (existing && existing.length > 0) {
        // Update existing financial metrics
        result = await sequelize.query(
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
          WHERE obf_id = :id
          RETURNING *`,
          { 
            replacements: { 
              id,
              gross_margin_year1,
              gross_margin_fy2026,
              gross_margin_contract,
              gross_percent_year1,
              gross_percent_fy2026,
              gross_percent_contract,
              trade_discount_year1,
              trade_discount_fy2026,
              trade_discount_contract,
              gross_margin_after_discount_year1,
              gross_margin_after_discount_fy2026,
              gross_margin_after_discount_contract,
              gross_margin_after_discount_percent_year1,
              gross_margin_after_discount_percent_fy2026,
              gross_margin_after_discount_percent_contract,
              depreciation_ammortisation_year1,
              depreciation_ammortisation_fy2026,
              depreciation_ammortisation_contract,
              ebit_year1,
              ebit_fy2026,
              ebit_contract,
              ebit_percent_year1,
              ebit_percent_fy2026,
              ebit_percent_contract,
              interest_cost_year1,
              interest_cost_fy2026,
              interest_cost_contract,
              ebt_year1,
              ebt_fy2026,
              ebt_contract,
              ebt_percent_year1,
              ebt_percent_fy2026,
              ebt_percent_contract
            },
            type: QueryTypes.UPDATE,
            transaction 
          }
        );
      } else {
        // Insert new financial metrics
        result = await sequelize.query(
          `INSERT INTO obf_financial_metrics (
            id, obf_id, gross_margin_year1, gross_margin_fy2026,
            gross_margin_contract, gross_percent_year1, gross_percent_fy2026,
            gross_percent_contract, trade_discount_year1, trade_discount_fy2026,
            trade_discount_contract, gross_margin_after_discount_year1,
            gross_margin_after_discount_fy2026, gross_margin_after_discount_contract,
            gross_margin_after_discount_percent_year1, gross_margin_after_discount_percent_fy2026,
            gross_margin_after_discount_percent_contract, depreciation_ammortisation_year1,
            depreciation_ammortisation_fy2026, depreciation_ammortisation_contract,
            ebit_year1, ebit_fy2026, ebit_contract, ebit_percent_year1,
            ebit_percent_fy2026, ebit_percent_contract, interest_cost_year1,
            interest_cost_fy2026, interest_cost_contract, ebt_year1, ebt_fy2026,
            ebt_contract, ebt_percent_year1, ebt_percent_fy2026, ebt_percent_contract,
            created_at, updated_at
          ) VALUES (
            uuid_generate_v4(), :id, :gross_margin_year1, :gross_margin_fy2026,
            :gross_margin_contract, :gross_percent_year1, :gross_percent_fy2026,
            :gross_percent_contract, :trade_discount_year1, :trade_discount_fy2026,
            :trade_discount_contract, :gross_margin_after_discount_year1,
            :gross_margin_after_discount_fy2026, :gross_margin_after_discount_contract,
            :gross_margin_after_discount_percent_year1, :gross_margin_after_discount_percent_fy2026,
            :gross_margin_after_discount_percent_contract, :depreciation_ammortisation_year1,
            :depreciation_ammortisation_fy2026, :depreciation_ammortisation_contract,
            :ebit_year1, :ebit_fy2026, :ebit_contract, :ebit_percent_year1,
            :ebit_percent_fy2026, :ebit_percent_contract, :interest_cost_year1,
            :interest_cost_fy2026, :interest_cost_contract, :ebt_year1, :ebt_fy2026,
            :ebt_contract, :ebt_percent_year1, :ebt_percent_fy2026, :ebt_percent_contract,
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          ) RETURNING *`,
          { 
            replacements: { 
              id,
              gross_margin_year1,
              gross_margin_fy2026,
              gross_margin_contract,
              gross_percent_year1,
              gross_percent_fy2026,
              gross_percent_contract,
              trade_discount_year1,
              trade_discount_fy2026,
              trade_discount_contract,
              gross_margin_after_discount_year1,
              gross_margin_after_discount_fy2026,
              gross_margin_after_discount_contract,
              gross_margin_after_discount_percent_year1,
              gross_margin_after_discount_percent_fy2026,
              gross_margin_after_discount_percent_contract,
              depreciation_ammortisation_year1,
              depreciation_ammortisation_fy2026,
              depreciation_ammortisation_contract,
              ebit_year1,
              ebit_fy2026,
              ebit_contract,
              ebit_percent_year1,
              ebit_percent_fy2026,
              ebit_percent_contract,
              interest_cost_year1,
              interest_cost_fy2026,
              interest_cost_contract,
              ebt_year1,
              ebt_fy2026,
              ebt_contract,
              ebt_percent_year1,
              ebt_percent_fy2026,
              ebt_percent_contract
            },
            type: QueryTypes.INSERT,
            transaction 
          }
        );
      }
      
      // Commit transaction
      await transaction.commit();
      
      return res.status(200).json(result[0]);
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error saving OBF financial metrics:', error);
    return res.status(500).json({ message: 'Failed to save OBF financial metrics' });
  }
});

/**
 * @route POST /obf/:id/input
 * @desc Create or update input data for a single OBF
 */
router.post('/:id/input', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inputData = req.body;

    // Begin transaction
    const transaction = await sequelize.transaction();
    try {
      // Check if OBF exists
      const obf = await sequelize.query<OBFData>(
        `SELECT id FROM obf WHERE id = :id`,
        {
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction
        }
      );
      if (!obf || obf.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'OBF not found' });
      }

      // Check if input result exists
      const existing = await sequelize.query(
        `SELECT id FROM obf_input_result WHERE project_id = :id`,
        {
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction
        }
      );

      let result;
      if (existing && existing.length > 0) {
        // Update existing input result
        result = await sequelize.query(
          `UPDATE obf_input_result SET
            project_name = :project_name,
            opportunity_id = :opportunity_id,
            location = :location,
            state = :state,
            vertical = :vertical,
            project_type = :project_type,
            projection_period = :projection_period,
            customer_payment_terms = :customer_payment_terms,
            capex_amortisation = :capex_amortisation,
            amc_first_year = :amc_first_year,
            depreciation = :depreciation,
            interest = :interest,
            asset_backing = :asset_backing,
            redeploy_asset = :redeploy_asset,
            rentals_escalation = :rentals_escalation,
            manpower_mgmt_escalation = :manpower_mgmt_escalation,
            manpower_min_wage_escalation = :manpower_min_wage_escalation,
            capex_cost_escalation = :capex_cost_escalation,
            operating_cost_escalation = :operating_cost_escalation,
            rentals_credit_period = :rentals_credit_period,
            manpower_mgmt_credit_period = :manpower_mgmt_credit_period,
            manpower_min_wage_credit_period = :manpower_min_wage_credit_period,
            capex_cost_credit_period = :capex_cost_credit_period,
            operating_cost_credit_period = :operating_cost_credit_period,
            updated_at = CURRENT_TIMESTAMP
          WHERE project_id = :id
          RETURNING *`,
          {
            replacements: {
              id,
              project_name: inputData.project_name,
              opportunity_id: inputData.opportunity_id,
              location: inputData.location,
              state: inputData.state,
              vertical: inputData.vertical,
              project_type: inputData.project_type,
              projection_period: inputData.projection_period,
              customer_payment_terms: inputData.customer_payment_terms,
              capex_amortisation: inputData.capex_amortisation,
              amc_first_year: inputData.amc_first_year,
              depreciation: inputData.depreciation,
              interest: inputData.interest,
              asset_backing: inputData.asset_backing,
              redeploy_asset: inputData.redeploy_asset,
              rentals_escalation: inputData.rentals_escalation,
              manpower_mgmt_escalation: inputData.manpower_mgmt_escalation,
              manpower_min_wage_escalation: inputData.manpower_min_wage_escalation,
              capex_cost_escalation: inputData.capex_cost_escalation,
              operating_cost_escalation: inputData.operating_cost_escalation,
              rentals_credit_period: inputData.rentals_credit_period,
              manpower_mgmt_credit_period: inputData.manpower_mgmt_credit_period,
              manpower_min_wage_credit_period: inputData.manpower_min_wage_credit_period,
              capex_cost_credit_period: inputData.capex_cost_credit_period,
              operating_cost_credit_period: inputData.operating_cost_credit_period
            },
            type: QueryTypes.UPDATE,
            transaction
          }
        );
      } else {
        // Insert new input result
        result = await sequelize.query(
          `INSERT INTO obf_input_result (
            id, project_id, project_name, opportunity_id, location, state, vertical, project_type, projection_period, customer_payment_terms, capex_amortisation, amc_first_year, depreciation, interest, asset_backing, redeploy_asset, rentals_escalation, manpower_mgmt_escalation, manpower_min_wage_escalation, capex_cost_escalation, operating_cost_escalation, rentals_credit_period, manpower_mgmt_credit_period, manpower_min_wage_credit_period, capex_cost_credit_period, operating_cost_credit_period, created_at, updated_at
          ) VALUES (
            uuid_generate_v4(), :id, :project_name, :opportunity_id, :location, :state, :vertical, :project_type, :projection_period, :customer_payment_terms, :capex_amortisation, :amc_first_year, :depreciation, :interest, :asset_backing, :redeploy_asset, :rentals_escalation, :manpower_mgmt_escalation, :manpower_min_wage_escalation, :capex_cost_escalation, :operating_cost_escalation, :rentals_credit_period, :manpower_mgmt_credit_period, :manpower_min_wage_credit_period, :capex_cost_credit_period, :operating_cost_credit_period, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          ) RETURNING *`,
          {
            replacements: {
              id,
              project_name: inputData.project_name,
              opportunity_id: inputData.opportunity_id,
              location: inputData.location,
              state: inputData.state,
              vertical: inputData.vertical,
              project_type: inputData.project_type,
              projection_period: inputData.projection_period,
              customer_payment_terms: inputData.customer_payment_terms,
              capex_amortisation: inputData.capex_amortisation,
              amc_first_year: inputData.amc_first_year,
              depreciation: inputData.depreciation,
              interest: inputData.interest,
              asset_backing: inputData.asset_backing,
              redeploy_asset: inputData.redeploy_asset,
              rentals_escalation: inputData.rentals_escalation,
              manpower_mgmt_escalation: inputData.manpower_mgmt_escalation,
              manpower_min_wage_escalation: inputData.manpower_min_wage_escalation,
              capex_cost_escalation: inputData.capex_cost_escalation,
              operating_cost_escalation: inputData.operating_cost_escalation,
              rentals_credit_period: inputData.rentals_credit_period,
              manpower_mgmt_credit_period: inputData.manpower_mgmt_credit_period,
              manpower_min_wage_credit_period: inputData.manpower_min_wage_credit_period,
              capex_cost_credit_period: inputData.capex_cost_credit_period,
              operating_cost_credit_period: inputData.operating_cost_credit_period
            },
            type: QueryTypes.INSERT,
            transaction
          }
        );
      }
      await transaction.commit();
      return res.status(200).json(result[0]);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error saving OBF input data:', error);
    return res.status(500).json({ message: 'Failed to save OBF input data' });
  }
});

/**
 * @route DELETE /obf/:id/input
 * @desc Delete input data for a single OBF
 */
router.delete('/:id/input', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Begin transaction
    const transaction = await sequelize.transaction();
    try {
      // Check if input result exists
      const existing = await sequelize.query(
        `SELECT id FROM obf_input_result WHERE project_id = :id`,
        {
          replacements: { id },
          type: QueryTypes.SELECT,
          transaction
        }
      );
      if (!existing || existing.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Input result not found' });
      }
      // Delete input result
      await sequelize.query(
        `DELETE FROM obf_input_result WHERE project_id = :id`,
        {
          replacements: { id },
          type: QueryTypes.DELETE,
          transaction
        }
      );
      await transaction.commit();
      return res.status(200).json({ message: 'Input result deleted successfully' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting OBF input data:', error);
    return res.status(500).json({ message: 'Failed to delete OBF input data' });
  }
});

// Helper: Get next approver (role and userId) for an OBF
async function getNextApprover(obfId: string, flow: string[], afterRole: string | null = null): Promise<{ role: string; userId: string } | null> {
  // Get all access for this OBF
  const accesses: any[] = await sequelize.query(
    `SELECT "userId", role FROM obf_access WHERE "obfId" = :obfId`,
    { replacements: { obfId }, type: QueryTypes.SELECT }
  );
  console.log('getNextApprover for OBF:', obfId, 'flow:', flow);
  console.log('OBF Accesses:', accesses);
  let startIdx = 0;
  if (afterRole) {
    startIdx = flow.indexOf(afterRole) + 1;
  }
  for (let i = startIdx; i < flow.length; i++) {
    const role = flow[i];
    accesses.forEach(a => {
      console.log(`Comparing DB role: '${a.role}' (type ${typeof a.role}) to flow role: '${role}' (type ${typeof role})`);
    });
    const user = accesses.find(a => a.role && a.role.trim().toLowerCase() === role.trim().toLowerCase());
    console.log(`Checking role: ${role}, found user: ${user ? user.userId : 'none'}`);
    if (user) {
      return { role: flow[i], userId: user.userId };
    }
  }
  console.log('No next approver found for OBF', obfId);
  return null;
}

// Helper: Create notification
async function createNotification({ userId, obfId, type, message }: { userId: string, obfId: string, type: string, message: string }) {
  await Notification.create({
    user_id: userId,
    obf_id: obfId,
    type,
    message,
    read: false,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

// Helper: Notify all users with access to an OBF
async function notifyAllAccessUsers(obfId: string, type: string, message: string) {
  const accesses: any[] = await sequelize.query(
    `SELECT "userId" FROM obf_access WHERE "obfId" = :obfId`,
    { replacements: { obfId }, type: QueryTypes.SELECT }
  );
  for (const access of accesses) {
    await createNotification({ userId: access.userId, obfId, type, message });
  }
}

// Helper: Notify OBF creator
async function notifyObfCreator(obfId: string, type: string, message: string) {
  const obfArr: any[] = await sequelize.query(
    `SELECT "creatorId" FROM obf WHERE id = :id`,
    { replacements: { id: obfId }, type: QueryTypes.SELECT }
  );
  const obf = obfArr[0];
  if (obf && obf.creatorId) {
    await createNotification({ userId: obf.creatorId, obfId, type, message });
  }
}

// --- OBF Creation: Notify all users with access ---
// (Insert this logic after OBF creation and access assignment)
// Example usage:
// await notifyAllAccessUsers(id, 'obf_created', `You have been granted access to OBF ${id}`);

// --- Approval Flow Integration ---
// In start-approval and approve endpoints, add notification logic:
// - On start-approval: notify next approver
// - On approve: notify next approver or all on final approval

// Update POST /obf/:id/start-approval
router.post('/:id/start-approval', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const obfArr: any[] = await sequelize.query(
      `SELECT validation_status, validation_result FROM obf WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    const obf = obfArr[0];
    if (!obf) return res.status(404).json({ message: 'OBF not found' });
    if (!obf.validation_status) return res.status(400).json({ message: 'OBF not validated yet' });
    let flow = APPROVAL_FLOW;
    if (obf.validation_status === 'needs_doa') flow = APPROVAL_FLOW.concat(DOA_FLOW);
    const next = await getNextApprover(id, flow);
    if (!next) return res.status(400).json({ message: 'No approver found for this OBF' });
    
    // Update OBF status
    await sequelize.query(
      `UPDATE obf SET approval_status = 'pending', current_approver_role = :role, current_approver_user_id = :userId, updated_at = NOW() WHERE id = :id`,
      { replacements: { id, role: next.role, userId: next.userId }, type: QueryTypes.UPDATE }
    );

    // Notify the next approver
    await createNotification({
      userId: next.userId,
      obfId: id,
      type: 'approval_required',
      message: `You are required to approve OBF ${id} as ${next.role}`
    });

    // Notify the OBF creator
    // Notification: notify next approver
    await createNotification({
      userId: next.userId,
      obfId: id,
      type: 'approval_required',
      message: `You are required to approve OBF ${id} as ${next.role}`
    });
    return res.json({ message: 'Approval flow started', next });
  } catch (error) {
    console.error('Error starting approval flow:', error);
    return res.status(500).json({ message: 'Failed to start approval flow' });
  }
});

// Update POST /obf/:id/approve
router.post('/:id/approve', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as User).id;
    const obfArr: any[] = await sequelize.query(
      `SELECT approval_status, current_approver_role, current_approver_user_id, validation_status FROM obf WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    const obf = obfArr[0];
    if (!obf) return res.status(404).json({ message: 'OBF not found' });
    if (obf.approval_status !== 'pending') return res.status(400).json({ message: 'Approval not pending' });
    if (obf.current_approver_user_id !== userId) return res.status(403).json({ message: 'You are not the current approver' });
    let flow = APPROVAL_FLOW;
    if (obf.validation_status === 'needs_doa') flow = APPROVAL_FLOW.concat(DOA_FLOW);
    const next = await getNextApprover(id, flow, obf.current_approver_role);
    if (next) {
      await sequelize.query(
        `UPDATE obf SET current_approver_role = :role, current_approver_user_id = :userId, updated_at = NOW() WHERE id = :id`,
        { replacements: { id, role: next.role, userId: next.userId }, type: QueryTypes.UPDATE }
      );
      // Notification: notify next approver
      await createNotification({
        userId: next.userId,
        obfId: id,
        type: 'approval_required',
        message: `You are required to approve OBF ${id} as ${next.role}`
      });
      return res.json({ message: 'Approved. Moved to next approver.', next });
    } else {
      // No more approvers, mark as approved
      await sequelize.query(
        `UPDATE obf SET approval_status = 'approved', project_status = 'approved', current_approver_role = NULL, current_approver_user_id = NULL, updated_at = NOW() WHERE id = :id`,
        { replacements: { id }, type: QueryTypes.UPDATE }
      );
      // Notification: notify OBF creator and all access users
      await notifyObfCreator(id, 'approved', `Your OBF ${obf.project_name} (${obf.project_code}) has been fully approved.`);
      await notifyAllAccessUsers(id, 'approved', `OBF ${obf.project_name} (${obf.project_code}) has been fully approved.`);
      return res.json({ message: 'OBF fully approved.' });
    }
  } catch (error) {
    console.error('Error in approval:', error);
    return res.status(500).json({ message: 'Failed to approve OBF' });
  }
});

// --- Notification Endpoints ---
// GET /obf/notifications (for current user, unread filter optional)
router.get('/notifications', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as User).id;
    const { unread } = req.query;
   
    const where: any = { user_id: userId };
    if (unread === 'true') where.read = false;
    
    const notifications = await sequelize.query(
      `SELECT n.*, o.project_name, o.project_code
       FROM notifications n
       JOIN obf o ON n.obf_id = o.id
       WHERE n.user_id = :userId ${unread === 'true' ? 'AND n.read = false' : ''}
       ORDER BY n.created_at DESC`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );
    
    return res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// POST /obf/notifications/:id/read (mark as read)
router.post('/notifications/:id/read', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as User).id;
    const notification = await Notification.findOne({ where: { id, user_id: userId } });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    notification.read = true;
    notification.updated_at = new Date();
    await notification.save();
    return res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

// GET /obf/:id/approval-status
router.get('/:id/approval-status', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const obfArr: any[] = await sequelize.query(
      `SELECT 
        approval_status,
        current_approver_role,
        current_approver_user_id,
        validation_status
      FROM obf 
      WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    
    if (!obfArr || obfArr.length === 0) {
      return res.status(404).json({ message: 'OBF not found' });
    }

    const obf = obfArr[0];
    let approverName = null;
    let approverEmail = null;
    if (obf.current_approver_user_id) {
      const userArr: any[] = await sequelize.query(
        `SELECT name, email FROM users WHERE id = :id`,
        { replacements: { id: obf.current_approver_user_id }, type: QueryTypes.SELECT }
      );
      if (userArr && userArr.length > 0) {
        approverName = userArr[0].name;
        approverEmail = userArr[0].email;
      }
    }
    return res.json({
      status: obf.approval_status || 'not_started',
      current_approver_role: obf.current_approver_role,
      current_approver_user_id: obf.current_approver_user_id,
      approver_name: approverName,
      approver_email: approverEmail,
      validation_status: obf.validation_status
    });
  } catch (error) {
    console.error('Error fetching approval status:', error);
    return res.status(500).json({ message: 'Failed to fetch approval status' });
  }
});

// POST /obf/:id/reject (approval rejection)
router.post('/:id/reject', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as User).id;
    // Get OBF and current approver
    const obfArr: any[] = await sequelize.query(
      `SELECT approval_status, current_approver_role, current_approver_user_id, project_name, project_code, "creatorId" FROM obf WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    const obf = obfArr[0];
    if (!obf) return res.status(404).json({ message: 'OBF not found' });
    if (obf.approval_status !== 'pending') return res.status(400).json({ message: 'Approval not pending' });
    if (obf.current_approver_user_id !== userId) return res.status(403).json({ message: 'You are not the current approver' });
    // Get user name
    const userArr: any[] = await sequelize.query(
      `SELECT name FROM users WHERE id = :id`,
      { replacements: { id: userId }, type: QueryTypes.SELECT }
    );
    const userName = userArr[0]?.name || 'Unknown';
    // Set OBF as rejected (update both approval_status and project_status)
    await sequelize.query(
      `UPDATE obf SET approval_status = 'rejected', project_status = 'rejected', current_approver_role = NULL, current_approver_user_id = NULL, updated_at = NOW() WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.UPDATE }
    );
    // Notify all unique users (creator + access users, deduplicated)
    const message = `OBF ${obf.project_name} (${obf.project_code}) was rejected by ${userName} (${obf.current_approver_role})`;
    // Get all access user IDs
    const accessRows: any[] = await sequelize.query(
      `SELECT DISTINCT "userId" FROM obf_access WHERE "obfId" = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    const userIds = new Set([obf.creatorId, ...accessRows.map(row => row.userId)]);
    for (const uid of userIds) {
      await createNotification({ userId: uid, obfId: id, type: 'rejected', message });
    }
    return res.json({ message: 'OBF approval rejected.' });
  } catch (error) {
    console.error('Error in rejection:', error);
    return res.status(500).json({ message: 'Failed to reject OBF' });
  }
});

export default router; 