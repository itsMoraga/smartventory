const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Todas las rutas del dashboard requieren autenticación
router.get('/', authenticateJWT, dashboardController.getDashboardStats);

module.exports = router;
