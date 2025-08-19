import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PATH } from "../../shared/hooks/Path"
import goback_arrow from "../../assets/icons/goback_arrow.svg"
import paymentArrow from "../../assets/icons/paymentArrow.svg"

import CustomModal from "../../components/CustomModal"
import { useState, type FormEvent } from "react"
import { Button, Input } from "antd"
import SuccessModal from "../../components/SuccessModal"
import AnyPaymentItem from "../../components/AnyPaymentItem"
import { useDebt } from "../../services/Debt"
import { useDebtPayment } from "../../services/DebtPayment"

const DebtPayment = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()

    const [showSuccess, setShowSuccess] = useState<boolean>(false)
    const [showForMonthPayment, setShowForMonthPayment] = useState<boolean>(false)
    const [showAnyPayment, setShowAnyPayment] = useState<boolean>(false)
    const [showChooseDatePayment, setShowChooseDatePayment] = useState<boolean>(false)

    const FormatNumber = (num: string | number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    const FindMonth = (dateString: string) => {
        const monthList = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
        const date = new Date(dateString);
        return monthList[date.getMonth()];
    }

    const { data: debtData } = useDebt().getDebtById(id || "");
    const { monthlyPayment, anyAmountPayment, multipleMonthsPayment } = useDebtPayment();

    const nextUnpaidSchedule = debtData?.data?.paymentSchedules?.find(schedule => !schedule.isPaid);
    const unpaidSchedules = debtData?.data?.paymentSchedules?.filter(schedule => !schedule.isPaid) || [];

    const [totalPay, setTotalPay] = useState<number[]>([])
    const [payAll, setPayAll] = useState(false)
    const [payMonth, setPayMonth] = useState<Array<string>>([])

    function handleMonthlyPayment() {
        monthlyPayment.mutate({ 
            debtId: id || "" 
        }, {
            onSuccess: () => {
                setShowForMonthPayment(false)
                setShowSuccess(true)
            }
        })
    }

    function handleSubmitAnyPayment(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const amount = Number((e.target as HTMLFormElement).amount.value)
        anyAmountPayment.mutate({ 
            debtId: id || "", 
            amount 
        }, {
            onSuccess: () => {
                setShowAnyPayment(false)
                setShowSuccess(true)
            }
        })
    }

    function handleManyMonthClick() {
        multipleMonthsPayment.mutate({ 
            debtId: id || "", 
            scheduleIds: payMonth 
        }, {
            onSuccess: () => {
                setShowChooseDatePayment(false)
                setShowSuccess(true)
            }
        })
    }

    function handlePayAll() {
        setPayAll((_prev: boolean) => {
            if (!payAll) {
                setPayMonth(unpaidSchedules.map(item => item.id))
                setTotalPay(unpaidSchedules.map(item => Number(item.amount)))
                return true
            }
            else {
                setPayMonth([])
                setTotalPay([])
                return false
            }
        })
    }

    function addAmount(arr: number[]) {
        if (arr.length > 0) {
            let total = arr?.reduce((value: number, item: number) => {
                return value += item
            })
            return FormatNumber(total)
        }
    }

  return (
    <>
      <div className="containers min-h-screen bg-white !pt-4">
        <div className="flex items-center justify-between mb-6">
          <img
            src={goback_arrow}
            alt="Back"
            className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110"
            onClick={() => navigate(`${PATH.customers}/debt-detail/${id}`)}/>
          <h1 className="text-xl font-semibold text-[#000000]">Nasiyani so'ndirish</h1>
          <div className="w-6 h-6"></div>
        </div>

          <h1 className="!text-[22px] font-semibold text-[#000000] !my-[25px]">To'lov</h1>
          <ul>
              <li onClick={() => setShowForMonthPayment(true)} className="cursor-pointer flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
                  <p className="!text-[16px] font-normal">1 oyga so'ndirish</p>
                  <button><img src={paymentArrow} alt="paymentArrow" /></button>
              </li>
              <li onClick={() => setShowAnyPayment(true)} className="cursor-pointer flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
                  <p className="!text-[16px] font-normal">Har qanday miqdorda so'ndirish</p>
                  <button><img src={paymentArrow} alt="paymentArrow" /></button>
              </li>
              <li onClick={() => setShowChooseDatePayment(true)} className="cursor-pointer flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
                  <p className="!text-[16px] font-normal">To'lov muddatini tanlash</p>
                  <button><img src={paymentArrow} alt="paymentArrow" /></button>
              </li>
          </ul>
      </div>

      <CustomModal show={showForMonthPayment} setShow={setShowForMonthPayment}>
          <h2 className="!font-bold !text-[20px]">1 oy uchun so'ndirish</h2>
          <div className="p-4 rounded-[16px] bg-[#DDE9FE] mt-[32px] mb-[200px]">
              <h2 className="!font-bold !text-[16px] !mb-[4px] text-[#3478F7]">{FormatNumber(nextUnpaidSchedule?.amount || "0")} so'm</h2>
              <p>{nextUnpaidSchedule ? FindMonth(nextUnpaidSchedule.dueDate) : ""} oyi uchun so'ndiriladi</p>
          </div>
          <Button 
            loading={monthlyPayment.isPending} 
            onClick={handleMonthlyPayment} 
            className="!h-[42px] !font-medium !text-[14px] w-full" 
            size="large" 
            htmlType="button" 
            type="primary"
            disabled={!nextUnpaidSchedule}
          >
            1 oylik uchun so'ndirish
          </Button>
      </CustomModal>

      <CustomModal show={showAnyPayment} setShow={setShowAnyPayment}>
          <form onSubmit={handleSubmitAnyPayment} autoComplete="off">
              <h2 className="!font-bold !text-[20px] !mb-[32px]">Har qanday miqdorda so'ndirish</h2>
              <label className="!mb-[215px] block">
                  <span className="text-[13px] font-semibold mb-[8px]">Miqdorni kiriting *</span>
                  <Input 
                    type="number" 
                    allowClear 
                    className="!bg-[#F6F6F6] !h-[44px]" 
                    size="large" 
                    name="amount" 
                    placeholder="To'lov miqdori"
                    max={debtData?.data?.remainingAmount}
                  />
              </label>
              <Button 
                loading={anyAmountPayment.isPending} 
                className="!h-[42px] !font-medium !text-[14px] w-full" 
                size="large" 
                htmlType="submit" 
                type="primary"
              >
                So'ndirish
              </Button>
          </form>
      </CustomModal>

      <CustomModal show={showChooseDatePayment} setShow={setShowChooseDatePayment}>
          <h2 className="!font-bold !text-[20px]">To'lov muddatini tanlang</h2>
          <div className="flex items-center justify-between mt-[22px] pb-[22px] border-b-[1px] border-[#ECECEC]">
              <div>
                  <p className="!text-[14px] !font-medium">So'ndirish:</p>
                  <p className="!text-[16px] !font-bold text-[#3478F7]">{addAmount(totalPay) ? addAmount(totalPay) : 0} so'm</p>
              </div>
              <button onClick={handlePayAll} className="text-[14px] font-bold text-[#3478F7] cursor-pointer hover:scale-[1.1] duration-300">Hammasini tanlang</button>
          </div>
          <ul>
              {unpaidSchedules.map(item => 
                <AnyPaymentItem 
                  setTotalPay={setTotalPay} 
                  payAll={payAll} 
                  item={item} 
                  key={item.id} 
                  setPayMonth={setPayMonth} 
                  payMonth={payMonth} 
                />
              )}
          </ul>
          <Button 
            loading={multipleMonthsPayment.isPending} 
            onClick={handleManyMonthClick} 
            className="!h-[42px] !mt-[16px] !font-medium !text-[14px] w-full" 
            size="large" 
            htmlType="submit" 
            type="primary"
            disabled={payMonth.length === 0}
          >
            So'ndirish
          </Button>
      </CustomModal>

      {showSuccess && <SuccessModal />}
    </>
  )
}

export default React.memo(DebtPayment)