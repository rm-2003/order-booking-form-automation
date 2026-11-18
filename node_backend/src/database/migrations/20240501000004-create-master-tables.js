'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create manpower table
    await queryInterface.createTable('manpower', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      sr_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      role_description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      mll_grade: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      roll: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      ctc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes for manpower
    await queryInterface.addIndex('manpower', ['category'], {
      name: 'idx_manpower_category'
    });
    await queryInterface.addIndex('manpower', ['role_description'], {
      name: 'idx_manpower_role_description'
    });

    // Create capex table
    await queryInterface.createTable('capex', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      sr_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      asset: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      asset_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      period: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      amc: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes for capex
    await queryInterface.addIndex('capex', ['category'], {
      name: 'idx_capex_category'
    });
    await queryInterface.addIndex('capex', ['asset'], {
      name: 'idx_capex_asset'
    });

    // Create opex table
    await queryInterface.createTable('opex', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      sr_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      cost_description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      nos: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes for opex
    await queryInterface.addIndex('opex', ['category'], {
      name: 'idx_opex_category'
    });
    await queryInterface.addIndex('opex', ['cost_description'], {
      name: 'idx_opex_cost_description'
    });

    // Create rental table
    await queryInterface.createTable('rental', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      sr_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      area_sqft: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      rent_per_sqft: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes for rental
    await queryInterface.addIndex('rental', ['location'], {
      name: 'idx_rental_location'
    });

    // ==========================================
    // SEED DATA FOR MASTER TABLES
    // ==========================================

    // Seed manpower table with default values
    await queryInterface.bulkInsert('manpower', [
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 1, role_description: 'Adhoc Delivery Associates', mll_grade: 'Assistant Manager', category: 'Management', roll: 'MLL', ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 2, role_description: 'Adhoc Enroute Loaders', mll_grade: 'DEO', category: 'Supervisory', roll: 'Contract', ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 3, role_description: 'Adhoc Loaders', mll_grade: 'Deputy Manager', category: 'Labour', roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 4, role_description: 'Adhoc Process Associates', mll_grade: 'Deputy Manager - 1', category: 'Security', roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 5, role_description: 'Adhoc Security Guard', mll_grade: 'Deputy Manager - 2', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 6, role_description: 'ADM', mll_grade: 'Deputy Manager - 3', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 7, role_description: 'Admin Staff (DPO/MIS)', mll_grade: 'Executive', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 8, role_description: 'Admin Staff (skilled)Warehouse', mll_grade: 'Executive - 1', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 9, role_description: 'Aerosol Checkers', mll_grade: 'Executive - 2', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 10, role_description: 'AFL Operator', mll_grade: 'Executive - 3', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 11, role_description: 'Area Manager', mll_grade: 'Executive-1', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 12, role_description: 'Assistant Manager', mll_grade: 'Interns', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 13, role_description: 'Assistant/Deputy Manager', mll_grade: 'Labour', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 14, role_description: 'Associate', mll_grade: 'Manager', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 15, role_description: 'Associate - Operations', mll_grade: 'Manager - 1', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 16, role_description: 'Associates( semi-skilled )', mll_grade: 'Manager - 2', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 17, role_description: 'Asst. Manager', mll_grade: 'Manager - 3', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 18, role_description: 'BA - Executive', mll_grade: 'MHE Operator', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 19, role_description: 'BA - Helper', mll_grade: 'MLL Grade', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 20, role_description: 'BA Manpower', mll_grade: 'Security Guard', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 21, role_description: 'BA Supervisor', mll_grade: 'Security Supervisor', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 22, role_description: 'BA Supervisor( Shared resource)', mll_grade: 'Semi-Skilled Labour', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 23, role_description: 'BA-MHE Operator', mll_grade: 'Semiskilled-Operators', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 24, role_description: 'BA-Operator', mll_grade: 'Senior Executive', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 25, role_description: 'BA-Picker', mll_grade: 'Senior Executive - 1', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 26, role_description: 'BOPT Operator', mll_grade: 'Senior Executive - 2', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 27, role_description: 'Cashier', mll_grade: 'Senior Executive - 3', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 28, role_description: 'Casual Labour (Semi-skilled)', mll_grade: 'Senior Manager', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 29, role_description: 'Casual Manpower for cleaning', mll_grade: 'Senior Manager - 1', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 30, role_description: 'CAT manpower', mll_grade: 'Skilled Labour', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 31, role_description: 'CCTV Operator', mll_grade: 'Skilled Operators', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 32, role_description: 'CCTV Operator/ MST', mll_grade: 'Staff', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 33, role_description: 'Checker & Put away Labour (Skilled)', mll_grade: 'Supervisor', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 34, role_description: 'Checkers', mll_grade: 'Supervisor - 1', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 35, role_description: 'CL (Un-Skilled)', mll_grade: 'Supervisor - 2', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 36, role_description: 'Cleaner', mll_grade: 'Supervisor - 3', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 37, role_description: 'Clerk', mll_grade: 'Supervisory', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 38, role_description: 'Combi lift', mll_grade: 'Team Leader', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 39, role_description: 'Commercial Executive', mll_grade: 'Un Skilled Labour', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 40, role_description: 'Computer operators', mll_grade: 'Unskilled', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 41, role_description: 'Control Tower Executive', mll_grade: 'L2DH-AVP', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 42, role_description: 'Crane operator', mll_grade: 'L3DH-Sr.GM', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 43, role_description: 'Cross Dock In-charge', mll_grade: 'L4DH-General Manager', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 44, role_description: 'Cross Dock Manpower', mll_grade: 'L5DH-DGM', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 45, role_description: 'CSD + Water Planner', mll_grade: 'L5M-AGM', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 46, role_description: 'Cycle count Casual', mll_grade: 'L6M-Senior Manager', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 47, role_description: 'Damage Handling-Support', mll_grade: 'L7M-Manager', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 48, role_description: 'Data Entry Operator (DEO)', mll_grade: 'L7O-Deputy Manager', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 49, role_description: 'DC manager', mll_grade: 'L8O-Asst. Manager', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 50, role_description: 'Delivery Associate', mll_grade: 'L9O-Sr.Executive', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 51, role_description: 'DEO + (MIS + Documentation)', mll_grade: 'L10O-Executive', category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 52, role_description: 'DEO Co-Packaging', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 53, role_description: 'DEO Cum Supervisor', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 54, role_description: 'DEO/Executive', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 55, role_description: 'DEO/Executive (PCS / GR preparation)', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 56, role_description: 'DEO/Executive (Receipt to Dispatch System Operator )', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 57, role_description: 'DEO/Supervisor', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 58, role_description: 'Deputy Manager', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 59, role_description: 'Dock Checker', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 60, role_description: 'Dock Checker in', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 61, role_description: 'Dock Checker out', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 62, role_description: 'Dock Marshal', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 63, role_description: 'Dock Security', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 64, role_description: 'Dock-Checker-out', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 65, role_description: 'Documentation', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 66, role_description: 'Driver', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 67, role_description: 'Dy Manager (ADM)', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 68, role_description: 'Dy. Manager', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 69, role_description: 'Dy. Manager - HR & Admin', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 70, role_description: 'Electricians', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 71, role_description: 'Enroute Loaders', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 72, role_description: 'EOT Operator', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 73, role_description: 'EV Driver', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 74, role_description: 'Excavator Floor in-charge', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 75, role_description: 'Executive - Admin', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 76, role_description: 'Executive - EV Operations', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 77, role_description: 'Executive - HR & Admin', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 78, role_description: 'Executive - HR / MIS', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 79, role_description: 'Executive - Operation', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 80, role_description: 'Executive - Operations', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 81, role_description: 'Executive - Vehicle Placement', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 82, role_description: 'Executive (Operation Supervisor)', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 83, role_description: 'Executive (Safety- Supervisor)', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 84, role_description: 'Executive- Functional in-charge', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 85, role_description: 'Executive Inventory', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 86, role_description: 'Executive Operation', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 87, role_description: 'Executive/Officer', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 88, role_description: 'Executive/Officer-Put Away', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 89, role_description: 'Executive/Sr. Executive -out', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 90, role_description: 'Executives/Supervisor', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 91, role_description: 'Facility Admin', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 92, role_description: 'FG in-charge-CPG', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 93, role_description: 'Fixed Das', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 94, role_description: 'Fixed Loaders', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 95, role_description: 'Fixed Security', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 96, role_description: 'FL Operator', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 97, role_description: 'Floor Supervisor', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 98, role_description: 'FLT Operator', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 99, role_description: 'Fork Lift Driver (FLD)', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 100, role_description: 'FTC (Operation DEO)', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 101, role_description: 'FTC (Operation Supervisor)', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 102, role_description: 'Gas Cutter', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 103, role_description: 'General Trade Planner', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 104, role_description: 'Godrej 1.5T  Stacker , MFH-6000 mm Driver', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 105, role_description: 'Godrej 2 T Articulated forklift truck, MFH-9000 mm Driver', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 106, role_description: 'Grader/ Sorter', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 107, role_description: 'Group leader', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 108, role_description: 'Gunman', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 109, role_description: 'Helpers', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 110, role_description: 'Highly Skilled', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 111, role_description: 'HLOP Operator', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 112, role_description: 'House Keeping at WH ( Un Skilled )', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 113, role_description: 'House Keeping/Office boy- Sindhu', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 114, role_description: 'Housekeeper', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 115, role_description: 'HR', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 116, role_description: 'HR & Admin Executive', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 117, role_description: 'HR / Administration', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 118, role_description: 'HR + Admin', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 119, role_description: 'HR and Safety Executive', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 120, role_description: 'HR- Deputy Manager', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 121, role_description: 'HR Executive', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 122, role_description: 'HR in-charge', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 123, role_description: 'HR Lead', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 124, role_description: 'HR Manager', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 125, role_description: 'HR/Admin/Safety Officer', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 126, role_description: 'Hub in-charge', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 127, role_description: 'IB Executive', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 128, role_description: 'IB IRN Skilled', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 129, role_description: 'IB Material checking', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 130, role_description: 'IB QC Skilled', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 131, role_description: 'IB QC Skilled, IB LBH Skilled', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 132, role_description: 'IB Semi-Skilled', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 133, role_description: 'IB Skilled', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 134, role_description: 'IB Unloader', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 135, role_description: 'IB Unloader and OB Loader', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 136, role_description: 'ICQA Executive', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 137, role_description: 'ICQA Supervisor', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 138, role_description: 'ICQA-Semiskilled', mll_grade: null, category: null, roll: null, ctc: 0, created_at: new Date(), updated_at: new Date() }
    ], {});

    await queryInterface.bulkInsert('capex', [
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 1, asset: 'DG', asset_description: '10 KVA 1 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 2, asset: 'DG', asset_description: '10 KVA 1 Phase With MCP (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 3, asset: 'DG', asset_description: '10 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 4, asset: 'DG', asset_description: '10 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 5, asset: 'DG', asset_description: '100 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 6, asset: 'DG', asset_description: '100 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 7, asset: 'DG', asset_description: '125 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 8, asset: 'DG', asset_description: '125 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 9, asset: 'DG', asset_description: '15 KVA 1 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 10, asset: 'DG', asset_description: '15 KVA 1 Phase With MCP (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 11, asset: 'DG', asset_description: '15 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 12, asset: 'DG', asset_description: '15 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 13, asset: 'DG', asset_description: '160 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 14, asset: 'DG', asset_description: '160 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 15, asset: 'DG', asset_description: '20 KVA 1 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 16, asset: 'DG', asset_description: '20 KVA 1 Phase With MCP (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 17, asset: 'DG', asset_description: '20 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 18, asset: 'DG', asset_description: '20 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 19, asset: 'DG', asset_description: '200 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 20, asset: 'DG', asset_description: '200 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 21, asset: 'DG', asset_description: '25 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 22, asset: 'DG', asset_description: '25 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 23, asset: 'DG', asset_description: '250 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 24, asset: 'DG', asset_description: '250 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 25, asset: 'DG', asset_description: '30 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 26, asset: 'DG', asset_description: '30 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 27, asset: 'DG', asset_description: '35 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 28, asset: 'DG', asset_description: '35 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 29, asset: 'DG', asset_description: '40 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 30, asset: 'DG', asset_description: '40 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 31, asset: 'DG', asset_description: '45 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 32, asset: 'DG', asset_description: '45 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 33, asset: 'Printer', asset_description: '4-in-1 (Fax, printer, Scaner & copier) - 1000 copy per day', category: 'IT', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 34, asset: 'Printer', asset_description: '4-in-1 (Fax, printer, Scaner & copier) - 500 copy per day', category: 'IT', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 35, asset: 'Printer', asset_description: '4-in-1 (Fax, printer, Scaner & copier) - 5000 copy per day', category: 'IT', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 36, asset: 'DG', asset_description: '50 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 37, asset: 'DG', asset_description: '50 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 38, asset: 'DG', asset_description: '58.5 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 39, asset: 'DG', asset_description: '58.5 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 40, asset: 'DG', asset_description: '62.5 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 41, asset: 'DG', asset_description: '62.5 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 42, asset: 'DG', asset_description: '82.5 KVA 3 Phase With AMF Panel  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 43, asset: 'DG', asset_description: '82.5 KVA 3 Phase With MCP  (Without Installation)', category: 'Utility', period: 7, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 44, asset: 'Others', asset_description: 'Access control point', category: 'HSSE', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 45, asset: 'Fan', asset_description: 'Air Circulater 36" wall mount fans + Material & fitting', category: 'Utility', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 46, asset: 'AC', asset_description: 'Air Conditioner - Split 1 Ton', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 47, asset: 'AC', asset_description: 'Air Conditioner - Split 2 Ton', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 48, asset: 'AC', asset_description: 'Air Conditioner - Window 1 Ton', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 49, asset: 'AC', asset_description: 'Air Conditioner - Window 2 Ton', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 50, asset: 'Air curtain', asset_description: 'Air curtain - 3ft width / Door height - 10 ft', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() }
    ], {});
    
    await queryInterface.bulkInsert('capex', [
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 51, asset: 'Air curtain', asset_description: 'Air curtain - 4ft width / Door height - 10 ft', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 52, asset: 'Air curtain', asset_description: 'Air curtain - 6ft width / Door height - 10 ft', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 53, asset: 'Air curtain', asset_description: 'Air curtain - 9ft width / Door height - 10 ft', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 54, asset: 'Aircon', asset_description: 'Aircon Room Setup (Height - 10ft)', category: 'Facility', period: 5, amc: 0.08, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 55, asset: 'Trolley', asset_description: 'AM-OM Trolley (for Laptop & Printer Carrying)', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 56, asset: 'Water cooler', asset_description: 'Aquaguard Capacity 15 ltrs', category: 'Facility', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 57, asset: 'Forklift', asset_description: 'Articulated Forklift  with Battery & Charger + Camera - Reach Height 12.5 mtr / Cap 2.0 Ton (Godrej)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 58, asset: 'Forklift', asset_description: 'Articulated Forklift  with Battery & Charger + Camera - Reach Height 7.5 mtr / Cap 1.4 Ton (Godrej)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 59, asset: 'Forklift', asset_description: 'Articulated Forklift  with Battery & Charger + Camera - Reach Height 9.0 mtr / Cap 1.8 Ton (Godrej)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 60, asset: 'Attendance System', asset_description: 'Attendance System', category: 'WH Equip', period: 5, amc: 2.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 61, asset: 'Others', asset_description: 'Bag Sealing Machine', category: 'Packing', period: 5, amc: 0.10, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 62, asset: 'Printer', asset_description: 'Barcode printer', category: 'IT', period: 3, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 63, asset: 'Printer', asset_description: 'Barcode scanner (wired)', category: 'IT', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 64, asset: 'Others', asset_description: 'Breath Analyzer', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 65, asset: 'Others', asset_description: 'Bubble Pack machine', category: 'Packing', period: 5, amc: 20.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 66, asset: 'Trolley', asset_description: 'Cage Trolley - 650 (L) x 450 (W) x 1000 (H)', category: 'MHE', period: 5, amc: 1.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 67, asset: 'CCTV', asset_description: 'Camera system with color monitor for Reach Truck  (Godrej)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 68, asset: 'Others', asset_description: 'Canopy - 3.5 mtr (L) x 4 mtr (W)', category: 'L/UL Equip', period: 8, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 69, asset: 'Canteen', asset_description: 'Canteen Facility (AC)', category: 'Facility', period: null, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 70, asset: 'Canteen', asset_description: 'Canteen Facility (non-AC)', category: 'Facility', period: null, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 71, asset: 'Cartoon Box', asset_description: 'Carton Box - 300 mm (W) x 200 mm (D) x 150 mm (H)', category: 'Storage', period: 5, amc: 0.20, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 72, asset: 'Cartoon Box', asset_description: 'Carton Box - 450 mm (W) x 300 mm (D) x 300 mm (H)', category: 'Storage', period: 5, amc: 0.20, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 73, asset: 'Cabling', asset_description: 'CCTV Cabling', category: 'HSSE', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 74, asset: 'CCTV', asset_description: 'CCTV DVR - 16 cameras', category: 'HSSE', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 75, asset: 'CCTV', asset_description: 'CCTV DVR - 4 cameras', category: 'HSSE', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 76, asset: 'CCTV', asset_description: 'CCTV DVR - 8 cameras', category: 'HSSE', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 77, asset: 'CCTV', asset_description: 'CCTV Harddisk - 30 days storage (1 TB)', category: 'HSSE', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 78, asset: 'CCTV', asset_description: 'CCTV Harddisk - 90 days storage (3 TB)', category: 'HSSE', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 79, asset: 'CCTV', asset_description: 'CCTV Indoor camera (night vision) - Range 15 mtr', category: 'HSSE', period: 5, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 80, asset: 'CCTV', asset_description: 'CCTV Outdoor camera (night vision) - Range 30 mtr', category: 'HSSE', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 81, asset: 'CCTV', asset_description: 'CCTV Screen - 56 inch', category: 'HSSE', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 82, asset: 'CCTV', asset_description: 'CCTV Unit set - with DVR and 16 Camera', category: 'HSSE', period: 5, amc: 2.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 83, asset: 'CCTV', asset_description: 'CCTV Unit set - with DVR with 4 Camera', category: 'HSSE', period: 5, amc: 2.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 84, asset: 'Others', asset_description: 'Changing room - 3 ft (W) x 3 ft (D) x 7 ft (H) ', category: 'Facility', period: null, amc: 2.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 85, asset: 'Others', asset_description: 'Cold Room - 10 ft height', category: 'Facility', period: 5, amc: 0.07, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 86, asset: 'Others', asset_description: 'Convex miror with Shed (cap like projection)', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 87, asset: 'Computer', asset_description: 'Data Card', category: 'IT', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 88, asset: 'Others', asset_description: 'Deep Frezzer -  500 ltr - Temp upto -40 Deg', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 89, asset: 'Computer', asset_description: 'Desktop computer', category: 'IT', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 90, asset: 'Forklift', asset_description: 'Diesel Forklift (Godrej) - Reach Height 3.0 mtr / Cap 5.0 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 91, asset: 'Forklift', asset_description: 'Diesel Forklift (Godrej) - Reach Height 4.5 mtr / Cap 1.5 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 92, asset: 'Forklift', asset_description: 'Diesel Forklift (Godrej) - Reach Height 4.5 mtr / Cap 2.0 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 93, asset: 'Forklift', asset_description: 'Diesel Forklift (Godrej) - Reach Height 4.5 mtr / Cap 3.0 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 94, asset: 'CCTV', asset_description: 'Digital Camera - 7 Megapixel', category: 'Other Equip', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 95, asset: 'Board', asset_description: 'Display Boards', category: 'Other Equip', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 96, asset: 'Others', asset_description: 'Dock Bumpers', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 97, asset: 'Dock Leveller', asset_description: 'Dock Leveller (Maini) -  Capacity 5 ton 2.0 mtr (W) x 2.2 mtr (L)', category: 'L/UL Equip', period: 8, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 98, asset: 'Dock Leveller', asset_description: 'Dock Leveller (Maini) -  Capacity 9 ton 2.1 mtr (W) x 2.7 mtr (L)', category: 'L/UL Equip', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 99, asset: 'Others', asset_description: 'Dock Shelter', category: 'L/UL Equip', period: null, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 100, asset: 'Table', asset_description: 'Dock Table & chairs + 4 More Chairs', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() }
    ], {});
    
    await queryInterface.bulkInsert('capex', [
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 101, asset: 'Printer', asset_description: 'Dot Matrix printer - EPSON - LQ 1150', category: 'IT', period: 3, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 102, asset: 'Printer', asset_description: 'Dot Matrix printer - EPSON - LQ 2180', category: 'IT', period: 3, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 103, asset: 'Printer', asset_description: 'Dot Matrix printer - EPSON - LX 300', category: 'IT', period: 3, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 104, asset: 'Reach Truck', asset_description: 'Double Deep Reach Truck (Pantograph) (Jungheinrich) with Battery & Charger - Reach Height 11.3 mtr / Cap 1.6 MT (Model - ETR 335d GNE107 1135DZ)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 105, asset: 'Reach Truck', asset_description: 'Double Deep Reach Truck (Telescopic forks) (Jungheinrich) with Battery & Charger - Reach Height 11.5 mtr / Cap 2 MT (Model - ETV MC320 GNE115 1151DZ)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 106, asset: 'HPT', asset_description: 'E-Hand Pallet Truck  - Cap 1.5 ton with lithium battery (Jungheinrich)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 107, asset: 'Stacker', asset_description: 'Electric Stacker (Jungheinrich) with Battery & Charger - Reach Height 5.23 mtr / Cap 1.6 Ton (Model - EJC BB216)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 108, asset: 'Stacker', asset_description: 'Electric Stacker (Jungheinrich) with Battery & Charger & Operator Platform - Reach Height 5.43 mtr / Cap 1.6 Ton (Model - ERC BB216)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 109, asset: 'Stacker', asset_description: 'Electric Stacker with Battery & Charger - Reach Height 6.3 mtr / Cap 1.5 Ton (Godrej)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 110, asset: 'Electrification', asset_description: 'Electrification - 2-tier Shelving area', category: 'Facility', period: null, amc: 0.03, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 111, asset: 'Electrification', asset_description: 'Electrification - 3-tier Shelving area', category: 'Facility', period: null, amc: 0.03, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 112, asset: 'Electrification', asset_description: 'Electrification - Standard', category: 'Facility', period: null, amc: 0.03, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 113, asset: 'Lift', asset_description: 'Elevator Lift  - Reach Height 2.5 mtr / Cap 1.0 Ton', category: 'MHE', period: 8, amc: 10.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 114, asset: 'Lift', asset_description: 'Elevator Lift  - Reach Height 6.0 mtr / Cap 1.0 Ton', category: 'MHE', period: 8, amc: 10.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 115, asset: 'Light', asset_description: 'Emergency LED Light', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 116, asset: 'Light', asset_description: 'Emergency Lighting', category: 'Other Equip', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 117, asset: 'Light', asset_description: 'Emergency Lighting - 2 Beams', category: 'Facility', period: null, amc: null, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 118, asset: 'Light', asset_description: 'Emergency Lighting - Hand Hed', category: 'Facility', period: null, amc: null, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 119, asset: 'Others', asset_description: 'EPBAX system', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 120, asset: 'Fan', asset_description: 'Exhaust Fan - 18"', category: 'Utility', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 121, asset: 'Fan', asset_description: 'Exhaust Fan - 24"', category: 'Utility', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 122, asset: 'Battery', asset_description: 'Extra Battery Double Deep Reach Truck (Telescopic forks) (Jungheinrich)- Reach Height 11.5 mtr / Cap 2 MT Local', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 123, asset: 'Battery', asset_description: 'Extra Battery Double Deep Reach Truck (Telescopic forks) (Jungheinrich)- Reach Height 11.5 mtr / Cap 2 MT Local', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 124, asset: 'Battery', asset_description: 'Extra Battery Electric Stacker (Jungheinrich) - Reach Height 5.23 mtr / Cap 1.6 Ton (Model - EJC BB216)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 125, asset: 'Battery', asset_description: 'Extra Battery Electric Stacker (Jungheinrich) - Reach Height 5.43 mtr / Cap 1.6 Ton (Model - ERC BB216)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 126, asset: 'Battery', asset_description: 'Extra Battery Long Fork Power Pallet Truck (Jungheinrich) - Cap 2.0 ton (Model ERE MA120 G240)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 127, asset: 'Battery', asset_description: 'Extra Battery Long Fork Power Pallet Truck (Jungheinrich) - Cap 2.0 ton (Model ERE MB225 G240)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 128, asset: 'Battery', asset_description: 'Extra Battery Power Pallet Truck (Jungheinrich) - Cap 2 ton (Model ERE BB220)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 129, asset: 'Battery', asset_description: 'Extra Battery Power Pallet Truck (Jungheinrich) - Cap 2.5 ton (Model ERE MB225)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 130, asset: 'Battery', asset_description: 'Extra Battery Reach Truck (Jungheinrich)  -  Reach Height 10.7 mtr / Cap 1.6 Ton (Model - ETV MB216)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 131, asset: 'Battery', asset_description: 'Extra Battery Reach Truck (Jungheinrich)  -  Reach Height 11.5 mtr / Cap 2 Ton (Model - ETV MC320)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 132, asset: 'Battery', asset_description: 'Extra Battery Reach Truck (Jungheinrich)  - Reach Height 9 mtr / Cap 1.4 Ton (Model - ETV MB214)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 133, asset: 'Battery', asset_description: 'Extra Battery Tow Truck (Jungheinrich) with Battery & Charger - Cap 3.0 ton (Model - EZS MB230 )', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 134, asset: 'Battery', asset_description: 'Extra Battery Tow Truck (Jungheinrich) with Battery & Charger - Cap 5.0 ton (Model - EZS 350 )', category: 'MHE', period: null, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 135, asset: 'Others', asset_description: 'Eyewash', category: 'HSSE', period: 3, amc: 0.20, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 136, asset: 'Others', asset_description: 'False Ceiling', category: 'Facility', period: null, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 137, asset: 'Others', asset_description: 'Filing Cabinets - 2 ft (W) x 1.5 ft (D) x 4 ft (H) - 4 levels', category: 'Facility', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 138, asset: 'Fire Alarm', asset_description: 'Fire Alarm ( manual Siren )', category: 'Facility', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 139, asset: 'Fire Alarm', asset_description: 'Fire Alarm Detectors', category: 'HSSE', period: 5, amc: 0.02, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 140, asset: 'Fire Extinguisher', asset_description: 'Fire Extinguisher - ABC type - 4 kg', category: 'HSSE', period: 5, amc: 0.20, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 141, asset: 'Fire Extinguisher', asset_description: 'Fire Extinguisher - ABC type - 6 kg', category: 'HSSE', period: 5, amc: 0.20, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 142, asset: 'Fire Extinguisher', asset_description: 'Fire Extinguisher - ABC type - 9 kg', category: 'HSSE', period: 5, amc: 0.20, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 143, asset: 'Fire Extinguisher', asset_description: 'Fire Extinguisher - BC Type - 50 kg', category: 'HSSE', period: 5, amc: 20.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 144, asset: 'Fire Extinguisher', asset_description: 'Fire Extinguisher - CM FE36 Clean Agent - 10 kgs', category: 'HSSE', period: 5, amc: 20.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 145, asset: 'Fire Extinguisher', asset_description: 'Fire Extinguisher - CO2 type -  4.5 kg', category: 'HSSE', period: 5, amc: 20.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 146, asset: 'Fire Extinguisher', asset_description: 'Fire Extinguisher CM ABC Type - 10 kgs', category: 'HSSE', period: 5, amc: 20.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 147, asset: 'Fire Extinguisher', asset_description: 'Fire Extinguisher Foam Type - 50 ltr', category: 'HSSE', period: 5, amc: 20.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 148, asset: 'Fire Extinguisher', asset_description: 'Fire Extinguisher Foam Type - 9 ltr', category: 'HSSE', period: 5, amc: 20.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 149, asset: 'Fire Extinguisher', asset_description: 'Fire Safety Buckets', category: 'Facility', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 150, asset: 'Others', asset_description: 'First Aid Box', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() }
    ], {});
    
    await queryInterface.bulkInsert('capex', [
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 151, asset: 'Cleanin Machine', asset_description: 'Floor Cleaning machine 60ltr', category: 'Facility', period: 5, amc: 15.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 152, asset: 'Flooring', asset_description: 'Flooring - Anti-static', category: 'Facility', period: null, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 153, asset: 'Flooring', asset_description: 'Flooring - Epoxy - 1 mm thick', category: 'Facility', period: null, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 154, asset: 'Flooring', asset_description: 'Flooring - Linolium - 0.5 mm thick', category: 'Facility', period: null, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 155, asset: 'Flooring', asset_description: 'Flooring - PVC - 1 mm thick', category: 'Facility', period: null, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 156, asset: 'Flooring', asset_description: 'Flooring - PVC - 3 mm thick', category: 'Facility', period: null, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 157, asset: 'Forklift', asset_description: 'Forklift (Godrej) with Battery & Charger - Reach Height 3.0 mtr / Cap 3.0 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 158, asset: 'Forklift', asset_description: 'Forklift (Godrej) with Battery & Charger - Reach Height 3.0 mtr / Cap 5.0 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 159, asset: 'Forklift', asset_description: 'Forklift (Godrej) with Battery & Charger - Reach Height 4.5 mtr / Cap 1.5 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 160, asset: 'Forklift', asset_description: 'Forklift (Godrej) with Battery & Charger - Reach Height 4.5 mtr / Cap 2.0 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 161, asset: 'Forklift', asset_description: 'Forklift (Godrej) with Battery & Charger - Reach Height 4.5 mtr / Cap 2.5 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 162, asset: 'Forklift', asset_description: 'Forklift (Godrej) with Battery & Charger - Reach Height 4.5 mtr / Cap 3.0 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 163, asset: 'Forklift', asset_description: 'Forklift (Hyundai) with lithium Battery & Charger - Reach Height 6 mtr / Cap 2 Ton (Model -  20B-9F)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 164, asset: 'Battery', asset_description: 'Forklift (Jungheinrich) Extra Battery - Reach Height 4.4 mtr / Cap 3 Ton (Model - EFG BC330)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 165, asset: 'Battery', asset_description: 'Forklift (Jungheinrich) Extra Battery - Reach Height 4.8 mtr / Cap 1.6 Ton (Model - EFG BB216k)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 166, asset: 'Battery', asset_description: 'Forklift (Jungheinrich) Extra Battery - Reach Height 4.8 mtr / Cap 2 Ton (Model - EFG BB320)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 167, asset: 'Forklift', asset_description: 'Forklift (Jungheinrich) with Battery & Charger - Reach Height 4.4 mtr / Cap 3 Ton (Model - EFG BC330)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 168, asset: 'Forklift', asset_description: 'Forklift (Jungheinrich) with Battery & Charger - Reach Height 4.8 mtr / Cap 1.6 Ton (Model - EFG BB216k)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 169, asset: 'Forklift', asset_description: 'Forklift (Jungheinrich) with Battery & Charger - Reach Height 4.8 mtr / Cap 2 Ton (Model - EFG BB320)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 170, asset: 'Others', asset_description: 'Garbage Bins', category: 'Other Equip', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 171, asset: 'Others', asset_description: 'Gate Pass set up ( PC+Camera+Printer)', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 172, asset: 'HPT', asset_description: 'Hand Pallet Truck  - Cap 2.0 ton (Godrej)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 173, asset: 'HPT', asset_description: 'Hand Pallet Truck  - Cap 2.3 ton (Crown)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 174, asset: 'HPT', asset_description: 'Hand Pallet Truck  - Cap 2.5 ton (Nilkamal)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 175, asset: 'Others', asset_description: 'Hanging Tubelight with Chain', category: 'Facility', period: 3, amc: 0.15, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 176, asset: 'Others', asset_description: 'Heat Sealing Machine', category: 'Packing', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 177, asset: 'Ladder', asset_description: 'Hi Reach Ladder ( Liftman ) - mechanised', category: 'Facility', period: 7, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 178, asset: 'Ladder', asset_description: 'High Rise Ladder - for cleaning & Maintainence (Reach height - 15 mtr)', category: 'Facility', period: 7, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 179, asset: 'Others', asset_description: 'Industrial Scubber', category: 'Utility', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 180, asset: 'Printer', asset_description: 'Ink Jet Printers', category: 'IT', period: 3, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 181, asset: 'Others', asset_description: 'Insect Killer', category: 'Facility', period: 3, amc: 10.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 182, asset: 'Others', asset_description: 'Intruder alarm point', category: 'HSSE', period: 5, amc: 2.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 183, asset: 'Inverter', asset_description: 'Inverter - 1000 VA', category: 'Utility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 184, asset: 'Inverter', asset_description: 'Inverter - 1400 VA', category: 'Utility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 185, asset: 'Inverter', asset_description: 'Inverter - 2000 VA', category: 'Utility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 186, asset: 'Inverter', asset_description: 'Inverter - 800 VA', category: 'Utility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 187, asset: 'Computer', asset_description: 'IT Connectivity', category: 'IT', period: null, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 188, asset: 'Others', asset_description: 'Key Holder Stand', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 189, asset: 'Others', asset_description: 'Lable Applicator', category: 'Packing', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 190, asset: 'Telephone', asset_description: 'Landline Telephone', category: 'Other Equip', period: 3, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 191, asset: 'Computer', asset_description: 'Laptop', category: 'IT', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 192, asset: 'Printer', asset_description: 'Laser printer - HP Office Jet 6208 (Printer Scaner & Photo Copier)', category: 'IT', period: 3, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 193, asset: 'Printer', asset_description: 'Laser printer - HP1020', category: 'IT', period: 3, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 194, asset: 'Others', asset_description: 'Layout / Yard Marking', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 195, asset: 'Locker', asset_description: 'Lockers - 1.25 ft (W) x 1.5 ft (D) x 1 ft (H) - 6 levels', category: 'Facility', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 196, asset: 'Power Pallet Truck', asset_description: 'Long Fork Power Pallet Truck (Jungheinrich) with Battery & Charger - Cap 2.0 ton (Model ERE MA120 G240)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 197, asset: 'Power Pallet Truck', asset_description: 'Long Fork Power Pallet Truck (Jungheinrich) with Battery & Charger - Cap 2.0 ton (Model ERE MB225 G240)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 198, asset: 'Shelving', asset_description: 'Long Span Shelving –  1200 mm (W) x 300 mm (D) x 250 mm (H) x 7 Levels - 50 kg/Level', category: 'Storage', period: 8, amc: 1.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 199, asset: 'Shelving', asset_description: 'Long Span Shelving –  1200 mm (W) x 450 mm (D) x 350 mm (H) x 6 Levels - 100 kg/Level', category: 'Storage', period: 8, amc: 1.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 200, asset: 'Shelving', asset_description: 'Long Span Shelving –  3000 mm (W) x 600 mm (D) x 600 mm (H) x 4 Levels - 100 kg/Level', category: 'Storage', period: 8, amc: 1.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() }
    ], {});
    
    await queryInterface.bulkInsert('capex', [
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 201, asset: 'Table', asset_description: 'Lunch table', category: 'Facility', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 202, asset: 'Others', asset_description: 'Manual Chain Pulley 2 MT', category: 'L/UL Equip', period: 8, amc: 10.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 203, asset: 'Metal detector', asset_description: 'Metal Detector - Hand Frisker', category: 'HSSE', period: 5, amc: 3.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 204, asset: 'Metal detector', asset_description: 'Metal Detector - Walk Through (12 zone)', category: 'HSSE', period: 5, amc: 3.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 205, asset: 'Metal detector', asset_description: 'Metal Detector - Walk Through (8 Zone)', category: 'HSSE', period: 5, amc: 3.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 206, asset: 'Others', asset_description: 'Metal Stool', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 207, asset: 'Others', asset_description: 'Microwave', category: 'Facility', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 208, asset: 'Telephone', asset_description: 'Mobile Phone with High resolution Camera', category: 'IT', period: 2, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 209, asset: 'Signage', asset_description: 'Model WH CAPEX + Signages', category: 'Facility', period: null, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 210, asset: 'Others', asset_description: 'Motion Sensors', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 211, asset: 'Office set-up', asset_description: 'Office Setup - Basic', category: 'Facility', period: null, amc: 0.03, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 212, asset: 'Office set-up', asset_description: 'Office Setup - Premium', category: 'Facility', period: null, amc: 0.03, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 213, asset: 'Office set-up', asset_description: 'Office Setup - Standard', category: 'Facility', period: null, amc: 0.03, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 214, asset: 'Order Picker', asset_description: 'Order Picker (Jungheinrich) with Battery & Charger - Reach Height 8.0 mtr / Cap 1.0 Ton', category: 'MHE', period: 5, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 215, asset: 'Table', asset_description: 'Packing Table with Top (4 ft L x 3 ft W)', category: 'Facility', period: 3, amc: 10.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 216, asset: 'Table', asset_description: 'Packing Table with Top (6ft L x 4 ft W)', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 217, asset: 'Pallet', asset_description: 'Pallet (Metal) - 1.2 mtr (W) x 1.0 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 8, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 218, asset: 'Pallet', asset_description: 'Pallet (Metal) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 8, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 219, asset: 'Pallet', asset_description: 'Pallet (Plastic for Block-stack) - 1.2 mtr (W) x 1.0 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 7, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 220, asset: 'Pallet', asset_description: 'Pallet (Plastic for Block-stack) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 7, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 221, asset: 'Pallet', asset_description: 'Pallet (Plastic for Racking) - 1.2 mtr (W) x 1.0 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 7, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 222, asset: 'Pallet', asset_description: 'Pallet (Plastic for Racking) - 1.2 mtr (W) x 1.0 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 7, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 223, asset: 'Pallet', asset_description: 'Pallet (Plastic for Racking) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 7, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 224, asset: 'Pallet', asset_description: 'Pallet (Plastic for Racking) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 7, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 225, asset: 'Pallet', asset_description: 'Pallet (Wooden for Drive-In Racks) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 3, amc: 0.15, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 226, asset: 'Pallet', asset_description: 'Pallet (Wooden) - 1.2 mtr (W) x 1.0 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 3, amc: 0.15, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 227, asset: 'Pallet', asset_description: 'Pallet (Wooden) - 1.2 mtr (W) x 1.0 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 3, amc: 0.15, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 228, asset: 'Pallet', asset_description: 'Pallet (Wooden) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton', category: 'Storage', period: 3, amc: 0.15, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 229, asset: 'Pallet', asset_description: 'Pallet Racking (APRS) - 1.2 mtr (W) x 1.0 mtr (D) x 1.35 mtr (H) - Cap 0.5 Ton', category: 'Storage', period: 10, amc: 0.01, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 230, asset: 'Pallet', asset_description: 'Pallet Racking (APRS) - 1.2 mtr (W) x 1.0 mtr (D) x 1.35 mtr (H) - Cap 1.0 Ton', category: 'Storage', period: 10, amc: 0.01, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 231, asset: 'Pallet', asset_description: 'Pallet Racking (APRS) - 1.22 mtr (W) x 1.22 mtr (D) x 1.35 mtr (H) - Cap 0.5 Ton', category: 'Storage', period: 10, amc: 0.01, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 232, asset: 'Pallet', asset_description: 'Pallet Racking (APRS) - 1.22 mtr (W) x 1.22 mtr (D) x 1.35 mtr (H) - Cap 1.0 Ton', category: 'Storage', period: 10, amc: 0.01, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 233, asset: 'Pallet', asset_description: 'Pallet Racking (DRIVE-IN) - 1.2 mtr (W) x 1.0 mtr (D) x 1.35 mtr (H) - Cap 1.0 Ton', category: 'Storage', period: 10, amc: 0.01, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 234, asset: 'Fan', asset_description: 'Pedestal Fan - 24"', category: 'Utility', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 235, asset: 'Fan', asset_description: 'Pedestal Fan - 36"', category: 'Utility', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 236, asset: 'Ladder', asset_description: 'Picking Ladder', category: 'MHE', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 237, asset: 'Trolley', asset_description: 'Picking Trolley - 900 mm (L) x 600 mm (W) x 450 mm (H) 3 level', category: 'MHE', period: 5, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 238, asset: 'Plastic Bins', asset_description: 'Plastic Bins - 150 mm (W) x 100 mm (D) x 75 mm (H)', category: 'Storage', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 239, asset: 'Plastic Bins', asset_description: 'Plastic Bins - 300 mm (W) x 200 mm (D) x 150 mm (H)', category: 'Storage', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 240, asset: 'Plastic Bins', asset_description: 'Plastic Bins - 600 mm (W) x 400 mm (D) x 320 mm (H)', category: 'Storage', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 241, asset: 'Trolley', asset_description: 'Platform Trolley', category: 'MHE', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 242, asset: 'Power Pallet Truck', asset_description: 'Power Pallet Truck (Jungheinrich) with Battery & Charger - Cap 1.5 ton (Model AME15)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 243, asset: 'Power Pallet Truck', asset_description: 'Power Pallet Truck (Jungheinrich) with Battery & Charger - Cap 2 ton (Model ERE BB220)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 244, asset: 'Power Pallet Truck', asset_description: 'Power Pallet Truck (Jungheinrich) with Battery & Charger - Cap 2.5 ton (Model ERE MB225)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 245, asset: 'Others', asset_description: 'Public Addressing System', category: 'HSSE', period: 5, amc: 2.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 246, asset: 'Curtain', asset_description: 'PVC Curtain - 3mm thick, transperancy 95%, overlapping 50%, width 200mm', category: 'Facility', period: 5, amc: 0.03, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 247, asset: 'Curtain', asset_description: 'PVC Curtain - 3mm thick, transperancy 99.2%, overlapping 50%, width 200mm', category: 'Facility', period: 5, amc: 0.03, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 248, asset: 'Reach Truck', asset_description: 'Reach Truck (Crown) with Battery & Charger - Reach Height 10 mtr / Cap 1.6 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 249, asset: 'Reach Truck', asset_description: 'Reach Truck (Crown) with Battery & Charger - Reach Height 8.5 mtr / Cap 1.6 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 250, asset: 'Reach Truck', asset_description: 'Reach Truck (Double Deep) (Crown) with Battery & Charger - Reach Height 10 mtr / Cap 1.4 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() }
    ], {});
    
    await queryInterface.bulkInsert('capex', [
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 251, asset: 'Reach Truck', asset_description: 'Reach Truck (Godrej) with Battery & Charger - Reach Height 11 mtr / Cap 2.0 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 252, asset: 'Reach Truck', asset_description: 'Reach Truck (Godrej) with Battery & Charger - Reach Height 12 mtr / Cap 2.0 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 253, asset: 'Reach Truck', asset_description: 'Reach Truck (Godrej) with Battery & Charger - Reach Height 7.4 mtr / Cap 1.6 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 254, asset: 'Reach Truck', asset_description: 'Reach Truck (Godrej) with Battery & Charger - Reach Height 9.0 mtr / Cap 1.6 Ton', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 255, asset: 'Reach Truck', asset_description: 'Reach Truck (Hyundai) -  Reach Height 10.5 mtr / Cap 2 Ton (Model -  20BRJ-9)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 256, asset: 'Reach Truck', asset_description: 'Reach Truck (Hyundai) -  Reach Height 11 mtr / Cap 2 Ton (Model -  20BRJ-9)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 257, asset: 'Reach Truck', asset_description: 'Reach Truck (Jungheinrich) with Battery & Charger - Reach Height 10.7 mtr / Cap 1.6 Ton (Model - ETV MB216)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 258, asset: 'Reach Truck', asset_description: 'Reach Truck (Jungheinrich) with Battery & Charger - Reach Height 11.5 mtr / Cap 2 Ton (Model - ETV MC320)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 259, asset: 'Reach Truck', asset_description: 'Reach Truck (Jungheinrich) with Battery & Charger - Reach Height 9 mtr / Cap 1.4 Ton (Model - ETV MB214)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 260, asset: 'Refrigerator', asset_description: 'Refrigerator 200ltr', category: 'Other Equip', period: 3, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 261, asset: 'Refrigerator', asset_description: 'Refrigerator 350ltr', category: 'Other Equip', period: 3, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 262, asset: 'HHD', asset_description: 'RF Hand held terminal with Battery + charger - Honeywell', category: 'IT', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 263, asset: 'HHD', asset_description: 'RF Hand held terminal with Battery + charger - Motorola', category: 'IT', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 264, asset: 'Water cooler', asset_description: 'RO - Elite 1 - 25 litres per hour', category: 'Facility', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 265, asset: 'Water cooler', asset_description: 'RO - Elite 2 - 50 litres per hour', category: 'Facility', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 266, asset: 'Water cooler', asset_description: 'RO With water Cooler', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 267, asset: 'Bins', asset_description: 'ROTO  Moulded Wheel bins - 660 ltrs (Nilkamal)', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 268, asset: 'Others', asset_description: 'Rubber Foot Mat', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 269, asset: 'Others', asset_description: 'Safe - 1.25 ft (W) x 1.5 ft (D) x 1 ft (H)', category: 'Facility', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 270, asset: 'Television', asset_description: 'Safety Video Display TV ( MLL Safety )', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 271, asset: 'Others', asset_description: 'Scrap disposal area', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 272, asset: 'Others', asset_description: 'Seal machine - Box-sealing tape', category: 'Packing', period: 5, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 273, asset: 'Wrapping Machine', asset_description: 'Shrink wrap Machine', category: 'Packing', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 274, asset: 'Signage', asset_description: 'Signage', category: 'HSSE', period: null, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 275, asset: 'Shelving', asset_description: 'Slotted Angle Shelving –  1200 mm (W) x 450 mm (D) x 350 mm (H) x 6 Levels - 100 kg/Level', category: 'Storage', period: 8, amc: 1.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 276, asset: 'Shelving', asset_description: 'Slotted Angle Shelving –  1200 mm (W) x 600 mm (D) x 400 mm (H) x 6 Levels - 100 kg/Level', category: 'Storage', period: 8, amc: 1.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 277, asset: 'Shelving', asset_description: 'Slotted Angle Shelving –  1200 mm (W) x 600 mm (D) x 600 mm (H) x 4 Levels - 100 kg/Level', category: 'Storage', period: 8, amc: 1.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 278, asset: 'Shelving', asset_description: 'Slotted Angle Shelving –  900 mm (W) x 450 mm (D) x 600 mm (H) x 4 Levels - 100 kg/Level', category: 'Storage', period: 8, amc: 1.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 279, asset: 'Shelving', asset_description: 'Slotted Angle Shelving –  900 mm (W) x 600 mm (D) x 400 mm (H) x 6 Levels - 100 kg/Level', category: 'Storage', period: 8, amc: 1.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 280, asset: 'Shelving', asset_description: 'Slotted Angle Shelving –  900 mm (W) x 600 mm (D) x 600 mm (H) x 4 Levels - 100 kg/Level', category: 'Storage', period: 8, amc: 1.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 281, asset: 'Smoke Detector', asset_description: 'Smoke Detectors stand alone unit', category: 'HSSE', period: 5, amc: 0.02, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 282, asset: 'Battery', asset_description: 'Spare batteries for Articulated Electric Forklift Cap 1.5 Ton (Godrej)', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 283, asset: 'Battery', asset_description: 'Spare batteries for Electric Forklift Cap 1 Ton', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 284, asset: 'Battery', asset_description: 'Spare batteries for Electric Forklift Cap 2.0 Ton', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 285, asset: 'Battery', asset_description: 'Spare batteries for Electric Forklift Cap 2.5 Ton', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 286, asset: 'Battery', asset_description: 'Spare batteries for Electric Forklift Cap 3.0 Ton', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 287, asset: 'Battery', asset_description: 'Spare batteries for Electric Forklift Cap 3.0 Ton', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 288, asset: 'Battery', asset_description: 'Spare batteries for Electric Forklift Cap 5.0 Ton', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 289, asset: 'Battery', asset_description: 'Spare Batteries for Power Pallet Truck 2.0 Ton (Godrej)', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 290, asset: 'Battery', asset_description: 'Spare Batteries for Reach Truck', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 291, asset: 'Battery', asset_description: 'Spare Batteries for Tow Truck 2.0 Ton', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 292, asset: 'Battery', asset_description: 'Spare Battery - Stacker (Godrej)', category: 'MHE', period: 3, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 293, asset: 'Computer', asset_description: 'Speaker for Laptop', category: 'IT', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 294, asset: 'Others', asset_description: 'Speed bumpers', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 295, asset: 'Cupboard', asset_description: 'Steel Cupboard - 40" (W) x 20" (D) x 78" (H)', category: 'Storage', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 296, asset: 'Ladder', asset_description: 'Step Ladder', category: 'Facility', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 297, asset: 'Strapping Machine', asset_description: 'Strapping Machine - Manual', category: 'Packing', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 298, asset: 'Strapping Machine', asset_description: 'Strapping Machine - Semi Automatic', category: 'Packing', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 299, asset: 'Wrapping Machine', asset_description: 'Stretch wrapping machine - Manual', category: 'Packing', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 300, asset: 'Wrapping Machine', asset_description: 'Stretch wrapping machine - Semi-Automatic - Carton', category: 'Packing', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() }
    ], {});
    
    await queryInterface.bulkInsert('capex', [
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 301, asset: 'Wrapping Machine', asset_description: 'Stretch wrapping machine - Semi-Automatic - Pallet', category: 'Packing', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 302, asset: 'Others', asset_description: 'Suggestion Box', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 303, asset: 'Others', asset_description: 'Taping Machine - Manual', category: 'Packing', period: 3, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 304, asset: 'Others', asset_description: 'Tea/ Coffee Vending Machine ( 3 selection option)', category: 'Facility', period: 3, amc: 15.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 305, asset: 'Others', asset_description: 'Temperature data logger (Testo make)', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 306, asset: 'Others', asset_description: 'Temperature Indicator (Local brands) Manual temp. log', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 307, asset: 'Others', asset_description: 'Torch', category: 'Other Equip', period: 5, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 308, asset: 'Tow Truck', asset_description: 'Tow Truck (Hyundai) with Battery & Charger - Cap 4.0 ton (Model - 40T-9 )', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 309, asset: 'Tow Truck', asset_description: 'Tow Truck (Jungheinrich) with Battery & Charger - Cap 3.0 ton (Model - EZS MB230 )', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 310, asset: 'Tow Truck', asset_description: 'Tow Truck (Jungheinrich) with Battery & Charger - Cap 5.0 ton (Model - EZS 350 )', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 311, asset: 'Tow Truck', asset_description: 'Tow Truck with Battery & Charger - Cap 2.0 ton (Godrej)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 312, asset: 'Tow Truck', asset_description: 'Tow Truck with Battery & Charger - Cap 5.0 ton (Godrej)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 313, asset: 'Trolley', asset_description: 'Trolley Double Deep Reach Truck (Telescopic forks) (Jungheinrich) - Reach Height 11.5 mtr / Cap 2 MT Local', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 314, asset: 'Trolley', asset_description: 'Trolley Double Deep Reach Truck (Telescopic forks) (Jungheinrich)- Reach Height 11.5 mtr / Cap 2 MT Local', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 315, asset: 'Trolley', asset_description: 'Trolley Electric Stacker (Jungheinrich) - Reach Height 5.23 mtr / Cap 1.6 Ton (Model - EJC BB216)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 316, asset: 'Trolley', asset_description: 'Trolley Electric Stacker (Jungheinrich) - Reach Height 5.43 mtr / Cap 1.6 Ton (Model - ERC BB216)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 317, asset: 'Trolley', asset_description: 'Trolley Long Fork Power Pallet Truck (Jungheinrich) - Cap 2.0 ton (Model ERE MA120 G240)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 318, asset: 'Trolley', asset_description: 'Trolley Long Fork Power Pallet Truck (Jungheinrich) - Cap 2.0 ton (Model ERE MB225 G240)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 319, asset: 'Trolley', asset_description: 'Trolley Reach Truck (Jungheinrich)  -  Reach Height 10.7 mtr / Cap 1.6 Ton (Model - ETV MB216)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 320, asset: 'Trolley', asset_description: 'Trolley Reach Truck (Jungheinrich) -  Reach Height 11.5 mtr / Cap 2 Ton (Model - ETV MC320)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 321, asset: 'Trolley', asset_description: 'Trolley Reach Truck (Jungheinrich)  - Reach Height 9 mtr / Cap 1.4 Ton (Model - ETV MB214)', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 322, asset: 'Trolley', asset_description: 'Trolley Tow Truck (Jungheinrich) with Battery & Charger - Cap 3.0 ton (Model - EZS MB230 )', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 323, asset: 'Trolley', asset_description: 'Trolley Tow Truck (Jungheinrich) with Battery & Charger - Cap 5.0 ton (Model - EZS 350 )', category: 'MHE', period: 7, amc: 8.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 324, asset: 'UPS', asset_description: 'UPS 1 KVA - with 30 Minutes backup', category: 'IT', period: null, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 325, asset: 'UPS', asset_description: 'UPS 10 KVA - with 15 Minutes backup', category: 'IT', period: null, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 326, asset: 'UPS', asset_description: 'UPS 10 KVA - with 30 Minutes backup', category: 'IT', period: null, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 327, asset: 'UPS', asset_description: 'UPS 2 KVA - with 30 Minutes backup', category: 'IT', period: null, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 328, asset: 'UPS', asset_description: 'UPS 20 KVA - with 30 Minutes backup', category: 'IT', period: null, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 329, asset: 'UPS', asset_description: 'UPS 3 KVA - with 30 Minutes backup', category: 'IT', period: null, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 330, asset: 'UPS', asset_description: 'UPS 6 KVA - with 30 Minutes backup', category: 'IT', period: null, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 331, asset: 'Cleanin Machine', asset_description: 'Vaccum Cleaner - Air flow 300 CBM / hr + Tank Capacity - 60 ltrs', category: 'Facility', period: 5, amc: 7.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 332, asset: 'W/h Enclosure', asset_description: 'Warehouse Enclosure - Alluminium board partition', category: 'Facility', period: 8, amc: 0.02, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 333, asset: 'W/h Enclosure', asset_description: 'Warehouse Enclosure - Gypsum board partition', category: 'Facility', period: 8, amc: 0.02, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 334, asset: 'W/h Enclosure', asset_description: 'Warehouse Enclosure-Meshed partition', category: 'Facility', period: 8, amc: 0.02, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 335, asset: 'Water cooler', asset_description: 'Water Cooler - Blue Star - 40 litres', category: 'Facility', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 336, asset: 'Water cooler', asset_description: 'Water Cooler - Blue Star - 80 litres', category: 'Facility', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 337, asset: 'Water cooler', asset_description: 'Water Dispenser Machine - 3 litre', category: 'Facility', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 338, asset: 'Weighting Scale', asset_description: 'Weighting scale - 1.5 mtr (W) x 1.2 mtr (D) - Cap 1000 kg / LC - 10 gm', category: 'WH Equip', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 339, asset: 'Weighting Scale', asset_description: 'Weighting scale - Cap 100 kg / LC - 1 gm', category: 'WH Equip', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 340, asset: 'Weighting Scale', asset_description: 'Weighting scale - Cap 15 kg / LC - 0.5 gm', category: 'WH Equip', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 341, asset: 'Weighting Scale', asset_description: 'Weighting scale - Cap 15 kg / LC - 1 gm', category: 'WH Equip', period: 3, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 342, asset: 'Board', asset_description: 'White board (6\'\'X 4\'\')', category: 'Facility', period: 3, amc: 0.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 343, asset: 'Others', asset_description: 'Wi-Fi Access point (covering 5,000 sq.ft.)', category: 'IT', period: 6, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 344, asset: 'Cabling', asset_description: 'Wi-Fi Cabling', category: 'IT', period: null, amc: 0.05, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 345, asset: 'Others', asset_description: 'Work Station - 4\'\' (L) x3\'\' (W) x 3.5\'\' (H)', category: 'Packing', period: 5, amc: 5.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 346, asset: 'Others', asset_description: 'Work Station - 5\'\' (L) x3\'\' (W) x 3.5\'\' (H)', category: 'Packing', period: 5, amc: 10.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 347, asset: 'Printer', asset_description: 'Xebra Label Printer', category: 'IT', period: 5, amc: 10.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 348, asset: 'Printer', asset_description: 'ZEBRA GX 420D/200 DPI (Gift pack printer)', category: 'IT', period: 5, amc: 10.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 349, asset: 'Printer', asset_description: 'ZEBRA GX430T/300 DPI (SLAM Label Printer)', category: 'IT', period: 5, amc: 10.00, unit_cost: 0, created_at: new Date(), updated_at: new Date() }
    ], {});    

    // Seed opex table with all default values
    await queryInterface.bulkInsert('opex', [
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 1, cost_description: 'Electricity', category: 'Utility', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 2, cost_description: 'Electricity "Air Con Area"', category: 'Utility', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 3, cost_description: 'Water', category: 'Utility', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 4, cost_description: 'Repair / Maintenance cost', category: 'Maintenance', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 5, cost_description: 'Cleaning', category: 'Facility', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 6, cost_description: 'Pest control', category: 'Facility', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 7, cost_description: 'Staff Welfare', category: 'HR', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 8, cost_description: 'Meal - Mgmt/Sup.', category: 'HR', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 9, cost_description: 'Meal - Labour', category: 'HR', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 10, cost_description: 'Conveyance - Mgmt/Sup.', category: 'HR', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 11, cost_description: 'Conveyance - Labour', category: 'HR', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 12, cost_description: 'Uniform+Safety shoes', category: 'Safety', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 13, cost_description: 'HR/Admin Cost', category: 'HR', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 14, cost_description: 'Training Cost', category: 'HR', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 15, cost_description: 'Labour License', category: 'Compliance', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 16, cost_description: 'Medical Check-up', category: 'HR', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 17, cost_description: 'Rewards & Recognition', category: 'HR', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 18, cost_description: 'Telephones', category: 'Communication', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 19, cost_description: 'Mobile Phones', category: 'Communication', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 20, cost_description: 'Broadbands', category: 'Communication', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 21, cost_description: 'Leased line - Primary', category: 'Communication', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 22, cost_description: 'Leased line - Secondary', category: 'Communication', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 23, cost_description: 'Data card for Laptop', category: 'Communication', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 24, cost_description: 'Office stationery', category: 'Office', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 25, cost_description: 'Printer ribbons and cartridges', category: 'Office', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 26, cost_description: 'Other Office Expenses', category: 'Office', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 27, cost_description: 'Warehouse Registers', category: 'Office', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 28, cost_description: 'Asset Insurance cost', category: 'Insurance', unit_cost: 0, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 29, cost_description: 'Asset Maintenance Cost', category: 'Maintenance', unit_cost: 0, created_at: new Date(), updated_at: new Date() }
    ], {});    

    // Seed rental table with main locations
    await queryInterface.bulkInsert('rental', [
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 1, location: 'Mumbai', area_sqft: 1000, rent_per_sqft: 100, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 2, location: 'Delhi', area_sqft: 1500, rent_per_sqft: 80, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 3, location: 'Bangalore', area_sqft: 1200, rent_per_sqft: 90, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 4, location: 'Hyderabad', area_sqft: 1100, rent_per_sqft: 70, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 5, location: 'Chennai', area_sqft: 900, rent_per_sqft: 75, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 6, location: 'Pune', area_sqft: 800, rent_per_sqft: 85, created_at: new Date(), updated_at: new Date() },
      { id: Sequelize.literal('uuid_generate_v4()'), sr_no: 7, location: 'Kolkata', area_sqft: 950, rent_per_sqft: 60, created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to avoid foreign key constraint issues
    await queryInterface.dropTable('rental');
    await queryInterface.dropTable('opex');
    await queryInterface.dropTable('capex');
    await queryInterface.dropTable('manpower');
  }
}; 