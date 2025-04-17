const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sendWhatsApp, generatePDF } = require('./utils');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { email, phone } = req.body;
  await sendWhatsApp(phone, `Ciao! Sei registrato su Castly AI 🧠`);
  res.json({ message: 'Registrazione ricevuta!' });
});

app.post('/contratto', async (req, res) => {
  const { nome, ruolo, dataEvento, pagamento, telefono } = req.body;
  const pdfPath = await generatePDF({ nome, ruolo, dataEvento, pagamento });
  await sendWhatsApp(telefono, `Ecco il tuo contratto per l’evento del ${dataEvento}`, pdfPath);
  res.json({ message: 'Contratto inviato via WhatsApp.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server attivo sulla porta ${PORT}`));
