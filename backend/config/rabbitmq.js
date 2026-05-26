import amqp from 'amqplib';

export const MESSAGES_QUEUE = 'payment.status';
export const EXCHANGE = 'payment.exchange';
export const ROUTING_KEY = 'payment.routing.key';

let channel = null;

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

export async function connectRabbitMQ() {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Equivalente a: new Queue(MESSAGES_QUEUE, true)  → durable: true
    await channel.assertQueue(MESSAGES_QUEUE, { durable: true });

    // Equivalente a: new DirectExchange(EXCHANGE)
    await channel.assertExchange(EXCHANGE, 'direct', { durable: true });

    // Equivalente a: BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY)
    await channel.bindQueue(MESSAGES_QUEUE, EXCHANGE, ROUTING_KEY);

    console.log('RabbitMQ conectado');
    return channel;
}

// Equivalente a inyectar el channel como bean en Spring
export function getChannel() {
    if (!channel) throw new Error('RabbitMQ no inicializado. Llama connectRabbitMQ() primero.');
    return channel;
}