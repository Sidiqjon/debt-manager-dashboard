export interface MessageType {
    id: string,
    message: string,
    isSended: boolean,
    sellerId: string,
    debtorId: string,
    createdAt: string,
    updatedAt: string,
    Debtor: {
        name: string
    }
}

export interface NotificationType {
    id: string,
    from: string,
    to: string,
    message: string,
    sent: boolean,
    createdAt: string,
    updatedAt: string,
    sender: {
        id: string,
        fullName: string,
        userName: string
    },
    receiver: {
        id: string,
        fullName: string,
        address: string,
        phoneNumbers: [
            {
                number: string
        }]
    }
}

import { api } from "../api";
export interface MessageType {
  id: string;
  message: string;
  createdAt: string;
  to: string;
  from: string;
}

export interface DebtorType {
  id: string;
  name: string;
  Phone: PhoneType[];
}

export interface PhoneType {
  id: string;
  phoneNumber: string;
}

export interface ConversationType {
  notifications: MessageType[];
  debtor: {
    id: string;
    name: string;
  };
}

export interface PaymentType {
  id: string;
  amount: number;
  createdAt: string;
  debtorId: string;
  debtId: string;
  debt: {
    productName: string;
    amount: string;
    paid: boolean;
    date: string;
  }
  debtor: {
    fullName: string;
    sellerId: string;
    phoneNumbers: [
      {
        number: string
    }];
  };
}

export interface CreateMessageRequest {
  to: string;
  message: string;
}

export const messageService = {
  getAllMessages: async (): Promise<any> => {
    const response = await api.get("/messages");
    return response.data.data?.notifications || response.data.data || [];
  },

  getConversation: async (debtorId: string): Promise<ConversationType> => {
    const response = await api.get("/messages", { 
      params: { debtorId } 
    });
    return response.data.data;
  },

  createMessage: async (data: CreateMessageRequest): Promise<void> => {
    await api.post("/messages", data);
  },

  deleteConversation: async (debtorId: string): Promise<void> => {
    await api.delete(`/messages/${debtorId}/deleteAll`);
  },

  getAllPayments: async (): Promise<PaymentType[]> => {
    const response = await api.get("/payments");
    return response.data.data || [];
  },
};