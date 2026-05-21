const db = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/encryption.utils');
const { generateToken } = require('../utils/jwt.utils');

async function register(email, password, full_name, role = 'technician') {
  // 1. Verificar si el usuario ya existe
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    throw { status: 409, message: "El email ya está registrado" };
  }

  // 2. Hashear la contraseña
  const hashedPassword = await hashPassword(password);

  // 3. Crear el usuario
  const [id] = await db('users').insert({
    full_name,
    email,
    password_hash: hashedPassword,
    role
  });

  // 4. Devolver los datos sin la contraseña
  return { id, full_name, email, role };
}

async function login(email, password) {
  // 1. Buscar usuario
  const user = await db('users').where({ email }).first();
  if (!user) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  // 2. Comparar contraseñas
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  // 3. Generar Token JWT
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  const { password_hash: _, ...userWithoutPassword } = user; // Quitamos la contraseña del objeto

  return {
    user: userWithoutPassword,
    token
  };
}

async function findAllUsers() {
    return await db('users')
        .select('id', 'full_name', 'email', 'role', 'is_active')
        .orderBy('full_name', 'asc');
}

async function findUserById(id) {
    return await db('users')
        .select('id', 'full_name', 'email', 'role', 'is_active')
        .where({ id }).first();
}

/**
 * Modifica solo campos permitidos (Nombre y Email).
 */
async function modifyUser(id, updateData) {
  const { 
    full_name,
    email 
  } = updateData;
    
  const safeData = {};
    if (full_name !== undefined) safeData.full_name = full_name;
    if (email !== undefined) safeData.email = email;
    if(safeData.email){
      const existingUser = await db('users').where({ email: safeData.email }).first();
      if (existingUser && existingUser.id !== id) {
        throw { status: 409, message: "El email ya está registrado" };
      }
    }
    if (Object.keys(safeData).length === 0) {
        throw { status: 400, message: "No hay campos para actualizar" };
    }
    
    const updatedRows = await db('users').where({ id }).update(safeData);
    if (updatedRows === 0) {
        throw { status: 404, message: "User not found" };
    }
    
    return await findUserById(id);
}

/**
 * Modifica solo campos permitidos por el Admin (Nombre, Email y Estado activo).
 */
async function modifyUserByAdmin(id, updateData) {
  const { 
    full_name,
    is_active,
    email,
    role
  } = updateData;
    
  const safeData = {};
    if (full_name !== undefined) safeData.full_name = full_name;
    if (email !== undefined) safeData.email = email;
    if (is_active !== undefined) safeData.is_active = is_active;
    if (role !== undefined) safeData.role = role;
    if(safeData.email){
      const existingUser = await db('users').where({ email: safeData.email }).first();
      if (existingUser && existingUser.id !== id) {
        throw { status: 409, message: "El email ya está registrado" };
      }
    }
    if (Object.keys(safeData).length === 0) {
        throw { status: 400, message: "No hay campos para actualizar" };
    }
    
    const updatedRows = await db('users').where({ id }).update(safeData);
    if (updatedRows === 0) {
        throw { status: 404, message: "User not found" };
    }
    
    return await findUserById(id);
}

/**
 * Lógica de cambio de contraseña con verificación de clave actual.
 */
async function changePassword(userId, currentPassword, newPassword) {
    const user = await db("users").where({ id: userId }).first();
    if (!user) throw { status: 404, message: "User not found" };

    const isPasswordValid = await comparePassword(currentPassword, user.password_hash);
    if (!isPasswordValid) throw { status: 401, message: "Contraseña actual incorrecta" };

    const hashedPassword = await hashPassword(newPassword);
    return await db("users").where({ id: userId }).update({ password_hash: hashedPassword });
}

module.exports = { 
  register,
  login, 
  findAllUsers, 
  findUserById, 
  modifyUser, 
  modifyUserByAdmin, 
  changePassword 
};