import express, { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';

const router = express.Router();

interface FinalOutputData {
  // OBF fields
  project_code: string;
  project_name: string;
  opportunity_id: string;
  client_name: string;
  description: string | null;
  project_type: string;
  project_category: string;
  project_priority: string;
  project_status: string;
  created_at: string;
  creatorId: string;

  // Input result fields
  vertical: string;
  location: string;
  state: string;

  // Metrics fields
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

  // Manpower fields
  manpower_mll: number;
  manpower_ba: number;
  manpower_security: number;
  manpower_total: number;

  // CAPEX fields
  capex_storage: number;
  capex_mhe: number;
  capex_facility: number;
  capex_other: number;

  // One Time fields
  one_time_rentals: number;
  one_time_rent_related: number;
  one_time_impl_cost: number;
  one_time_capex_1st_month_write_off: number;
  go_live_date: string | null;
}

// GET /obf/:obfId/final-output
router.get('/obf/:obfId/final-output', async (req: Request, res: Response) => {
  const { obfId } = req.params;
  try {
    // Get all data from the final output view
    const [data] = await sequelize.query<FinalOutputData>(
      `SELECT 
        o.*,
        ir.vertical,
        ir.location,
        ir.state,
        metrics.*,
        mp.manpower_mll,
        mp.manpower_ba,
        mp.manpower_security,
        mp.manpower_total,
        fc.capex_storage,
        fc.capex_mhe,
        fc.capex_facility,
        fc.capex_other,
        fo.rentals as one_time_rentals,
        fo.rent_related as one_time_rent_related,
        fo.impl_cost as one_time_impl_cost,
        fo.capex_1st_month_write_off as one_time_capex_1st_month_write_off,
        r.go_live_date as go_live_date
      FROM obf o
      LEFT JOIN obf_input_result ir ON o.id = ir.project_id
      LEFT JOIN obf_financial_metrics metrics ON o.id = metrics.obf_id
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
          SUM(CASE WHEN category = 'Storage' THEN unit_cost * nos ELSE 0 END) as capex_storage,
          SUM(CASE WHEN category = 'MHE' THEN unit_cost * nos ELSE 0 END) as capex_mhe,
          SUM(CASE WHEN category = 'Facility' THEN unit_cost * nos ELSE 0 END) as capex_facility,
          SUM(CASE WHEN category NOT IN ('Storage', 'MHE', 'Facility') THEN unit_cost * nos ELSE 0 END) as capex_other,
          SUM(unit_cost * nos) as total_capex
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
      LEFT JOIN obf_revenue r ON o.id = r.obf_id
      WHERE o.id = :obfId`,
      { replacements: { obfId }, type: QueryTypes.SELECT }
    );

    // YOY Increase (static for now)
    const yoyIncrease = [
      { label: 'Revenue', value: 6.6 },
      { label: 'Rent', value: 5.0 },
      { label: 'Manpower', value: 10.0 },
      { label: 'Opex', value: 7.0 }
    ];

    // Transform the data into the expected format
    const response = {
      ...data,
      metrics: {
        gross_margin_year1: data.gross_margin_year1,
        gross_margin_fy2026: data.gross_margin_fy2026,
        gross_margin_contract: data.gross_margin_contract,
        gross_percent_year1: data.gross_percent_year1,
        gross_percent_fy2026: data.gross_percent_fy2026,
        gross_percent_contract: data.gross_percent_contract,
        trade_discount_year1: data.trade_discount_year1,
        trade_discount_fy2026: data.trade_discount_fy2026,
        trade_discount_contract: data.trade_discount_contract,
        gross_margin_after_discount_year1: data.gross_margin_after_discount_year1,
        gross_margin_after_discount_fy2026: data.gross_margin_after_discount_fy2026,
        gross_margin_after_discount_contract: data.gross_margin_after_discount_contract,
        gross_margin_after_discount_percent_year1: data.gross_margin_after_discount_percent_year1,
        gross_margin_after_discount_percent_fy2026: data.gross_margin_after_discount_percent_fy2026,
        gross_margin_after_discount_percent_contract: data.gross_margin_after_discount_percent_contract,
        depreciation_ammortisation_year1: data.depreciation_ammortisation_year1,
        depreciation_ammortisation_fy2026: data.depreciation_ammortisation_fy2026,
        depreciation_ammortisation_contract: data.depreciation_ammortisation_contract,
        ebit_year1: data.ebit_year1,
        ebit_fy2026: data.ebit_fy2026,
        ebit_contract: data.ebit_contract,
        ebit_percent_year1: data.ebit_percent_year1,
        ebit_percent_fy2026: data.ebit_percent_fy2026,
        ebit_percent_contract: data.ebit_percent_contract,
        interest_cost_year1: data.interest_cost_year1,
        interest_cost_fy2026: data.interest_cost_fy2026,
        interest_cost_contract: data.interest_cost_contract,
        ebt_year1: data.ebt_year1,
        ebt_fy2026: data.ebt_fy2026,
        ebt_contract: data.ebt_contract,
        ebt_percent_year1: data.ebt_percent_year1,
        ebt_percent_fy2026: data.ebt_percent_fy2026,
        ebt_percent_contract: data.ebt_percent_contract
      },
      yoyIncrease,
      manpower: {
        mll: data.manpower_mll,
        ba: data.manpower_ba,
        security: data.manpower_security,
        total: data.manpower_total
      },
      capex: {
        storage: data.capex_storage,
        mhe: data.capex_mhe,
        facility: data.capex_facility,
        other: data.capex_other
      },
      oneTime: {
        rentals: data.one_time_rentals,
        rent_related: data.one_time_rent_related,
        impl_cost: data.one_time_impl_cost,
        capex_1st_month_write_off: data.one_time_capex_1st_month_write_off,
        go_live_date: data.go_live_date
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching final output:', error);
    res.status(500).json({ message: 'Failed to fetch final output' });
  }
});

export default router; 