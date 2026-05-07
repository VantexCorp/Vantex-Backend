require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.route');
const machineRoutes = require('./routes/machine.route');
const workOrderRoutes = require('./routes/work_order.route');
const sparePartRoutes = require('./routes/spare_part.route');

const { initCronJobs } = require('./utils/cron.utils');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/spare-parts', sparePartRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Vantex Backend API is running' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;

if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
    initCronJobs(); 
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto '${PORT}'`);
    });
}