const QUEUE_OUTPUT = 'payment.output';
const logger = require('../utils/logger');

async function startPaymentOutputConsumer(channel) {
    await channel.assertQueue(QUEUE_OUTPUT, { durable: true });

    channel.consume(QUEUE_OUTPUT, (msg) => {
        if (!msg) return;

        const dto = JSON.parse(msg.content.toString());
        logger.info(`[RabbitMQ] Mensaje recibido en payment.output - error: ${dto.error} - Evento: ${dto.eventName}`);
        logger.info(`[RabbitMQ] Mensaje IA generado: ${dto.message}`);
        channel.ack(msg);
    });

    logger.info(`[RabbitMQ] Escuchando en ${QUEUE_OUTPUT}`);
}

module.exports = { startPaymentOutputConsumer };