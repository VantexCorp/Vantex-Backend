const authService = require('../services/auth.service');

async function registerUser(req, res) {
  try {
    const { email, password, full_name } = req.body;
    // Seguridad: Forzamos el rol a 'technician' en el registro público para evitar escalada de privilegios
    const result = await authService.register(email, password, full_name, 'technician');
    res.status(201).json({ success: true, message: "Usuario registrado", data: result });
  } catch (error) {

    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message || "Error al registrar" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ success: true, message: "Login exitoso", data: result });
  } catch (error) {

    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message || "Error en el login" });
  }
}