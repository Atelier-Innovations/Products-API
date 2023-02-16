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
  client.query('CREATE TABLE IF NOT EXISTS features(id INT PRIMARY KEY NOT NULL, product_id INT, feature VARCHAR(30), value VARCHAR(30), FOREIGN KEY (product_id) REFERENCES product(id))')
  const streamFeatures = client.query(copyFrom('Copy features FROM STDIN CSV HEADER'));
  const featuresStream = fs.createReadStream('./csvFiles/features.csv')

  featuresStream.on('error', (err) => {console.log('productsStream', err); done})
  streamFeatures.on('error', (err) => {console.log('middle', err); done});
  streamFeatures.on('finish', () => {console.log('finished'); done});

  featuresStream.pipe(streamFeatures).on('finish', done).on('error', done);

})