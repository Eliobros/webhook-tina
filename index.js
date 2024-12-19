const express = require('express');
const bodyParser = require('body-parser');
const { VERIFY_TOKEN } = require('./config');
const app = express();



app.use(bodyParser.json());

// Endpoint para verificação do webhook
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === `${VERIFY_TOKEN}`) {
            console.log('Webhook verificado!');
            return res.status(200).send(challenge);
        } else {
            return res.status(403).send('Token inválido.');
        }
    }
});

// Endpoint para receber eventos
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0];
            console.log('Evento recebido:', webhookEvent);

            // Processar mensagens recebidas
            if (webhookEvent.message) {
                const senderId = webhookEvent.sender.id;
                const messageText = webhookEvent.message.text;
                console.log(`Mensagem de ${senderId}: ${messageText}`);
                // Aqui você pode integrar sua IA para responder.
            }
        });
        return res.status(200).send('Evento recebido.');
    } else {
        return res.status(404).send('Evento desconhecido.');
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
