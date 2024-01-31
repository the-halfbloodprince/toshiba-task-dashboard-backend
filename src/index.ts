import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const app = express()

app.get('/ping', (req, res) => res.send('Success'))

app.get('/api/profit-percentage-timeseries-dataset/raw', (req, res) => {
  res.sendFile(path.join(__dirname, '../data', 'profit_percentage_timeseries_dataset.csv'))
})

app.get('/api/profit-percentage-timeseries-dataset/downsampled', (req, res) => {
  res.sendFile(path.join(__dirname, '../data', 'profit_percentage_timeseries_dataset.csv'))
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Server up and running at port ${PORT}`))