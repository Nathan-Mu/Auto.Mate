import fs from 'node:fs';
import { parse } from 'csv-parse';
import { finished } from 'node:stream/promises';

export default async function (fileName: string): Promise<string[][]> {
  const records = [];

  const parser = fs
    .createReadStream(fileName)
    .pipe(parse({ delimiter: ',' }))
    .on('readable', function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

  await finished(parser);

  return records;
}
