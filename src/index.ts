import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { getFeatures, getProducts, getSkus, getStyles, getSingleProduct } from './queries'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())


app.get('/', (req:Request, res:Response) => {
  res.send('Testing')
});

app.get('/products/:product_id', getSingleProduct);

app.get('/products', getProducts);

app.get('/skus', getSkus);

app.get('/features', getFeatures);

app.get('/products/:product_id/styles', getStyles)




app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`)
})