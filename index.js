// Importação dos pacotes necessários
const express = require('express');
const bodyParser = require('body-parser');
const { VERIFY_TOKEN } = require('./config'); // Certifique-se de que o VERIFY_TOKEN esteja correto.
const axios = require('axios');
const app = express();

// Configuração para ler os corpos das requisições como JSON
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

// Endpoint para receber e processar mensagens do Facebook
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        // Iterar sobre as entradas do webhook
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0];  // O evento da mensagem recebida
            console.log('Evento recebido:', webhookEvent);

            // Processar mensagem recebida
            if (webhookEvent.message) {
                const senderId = webhookEvent.sender.id;  // ID do remetente
                const messageText = webhookEvent.message.text;  // Conteúdo da mensagem

                // Exibindo as informações no formato JSON
                const messageDetails = {
                    message_sender: senderId,  // ID do usuário que enviou
                    message_text: messageText   // Conteúdo da mensagem
                };

                console.log('Mensagem recebida:', JSON.stringify(messageDetails, null, 2));

                // Aqui você pode integrar sua IA para gerar uma resposta, se necessário
            }
        });

        // Retornando um status 200 para confirmar o recebimento
        return res.status(200).send('Evento recebido.');
    } else {
        // Caso o evento não seja reconhecido
        return res.status(404).send('Evento desconhecido.');
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
