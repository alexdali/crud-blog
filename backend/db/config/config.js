require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
}