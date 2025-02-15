const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const pool = new Pool({
  host: 'localhost',
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  allowExitOnIdle: true
});

pool.on('connect', () => {
  console.log('Conectado a la base de datos PostgreSQL:', process.env.DATABASE_NAME);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};


