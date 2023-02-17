import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import getSkus from '../queries'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())


app.get('/', (req:Request, res:Response) => {
  res.send('Testing')
});

app.get('/skus', getSkus)

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`)
})