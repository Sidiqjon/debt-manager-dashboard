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








// ```json
// {
//   "statusCode": 200,
//   "message": "Debtor retrieved successfully",
//   "data": {
//     "id": "a07c3bf5-b664-49eb-8520-7a36e80bc1fa",
//     "sellerId": "6551a3e8-ae09-4acf-9509-3c13763e9016",
//     "fullName": "seller2 debtor",
//     "address": "123 Main Street, Tashkent 2",
//     "notice": "Prefers evening contact 2",
//     "createdAt": "2025-08-04T19:50:31.285Z",
//     "updatedAt": "2025-08-04T19:50:31.285Z",
//     "debts": [
//       {
//         "id": "1ab84ee0-1962-46e8-aca8-ec89f0ddc5b3",
//         "debtorId": "a07c3bf5-b664-49eb-8520-7a36e80bc1fa",
//         "productName": "iPhone 12 Pro Gold",
//         "date": "2025-08-05T10:30:00.000Z",
//         "deadline": "SIX_MONTHS",
//         "comment": "iPhone Oldi!",
//         "amount": "18000",
//         "paid": false,
//         "createdAt": "2025-08-04T20:10:55.583Z",
//         "updatedAt": "2025-08-04T21:29:08.069Z",
//         "paymentSchedules": [
//           {
//             "id": "0d85178d-404f-4458-bcd6-cb5242df7089",
//             "debtId": "1ab84ee0-1962-46e8-aca8-ec89f0ddc5b3",
//             "amount": "3000",
//             "dueDate": "2025-12-05T10:30:00.000Z",
//             "isPaid": false,
//             "paidDate": null,
//             "paidAmount": "0",
//             "createdAt": "2025-08-04T20:10:55.587Z",
//             "updatedAt": "2025-08-04T20:10:55.587Z"
//           },
//           {
//             "id": "edc6abca-9b51-4f89-bfe3-dfbb73dcdc57",
//             "debtId": "1ab84ee0-1962-46e8-aca8-ec89f0ddc5b3",
//             "amount": "3000",
//             "dueDate": "2026-01-05T10:30:00.000Z",
//             "isPaid": false,
//             "paidDate": null,
//             "paidAmount": "0",
//             "createdAt": "2025-08-04T20:10:55.587Z",
//             "updatedAt": "2025-08-04T20:10:55.587Z"
//           },
//           {
//             "id": "b43106d5-85f9-4dab-8cf6-0e52ce8b759a",
//             "debtId": "1ab84ee0-1962-46e8-aca8-ec89f0ddc5b3",
//             "amount": "3000",
//             "dueDate": "2026-02-05T10:30:00.000Z",
//             "isPaid": false,
//             "paidDate": null,
//             "paidAmount": "0",
//             "createdAt": "2025-08-04T20:10:55.587Z",
//             "updatedAt": "2025-08-04T20:10:55.587Z"
//           },
//           {
//             "id": "fa7ed906-f2c9-4f49-babc-fdb5a7555405",
//             "debtId": "1ab84ee0-1962-46e8-aca8-ec89f0ddc5b3",
//             "amount": "3000",
//             "dueDate": "2025-09-05T10:30:00.000Z",
//             "isPaid": true,
//             "paidDate": "2025-09-05T00:00:00.000Z",
//             "paidAmount": "3000",
//             "createdAt": "2025-08-04T20:10:55.587Z",
//             "updatedAt": "2025-08-04T21:29:44.834Z"
//           },
//           {
//             "id": "c2bfe0aa-1c99-46f1-b33b-1a6a9198a713",
//             "debtId": "1ab84ee0-1962-46e8-aca8-ec89f0ddc5b3",
//             "amount": "3000",
//             "dueDate": "2025-10-05T10:30:00.000Z",
//             "isPaid": true,
//             "paidDate": "2025-10-05T00:00:00.000Z",
//             "paidAmount": "3000",
//             "createdAt": "2025-08-04T20:10:55.587Z",
//             "updatedAt": "2025-08-04T21:38:04.682Z"
//           },
//           {
//             "id": "c70301e1-fae0-4f7c-8664-6d702b30bcdb",
//             "debtId": "1ab84ee0-1962-46e8-aca8-ec89f0ddc5b3",
//             "amount": "3000",
//             "dueDate": "2025-11-05T10:30:00.000Z",
//             "isPaid": true,
//             "paidDate": "2025-10-05T00:00:00.000Z",
//             "paidAmount": "3000",
//             "createdAt": "2025-08-04T20:10:55.587Z",
//             "updatedAt": "2025-08-04T21:38:04.684Z"
//           }
//         ]
//       }
//     ],
//     "phoneNumbers": [
//       {
//         "number": "+998901234567 2"
//       },
//       {
//         "number": "+998901234568 2"
//       }
//     ],
//     "debtorImages": [
//       {
//         "image": "image1.jpg"
//       },
//       {
//         "image": "image2.png"
//       }
//     ],
//     "seller": {
//       "id": "6551a3e8-ae09-4acf-9509-3c13763e9016",
//       "fullName": "Cristiano Ronaldo",
//       "username": "seller2"
//     },
//     "remainingDebtBalance": "9000"
//   }
// } => here the returned data when you send a get a debtor by id request
// ```

// "Tahrirlash/O'chirish" modal appear as a dropdown from the 3-dot icon
// in progress bar the green is the paid amount and the empty part is the unpaid part
// in "Qo'shish" button you just write the word "Qo'shish" and leave an empty img src for icon I myself will place the needed icon.