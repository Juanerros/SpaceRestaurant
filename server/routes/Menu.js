import express from 'express';
import MenuController from '../controllers/MenuController.js';
import MenuService from '../services/MenuService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Instanciar servicio y controlador
const menuService = new MenuService(pool);
const menuController = new MenuController(menuService);

// Rutas de consulta (públicas)
router.get('/', menuController.getAllMenuItems);
router.get('/available', menuController.getAvailableMenuItems);
router.get('/search', menuController.searchMenuItems);
router.get('/:id', menuController.getMenuItemById);

// Rutas de modificación (requieren autenticación)
router.post('/', requireAuth, menuController.createMenuItem);
router.put('/:id', requireAuth, menuController.updateMenuItem);
router.patch('/:id/toggle-availability', requireAuth, menuController.toggleAvailability);
router.delete('/:id', requireAuth, menuController.deleteMenuItem);

export default router;