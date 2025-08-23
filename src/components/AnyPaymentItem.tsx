import { Checkbox } from 'antd'
import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from 'react'
import type { PaymentScheduleType } from '../services/DebtPayment'

const AnyPaymentItem: FC<{
  setTotalPay: Dispatch<SetStateAction<number[]>>, 
  payAll: boolean, 
  payMonth: string[], 
  item: PaymentScheduleType, 
  setPayMonth: Dispatch<SetStateAction<string[]>>
}> = ({ payAll, setPayMonth, item, setTotalPay }) => {
  const [check, setCheck] = useState<boolean>(false)
  
  const FormatNumber = (num: string | number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  const FindMonth = (dateString: string) => {
    const monthList = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
    const date = new Date(dateString);
    return monthList[date.getMonth()];
  }

  function handleCheck() {
    setCheck(prev => !prev);
    setPayMonth((prev: string[]) => {
      if (!check) {
        return [...prev, item.id];
      } else {
        return prev.filter((id: string) => id !== item.id);
      }
    });
    setTotalPay((prev: number[]) => {
      if (!check) {
        return [...prev, Number(item.amount)];
      } else {
        const deleteIndex = prev.findIndex(data => data == Number(item.amount))
        prev.splice(deleteIndex, 1)
        return prev
      }
    });
  }

  useEffect(() => {
    setCheck(payAll)
  }, [payAll])

  if (item.isPaid) return null;

  return (
    <li onClick={handleCheck} className="py-[16px] cursor-pointer border-b-[1px] flex items-center justify-between border-[#ECECEC]">
      <div>
        <p className="!font-medium !text-[12px]">{FindMonth(item.dueDate)}</p>
        <p className="!font-semibold !text-[14px]">{item.dueDate.split("T")[0]}</p>
      </div>
      <div className="flex items-center gap-[12px]">
        <p className="!font-bold !text-[14px]">{FormatNumber(item.amount)} so'm</p>
        <Checkbox checked={check}></Checkbox>
      </div>
    </li>
  )
}

export default AnyPaymentItem
