const admin = require("firebase-admin");

// Caminho para o arquivo JSON da chave privada
const serviceAccount = require("./firebaseConfig.json");

// Inicializa o Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<seu-projeto>.firebaseio.com" // Opcional, só se usar Realtime Database
});

const db = admin.firestore();

module.exports = db;