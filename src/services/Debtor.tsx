import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { api } from "../api"

export interface PhoneNumber {
  number: string
}

export interface DebtorImage {
  image: string
}

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

export interface Seller {
  id: string
  fullName: string
  username: string
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
  phoneNumbers: PhoneNumber[]
  debtorImages: DebtorImage[]
  seller: Seller
  remainingDebtBalance: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface DebtorResponse {
  statusCode: number
  message: string
  data: {
    debtors: Debtor[]
    pagination: Pagination
  }
}

export interface CreateDebtorData {
  fullName: string
  address: string
  notice: string
  phoneNumbers: string[]
  images: string[]
}

export interface UpdateDebtorData {
  fullName: string
  address: string
  notice: string
  phoneNumbers: string[]
  images?: string[]
}


export interface SingleDebtorResponse {
  statusCode: number
  message: string
  data: Debtor
}

export const useDebtor = () => {
  const queryClient = useQueryClient()

  const getDebtors = (search?: string, page: number = 1, limit: number = 10) =>
    useQuery({
      queryKey: ["debtors", search, page, limit],
      queryFn: () => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search ? { search } : {})
        })
        return api.get(`/debtors?${params}`).then(res => res.data as DebtorResponse)
      }
    })

  const getDebtor = (id: string) =>
    useQuery({
      queryKey: ["debtor", id],
      queryFn: () => api.get(`/debtors/${id}`).then(res => res.data as SingleDebtorResponse),
      enabled: !!id
    })

  const createDebtor = () =>
    useMutation({
      mutationFn: (data: CreateDebtorData) =>
        api.post("/debtors", data).then(res => res.data as SingleDebtorResponse)
    })

  const deleteDebtor = () =>
    useMutation({
      mutationFn: (id: string) =>
        api.delete(`/debtors/${id}`).then(res => res.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['debtors'] })
      },
      onError: (error) => {
        console.error('Error deleting debtor:', error)
      }
    })

  const updateDebtor = (id: string) =>
    useMutation({
      mutationFn: (body: UpdateDebtorData) =>
        api.patch(`/debtors/${id}`, body).then(res => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debtors'] })
    })



  return {
    getDebtors,
    getDebtor,
    createDebtor,
    deleteDebtor,
    updateDebtor
  }
}
