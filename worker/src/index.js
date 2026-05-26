require('dotenv').config();
const { connectRabbitMQ } = require('./config/rabbitmq');
const { startLLMConsumer } = require('./consumer/llmConsumer');

connectRabbitMQ()
    .then(async (channel) => {
        await startLLMConsumer(channel);
    })
    .catch(error => {
        console.error('Error conectando RabbitMQ:', error);
        process.exit(1);
    });