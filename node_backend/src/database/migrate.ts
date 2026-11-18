// @ts-ignore: Suppress missing module type for 'umzug'
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'obf_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: console.log,
  }
);

// Configure Umzug for migrations
const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, './migrations/*.js'),
    resolve: (params) => {
      if (!params.path) {
        throw new Error('Migration path is required');
      }
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const migration = require(params.path);
      return {
        name: params.name,
        up: async () => migration.up(params.context, Sequelize),
        down: async () => migration.down(params.context, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// Run migrations
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Execute all pending migrations
    const migrations = await umzug.up();
    console.log('Migrations executed successfully');
    if (migrations.length === 0) {
      console.log('No migrations were executed, database schema already up to date');
    } else {
      console.log('Executed migrations:', migrations.map((m) => m.name).join(', '));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error executing migrations:', error);
    process.exit(1);
  }
})(); 