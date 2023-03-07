import * as pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv'
import { Request, Response } from 'express';
import { transformProductRequest, transformRelated, transformStylesRequest } from './transformHelpers';

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

export const getProducts = (req: Request, res: Response) => {
  if (!req.params.page) {
    req.params.page = '0'
  } else {
    req.params.page = (Number(req.params.page) - 1).toString()
  }

  if (!req.params.count) {
    req.params.count = '5';
  }

  const pageNumber = (Number(req.params.page) * Number(req.params.count)).toString()

  pool.query(`SELECT * FROM product WHERE id >= $1 ORDER BY id LIMIT $2`, [pageNumber, req.params.count])
    .then((results) => {
      // console.log(results.rows)
      res.send(results.rows)
    })
    .catch((err) => {console.log(err)})
}

export const getSingleProduct = (req: Request, res: Response) => {
  pool.query(`SELECT product.id, product.name, product.slogan, product.description, product.category, product.default_price, features.feature, features.value FROM product INNER JOIN features ON product.id = features.product_id WHERE product.id = $1`, [req.params.product_id])
    .then((results) => {
      const transformedResults = transformProductRequest(results.rows)
      res.send(transformedResults)
    })
    .catch((err) => {console.log(err)})
}

export const getFeatures = (req: Request, res: Response) => {
  pool.query('SELECT * FROM features LIMIT 100')
    .then((results) => {res.send(results.rows)})
    .catch((err) => {console.log(err)})
}

// export const getStyles = (req: Request, res: Response) => {
//   pool.query(`SELECT * FROM styles INNER JOIN photos ON styles.id = photos.styles_id WHERE styles.product_id = $1`, [req.params.product_id])
//     .then((query1) => {
//       pool.query(`SELECT * FROM styles INNER JOIN skus ON styles.id = skus.styles_id WHERE styles.product_id = $1`, [req.params.product_id])
//         .then((query2) => {
//           const result = [];
//           result.push(query1.rows);
//           result.push(query2.rows);
//           // console.log(result)
//           res.send(transformStylesRequest(result));
//         })
//         .catch((err) => {console.log(err)});
//     })
//     .catch((err) => {console.log(err)});
// }

export const getStyles = (req: Request, res: Response) => {
  const product_id = req.params.product_id;

  pool.query(`
    SELECT
      json_agg(json_build_object(
        'style_id', styles.id,
        'name', styles.name,
        'photos', (
          SELECT json_agg(json_build_object(
            'thumbnail_url', photos.thumbnail_url,
            'url', photos.url
          ))
          FROM photos
          WHERE photos.styles_id = styles.id
        ),
        'skus', (
          SELECT json_object_agg(
            skus.id, json_build_object(
              'quantity', skus.quantity,
              'size', skus.size
            )
          )
          FROM skus
          WHERE skus.styles_id = styles.id
        )
      )) as styles
    FROM styles
    WHERE styles.product_id = $1
    GROUP BY styles.product_id
  `, [product_id])
    .then((query) => {
      const result = query.rows[0];
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving styles data.');
    });
}

export const getSkus = (req: Request, res: Response) => {
  pool.query('SELECT * FROM skus LIMIT 100')
    .then((results) => {res.send(results.rows)})
    .catch((err) => {console.log(err)})
}

export const getPhotos = (req: Request, res: Response) => {
  pool.query('SELECT * FROM photos LIMIT 100')
    .then((results) => {
      // console.log(results.rows)
      res.send(results.rows)
    })
    .catch((err) => {console.log(err)})
}


export const getRelatedProducts = (req: Request, res: Response) => {
  pool.query(`SELECT related_product_id FROM related WHERE current_product_id = $1`, [req.params.product_id])
    .then((results) => {
      // console.log(results.rows);
      res.send(transformRelated(results.rows));
    })
    .catch((err) => {console.log(err)})
}
