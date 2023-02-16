import * as pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv'

dotenv.config()

const dbPW = process.env.dbPW;
const dbPORT = process.env.dbPORT

const pool = new Pool({
  user: 'bryce',
  host: 'localhost',
  database: 'products',
  password: dbPW,
  port: Number(dbPORT)
})

const getSkus = (req, res) => {
  pool.query('SELECT * FROM skus', (error, results) => {
    if (error) {
      throw error
    }
  res.status(200).json(results.rows)
  })
}

export default getSkus;