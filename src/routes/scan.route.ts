import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { uploadScan } from '../controllers/scan/uploadScan.controller';

const router = Router();

router.post('/', upload.single('file'), uploadScan);

export default router;
