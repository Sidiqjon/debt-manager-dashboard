import { useNavigate, useParams } from "react-router-dom"
import { useDebtor } from "../../services/Debtor"
import { PATH } from "../../shared/hooks/Path"

const DebtorDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const { data, isLoading } = useDebtor().getDebtor(id!)

  const calculateTotalDebt = () => {
    if (!data?.data.debts) return 0
    return data.data.debts.reduce((total, debt) => {
      return total + parseInt(debt.amount)
    }, 0)
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US').replace(/,/g, ' ')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    )
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Mijoz topilmadi</div>
      </div>
    )
  }

  const debtor = data.data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="containers pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => navigate(PATH.customers)} className="mr-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-lg font-semibold">{debtor.fullName}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="#FFB800" stroke="#FFB800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="w-6 h-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="1" fill="#000"/>
                <circle cx="19" cy="12" r="1" fill="#000"/>
                <circle cx="5" cy="12" r="1" fill="#000"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-blue-100 rounded-xl p-4 mb-6 relative">
          <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1">
            <p className="text-sm font-medium">Tahrirlash</p>
          </div>
          <div className="absolute bottom-4 right-4">
            <p className="text-red-500 text-sm">O'chirish</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Umumiy nasiya:</p>
            <p className="text-2xl font-bold">{formatAmount(calculateTotalDebt())} so'm</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Faol nasiyalar</h2>
          
          {debtor.debts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium text-lg mb-2">Mijozda hali nasiya mavjud emas</p>
              <p className="text-gray-400 text-sm">Nasiya yaratish uchun pastdagi "+" tugmasini bosing</p>
            </div>
          ) : (
            <div className="space-y-4">
              {debtor.debts.map((debt) => (
                <div key={debt.id} className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{debt.productName}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Umumiy qarz:</span>
                    <span className="font-medium">{formatAmount(parseInt(debt.amount))} so'm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Qolgan qarz:</span>
                    <span className="text-red-500 font-medium">
                      {formatAmount(parseInt(debtor.remainingDebtBalance))} so'm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-20 right-4">
        <button className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <span className="text-2xl">+</span>
        </button>
      </div>
    </div>
  )
}

export default DebtorDetail