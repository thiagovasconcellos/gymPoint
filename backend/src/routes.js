import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentControllers';
import MembershipController from './app/controllers/MembershipController';
import StudentRegistrationController from './app/controllers/StudentRegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrder from './app/controllers/HelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/students/:id/help-orders', HelpOrder.store);
routes.get('/unanswered', HelpOrder.show);
routes.get('/students/:id/help-orders', HelpOrder.index);

routes.use(authMiddleware);

routes.get('/students', StudentController.show);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.get('/memberships', MembershipController.show);
routes.post('/memberships', MembershipController.store);
routes.put('/memberships/:id', MembershipController.update);
routes.delete('/memberships/:id', MembershipController.delete);

routes.get('/registrations', StudentRegistrationController.show);
routes.post('/registrations', StudentRegistrationController.store);
routes.put('/registrations/:id', StudentRegistrationController.update);
routes.delete('/registrations/:id', StudentRegistrationController.delete);

routes.get('/students/:student_id/checkins', CheckinController.show);
routes.post('/students/:student_id/checkins', CheckinController.store);

routes.put('/help-orders/:id/answer', HelpOrder.update);

export default routes;
