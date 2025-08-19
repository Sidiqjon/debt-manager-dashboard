import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api"

export interface PaymentScheduleType {
  id: string;
  debtId: string;
  amount: string;
  dueDate: string;
  isPaid: boolean;
  paidDate: string | null;
  paidAmount: string;
  createdAt: string;
  updatedAt: string;
}

export interface DebtorType {
  id: string;
  fullName: string;
  address: string;
  phoneNumbers: Array<{ number: string }>;
  seller: {
    id: string;
    fullName: string;
    username: string;
  };
}

export interface ProductImageType {
  image: string;
}

export interface Payment {
  id: string;
  debtorId: string;
  debtId: string;
  amount: string;
  createdAt: string;
}

export interface DebtType {
  id: string;
  debtorId: string;
  productName: string;
  date: string;
  deadline: string;
  comment: string;
  amount: string;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
  paymentSchedules: Array<PaymentScheduleType>;
  productImages: Array<ProductImageType>;
  debtor: DebtorType;
  payments: Array<Payment>;
  totalPaid: number;
  remainingAmount: number;
  paymentsCount: number;
}

export interface DebtResponse {
  statusCode: number;
  message: string;
  data: DebtType;
}

export const PaymentType = {
  MONTHLY_PAYMENT: "MONTHLY_PAYMENT",
  ANY_AMOUNT_PAYMENT: "ANY_AMOUNT_PAYMENT",
  MULTIPLE_MONTHS_PAYMENT: "MULTIPLE_MONTHS_PAYMENT"
} as const;

export type PaymentType = typeof PaymentType[keyof typeof PaymentType];

export interface CreatePaymentDto {
  debtId: string;
  paymentType: PaymentType;
  amount?: number;
  scheduleIds?: string[];
  paymentDate?: string;
}

export const useDebtPayment = () => {
  const queryClient = useQueryClient();

  const monthlyPayment = useMutation({
    mutationFn: (data: { debtId: string; paymentDate?: string }) =>
      api.post("/payments", {
        debtId: data.debtId,
        paymentType: PaymentType.MONTHLY_PAYMENT,
        paymentDate: data.paymentDate
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt'] });
      queryClient.invalidateQueries({ queryKey: ['debtor'] });
      queryClient.invalidateQueries({ queryKey: ['history-payment'] });
    }
  });

  const anyAmountPayment = useMutation({
    mutationFn: (data: { debtId: string; amount: number; paymentDate?: string }) =>
      api.post("/payments", {
        debtId: data.debtId,
        paymentType: PaymentType.ANY_AMOUNT_PAYMENT,
        amount: data.amount,
        paymentDate: data.paymentDate
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt'] });
      queryClient.invalidateQueries({ queryKey: ['debtor'] });
      queryClient.invalidateQueries({ queryKey: ['history-payment'] });
    }
  });

  const multipleMonthsPayment = useMutation({
    mutationFn: (data: { debtId: string; scheduleIds: string[]; paymentDate?: string }) =>
      api.post("/payments", {
        debtId: data.debtId,
        paymentType: PaymentType.MULTIPLE_MONTHS_PAYMENT,
        scheduleIds: data.scheduleIds,
        paymentDate: data.paymentDate
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt'] });
      queryClient.invalidateQueries({ queryKey: ['debtor'] });
      queryClient.invalidateQueries({ queryKey: ['history-payment'] });
    }
  });

  return {
    monthlyPayment,
    anyAmountPayment,
    multipleMonthsPayment
  };
};