import React from "react"
import { useNavigate, useParams } from "react-router-dom"
// import toast from "react-hot-toast"
import { PATH } from "../../shared/hooks/Path"
import goback_arrow from "../../assets/icons/goback_arrow.svg"
import paymentArrow from "../../assets/icons/paymentArrow.svg"

import CustomModal from "../../components/CustomModal"
import { useState, type FormEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCookies } from "react-cookie"
import { Button, Input } from "antd"
import SuccessModal from "../../components/SuccessModal"
import AnyPaymentItem from "../../components/AnyPaymentItem"
import type { DebtType } from "../../services/DebtPayment"
import { api } from "../../api"

const DebtPayment = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()

    const [cookies] = useCookies(['token']);
    const [showSuccess, setShowSuccess] = useState<boolean>(false)
    const queryClient = useQueryClient()

    const [showForMonthPayment, setShowForMonthPayment] = useState<boolean>(false)
    const [showAnyPayment, setShowAnyPayment] = useState<boolean>(false)
    const [showChooseDatePayment, setShowChooseDatePayment] = useState<boolean>(false)

    const FormatNumber = (num:string | number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    const FindMonth = (index: number) => {
        const monthList = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
        return monthList[index];
    }

    const { data: debtData } = useQuery<DebtType>({
        queryKey: ['single-debt'],
        queryFn: () => api.get(`/debt/${id}`, { headers: { "Authorization": `Bearer ${cookies.token}` } }).then(res => res.data.data)
    })

    // one month
    const { mutate: oneMonthMutate, isPending: oneMonthPenning } = useMutation({
        mutationFn: (data: { id: string | undefined }) => api.post("/debt/oneMonth", data, { headers: { "Authorization": `Bearer ${cookies.token}` } }),
        onSuccess: () => {
            setShowSuccess(true)
            queryClient.invalidateQueries({ queryKey: ['single-debt'] })
            queryClient.invalidateQueries({ queryKey: ['single-debtor'] })
            queryClient.invalidateQueries({ queryKey: ['history-payment'] })
        }
    })
    function handleShowSuccess() {
        oneMonthMutate({ id })
    }
    // one month
    // any payment
    const { mutate: oneAnyPayment, isPending: anyPaymenPenning } = useMutation({
        mutationFn: (data: { id: string | undefined, amount: number }) => api.post("/debt/anyQuantity", data, { headers: { "Authorization": `Bearer ${cookies.token}` } }),
        onSuccess: () => {
            setShowSuccess(true)
            queryClient.invalidateQueries({ queryKey: ['single-debt'] })
            queryClient.invalidateQueries({ queryKey: ['single-debtor'] })
            queryClient.invalidateQueries({ queryKey: ['history-payment'] })
        }
    })
    function handleSubmitAnyPayment(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const data = { id, amount: (e.target as HTMLFormElement).amount.value - 0 }
        oneAnyPayment(data)
    }
    // any payment

    // Choose date to pay
    const [totolPay, setTotalPay] = useState<number[]>([])
    const [payAll, setPayAll] = useState(false)
    const [payMonth, setPayMonth] = useState<Array<number>>([])
    const { mutate: oneManyPayment, isPending: manyPaymenPenning } = useMutation({
        mutationFn: (data: { id: string | undefined, months: number[] }) => api.post("/debt/manyMonth", data, { headers: { "Authorization": `Bearer ${cookies.token}` } }),
        onSuccess: () => {
            setShowSuccess(true)
            queryClient.invalidateQueries({ queryKey: ['single-debt'] })
            queryClient.invalidateQueries({ queryKey: ['single-debtor'] })
            queryClient.invalidateQueries({ queryKey: ['history-payment'] })
        }
    })
    function handleManyMonthClick() {
        const data = { id, months: payMonth }
        oneManyPayment(data)
    }
    function handlePayAll() {
        setPayAll((_prev: boolean) => {
            if (!payAll) {
                setPayMonth(debtData?.Payment ? debtData?.Payment.map(item => item.month) : [])
                setTotalPay(debtData?.Payment ? debtData?.Payment.map(item => item.amount) : [])
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
          <h1 className="text-xl font-semibold text-[#000000]">Nasiyani so‘ndirish</h1>
          <div className="w-6 h-6"></div>
        </div>

          <h1 className="!text-[22px] font-semibold text-[#000000] !my-[25px]">To‘lov</h1>
          <ul>
              <li onClick={() => setShowForMonthPayment(true)} className="cursor-pointer flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
                  <p className="!text-[16px] font-normal">1 oyga so‘ndirish</p>
                  <button><img src={paymentArrow} alt="paymentArrow" /></button>
              </li>
              <li onClick={() => setShowAnyPayment(true)} className="cursor-pointer flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
                  <p className="!text-[16px] font-normal">Har qanday miqdorda so‘ndirish</p>
                  <button><img src={paymentArrow} alt="paymentArrow" /></button>
              </li>
              <li onClick={() => setShowChooseDatePayment(true)} className="cursor-pointer flex items-center justify-between py-[16px] border-b-[1px] border-[#EEEEEE]">
                  <p className="!text-[16px] font-normal">To‘lov muddatini tanlash</p>
                  <button><img src={paymentArrow} alt="paymentArrow" /></button>
              </li>
          </ul>
      </div>

      <CustomModal show={showForMonthPayment} setShow={setShowForMonthPayment}>
          <h2 className="!font-bold !text-[20px]">1 oy uchun so‘ndirish</h2>
          <div className="p-4 rounded-[16px] bg-[#DDE9FE] mt-[32px] mb-[200px]">
              <h2 className="!font-bold !text-[16px] !mb-[4px] text-[#3478F7]">{FormatNumber(debtData?.Payment[0]?.amount ? debtData?.Payment[0]?.amount : 0)} so‘m</h2>
              <p>{FindMonth(Number(debtData?.Payment[0]?.date?.split("T")[0]?.split("-")[1]) - 1)} oyi uchun so‘ndiriladi</p>
          </div>
          <Button loading={oneMonthPenning} onClick={handleShowSuccess} className="!h-[42px] !font-medium !text-[14px] w-full" size="large" htmlType="button" type="primary">1 oylik uchun so‘ndirish</Button>
      </CustomModal>
      <CustomModal show={showAnyPayment} setShow={setShowAnyPayment}>
          <form onSubmit={handleSubmitAnyPayment} autoComplete="off">
              <h2 className="!font-bold !text-[20px] !mb-[32px]">Har qanday miqdorda so‘ndirish</h2>
              <label className="!mb-[215px] block">
                  <span className="text-[13px] font-semibold mb-[8px]">Miqdorni kiriting *</span>
                  <Input type="number" allowClear className="!bg-[#F6F6F6] !h-[44px]" size="large" name="amount" placeholder="To‘lov miqdori" />
              </label>
              <Button loading={anyPaymenPenning} className="!h-[42px] !font-medium !text-[14px] w-full" size="large" htmlType="submit" type="primary">So‘ndirish</Button>
          </form>
      </CustomModal>
      <CustomModal show={showChooseDatePayment} setShow={setShowChooseDatePayment}>
          <h2 className="!font-bold !text-[20px]">To‘lov muddatini tanlang</h2>
          <div className="flex items-center justify-between mt-[22px] pb-[22px] border-b-[1px] border-[#ECECEC]">
              <div>
                  <p className="!text-[14px] !font-medium">So‘ndirish:</p>
                  <p className="!text-[16px] !font-bold text-[#3478F7]">{addAmount(totolPay) ? addAmount(totolPay) : 0} so‘m</p>
              </div>
              <button onClick={handlePayAll} className="text-[14px] font-bold text-[#3478F7] cursor-pointer hover:scale-[1.1] duration-300">Hammasini tanlang</button>
          </div>
          <ul>
              {debtData?.Payment.map(item => <AnyPaymentItem setTotalPay={setTotalPay} payAll={payAll} item={item} key={item.id} setPayMonth={setPayMonth} payMonth={payMonth} />)}
          </ul>
          <Button loading={manyPaymenPenning} onClick={handleManyMonthClick} className="!h-[42px] !mt-[16px] !font-medium !text-[14px] w-full" size="large" htmlType="submit" type="primary">So‘ndirish</Button>
      </CustomModal>
      {showSuccess && <SuccessModal />}
    </>
  )
}

export default React.memo(DebtPayment)
