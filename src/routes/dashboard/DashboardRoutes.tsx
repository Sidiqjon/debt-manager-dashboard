import { Route, Routes } from "react-router-dom"
import { PATH } from "../../shared/hooks/Path"
import { Home } from "../../pages"
import Calendar from "../../pages/dashboard/Calendar"
import DashboardLayout from "../../provider/DashboardLayout"

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path={PATH.main} element={<Home />} />
        <Route path={PATH.calendar} element={<Calendar />} />
        <Route path={PATH.customers} element={<div>Mijozlar Page</div>} />
        <Route path={PATH.reports} element={<div>Hisobot Page</div>} />
        <Route path={PATH.settings} element={<div>Sozlamalar Page</div>} />
      </Routes>
    </DashboardLayout>
  )
}

export default DashboardRoutes