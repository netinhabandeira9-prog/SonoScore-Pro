// api/webhook/asaas.js
import fs from 'fs';
import path from 'path';

// Para Vercel Serverless Function (funciona perfeitamente)
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.body;

  console.log('Webhook Asaas recebido:', event.event, event.payment?.id);

  // Eventos que confirmam pagamento
  if (event.event === 'PAYMENT_CONFIRMED' || event.event === 'PAYMENT_RECEIVED') {
    const paymentId = event.payment.id;

    // Cria um arquivo temporário que o check-status.js vai ler
    const filePath = path.join('/tmp', `payment_${paymentId}.json`);
    const data = {
      approved: true,
      timestamp: new Date().toISOString()
    };

    try {
      fs.writeFileSync(filePath, JSON.stringify(data));
      console.log(`Pagamento ${paymentId} marcado como aprovado`);
    } catch (err) {
      console.error('Erro ao salvar status:', err);
    }
  }

  // SEMPRE responde 200 pro Asaas não pausar a fila
  res.status(200).json({ received: true });
}

// Necessário pro Vercel
export const config = {
  api: {
    bodyParser: true,
  },
};
