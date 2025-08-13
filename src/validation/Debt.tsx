import { string, object, number } from "yup"

export const CreateDebtSchema = object({
  productName: string()
    .required("Mahsulot nomini kiritish majburiy")
    .min(2, "Minimum 2 harf bo'lishi kerak"),
  date: string()
    .required("Sanani tanlash majburiy"),
  deadline: string()
    .required("Muddatni tanlash majburiy"),
  comment: string(),
  amount: number()
    .required("Narxni kiritish majburiy")
    .positive("Narx musbat son bo'lishi kerak"),
});