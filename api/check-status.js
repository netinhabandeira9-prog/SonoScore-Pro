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

    // Se for requisição do frontend (polling) → retorna JSON
    if (req.headers['x-requested-with'] || req.headers['content-type']?.includes('json')) {
      return res.status(200).json({ approved: isPaid, status: data.status });
    }

    // Se o usuário abrir direto no navegador → redireciona pra página de obrigado
    if (isPaid) {
      return res.redirect(307, `https://www.sonoscorepro.com.br/obrigado?payment_id=${id}`);
    }

    return res.status(200).json({ approved: false, status: data.status });

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return res.status(200).json({ approved: false });
  }
}
