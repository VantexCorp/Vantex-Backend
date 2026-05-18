const authService = require('../services/auth.service');

const getMe = async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Tienes acceso VIP",
            data: { id: req.user.id, email: req.user.email, role: req.user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener perfil" });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await authService.findUserById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }
        
        res.json({ success: true, data: user });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message || "Error al obtener el usuario" });
    }
};

async function registerUser(req, res) {
  try {
    const { email, password, full_name } = req.body;
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

const getAllUsers = async (req, res) => {
    try {
        const users = await authService.findAllUsers();
        res.json({ success: true, data: users });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

const updateUserByAdmin = async (req, res) => {
    try {
        await authService.modifyUserByAdmin(req.params.id, req.body);
        res.json({ success: true, message: "Usuario actualizado correctamente por el Administrador" });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        await authService.modifyUser(req.user.id, req.body);
        res.json({ success: true, message: "Usuario actualizado" });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await authService.changePassword(req.user.id, currentPassword, newPassword);
        res.json({ success: true, message: "Contraseña actualizada con éxito" });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

module.exports = { 
  registerUser,
  loginUser,
  getAllUsers, 
  getMe,
  getUserById,
  updateUser,
  updateUserByAdmin,
  updatePassword  
};