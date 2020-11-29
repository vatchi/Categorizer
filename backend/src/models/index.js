import mongoose from 'mongoose';

import Sender from './sender';
import Message from './message';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
};

const models = { Sender, Message };

export { connectDb };

export default models;