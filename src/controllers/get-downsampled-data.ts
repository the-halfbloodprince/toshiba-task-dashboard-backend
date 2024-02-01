import fs from 'fs'
import path from 'path'
import csvParser from 'csv-parser'
import { Request, Response } from "express"
import { LTTB } from '../utils/downsampleCSV'

let cachedCSVData: any[] = []
let cachedDownsampledData: any[] = []

export const getDownsampledData = async (req: Request, res:Response) => {

  if (cachedDownsampledData.length) return res.json(cachedDownsampledData)

  if (cachedCSVData.length) {
    cachedDownsampledData = LTTB(cachedCSVData, 100)
    return res.json(cachedDownsampledData)
  }

  const location = path.join(__dirname, '../../data', 'profit_percentage_timeseries_dataset.csv')
  const newData: any[] = []

  await fs
    .createReadStream(location)
    .pipe(csvParser())
    .on('data', (data) => {
      newData.push(data)
      // console.log('data processing')
    })
    .on('end', () => {
      cachedCSVData = newData
      console.log('data fetched')
      cachedDownsampledData = LTTB(newData, 100)
      return res.json(cachedDownsampledData)
    })

  console.log('now I run')
}