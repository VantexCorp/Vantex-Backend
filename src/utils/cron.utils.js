/**
 * @file cron.utils.js
 * @description Configuración y registro de tareas en segundo plano (Cron Jobs).
 */
const cron = require('node-cron');
const db = require('../config/database');

const initCronJobs = () => {
    cron.schedule('0 2 * * *', async () => {
        const timestamp = new Date().toISOString();
        console.info(`[${timestamp}] [CRON:WORK_ORDERS] Iniciando auditoría de inactividad...`);
        
        try {
            const [result] = await db.raw('CALL sp_cierre_ordenes_abandonadas()');
            
            const resumen = result?.[0]?.[0]?.Resumen_Auditoria || "Ejecución completada sin output.";
            console.info(`[${timestamp}] [CRON:WORK_ORDERS] SUCCESS - ${resumen}`);
            
        } catch (error) {
            console.error(`[${timestamp}] [CRON:WORK_ORDERS] FATAL ERROR - Ejecución abortada. Detalles: ${error.message}`);
        }
    });

    console.info(`[${new Date().toISOString()}] [SYSTEM] Servicio de tareas programadas inicializado correctamente.`);
};

module.exports = { initCronJobs };
