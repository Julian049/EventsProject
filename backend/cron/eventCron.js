const cron = require('node-cron');
const EventModel = require('../models/eventModel');


cron.schedule('* * * * *', async () => {
    try {
        const result = await EventModel.completeFinishedEvents();
        if (result.rowCount > 0) {
            console.log(`[Cron] ${result.rowCount} evento(s) marcados como Inactive`);
        }
    } catch (err) {
        console.error('[Cron] Error al actualizar eventos:', err.message);
    }
});

console.log('[Cron] Tarea de eventos programada (cada minuto)');