import { useQuery } from "@tanstack/react-query"
import { api } from "../api"

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