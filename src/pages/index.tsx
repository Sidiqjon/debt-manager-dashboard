import { lazy } from "react"
import LoginHome from "./auth/Home"
import Home from "./dashboard/Home"
import Calendar from "./dashboard/Calendar"

const Login = lazy(() => new Promise((resolve:any) => {
    return setTimeout(() => resolve(import("./auth/Login")), 1500)
}))

const ForgotPassword = lazy(() => new Promise((resolve:any) => {
return setTimeout(() => resolve(import("./auth/ForgotPassword")), 1500)
}))

export {Login, Home, LoginHome, ForgotPassword, Calendar}
