import { Route, Routes } from "react-router-dom"
import { PATH } from "../../shared/hooks/Path"
import { Home } from "../../pages"
import DashboardLayout from "../../provider/DashboardLayout"

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path={PATH.main} element={<Home />} />
        <Route path={PATH.customers} element={<div>Mijozlar Page</div>} />
        <Route path={PATH.reports} element={<div>Hisobot Page</div>} />
        <Route path={PATH.settings} element={<div>Sozlamalar Page</div>} />
      </Routes>
    </DashboardLayout>
  )
}

export default DashboardRoutes