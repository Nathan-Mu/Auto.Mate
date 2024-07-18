import dayjs from 'dayjs';
import { Router } from 'express';
import multer from 'multer';
import processTransactions from '../transaction/index.ts';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/transactions/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')}_${file.originalname}`,
    );
  },
});
const upload = multer({
  storage,
});

router.post('/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading file');
    } else {
      console.log(req.file);
      const records = await processTransactions(req.file.path);
      console.log('File processed');
      res.send(records);
    }
  });
});

export default router;
