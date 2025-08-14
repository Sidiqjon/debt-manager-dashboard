import React from "react"
import { useNavigate, useParams } from "react-router-dom"
// import toast from "react-hot-toast"
import { PATH } from "../../shared/hooks/Path"
import goback_arrow from "../../assets/icons/goback_arrow.svg"
import paymentArrow from "../../assets/icons/paymentArrow.svg"
const DebtPayment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate()

  return (
    <div className="containers min-h-screen bg-white !pt-4">
      <div className="flex items-center justify-between mb-6">
        <img
          src={goback_arrow}
          alt="Back"
          className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110"
          onClick={() => navigate(`${PATH.customers}/debt-detail/${id}`)}/>
        <h1 className="text-xl font-semibold text-[#000000]">Nasiyani so‘ndirish</h1>
        <div className="w-6 h-6"></div>
      </div>

        <h1 className="!text-[22px] font-semibold text-[#000000] !my-[25px]">To‘lov</h1>
        <ul>
            <li className="cursor-pointer flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
                <p className="!text-[16px] font-normal">1 oyga so‘ndirish</p>
                <button><img src={paymentArrow} alt="paymentArrow" /></button>
            </li>
            <li className="cursor-pointer flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
                <p className="!text-[16px] font-normal">Har qanday miqdorda so‘ndirish</p>
                <button><img src={paymentArrow} alt="paymentArrow" /></button>
            </li>
            <li className="cursor-pointer flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
                <p className="!text-[16px] font-normal">To‘lov muddatini tanlash</p>
                <button><img src={paymentArrow} alt="paymentArrow" /></button>
            </li>
        </ul>
    </div>
  )
}

export default React.memo(DebtPayment)
