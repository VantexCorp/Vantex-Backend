/**
 * @file Middleware para proteger rutas usando nuestro JWT helper
 * @module middlewares/auth
 */
const { verifyToken } = require('../utils/jwt.utils');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Acceso denegado. Token no proporcionado." });
  }

  // 2. Extraemos solo la parte del token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificamos la firma matemática del token
    const decoded = verifyToken(token);
    
    // 4. Si es válido, guardamos los datos del usuario en la petición y lo dejamos pasar
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token inválido o expirado." });
  }
};