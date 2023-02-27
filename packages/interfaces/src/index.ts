import path from 'path';
import glob from 'glob';
import fs from 'fs';

export async function readTypeDefs() {
  return Promise.all(
    await new Promise<Promise<string>[]>((accept, reject) => {
      const pattern = path.join(__dirname, '../src/**/*.gql');
      glob(pattern, (err, files) => {
        if (err) reject(err);
        accept(files.map((file) => fs.promises.readFile(file, 'utf8')));
      });
    }),
  );
}

export * from './resolvers';
export * from './types';
