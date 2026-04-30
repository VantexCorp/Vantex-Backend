require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sparePartRoutes = require('./routes/spare_part.route');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/spare-parts', sparePartRoutes);

// Ruta de salud/bienvenida
app.get('/', (req, res) => {
    res.json({ message: 'Vantex Backend API is running' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto '${PORT}'`);
});

module.exports = app;