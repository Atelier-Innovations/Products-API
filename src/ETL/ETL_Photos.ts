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
  client.query('CREATE TABLE IF NOT EXISTS photos(id INT PRIMARY KEY NOT NULL, styles_id INT, url TEXT, thumbnail_url TEXT, FOREIGN KEY (styles_id) REFERENCES styles(id))')

  const streamPhotos = client.query(copyFrom("COPY photos FROM STDIN WITH QUOTE E'\b' NULL AS '' CSV HEADER"));
  const photosStream = fs.createReadStream('./csvFiles/photos.csv');

  photosStream.on('error', (err) => {console.log('photosStream', err); done});
  streamPhotos.on('error', (err) => {console.log('photosStream', err); done});
  streamPhotos.on('finish', () => {console.log('finished'); done});

  photosStream.pipe(streamPhotos).on('finish', done).on('error', done);
})