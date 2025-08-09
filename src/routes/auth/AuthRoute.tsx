import { Route, Routes } from "react-router-dom"
import { PATH } from "../../shared/hooks/Path"
import { Login, LoginHome, ForgotPassword } from "../../pages"
import { Suspense } from "react"
import PageLoading from "../../components/PageLoading"

const AuthRoute = () => {
  return (
    <Routes>
        <Route path={PATH.main} element={<LoginHome/>}/>
        <Route path={PATH.login} element={<Suspense fallback={<PageLoading/>}><Login/></Suspense>}/>
        <Route path={PATH.forgotPassword} element={<Suspense fallback={<PageLoading/>}><ForgotPassword/></Suspense>}/>
    </Routes>
  )
}

export default AuthRoute
