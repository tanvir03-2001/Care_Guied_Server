import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { requireRole } from '../../shared/middleware/role.middleware';
import { userController } from './user.controller';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/by-interests', (req, res, next) => userController.byInterests(req, res, next));
router.get('/', (req, res, next) => userController.list(req, res, next));
router.get('/:id', (req, res, next) => userController.getById(req, res, next));
router.post('/', (req, res, next) => userController.create(req, res, next));
router.patch('/:id', (req, res, next) => userController.update(req, res, next));
router.delete('/:id', (req, res, next) => userController.remove(req, res, next));

export default router;
