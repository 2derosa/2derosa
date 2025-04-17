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
  if (mediaPath) options.mediaUrl = [mediaPath];
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
