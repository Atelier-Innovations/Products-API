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
  client.query('CREATE TABLE IF NOT EXISTS related(id INT PRIMARY KEY NOT NULL, current_product_id INT, related_product_id INT, FOREIGN KEY (current_product_id) REFERENCES product(id))')
  const streamRelated = client.query(copyFrom('COPY related FROM STDIN CSV HEADER'))
  const relatedStream = fs.createReadStream('./csvFiles/related.csv');

  relatedStream.on('error', (err) => {console.log('onStart', err); done});
  streamRelated.on('error', (err) => {console.log('middle', err); done});
  streamRelated.on('finish', ()=> {console.log('finished'); done;});

  relatedStream.pipe(streamRelated).on('finish', done).on('error', done);
})