import React, { useState } from "react"
import { useSeller } from "../../services/Seller"
import { useImage } from "../../services/Image"
import { getUserIdFromToken } from "../../shared/utils/tokenUtils"
import calendarIcon from "../../assets/icons/calendar.svg"
import wallet from "../../assets/icons/wallet.svg"
import plus from "../../assets/icons/plus.svg"
import { PiEye } from "react-icons/pi";
import { PiEyeSlash } from "react-icons/pi";
import { useNavigate } from "react-router-dom"
import { PATH } from "../../shared/hooks/Path"

const Home = () => {
  const userId = getUserIdFromToken()
  const { getSellerProfile } = useSeller()
  const { data: sellerData, isLoading } = getSellerProfile(userId || "")

  const seller = sellerData?.data
  const { data: imageUrl } = useImage(seller?.image ?? "")

  const [showBalance, setShowBalance] = useState(true)

  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="containers !pt-4 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-medium capitalize text-[#000000]">{seller?.fullName || "Testuchun"}</span>
        </div>
        <div 
          className="w-10 h-10 bg-[#EDEDED] rounded-lg flex items-center justify-center cursor-pointer"
          onClick={() => navigate(PATH.calendar)}>
          <img src={calendarIcon} alt="Calendar" className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-[#30AF49] rounded-2xl p-6 text-white mb-7">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center justify-center flex-1 text-center" >
            <div className="text-2xl font-bold mb-1">
              {showBalance
                ? (seller?.balance ? `${Number(seller.statistics?.totalDebtBalance).toLocaleString()} so'm` : "135 214 200 so'm")
                : "******** so'm"}
            </div>
            <div className="text-green-200 text-sm">Umumiy nasiya:</div>
          </div>
          <div className="w-8 h-8 bg-opacity-20 flex items-center justify-center cursor-pointer">

            {showBalance ? (
              <PiEye
                className="w-5 h-5 cursor-pointer"
                onClick={() => setShowBalance(!showBalance)}
              />
            ) : (
              <PiEyeSlash
                className="w-5 h-5 cursor-pointer"
                onClick={() => setShowBalance(!showBalance)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-7">
        <div className="bg-white rounded-xl p-4 border border-[#ECECEC] flex flex-col ">
          <div className="text-[#000000] text-[16px] mb-2 font-medium flex-1">Kechiktirilgan to'lovlar</div>
          <div className="text-2xl font-bold text-[#F94D4D]">
            {seller?.statistics?.delayedPaymentsCount}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#ECECEC] flex flex-col ">
          <div className="text-[#000000] text-[16px] mb-2 font-medium flex-1">Mijozlar soni</div>
          <div className="text-2xl font-bold text-[#30AF49]">
            {seller?.statistics?.totalDebtorsCount}
          </div>
        </div>
      </div>

      <div className="p-4 mb-7">
        <h3 className="text-[20px] font-semibold text-gray-900 mb-4">Hamyoningiz</h3>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 bg-[#735CD81A] rounded-full flex items-center justify-center">
            <img src={wallet} alt="Wallet" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Hisobingizda</div>
            <div className="text-[20px] font-bold text-gray-900">500 000 so'm</div>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
            <img src={plus} alt="Plus" />
          </div>
        </div>

        <div className="flex justify-between text-sm mt-5">
          <span className="text-[#000000]">Bu oy uchun to'lov:</span>
          <span className="text-[#30AF49] font-medium">To'lov qilingan</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Home)