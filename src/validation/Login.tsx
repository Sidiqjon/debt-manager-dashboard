import { string, object } from "yup"

export const LoginSchema = object({
    username: string().required("Username kiritish majburiy").min(2, "Minimum 2 harf bo'lishi kerak"),
    password: string().required("Password kiritish majburiy").min(6, "Minimum 6 harf bo'lishi kerak")
})