'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert default Implementation Cost Break-up rows for all existing OBFs
    const [obfs] = await queryInterface.sequelize.query('SELECT id FROM obf');
    for (const obf of obfs) {
      // Implementation Cost Break-up
      const implRows = [
        'Project Manager',
        'SD Resource',
        'Travelling Cost',
        'Stay + Food Cost',
        'Conveyance Cost'
      ];
      for (const cost_type of implRows) {
        await queryInterface.sequelize.query(`
          INSERT INTO obf_implementation_cost (obf_id, cost_type, unit_cost, nos, created_at, updated_at)
          SELECT :obf_id, :cost_type, 0, 0, NOW(), NOW()
          WHERE NOT EXISTS (
            SELECT 1 FROM obf_implementation_cost WHERE obf_id = :obf_id AND cost_type = :cost_type
          )
        `, {
          replacements: { obf_id: obf.id, cost_type }
        });
      }
      // Pre Go Live Manpower cost
      const preGoLiveRows = [
        'Supervisory',
        'Management',
        'Labour',
        'Security',
        'Recruitement Cost'
      ];
      for (const manpower_type of preGoLiveRows) {
        await queryInterface.sequelize.query(`
          INSERT INTO obf_pre_go_live_manpower (obf_id, manpower_type, nos, cost_per_month, created_at, updated_at)
          SELECT :obf_id, :manpower_type, 0, 0, NOW(), NOW()
          WHERE NOT EXISTS (
            SELECT 1 FROM obf_pre_go_live_manpower WHERE obf_id = :obf_id AND manpower_type = :manpower_type
          )
        `, {
          replacements: { obf_id: obf.id, manpower_type }
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove only the default rows (by type) for all OBFs
    const implRows = [
      'Project Manager',
      'SD Resource',
      'Travelling Cost',
      'Stay + Food Cost',
      'Conveyance Cost'
    ];
    await queryInterface.bulkDelete('obf_implementation_cost', {
      cost_type: implRows
    });
    const preGoLiveRows = [
      'Supervisory',
      'Management',
      'Labour',
      'Security',
      'Recruitement Cost'
    ];
    await queryInterface.bulkDelete('obf_pre_go_live_manpower', {
      manpower_type: preGoLiveRows
    });
  }
}; 