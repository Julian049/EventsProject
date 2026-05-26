const AzureOpenAiClient = require('../config/azureOpenAiClient');

const QUEUE_INPUT  = 'payment.status';
const QUEUE_OUTPUT = 'payment.output';

async function startLLMConsumer(channel) {
    const azureClient = new AzureOpenAiClient();

    await channel.assertQueue(QUEUE_INPUT,  { durable: true });
    await channel.assertQueue(QUEUE_OUTPUT, { durable: true });

    channel.consume(QUEUE_INPUT, async (msg) => {
        if (!msg) return;

        const jsonMessage = msg.content.toString();
        console.log(' [x] Recibido de pasarela:', jsonMessage);

        try {
            const dto = JSON.parse(jsonMessage);
            dto.message = await azureClient.generateEmpatheticMessage(dto.message, dto.error, dto.eventName, dto.description);

            channel.sendToQueue(
                QUEUE_OUTPUT,
                Buffer.from(JSON.stringify(dto)),
                { persistent: true }
            );

            channel.ack(msg);
            console.log(' [v] Enviado a la cola final.');

        } catch (e) {
            console.error('Error procesando el evento:', e.message);
            channel.nack(msg, false, false); // descarta el mensaje sin reencolar
        }
    });

    console.log('[LLMConsumer] Escuchando en', QUEUE_INPUT);
}

module.exports = { startLLMConsumer };