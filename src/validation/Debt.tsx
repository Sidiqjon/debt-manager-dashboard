import { string, object, number } from "yup"

export const CreateDebtSchema = object({
  productName: string()
    .required("Mahsulot nomi kiritish majburiy")
    .min(2, "Minimum 2 harf bo'lishi kerak"),
  amount: number()
    .required("Summa kiritish majburiy")
});
