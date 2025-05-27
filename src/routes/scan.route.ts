import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { uploadScan } from '../controllers/scan/uploadScan.controller';
// import { getScanModelsById } from '../controllers/scan/uploadScan.controller';

const router = Router();
router.post(
  '/',
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'images', maxCount: 120 },
    { name: 'material', maxCount: 1 },
    { name: 'textures', maxCount: 200 },
  ]),
  uploadScan
);
//   router.get('/:id',getScanModelsById);

export default router;
