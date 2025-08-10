import { string, object, array } from "yup"

export const CreateDebtorSchema = object({
  fullName: string().required("Ism kiritish majburiy").min(2, "Minimum 2 harf bo'lishi kerak"),
  phoneNumbers: array().of(string().required("Telefon raqami kiritish majburiy")).min(1, "Kamida bitta telefon raqami kiritish kerak"),
  address: string(),
  notice: string()
})