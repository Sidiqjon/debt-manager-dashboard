import { useQuery } from "@tanstack/react-query"
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

export const useDebt = () => {
  const getDebtById = (id: string) =>
    useQuery({
      queryKey: ["debt", id],
      queryFn: () => api.get(`debts/${id}`).then(res => res.data as DebtResponse),
      enabled: !!id
    })

  return {
    getDebtById
  }
}
