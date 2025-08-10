import React, { useState, useMemo } from "react"
import { useSeller } from "../../services/Seller"
import { getUserIdFromToken } from "../../shared/utils/tokenUtils"
import goback_arrow from "../../assets/icons/goback_arrow.svg"
import left_arrow from "../../assets/icons/left_arrow.svg"
import right_arrow from "../../assets/icons/right_arrow.svg"
import { useNavigate } from "react-router-dom"
import { PATH } from "../../shared/hooks/Path"

interface PaymentSchedule {
    id: string
    debtId: string
    amount: string
    dueDate: string
    isPaid: boolean
    paidDate: string | null
    paidAmount: string
}

interface Debt {
    id: string
    debtorId: string
    productName: string
    date: string
    deadline: string
    comment: string
    amount: string
    paid: boolean
    paymentSchedules: PaymentSchedule[]
}

interface Debtor {
    id: string
    sellerId: string
    fullName: string
    address: string
    notice: string
    debts: Debt[]
}

const Calendar = () => {
    const navigate = useNavigate()
    const userId = getUserIdFromToken()
    const { getSellerProfile } = useSeller()
    const { data: sellerData, isLoading } = getSellerProfile(userId || "")

    const today = new Date()
    const [selectedDate, setSelectedDate] = useState<Date>(today)
    const [currentMonth, setCurrentMonth] = useState<Date>(today)

    const monthNames = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
    ]

    const dayNames = ["DU", "SE", "CH", "PA", "JU", "SH", "YA"]

    const seller = sellerData?.data
    const debtors: Debtor[] = seller?.debtors || []

    const filteredPayments = useMemo(() => {
        const payments: Array<{
            debtorName: string
            amount: string
            dueDate: string
            productName: string
        }> = []

        debtors.forEach(debtor => {
            debtor.debts.forEach(debt => {
                debt.paymentSchedules
                    .filter(schedule => !schedule.isPaid)
                    .filter(schedule => {
                        const dueDate = new Date(schedule.dueDate)
                        return dueDate <= selectedDate
                    })
                    .forEach(schedule => {
                        payments.push({
                            debtorName: debtor.fullName,
                            amount: schedule.amount,
                            dueDate: schedule.dueDate,
                            productName: debt.productName
                        })
                    })
            })
        })

        return payments
    }, [debtors, selectedDate])

    const monthlyTotal = useMemo(() => {
        let total = 0
        const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

        debtors.forEach(debtor => {
            debtor.debts.forEach(debt => {
                debt.paymentSchedules
                    .filter(schedule => !schedule.isPaid)
                    .filter(schedule => {
                        const dueDate = new Date(schedule.dueDate)
                        return dueDate >= currentMonthStart && dueDate <= currentMonthEnd
                        // return dueDate <= currentMonthEnd
                    })
                    .forEach(schedule => {
                        total += Number(schedule.amount)
                    })
            })
        })

        return total
    }, [debtors, currentMonth])

    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const startDate = new Date(firstDay)
        // startDate.setDate(firstDay.getDate() - firstDay.getDay())
        startDate.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7))

        console.log(lastDay)

        const days = []
        for (let i = 0; i < 42; i++) {
            const day = new Date(startDate)
            day.setDate(startDate.getDate() + i)
            days.push(day)
        }
        return days
    }

    const isToday = (date: Date) => {
        return date.toDateString() === today.toDateString()
    }

    const isSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString()
    }

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentMonth.getMonth()
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth)
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1)
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1)
        }
        setCurrentMonth(newMonth)

        const firstDayOfNewMonth = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1)
        setSelectedDate(firstDayOfNewMonth)
    }

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="containers !pt-4 !pb-4 bg-white min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <img
                    src={goback_arrow}
                    alt="Back"
                    className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                    onClick={() => navigate(PATH.main)}
                />
                <h1 className="text-xl font-semibold text-gray-900">Kalendar</h1>
                <div className="w-6 h-6"></div>
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="w-10 h-10 rounded-[12px] bg-[#F5F5F5] flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
                        >
                            <img src={left_arrow} alt="Previous" className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="w-10 h-10 rounded-[12px] bg-[#F5F5F5] flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
                        >
                            <img src={right_arrow} alt="Next" className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-[#000000CC]">Oylik jami:</span>
                    <span className="text-xl font-bold text-gray-900">
                        {monthlyTotal.toLocaleString()} so'm
                    </span>
                </div>

                <div className="grid grid-cols-7 mb-4">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-[#1A1A1A] py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth().map((date, index) => (
                        <button
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            className={`
                h-10 w-full rounded-lg text-sm font-medium border-[1px] border-[#EDEDED] bg-[#F6F6F6]
                ${!isCurrentMonth(date) ? 'text-gray-300' : ''}
                ${isSelected(date) ? 'bg-blue-500 text-white' : ''}
                ${isToday(date) && !isSelected(date) ? 'bg-blue-100 text-blue-600' : ''}
                ${!isSelected(date) && !isToday(date) && isCurrentMonth(date) ? 'hover:bg-gray-200' : ''}
              `}
                        >
                            {String(date.getDate()).padStart(2, '0')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[#F6F6F6] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-[#000000] mb-4">
                    {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} kuni to'lov kutilmoqda
                </h3>

                {filteredPayments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Bu sanagacha to'lov kutilayotgan qarzlar yo'q
                    </p>
                ) : (
                    <div className="space-y-4">
                        {filteredPayments.map((payment, index) => (
                            <div key={index} className=" bg-[#FFFFFF] px-[16px] py-[14px] rounded-2xl">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{payment.debtorName}</h4>
                                        <p className="text-sm text-gray-500">{payment.productName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            UZS {Number(payment.amount).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(payment.dueDate).toLocaleDateString('uz-UZ')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default React.memo(Calendar)
