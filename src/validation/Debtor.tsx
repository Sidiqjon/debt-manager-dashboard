import { string, object, array } from "yup"

export const CreateDebtorSchema = object({
  fullName: string()
    .required("Ism kiritish majburiy")
    .min(2, "Minimum 2 harf bo'lishi kerak"),

  phoneNumbers: array()
    .of(
      string()
        .trim()
        .required("Telefon raqami kiritish majburiy")
        .matches(/^\+998[0-9]{9}$/, "Telefon raqam noto'g'ri formatda. Format: +998xxxxxxxxx")
    )
    .min(1, "Kamida bitta telefon raqami kiritish kerak"),

  address: string()
    .required("Manzil kiritish majburiy")
    .min(2, "Minimum 2 harf bo'lishi kerak"),
  notice: string()
});
