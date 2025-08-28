import express from 'express';
import authController from '../controllers/authController.js';
import AuthService from '../services/authService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

const AuthService = new AuthService(pool);
const authController = new authController(AuthService);

// Rutas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

export default router;