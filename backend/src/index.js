import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import models, { connectDb } from './models';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.Sender.findByLogin('rwieruch'),
  };
  next();
});

app.use(cors());

app.use('/session', routes.session);
app.use('/senders', routes.sender);
app.use('/messages', routes.message);
app.use('/user', routes.user);


app.get('*', function (req, res, next) {
  const error = new Error(
    `${req.ip} tried to access ${req.originalUrl}`,
  );
 
  error.statusCode = 301;
 
  next(error);
});
 
app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;
 
  if (error.statusCode === 301) {
    return res.status(301).redirect('/not-found');
  }
 
  return res
    .status(error.statusCode)
    .json({ error: error.toString() });
});

const eraseDatabaseOnSync = true;

connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.Sender.deleteMany({}),
      models.Message.deleteMany({}),
    ]);

    createSendersWithMessages();
  }

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
});

const createSendersWithMessages = async () => {
  const sender1 = new models.Sender({
    username: 'rwieruch',
  });
 
  const sender2 = new models.Sender({
    username: 'ddavids',
  });
 
  const message1 = new models.Message({
    text: 'Published the Road to learn React',
    sender: sender1.id,
  });
 
  const message2 = new models.Message({
    text: 'Happy to release ...',
    sender: sender2.id,
  });
 
  const message3 = new models.Message({
    text: 'Published a complete ...',
    sender: sender2.id,
  });
 
  await message1.save();
  await message2.save();
  await message3.save();
 
  await sender1.save();
  await sender2.save();
};

console.log(process.env.MY_SECRET);