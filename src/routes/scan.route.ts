import { Router } from 'express';
import { upload } from '../middlewares/upload';
import {
  uploadScan,
  deleteScan,
} from '../controllers/scan/uploadScan.controller';
// import { getScanModelsById } from '../controllers/scan/uploadScan.controller';

const router = Router();
router.post(
  '/',
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'images', maxCount: 200 },
    { name: 'material', maxCount: 1 },
    { name: 'textures', maxCount: 20000 },
  ]),
  uploadScan
);
router.delete('/delete/:id', deleteScan);
//   router.get('/:id',getScanModelsById);

export default router;
