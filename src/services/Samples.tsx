import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export interface Seller {
  id: string;
  fullName: string;
  username: string;
}

export interface Sample {
  id: string;
  sellerId: string;
  message: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  seller: Seller;
}

export interface SamplesResponse {
  statusCode: number;
  message: string;
  data: {
    samples: Sample[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CreateSampleRequest {
  message: string;
}

export interface UpdateSampleRequest {
  message?: string;
  verified?: boolean;
}

export const samplesService = {
  getSamples: async (page = 1, limit = 10000): Promise<SamplesResponse> => {
    const response = await api.get(`/samples?page=${page}&limit=${limit}`);
    return response.data;
  },

  createSample: async (data: CreateSampleRequest): Promise<Sample> => {
    const response = await api.post("/samples", data);
    return response.data;
  },

  updateSample: async (id: string, data: UpdateSampleRequest): Promise<Sample> => {
    const response = await api.patch(`/samples/${id}`, data);
    return response.data;
  },

  deleteSample: async (id: string): Promise<void> => {
    await api.delete(`/samples/${id}`);
  },
};

export const useSamples = (page = 1, limit = 10000) => {
  return useQuery({
    queryKey: ["samples", page, limit],
    queryFn: () => samplesService.getSamples(page, limit),
  });
};

export const useCreateSample = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: samplesService.createSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
    },
  });
};

export const useUpdateSample = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSampleRequest }) =>
      samplesService.updateSample(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
    },
  });
};

export const useDeleteSample = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: samplesService.deleteSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
    },
  });
};