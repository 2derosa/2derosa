<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Castly AI</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="container">
    <h1>Benvenuto su Castly AI</h1>
    <p>Il tuo assistente HR per slide e contratti automatici</p>

    <form id="signupForm">
      <input type="email" placeholder="Email" required id="email" />
      <input type="text" placeholder="Numero WhatsApp" required id="phone" />
      <button type="submit">Registrati</button>
    </form>

    <p id="response"></p>
  </div>

  <script src="script.js"></script>
</body>
</html>
body {
  font-family: 'Arial', sans-serif;
  background: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  width: 300px;
}
input {
  display: block;
  width: 100%;
  margin: 1rem 0;
  padding: 0.5rem;
}
button {
  padding: 0.7rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  const res = await fetch('https://castly-api.onrender.com/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, phone })
  });

  const data = await res.json();
  document.getElementById('response').innerText = data.message || "Registrazione avvenuta!";
});
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sendWhatsApp, generatePDF } = require('./utils');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { email, phone } = req.body;
  console.log(`Nuova registrazione: ${email} / ${phone}`);

  await sendWhatsApp(phone, `Ciao! Sei registrato su Castly AI 🧠`);
  res.json({ message: 'Registrazione ricevuta! Ti scriviamo su WhatsApp.' });
});

app.post('/contratto', async (req, res) => {
  const { nome, ruolo, dataEvento, pagamento, telefono } = req.body;
  const pdfPath = await generatePDF({ nome, ruolo, dataEvento, pagamento });

  await sendWhatsApp(telefono, `Ecco il tuo contratto per l’evento del ${dataEvento}`, pdfPath);
  res.json({ message: 'Contratto inviato via WhatsApp.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server attivo sulla porta ${PORT}`));
const twilio = require('twilio');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const client = twilio('TWILIO_SID', 'TWILIO_AUTH');
const FROM = 'whatsapp:+14155238886';

const sendWhatsApp = async (to, message, mediaPath) => {
  const options = {
    from: FROM,
    to: `whatsapp:${to}`,
    body: message
  };

  if (mediaPath) {
    options.mediaUrl = [mediaPath];
  }

  return client.messages.create(options);
};

const generatePDF = async ({ nome, ruolo, dataEvento, pagamento }) => {
  const path = `./contratti/Contratto_${nome}.pdf`;
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path));
  doc.fontSize(14).text(`Contratto per ${nome}\nRuolo: ${ruolo}\nEvento: ${dataEvento}\nPagamento: €${pagamento}`);
  doc.end();
  return path;
};

module.exports = { sendWhatsApp, generatePDF };
const stripe = require('stripe')('STRIPE_SECRET_KEY');

const createCheckoutSession = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{
      price: 'price_12345', // ID del piano creato su Stripe
      quantity: 1,
    }],
    success_url: 'https://castlyai.carrd.co/success',
    cancel_url: 'https://castlyai.carrd.co/cancel',
  });

  res.json({ url: session.url });
};
castly-ai/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── backend/
│   ├── index.js
│   ├── stripe.js
│   └── utils.js
├── contratti/
│   └── (si generano qui i PDF)
└── README.md
