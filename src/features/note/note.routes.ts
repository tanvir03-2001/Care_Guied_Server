import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { noteController } from './note.controller';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => noteController.list(req, res, next));
router.get('/:id', (req, res, next) => noteController.getById(req, res, next));
router.post('/', (req, res, next) => noteController.create(req, res, next));
router.patch('/:id', (req, res, next) => noteController.update(req, res, next));
router.delete('/:id', (req, res, next) => noteController.remove(req, res, next));

export default router;
