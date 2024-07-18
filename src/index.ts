import express from 'express';
import { APP_PORT } from './config.ts';
import routes from './routes/index.ts';

const app = express();

app.use('/', routes);

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});
