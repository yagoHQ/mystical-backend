import { Router } from 'express';
import { Request, Response } from 'express';
import { createEnvironment } from '../controllers/environment/createEnvironment.controller';
import { getAllEnvironments } from '../controllers/environment/getAllEnvironments.controller';
import { createUser, loginUser } from '../controllers/auth/login.controller';
import { createMarking } from '../controllers/marking/createMarking.controller';
import { getEnvironmentMarkings } from '../controllers/marking/getEnvironmentMarkings.controller';
import { updateMarking } from '../controllers/marking/updateMarking.controller';
import { getEnvironmentById } from '../controllers/environment/getEnvironmentById.controller';

const router = Router();

router.post('/createEnvironment', createEnvironment);
router.get('/', getAllEnvironments);
router.post('/login', loginUser);
router.post('/createUser', createUser);
router.post('/addMarking', createMarking);
router.get('/:id/markings', getEnvironmentMarkings);
router.put('/:id', updateMarking);
router.get('/:id', getEnvironmentById);

export default router;
