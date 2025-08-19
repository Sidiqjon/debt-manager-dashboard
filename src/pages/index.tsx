import { lazy } from "react"
import LoginHome from "./auth/Home"
import Home from "./dashboard/Home"
import Calendar from "./dashboard/Calendar"
import Customers from "./dashboard/Customers"
import CreateDebtor from "./dashboard/CreateDebtor"
import DebtorDetail from "./dashboard/DebtorDetail"
import DebtCreate from "./dashboard/DebtCreate"
import DebtDetail from "./dashboard/DebtDetail"
import DebtPayment from "./dashboard/DebtPayment"
import UpdateDebtor from "./dashboard/UpdateDebtor"
import Settings from "./dashboard/Settings"
import SellerProfile from "./dashboard/SellerProfile"
import Notification from "./dashboard/Notification"
import Message from "./dashboard/Conversation"

const Login = lazy(() => new Promise((resolve: any) => {
    return setTimeout(() => resolve(import("./auth/Login")), 1500)
}))

const ForgotPassword = lazy(() => new Promise((resolve: any) => {
    return setTimeout(() => resolve(import("./auth/ForgotPassword")), 1500)
}))

export { Login, Home, LoginHome, ForgotPassword, Calendar, Customers, CreateDebtor, DebtorDetail, DebtCreate, DebtDetail, DebtPayment, UpdateDebtor, Settings, SellerProfile, Notification, Message }
