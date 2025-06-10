import { Router } from 'express';
import {
  createEnvironment,
  bulkUpdateScans,
} from '../controllers/environment/createEnvironment.controller';
import {
  getAllEnvironments,
  getEnvironmentById,
  getDashboardData,
  addOrigin,
} from '../controllers/environment/getAllEnvironments.controller';
import {
  createMarking,
  deleteMarking,
  getMarkingById,
} from '../controllers/marking/createMarking.controller';
import { updateMarking } from '../controllers/marking/updateMarking.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/multer';

const router = Router();

router.get('/', getAllEnvironments);
router.post('/createEnvironment', upload.single('image'), createEnvironment);
router.post('/updateScans', bulkUpdateScans);
router.post('/addMarking', createMarking);
router.delete('/deleteMarking/:id', deleteMarking);
router.get('/markings/:id', getMarkingById);
router.put('/:id', updateMarking);
router.get('/:id', getEnvironmentById);
router.get('/dashboard/getData', getDashboardData);
router.post('/origin', addOrigin);

export default router;
