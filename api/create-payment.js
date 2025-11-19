export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.ASAAS_API_KEY;
  const baseUrl = process.env.ASAAS_URL || 'https://www.asaas.com/api/v3';

  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'Configuração de API ausente no servidor.' });
  }

  try {
    const { name, email } = req.body;

    let customerId = null;

    // 1. Verificar se o cliente já existe
    const searchRes = await fetch(`${baseUrl}/customers?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      }
    });
    
    const searchData = await searchRes.json();

    if (searchData.data && searchData.data.length > 0) {
      // Cliente já existe, usa o ID dele
      customerId = searchData.data[0].id;
    } else {
      // 2. Se não existe, cria um novo
      const createRes = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': apiKey
        },
        body: JSON.stringify({
          name: name,
          email: email,
          notificationDisabled: true
        })
      });

      const createData = await createRes.json();
      
      if (createData.errors) {
          console.error("Asaas Create Customer Error:", createData.errors);
          return res.status(400).json({ success: false, error: 'Erro ao registrar cliente.' });
      }
      customerId = createData.id;
    }

    // 3. Criar Cobrança
    const paymentRes = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: "PIX",
        value: 9.90,
        dueDate: new Date().toISOString().split('T')[0],
        description: "SonoScore Pro - Protocolo Completo"
      })
    });

    const paymentData = await paymentRes.json();
    
    if (paymentData.errors) {
        console.error("Asaas Payment Error:", paymentData.errors);
        return res.status(400).json({ success: false, error: 'Erro ao gerar cobrança.' });
    }

    // 4. Pegar QR Code
    const qrRes = await fetch(`${baseUrl}/payments/${paymentData.id}/pixQrCode`, {
      headers: { 'access_token': apiKey }
    });
    const qrData = await qrRes.json();

    return res.status(200).json({
      success: true,
      paymentId: paymentData.id,
      payload: qrData.payload,
      encodedImage: qrData.encodedImage
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ success: false, error: 'Erro interno no servidor.' });
  }
}