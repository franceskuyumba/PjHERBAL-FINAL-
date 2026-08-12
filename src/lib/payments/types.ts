export interface PaymentOrder {
  id: string;
  orderNumber: string;
  total: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface InitiateResult {
  reference: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  redirectUrl?: string;
  instructions?: string[];
  provider: string;
}

export interface VerifyResult {
  status: "SUCCESS" | "FAILED" | "PENDING";
  transactionId?: string;
  provider: string;
}

export interface PaymentAdapter {
  id: string;
  name: string;
  initiate(order: PaymentOrder, method: string): Promise<InitiateResult>;
  verify(reference: string): Promise<VerifyResult>;
}
