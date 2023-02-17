import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { getFeatures, getProducts, getSkus, getStyles, getProduct } from './queries'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())


app.get('/', (req:Request, res:Response) => {
  res.send('Testing')
});


app.get('/product/:id', getProduct)
app.get('/products', getProducts);
app.get('/skus', getSkus);
app.get('/features', getFeatures);
app.get('/styles', getStyles);



app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`)
})