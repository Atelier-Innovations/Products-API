import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { getFeatures, getProducts, getSkus, getStyles, getSingleProduct, getPhotos, getRelatedProducts } from './queries'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())


app.get('/', (req:Request, res:Response) => {
  res.send('Testing')
});


app.get('/products/:product_id', getSingleProduct);

// errors when requesting product_id = [2, 100, 101]
app.get('/products/:product_id/styles', getStyles)


app.get('/products/:product_id/related', getRelatedProducts)

app.get('/loaderio-942522511193efbb37a0c6c6c258ecbe.txt', (req, res) => {
  res.sendFile('loaderio-942522511193efbb37a0c6c6c258ecbe.txt', {root: './src'})
})
app.get('/products/:page/:count', getProducts);



app.get('/skus', getSkus);
app.get('/features', getFeatures);
app.get('/styles/photos', getPhotos)




app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`)
})