import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { postController } from './post.controller';

const router = Router();

router.get('/by-user/:userId', (req, res, next) => postController.byUser(req, res, next));
router.get('/', (req, res, next) => postController.list(req, res, next));
router.get('/:id', (req, res, next) => postController.getById(req, res, next));

router.post('/', authenticate, (req, res, next) => postController.create(req, res, next));
router.patch('/:id', authenticate, (req, res, next) => postController.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => postController.remove(req, res, next));

export default router;
