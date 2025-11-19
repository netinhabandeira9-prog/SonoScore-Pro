import { UserData } from "../types";

interface PixResponse {
  success: boolean;
  paymentId?: string;
  payload?: string;
  encodedImage?: string;
  error?: string;
}

export const paymentService = {
  /**
   * Chama a Serverless Function da Vercel para criar o PIX com segurança
   */
  async createPixPayment(user: UserData): Promise<PixResponse> {
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email
        })
      });

      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Erro no serviço de pagamento:", error);
      return { success: false, error: "Erro de conexão com o servidor." };
    }
  },

  /**
   * Verifica status chamando a API interna
   */
  async checkPaymentStatus(paymentId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/check-status?id=${paymentId}`);
      const data = await response.json();
      return data.approved === true;
    } catch (error) {
      return false;
    }
  }
};