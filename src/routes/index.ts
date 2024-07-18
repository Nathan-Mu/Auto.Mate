import { Router } from 'express';
import transactions from './transactions.ts';

const router = Router();

router.use('/test', (req, res) => {
  res.send('Hello from test route');
});

router.use('/transactions', transactions);

export default router;
