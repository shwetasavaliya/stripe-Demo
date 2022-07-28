import { MONGO_URL, MONGO_CONFIG, isLocal } from '../../config';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

const connectMongoDB = async () => {
    try {
        const options: mongoose.ConnectionOptions = {
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
          poolSize: MONGO_CONFIG.poolSize,
          family: 4
        };
        (<any>mongoose).Promise = bluebird;
        mongoose.connect(MONGO_URL, options);

        // mongoose.set('debug', true);
    
        const mongoDb = mongoose.connection;
        mongoDb.on('error', () => {
          console.log(`Unable to connect to mongo database`);
        });
    
        mongoDb.once('open', () => {
          console.log(`Connected to mongo database`);
        });
      } catch (error) {
        console.error('error:', error.message);
      }
}

export default connectMongoDB