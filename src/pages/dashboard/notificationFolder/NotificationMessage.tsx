import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationType } from "../../../services/Message";
import { messageService } from "../../../services/Message";
import NotificationMessageNotFound from "./NotificationMessageNotFound";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import {PATH} from "../../../shared/hooks/Path";

const NotificationMessage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const FindMonth = (index: number) => {
    const monthList = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
    return monthList[index];
  }

  const PhoneFormat = (phone: string) => {
    return phone.replace(/^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 ($2) $3-$4-$5');
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messageService.getAllMessages
  })

  const uniqueMessages = data?.messages?.filter(
    (msg: NotificationType, index: number, self: NotificationType[]) =>
      index === self.findIndex((m) => m.receiver.id === msg.receiver.id)
  ) || []

  function showDebtNotification(id: string) {
    navigate(`${PATH.reports}/message/${id}`)
    queryClient.invalidateQueries({ queryKey: ['detor-notification'] })
  }

  return (
    <div>
      {isLoading ? <Loading/> : data.messages.length > 0 ? uniqueMessages.map((item: NotificationType) => (
        <div onClick={() => showDebtNotification(item.to)} key={item.id} className="flex cursor-pointer items-center justify-between py-[16px] border-b-[1px] border-[#ECECEC]">
          <div>
            <p className="!font-bold !text-[14px] !mb-[8px]">{item.receiver.fullName}</p>
            <p className="!font-semibold text-[#000000B2] !text-[13px]">{PhoneFormat(item.receiver.phoneNumbers.length > 0 ? item?.receiver.phoneNumbers[0].number : "")}</p>
          </div>
          <p className="!font-semibold !text-[12px]">
            {item?.message ? 
              `${item?.createdAt.split("T")[0].split("-")[2]} ${FindMonth(Number(item?.createdAt.split("T")[0].split("-")[1]))}` 
              : "--"
            }
          </p>
        </div>
      )) : <NotificationMessageNotFound/>}
    </div>
  )
}

export default NotificationMessage