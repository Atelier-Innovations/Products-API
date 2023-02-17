import * as pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv'
dotenv.config()
import * as fastcsv from '@fast-csv/parse';
import fs from 'fs'

// console.log(fastcsv)

const dbPW = process.env.dbPW;
const dbPORT = process.env.dbPORT
const stream = fs.createReadStream('./csvFiles/skus.csv')
const csvData = [];
const csvStream = fastcsv
  .parse()
  .on("error", (err) => {console.log(err)})
  .on("data", function() {
    csvData.push()
  })
  .on("end", function() {
    csvData.shift();


    const pool = new Pool({
      user: 'bryce',
      host: 'localhost',
      database: 'products',
      password: dbPW,
      port: Number(dbPORT)
    });

    const query = "INSERT INTO skus(id, styleid, size, quantity) VALUES($1, $2, $3, $4)";

    pool.connect((err, client, done) => {
      console.log('fromPoolConnection')
      if (err) throw err;

      try {
        csvData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err);
            } else {
              console.log(res.rowCount)
            }
          })
        })
      } finally {
        done();
      }
    })
  });



  stream.pipe(csvStream);