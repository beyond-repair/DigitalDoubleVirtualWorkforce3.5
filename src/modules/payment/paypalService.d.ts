declare module '../../modules/payment/paypalService' {
    interface PaymentData {
        amount: number;
        currency: string;
        // Add other relevant properties
    }

    interface PaymentResponse {
        success: boolean;
        transactionId?: string; // Optional field
        errorMessage?: string; // Optional field for error messages
    }

    export function createPayment(data: PaymentData): Promise<PaymentResponse>;
}