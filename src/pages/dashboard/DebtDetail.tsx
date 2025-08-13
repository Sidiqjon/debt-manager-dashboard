import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDebt } from "../../services/Debt"
import { PATH } from "../../shared/hooks/Path"
import Loading from "../../components/Loading"
import goback_arrow from "../../assets/icons/goback_arrow.svg"
import React from "react"
import dots from "../../assets/icons/dots.svg"
import Line from "../../assets/icons/Line.svg"
import datecalendar from "../../assets/icons/datecalendar.svg"

const deadlineMap: Record<string, string> = {
  ONE_MONTH: "1 oy",
  TWO_MONTHS: "2 oy",
  THREE_MONTHS: "3 oy",
  FOUR_MONTHS: "4 oy",
  FIVE_MONTHS: "5 oy",
  SIX_MONTHS: "6 oy",
  SEVEN_MONTHS: "7 oy",
  EIGHT_MONTHS: "8 oy",
  NINE_MONTHS: "9 oy",
  TEN_MONTHS: "10 oy",
  ELEVEN_MONTHS: "11 oy",
  TWELVE_MONTHS: "12 oy"
}


const DebtDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [showModal, setShowModal] = useState(false)
  const [imagePreview, setImagePreview] = useState<string[]>([])

  const { data: debtData, isLoading } = useDebt().getDebtById(id!)

  useEffect(() => {
    if (debtData?.data?.productImages) {
      const previews = debtData.data.productImages.map(img =>
        img.image.startsWith("http")
          ? img.image
          : `${import.meta.env.VITE_API_BASE_URL}/upload/${img.image}`
      )
      setImagePreview(previews)
    }
  }, [debtData])

  if (isLoading) {
    return <Loading />
  }

  if (!debtData?.data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Qarz topilmadi!</div>
      </div>
    )
  }

  const debt = debtData.data
  const formattedDate = new Date(debt.date).toLocaleDateString("uz-UZ")
  const formattedTime = new Date(debt.date).toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit"
  })

  return (
    <div className="min-h-screen ">
      <div className="containers bg-white !pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-30">
            <button onClick={() => navigate(`${PATH.customers}/detail/${debt.debtorId}`)}>
              <img src={goback_arrow} alt="back" className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110" />
            </button>
            <h1 className="text-[22px] grid capitalize font-semibold text-black">Batafsil</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowModal(!showModal)}
              className="w-6 h-6 flex items-center justify-center cursor-pointer"
            >
              <img src={dots} alt="menu" className="w-5 h-5" />
            </button>
            {showModal && (
              <div className="absolute right-0 top-8 overflow-hidden bg-white border border-gray-200 rounded-[16px] shadow-lg py-2 w-34 z-50">
                <button className="cursor-pointer w-full px-4 py-2 text-left text-md hover:bg-gray-100">
                  Tahrirlash
                </button>
                <div className="px-4"><img src={Line} alt="" /></div>
                <button className="w-full px-4 py-2 text-left text-md text-[#F94D4D] hover:bg-gray-100 disabled:opacity-50 cursor-pointer">
                  O'chirish
                </button>
              </div>
            )}
          </div>
        </div>

        <form className="space-y-6 pb-12">
          <div className="flex gap-4">
            <div className="w-[75%] relative">
              <label className="block text-sm font-medium text-[#000000] mb-2">Sana</label>
              <input
                value={formattedDate}
                readOnly
                type="text"
                className="w-full outline-none bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900"
              />
              <img src={datecalendar} alt="" className="absolute right-3 bottom-4 cursor-pointer" />
            </div>
            <div className="w-[25%]">
              <label className="block text-sm font-medium text-[#000000] mb-2">Vaqt</label>
              <input
                value={formattedTime}
                readOnly
                type="text"
                className="w-full outline-none bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">Muddati</label>
            <input
              value={deadlineMap[debt.deadline] || debt.deadline}
              readOnly
              type="text"
              className="flex-1 outline-none bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">Summa miqdori</label>
            <input
              value={debt.amount}
              readOnly
              type="text"
              className="w-full outline-none bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">Eslatma</label>
            <textarea
              value={!debt.comment ? "Eslatma mavjud emas!" : debt.comment}
              readOnly
              rows={4}
              className="w-full outline-none bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">Rasmlar</label>
            <div className="grid grid-cols-2 gap-4">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Debt Image ${index + 1}`}
                    className="w-full outline-none h-29 object-cover rounded-[16px] border border-[#ECECEC]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl py-4 font-medium text-base disabled:cursor-not-allowed transition-colors cursor-pointer mt-4"
            >
              Nasiyani so‘ndirish
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowModal(false)}
        ></div>
      )}
    </div>
  )
}

export default React.memo(DebtDetail)
