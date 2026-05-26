require('dotenv').config();
const amqp = require('amqplib');

let channel = null;

async function connectRabbitMQ() {
    const url = `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
    const connection = await amqp.connect(url);
    channel = await connection.createChannel();
    console.log('[RabbitMQ] Conectado');
    return channel;
}

function getChannel() {
    if (!channel) throw new Error('RabbitMQ no inicializado. Llama connectRabbitMQ() primero.');
    return channel;
}

module.exports = { connectRabbitMQ, getChannel };