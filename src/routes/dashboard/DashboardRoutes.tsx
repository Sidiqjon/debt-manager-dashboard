import { Route, Routes } from "react-router-dom"
import { PATH } from "../../shared/hooks/Path"
import { Home } from "../../pages"
import Calendar from "../../pages/dashboard/Calendar"
import Customers from "../../pages/dashboard/Customers"
import DashboardLayout from "../../provider/DashboardLayout"
import CreateDebtor from "../../pages/dashboard/CreateDebtor"
import DebtorDetail from "../../pages/dashboard/DebtorDetail"
import UpdateDebtor from "../../pages/dashboard/UpdateDebtor"

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path={PATH.main} element={<Home />} />
        <Route path={PATH.calendar} element={<Calendar />} />
        <Route path={PATH.customers} element={<Customers />} />
        <Route path={PATH.createCustomer} element={<CreateDebtor />} />
        <Route path={PATH.customerDetail} element={<DebtorDetail />} />
        <Route path={`${PATH.customers}/update/:id`} element={<UpdateDebtor />} />
        <Route path={PATH.reports} element={<div>Hisobot Page</div>} />
        <Route path={PATH.settings} element={<div>Sozlamalar Page</div>} />
      </Routes>
    </DashboardLayout>
  )
}

export default DashboardRoutes
