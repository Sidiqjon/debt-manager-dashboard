export interface PaymentHistoryType {
    id: string,
    debtorId: string,
    debtId: string,
    paidAt: string,
    amount: number,
    createdAt: string,
    updatedAt: string,
    Debtor: {
        id: string,
        name: string,
        address: string,
        sellerId: string,
        note: null | string,
        star: boolean,
        createdAt: string,
        updatedAt: string,
        Phone: [
            {
                id: string,
                phoneNumber: string,
                debtorId: string,
                createdAt: string,
                updatedAt: string
            }
        ]
    }
}