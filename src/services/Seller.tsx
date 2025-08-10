import { useQuery } from "@tanstack/react-query"
import { api } from "../api"

export interface PaymentSchedule {
  id: string
  debtId: string
  amount: string
  dueDate: string
  isPaid: boolean
  paidDate: string | null
  paidAmount: string
  createdAt: string
  updatedAt: string
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
  paymentSchedules: PaymentSchedule[]
}

export interface Debtor {
  id: string
  sellerId: string
  fullName: string
  address: string
  notice: string
  createdAt: string
  updatedAt: string
  debts: Debt[]
}

export interface SellerData {
  id: string
  fullName: string
  phoneNumber: string
  email: string
  username: string
  image: string
  balance: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  debtors: Debtor[]
  statistics: {
    totalDebtBalance: number
    totalDebtorsCount: number
    delayedPaymentsCount: number
  }
}

export interface SellerResponse {
  statusCode: number
  message: string
  data: SellerData
}

export const useSeller = () => {
  const getSellerProfile = (id: string) =>
    useQuery({
      queryKey: ['seller', id],
      queryFn: () => api.get(`sellers/${id}`).then(res => res.data as SellerResponse),
      enabled: !!id
    })

  return {
    getSellerProfile
  }
}