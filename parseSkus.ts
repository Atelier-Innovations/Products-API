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
  client.query('CREATE TABLE IF NOT EXISTS skus(id INT PRIMARY KEY NOT NULL, styles_id INT, size VARCHAR(20), quantity VARCHAR(10), FOREIGN KEY (styles_id) REFERENCES styles(id))');
  const streamSkus = client.query(copyFrom('COPY skus FROM STDIN CSV HEADER'));
  const skusStream = fs.createReadStream('./csvFiles/skus.csv');

  skusStream.on('error', (err) => {console.log('onStart', err); done});
  streamSkus.on('error', (err) => {console.log('middle', err); done});
  streamSkus.on('finish', ()=> {console.log('finished'); done;});

  skusStream.pipe(streamSkus).on('finish', done).on('error', done);
})

