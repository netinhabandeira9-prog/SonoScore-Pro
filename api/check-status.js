export default async function handler(req, res) {
  const { id } = req.query;
  const apiKey = process.env.ASAAS_API_KEY;
  const baseUrl = process.env.ASAAS_URL || 'https://www.asaas.com/api/v3';

  if (!id || !apiKey) {
    return res.status(400).json({ approved: false });
  }

  try {
    const response = await fetch(`${baseUrl}/payments/${id}`, {
      headers: { 'access_token': apiKey }
    });
    
    const data = await response.json();
    
    // Status que consideramos "Pago"
    const isPaid = data.status === 'RECEIVED' || data.status === 'CONFIRMED';

    return res.status(200).json({ approved: isPaid, status: data.status });
  } catch (error) {
    return res.status(500).json({ approved: false });
  }
}