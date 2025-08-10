import type { ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { PATH } from "../shared/hooks/Path"
import asosiyhome from "../assets/icons/asosiyhome.svg"
import mijozlar from "../assets/icons/mijozlar.svg"
import hisobot from "../assets/icons/hisobot.svg"
import sozlama from "../assets/icons/sozlama.svg"
import asosiyhomeActive from "../assets/icons/asosiyhome-active.svg"
import mijozlarActive from "../assets/icons/mijozlar-active.svg"
import hisobotActive from "../assets/icons/hisobot-active.svg"
import sozlamaActive from "../assets/icons/sozlama-active.svg"

const DashboardLayout = ({children}:{children:ReactNode}) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const menuItems = [
    { key: PATH.main, label: 'Asosiy', icon: asosiyhome, activeIcon: asosiyhomeActive },
    { key: PATH.customers, label: 'Mijozlar', icon: mijozlar, activeIcon: mijozlarActive },
    { key: PATH.reports, label: 'Hisobot', icon: hisobot, activeIcon: hisobotActive },
    { key: PATH.settings, label: 'Sozlamalar', icon: sozlama, activeIcon: sozlamaActive },
  ]

  const isActive = (itemKey: string) => {
    if (itemKey === PATH.main) {
      return location.pathname === PATH.main || location.pathname === PATH.calendar
    }
    else if (itemKey === PATH.customers) {
      return location.pathname === PATH.customers || location.pathname === PATH.createCustomer
    }
    return location.pathname === itemKey
  }

  return (
    <div className="h-[100vh] relative bg-gray-50">
      <div className="pb-20 overflow-y-auto h-full">
        {children}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 max-w-md mx-auto">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`flex flex-col items-center py-3 px-2 ${
                isActive(item.key)
                  ? 'text-[#0E5FF6]'
                  : 'text-[#637D92]'
              }`}
            >
              <div className="w-6 h-6 mb-1">
                <img 
                  src={isActive(item.key) ? item.activeIcon : item.icon} 
                  alt={item.label} 
                  className="w-full h-full cursor-pointer" 
                />
              </div>
              <span className="text-xs font-medium cursor-pointer">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout