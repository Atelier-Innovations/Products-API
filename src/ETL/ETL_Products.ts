import * as pg from 'pg';
import * as copy from 'pg-copy-streams'
const copyFrom = copy.from
const { Pool } = pg;
import dotenv from 'dotenv'
dotenv.config()

// import * as fastcsv from '@fast-csv/parse';
import fs from 'fs'


const dbPW = process.env.dbPW;
const dbPORT = process.env.dbPORT



const pool = new Pool ({
  user: 'bryce',
  host: 'localhost',
  database: 'products',
  password: dbPW,
  port: Number(dbPORT)
});


pool.connect((err, client, done) => {

  client.query('CREATE TABLE IF NOT EXISTS product(id INT PRIMARY KEY NOT NULL, name VARCHAR(50), slogan VARCHAR(200), description VARCHAR(500), category VARCHAR(20), default_price VARCHAR(15))')
  const streamProducts = client.query(copyFrom('COPY product FROM STDIN CSV HEADER'));
  const productsStream = fs.createReadStream('./csvFiles/product.csv')

  productsStream.on('error', (err) => {console.log('productsStream', err); done})
  streamProducts.on('error', (err) => {console.log('middle', err); done});
  streamProducts.on('finish', () => {console.log('finished'); done});

  productsStream.pipe(streamProducts).on('finish', done).on('error', done);
})






