import { useQuery } from "@tanstack/react-query";
import type { PaymentType } from "../../../services/Message";
import { messageService } from "../../../services/Message";
import NotificationMessageNotFound from "./NotificationMessageNotFound";
import Loading from "../../../components/Loading";

const HistoryPayment = () => {
  const PhoneFormat = (phone: string) => {
    return phone.replace(/^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 ($2) $3-$4-$5');
  };

  const FormatNumber = (num: string | number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const { data = [], isLoading } = useQuery<PaymentType[]>({
    queryKey: ['history-payment'],
    queryFn: messageService.getAllPayments
  })

  return (
    <div className="">
      {isLoading ? <Loading/> : data.length > 0 ? data.map((item: PaymentType, index) => (
        <div key={item.id} className="cursor-pointer">
          <p className="!text-center !text-[12px] !text-[#3478F7] !mt-[24px] !font-semibold">
            {index == 0 ? `${item.createdAt.split("T")[0]}` : 
              Number(data[index]?.createdAt?.split("T")[0].split("-")[2]) == Number(data[index - 1]?.createdAt?.split("T")[0]?.split("-")[2]) ? 
                "" : `${item.createdAt.split("T")[0]}`
            }
          </p>
          <div className="flex items-center justify-between py-[16px] border-b-[1px] border-[#ECECEC]">
            <div>
              <p className="!font-bold !text-[15px] !mb-[8px]">{item?.debtor?.fullName}</p>
              <p className="!font-semibold text-[#000000B2] !text-[13px]">
                {PhoneFormat(item?.debtor?.phoneNumbers?.length > 0 ? item?.debtor?.phoneNumbers[0]?.number : "----")}
              </p>
            </div>
            <p className="!font-small !text-[15px]">-{item.amount ? FormatNumber(item.amount) : "----"}</p>
          </div>
        </div>
      )) : <NotificationMessageNotFound/>}
    </div>
  )
}

export default HistoryPayment