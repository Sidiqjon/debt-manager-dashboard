import { Button, Segmented } from "antd";
import messageIcon from "../../assets/icons/messageIcon.svg"
import NotificationModal from "../../components/NotificationModal"
import { useState } from "react";
import HistoryPayment from "./notificationFolder/HistoryPayment";
import NotificationMessage from "./notificationFolder/NotificationMessage";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import NotificationMessageNotFound from "./notificationFolder/NotificationMessageNotFound";
import Loading from "../../components/Loading";
import sample from "../../assets/icons/sample.svg"
import React from "react";
import { PATH } from "../../shared/hooks/Path";
import { useDebtor, type Debtor } from "../../services/Debtor"

const Notification = () => {
  const [showMessage, setShowMessage] = useState<"Xabarlar tarixi" | "To'lovlar tarixi">("Xabarlar tarixi")
  const [showModalAddMessage, setShowModalAddMessage] = useState<boolean>(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  function handleSendMessage(id: string) {
    queryClient.invalidateQueries({ queryKey: ['detor-notification'] })
    navigate(`${PATH.reports}/message/${id}`)
  }

  const PhoneFormat = (phone: string) => {
    return phone.replace(/^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 ($2) $3-$4-$5');
  };

  const { data: debtors, isLoading: isLoadingDebtors } = useDebtor().getDebtors()
  
  return (
    <>
      <div className="containers bg-white !pt-4 !pb-[18px] border-b-[1px] border-[#ECECEC]">
        <div className="flex items-center justify-between ">
          <h2 className="!font-bold !text-[22px]">Hisobot</h2>
          <img src={sample} alt="" className="w-4 h-4 cursor-pointer" />
        </div>
      </div>
      <div className="containers bg-white min-h-screen !pt-4">
        <Segmented 
          block
          onChange={(e: "Xabarlar tarixi" | "To'lovlar tarixi") => setShowMessage(e)}
          className="!w-full !h-[44px] !bg-[#F6F6F6] flex justify-center items-center [&_.ant-segmented-item-selected]:!text-[#3478F7] [&_.ant-segmented-item]:!text-gray-700" 
          size="large" 
          options={['Xabarlar tarixi', "To'lovlar tarixi"]} />
        <div className="mt-[16px]">
          {showMessage == "Xabarlar tarixi" ? <NotificationMessage /> : <HistoryPayment />}
        </div>
      </div>
      {showMessage === "Xabarlar tarixi" && (
        <Button 
          onClick={() => setShowModalAddMessage(true)} 
          className="!text-[16px] !fixed !rounded-full !right-[calc(50%-185px)] !bottom-[80px] !p-0 !font-medium !h-[58px] !w-[58px]" 
          type="primary" 
          size="large" 
          icon={<img src={messageIcon} alt="" />}
        />
      )}

      <NotificationModal show={showModalAddMessage} setShow={setShowModalAddMessage}>
        <div className="h-[50vh] overflow-y-auto">
          {isLoadingDebtors ? (
            <Loading />
          ) : (debtors?.data?.debtors?.length ?? 0) > 0 ? (
            debtors!.data!.debtors!.map((debtor: Debtor) => (
              <div
                onClick={() => handleSendMessage(debtor.id)}
                key={debtor.id}
                className="flex hover:bg-slate-100 duration-300 cursor-pointer items-center justify-between py-[16px] border-b-[1px] border-[#ECECEC]"
              >
                <div>
                  <p className="!font-bold !text-[14px] !mb-[8px]">
                    {debtor.fullName}
                  </p>
                  <p className="!font-semibold !text-[13px]">
                    {debtor.phoneNumbers?.length
                      ? PhoneFormat(debtor.phoneNumbers[0].number)
                      : "----"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <NotificationMessageNotFound />
          )}
        </div>
      </NotificationModal>

    </>
  )
}

export default React.memo(Notification)