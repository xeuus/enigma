import { Bootable, Service } from 'feret';
import mongoose, { connect } from 'mongoose';
import { Config } from '../Config';

@Service()
export class DatabaseService implements Bootable {
  constructor(private readonly config: Config) {}

  async onBoot() {
    console.log('Connecting database...');
    mongoose.set('strictQuery', true);
    await connect(this.config.DB_URI);
  }
}
