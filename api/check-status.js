// api/check-status.js
export default async function handler(req, res) {
  const { id } = req.query;
  const apiKey = process.env.ASAAS_API_KEY;
  const baseUrl = process.env.ASAAS_URL || 'https://www.asaas.com/api/v3';

  if (!id || !apiKey) {
    return res.status(400).json({ approved: false });
  }

  try {
    const response = await fetch(`${baseUrl}/payments/${id}`, {
      headers: { access_token: apiKey },
    });

    const data = await response.json();

    const isPaid = data.status === 'RECEIVED' || data.status === 'CONFIRMED';

    // SE ESTIVER PAGO → REDIRECIONA AUTOMATICAMENTE PARA A PÁGINA DE OBRIGADO
    if (isPaid) {
      const redirectUrl = `https://www.sonoscorepro.com.br/obrigado?payment_id=${id}`;
      return res.redirect(307, redirectUrl); // 307 mantém o método GET
    }

    // SE AINDA NÃO ESTIVER PAGO → continua retornando JSON como antes
    return res.status(200).json({ approved: false, status: data.status });

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return res.status(500).json({ approved: false });
  }
}
