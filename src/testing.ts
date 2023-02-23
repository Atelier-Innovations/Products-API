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

// pool.query('EXPLAIN ANALYZE SELECT * FROM product WHERE id >= 1000000 ORDER BY id LIMIT 5')
//   .then((results) => {
//     console.log('products test', results.rows);
//   })
//   .catch((err) => {
//     console.log(err);
//   })

// pool.query('EXPLAIN ANALYZE SELECT product.id, product.name, product.slogan, product.description, product.category, product.default_price, features.feature, features.value FROM product INNER JOIN features ON product.id = features.product_id WHERE product.id = 1000011')
//   .then((results) => {
//     console.log('single product test', results.rows);
//   })
//   .catch((err) => {
//     console.log(err);
//   })

// pool.query('EXPLAIN ANALYZE SELECT * FROM features WHERE id >= 2210000 LIMIT 100')
//   .then((results) => {
//     console.log('features test', results.rows);
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// pool.query('EXPLAIN ANALYZE SELECT * FROM styles INNER JOIN photos ON styles.id = photos.styles_id WHERE styles.product_id = 1000011')
//   .then((results) => {
//     console.log('first styles join', results.rows)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// pool.query('EXPLAIN ANALYZE SELECT * FROM styles INNER JOIN skus ON styles.id = skus.styles_id WHERE styles.product_id = 1000011')
//   .then((results) => {
//     console.log('second styles join', results.rows)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// pool.query('EXPLAIN ANALYZE SELECT * FROM related WHERE current_product_id = 4508262')
//   .then((results) => {
//     console.log('related', results.rows);
//   })
//   .catch((err) => {
//     console.log(err);
//   })