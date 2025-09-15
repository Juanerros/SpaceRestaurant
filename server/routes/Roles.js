import express from 'express';
import RoleController from '../controllers/RoleController.js';
import RoleService from '../services/RoleService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Instanciar servicio y controlador
const roleService = new RoleService(pool);
const roleController = new RoleController(roleService);

// Rutas CRUD para roles
router.get('/', requireAuth, roleController.getAllRoles);
router.get('/:id', requireAuth, roleController.getRoleById);
router.post('/', requireAuth, roleController.createRole);
router.put('/:id', requireAuth, roleController.updateRole);
router.delete('/:id', requireAuth, roleController.deleteRole);

export default router;