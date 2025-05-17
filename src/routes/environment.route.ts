import { Router } from 'express';
import { createEnvironment } from '../controllers/environment/createEnvironment.controller';
import { getAllEnvironments } from '../controllers/environment/getAllEnvironments.controller';
import {
  createMarking,
  deleteMarking,
} from '../controllers/marking/createMarking.controller';
import { getEnvironmentMarkings } from '../controllers/marking/getEnvironmentMarkings.controller';
import { updateMarking } from '../controllers/marking/updateMarking.controller';
import { getEnvironmentById } from '../controllers/environment/getEnvironmentById.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/multer';

const router = Router();

router.get('/', getAllEnvironments);
router.post('/createEnvironment', upload.single('image'), createEnvironment);
router.post('/addMarking', createMarking);
router.delete('/deleteMarking/:id', deleteMarking);
router.get('/:id/markings', getEnvironmentMarkings);
router.put('/:id', authenticate, updateMarking);
router.get('/:id', getEnvironmentById);

export default router;
