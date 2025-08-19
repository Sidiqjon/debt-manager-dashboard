import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../api"

export interface ProductImage {
  image: string
}

export interface PhoneNumber {
  number: string
}

export interface Seller {
  id: string
  fullName: string
  username: string
}

export interface Debtor {
  id: string
  fullName: string
  address: string
  phoneNumbers: PhoneNumber[]
  seller: Seller
}

export interface Payment {
  id: string
  amount: string
  createdAt: string
}

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

export interface Debt {
  id: string
  debtorId: string
  productName: string
  date: string
  deadline: string
  comment: string
  amount: string
  paid: boolean
  createdAt: string
  updatedAt: string
  paymentSchedules: Array<PaymentScheduleType>;
  productImages: ProductImage[]
  debtor: Debtor
  payments: Payment[]
  totalPaid: number
  remainingAmount: number
  paymentsCount: number
}

export interface DebtResponse {
  statusCode: number
  message: string
  data: Debt
}

export interface CreateDebtData {
  debtorId: string
  productName: string
  date: string
  deadline: string
  comment: string
  amount: string
  images: string[]
}

export const useDebt = () => {

  const queryClient = useQueryClient()
  const getDebtById = (id: string) =>
    useQuery({
      queryKey: ["debt", id],
      queryFn: () => api.get(`debts/${id}`).then(res => res.data as DebtResponse),
      enabled: !!id
    })
    
  const createDebt = () =>
    useMutation({
      mutationFn: (data: CreateDebtData) =>
        api.post("/debts", data).then(res => res.data as DebtResponse)
    })

  const deleteDebt = () =>
    useMutation({
      mutationFn: (id: string) =>
        api.delete(`/debts/${id}`).then(res => res.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['debts'] })
      },
      onError: (error) => {
        console.error('Error deleting debt:', error)
      }
    })

  return {
    getDebtById,
    createDebt,
    deleteDebt
  }
}
