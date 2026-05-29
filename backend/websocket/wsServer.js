const { WebSocketServer } = require('ws');
const logger = require('../utils/logger');

const clients = new Map();

function attachToServer(httpServer) {
    const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

    wss.on('connection', (ws, req) => {
        const userId = new URL(req.url, 'http://localhost').searchParams.get('userId');

        if (!userId) {
            ws.close(1008, 'userId requerido');
            return;
        }

        clients.set(userId, ws);
        logger.info(`[WS] Cliente conectado: userId=${userId}`);

        ws.on('close', () => {
            clients.delete(userId);
            logger.info(`[WS] Cliente desconectado: userId=${userId}`);
        });

        ws.on('error', (err) => {
            logger.error(`[WS] Error en socket de userId=${userId}: ${err.message}`);
        });
    });

    logger.info('[WS] Servidor WebSocket listo en /ws');
}

function notifyClient(userId, payload) {
    const ws = clients.get(String(userId));
    if (!ws || ws.readyState !== 1) {
        logger.warn(`[WS] No hay cliente activo para userId=${userId}`);
        return;
    }
    ws.send(JSON.stringify(payload));
    logger.info(`[WS] Mensaje enviado a userId=${userId}`);
}

module.exports = { attachToServer, notifyClient };