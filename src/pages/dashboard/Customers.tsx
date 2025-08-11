import { useState } from "react"
import { useDebtor, type Debtor } from "../../services/Debtor"
import { useDebounce } from "../../shared/hooks/UseDebounce"
import { useParamsHook } from "../../shared/hooks/UseSearchParams"
import nomsizIcon from "../../assets/icons/nomsizIcon.svg"
import searchIcon from "../../assets/icons/searchIcon.svg"
import addDebtor from "../../assets/icons/addDebtor.svg"
import React from "react"
import { PiFolderOpenLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom"

const Customers = () => {
    const navigate = useNavigate()

    const { getParam, setParam, removeParam } = useParamsHook()
    const [searchInput, setSearchInput] = useState(getParam("search") || "")
    const debouncedSearch = useDebounce(searchInput, 500)

    const { data, isLoading } = useDebtor().getDebtors(debouncedSearch || undefined)

    const handleSearch = (value: string) => {
        setSearchInput(value)
        if (value.trim()) {
            setParam("search", value)
        } else {
            removeParam("search")
        }
    }

    const calculateTotalDebt = (debtor: Debtor) => {
        return debtor.debts.reduce((total, debt) => {
            return total + parseInt(debt.amount)
        }, 0)
    }

    const formatAmount = (amount: number) => {
        return amount.toLocaleString('en-US').replace(/,/g, ' ')
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
            </div>
        )
    }

    return (
            <div className="containers min-h-screen bg-[#FFFFFF] !pt-4 relative">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Mijozlarni qidirish..."
                            value={searchInput}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full bg-[#F6F6F6] rounded-[12px] border border-[#ECECEC] pl-12 pr-4 py-3 text-[#000000] placeholder-[#1A1A1A99] focus:outline-none"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <img src={searchIcon} alt="search" className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="cursor-pointer">
                        <img src={nomsizIcon} alt="filter" className="w-5 h-5" />
                    </div>
                </div>

                <div className="space-y-4 pb-4">
                    {data?.data.debtors.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center text-gray-400 py-8">
                            <PiFolderOpenLight className="text-5xl text-gray-400" />
                            <p className="text-lg font-medium">Hech narsa topilmadi!</p>
                        </div>
                    ) : (
                        data?.data.debtors.map((debtor) => (
                            <div
                                key={debtor.id}
                                onClick={() => navigate(`/customers/detail/${debtor.id}`)}
                                className="bg-[#F6F6F6] rounded-[16px] p-4 shadow-md border border-[#ECECEC] hover:transition-transform hover:scale-102 cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold capitalize text-[#000000]">
                                        {debtor.fullName}
                                    </h3>
                                </div>
                                <p className="text-[#1A1A1A] mb-3">
                                    {debtor.phoneNumbers[0]?.number || "Telefon raqami yo'q"}
                                </p>

                                <div>
                                    <p className="text-[#1A1A1A] text-sm mb-1">Jami nasiya:</p>
                                    <p className="text-[#F94D4D] text-lg font-medium">
                                        -{formatAmount(calculateTotalDebt(debtor))} so'm
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end sticky bottom-0 mt-4">
                    <button
                        onClick={() => navigate("/customers/create")}
                        className="bg-[#3478F7] hover:bg-[#0951d8ce] shadow-[0px_2px_4px_0px_#3478F74D] transition-all duration-300 ease-in-out transform hover:scale-102 text-white rounded-[10px] px-6 py-3 flex items-center space-x-2 font-medium cursor-pointer"
                    >
                        <img src={addDebtor} alt="add debtor" className="w-6 h-6" />
                        <span>Yaratish</span>
                    </button>
                </div>
            </div>
    )
}

export default React.memo(Customers)