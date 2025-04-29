import { Router } from 'express';
import { createEnvironment } from '../controllers/environment/createEnvironment.controller';
import { getAllEnvironments } from '../controllers/environment/getAllEnvironments.controller';
import { createMarking } from '../controllers/marking/createMarking.controller';
import { getEnvironmentMarkings } from '../controllers/marking/getEnvironmentMarkings.controller';
import { updateMarking } from '../controllers/marking/updateMarking.controller';
import { getEnvironmentById } from '../controllers/environment/getEnvironmentById.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Everything below requires a valid JWT
router.use(authenticate);

router.get('/', getAllEnvironments);
router.post('/createEnvironment', createEnvironment);
router.post('/addMarking', createMarking);
router.get('/:id/markings', getEnvironmentMarkings);
router.put('/:id', updateMarking);
router.get('/:id', getEnvironmentById);

export default router;
