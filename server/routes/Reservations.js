import express from 'express';
import ReservationController from '../controllers/ReservationController.js';
import ReservationService from '../services/ReservationService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Instanciar servicio y controlador
const reservationService = new ReservationService(pool);
const reservationController = new ReservationController(reservationService);

// Rutas de consulta
router.get('/', requireAuth, reservationController.getAllReservations);
router.get('/upcoming', requireAuth, reservationController.getUpcomingReservations);
router.get('/search', requireAuth, reservationController.searchReservationsByCustomer);
router.get('/date/:date', requireAuth, reservationController.getReservationsByDate);
router.get('/:id', requireAuth, reservationController.getReservationById);

// Rutas de modificación (requieren autenticación)
router.post('/', requireAuth, reservationController.createReservation);
router.put('/:id', requireAuth, reservationController.updateReservation);
router.delete('/:id', requireAuth, reservationController.deleteReservation);

export default router;