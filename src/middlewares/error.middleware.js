/**
 * @file Middleware para capturar y devolver errores de express-validator
 * @module middlewares/error
 */
const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: "Validation errors in request",
      errors: errors.array() 
    });
  }
  next();
};

module.exports = { handleValidationErrors };