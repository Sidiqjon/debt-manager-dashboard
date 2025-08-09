import { useQuery } from "@tanstack/react-query"
import { api } from "../api"

export const useImage = (filename: string) => {
  return useQuery({
    queryKey: ["image", filename],
    queryFn: async () => {
      const response = await api.get(`upload/${filename}`, {
        responseType: "blob"
      })
      return URL.createObjectURL(response.data)
    },
    enabled: !!filename && filename !== "",
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000    
  })
}
