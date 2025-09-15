import express from 'express';
import TableController from '../controllers/TableController.js';
import TableService from '../services/TableService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Instanciar servicio y controlador
const tableService = new TableService(pool);
const tableController = new TableController(tableService);

// Rutas de consulta
router.get('/', tableController.getAllTables);
router.get('/status/:status', tableController.getTablesByStatus);
router.get('/:id', tableController.getTableById);

// Rutas de modificación (requieren autenticación)
router.post('/', requireAuth, tableController.createTable);
router.put('/:id', requireAuth, tableController.updateTable);
router.patch('/:id/status', requireAuth, tableController.changeTableStatus);
router.patch('/:id/waiter', requireAuth, tableController.assignWaiter);
router.delete('/:id', requireAuth, tableController.deleteTable);

export default router;