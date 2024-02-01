import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { getDownsampledData } from './controllers/get-downsampled-data'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(cors())

app.get('/ping', (req, res) => res.send('Success'))

app.get('/api/profit-percentage-timeseries-dataset/raw', (req, res) => {
  res.sendFile(path.join(__dirname, '../data', 'profit_percentage_timeseries_dataset.csv'))
})

app.get('/api/profit-percentage-timeseries-dataset/downsampled', getDownsampledData)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server up and running at port ${PORT}`))