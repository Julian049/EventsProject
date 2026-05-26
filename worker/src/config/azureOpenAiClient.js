const OpenAI = require('openai');
const AzureOpenAI = OpenAI.AzureOpenAI;

class AzureOpenAiClient {
    constructor() {
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey   = process.env.AZURE_OPENAI_KEY;
        this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

        if (!endpoint || !apiKey) {
            throw new Error('ERROR: AZURE_OPENAI_ENDPOINT o AZURE_OPENAI_KEY no configuradas.');
        }

        this.client = new AzureOpenAI({
            endpoint,
            apiKey,
            apiVersion: '2025-01-01-preview',
        });
    }

    async generateEmpatheticMessage(technicalMessage, isError, eventName, description) {
        const isNetworkError = ['agotado', 'tiempo', 'espera']
            .some(keyword => technicalMessage.toLowerCase().includes(keyword));

        let systemPrompt;

        if (!isError) {
            systemPrompt = `
                Eres un asistente de experiencia de usuario para una plataforma de venta de entradas a eventos.
                El usuario acaba de comprar una entrada para: "${eventName}".
                Descripción del evento: "${description}".
                Genera un mensaje de confirmación personalizado, entusiasta y cálido basado en ese evento específico.
                Agrega una recomendación corta y relevante para el ingreso (llegar temprano, qué llevar, dress code, etc.).
                El mensaje debe ser breve, en español, y terminar con un emoji relacionado al evento.
                NO preguntes nada al usuario, ya tienes toda la información necesaria.
        `;
        } else if (isNetworkError) {
            systemPrompt = `
                Eres un asistente de recuperación de ventas para una plataforma de entradas a eventos.
                Hubo un error de red o timeout. Genera un mensaje que:
                1. Sea empático y tranquilizador, sin alarmar al usuario.
                2. Invite a intentar de nuevo con urgencia sutil pero amable.
                3. Sea breve, en español, con tono cercano.
            `;
            console.log("Entre aca");
        } else {
            systemPrompt = `
                Eres un asistente de experiencia de usuario para una plataforma de venta de entradas a eventos,
                genera un mensaje que:
                1. Sea empático y NO haga sentir mal al usuario.
                2. Explique brevemente qué pudo pasar, en lenguaje simple.
                3. Sugiera una acción concreta (intentar con otra tarjeta, contactar al banco, etc.).
                4. Sea persuasivo para que el usuario no abandone la compra.
                5. Sea breve, en español, con tono cercano y positivo.
            `;
        }

        const response = await this.client.chat.completions.create({
            model: this.deploymentName,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user',   content: technicalMessage },
            ],
        });

        return response.choices[0].message.content;
    }
}

module.exports = AzureOpenAiClient;