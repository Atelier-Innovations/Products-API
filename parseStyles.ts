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
  if (err) throw err;
  client.query('CREATE TABLE IF NOT EXISTS styles(id INT PRIMARY KEY NOT NULL, product_id INT, name VARCHAR(30), sale_price VARCHAR(15), original_price VARCHAR(15), default_style INT, FOREIGN KEY (product_id) REFERENCES product(id))')
  const streamStyles = client.query(copyFrom('COPY styles FROM STDIN CSV HEADER'));
  const stylesStream = fs.createReadStream('./csvFiles/styles.csv')

  stylesStream.on('error', (err) => {console.log('productsStream', err); done})
  streamStyles.on('error', (err) => {console.log('middle', err); done});
  streamStyles.on('finish', () => {console.log('finished'); done});

  stylesStream.pipe(streamStyles).on('finish', done).on('error', done);
})