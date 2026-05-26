require('dotenv').config();
const amqp = require('amqplib');
const logger = require('../utils/logger');

const MESSAGES_QUEUE = 'payment.status';
const EXCHANGE = 'payment.exchange';
const ROUTING_KEY = 'payment.routing.key';

let channel = null;

async function connectRabbitMQ() {
    const url = `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
    const connection = await amqp.connect(url);
    channel = await connection.createChannel();

    await channel.assertQueue(MESSAGES_QUEUE, { durable: true });
    await channel.assertExchange(EXCHANGE, 'direct', { durable: true });
    await channel.bindQueue(MESSAGES_QUEUE, EXCHANGE, ROUTING_KEY);

    logger.info('[RabbitMQ] Conectado exitosamente');
    return channel;
}

function getChannel() {
    if (!channel) {
        logger.error('[RabbitMQ] Canal no inicializado. Llama connectRabbitMQ() primero.');
        throw new Error('[RabbitMQ] Canal no inicializado. Llama connectRabbitMQ() primero.');
    }
    return channel;
}

module.exports = { connectRabbitMQ, getChannel, MESSAGES_QUEUE, EXCHANGE, ROUTING_KEY };