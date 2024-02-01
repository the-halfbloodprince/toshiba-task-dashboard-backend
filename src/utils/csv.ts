import fs from 'fs'
import csvParser from 'csv-parser'

export let parsedCSV: any[] = []

export const parseCsv = async (path: string) => {
  
  const result: any[] = []

  if (parsedCSV.length) return parsedCSV
  
  return fs
    .createReadStream(path)
    .pipe(csvParser())
    .on('data', data => {
      // console.log(data)
      result.push(data)
    })
    .on('end', () => {
      parsedCSV = result
      console.log('finished parsing csv')
    })
}