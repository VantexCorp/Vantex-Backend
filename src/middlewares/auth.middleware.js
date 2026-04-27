/**
 * @file Middleware para proteger rutas usando nuestro JWT helper
 * @module middlewares/auth
 */
const { verifyToken } = require('../utils/jwt.utils');