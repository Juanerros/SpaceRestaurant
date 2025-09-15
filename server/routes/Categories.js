import express from 'express';
import CategoryController from '../controllers/CategoryController.js';
import CategoryService from '../services/CategoryService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Instanciar servicio y controlador
const categoryService = new CategoryService(pool);
const categoryController = new CategoryController(categoryService);

// Rutas CRUD para categorías
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', requireAuth, categoryController.createCategory);
router.put('/:id', requireAuth, categoryController.updateCategory);
router.delete('/:id', requireAuth, categoryController.deleteCategory);

// Ruta adicional para obtener platos por categoría
router.get('/:id/menu', categoryController.getMenuByCategory);

export default router;