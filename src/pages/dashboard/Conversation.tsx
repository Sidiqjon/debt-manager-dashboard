import { useNavigate, useParams } from "react-router-dom";
import BackIcon from "../../assets/icons/goback_arrow.svg"
import sendMsg from "../../assets/icons/sendMsg.svg"
import sample from "../../assets/icons/sample.svg"
import { Button, Popover } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateMessageRequest, NotificationType } from "../../services/Message"
import { messageService } from "../../services/Message";
import { useState, type FormEvent, useRef, useEffect } from "react";
import SkeletonButton from "antd/es/skeleton/Button";
import Loading from "../../components/Loading";
import React from "react";
import { useDebtor } from "../../services/Debtor";
import { DeleteOutlined } from "@ant-design/icons";
import { useSamples } from "../../services/Samples";

const Conversation = () => {
  const { id: debtorId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [samplesModalOpen, setSamplesModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const FindMonth = (index: number) => {
    const monthList = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
    return monthList[index];
  }

  const { data = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messageService.getAllMessages
  })

  const { data: debtor } = useDebtor().getDebtor(debtorId!);
  const { data: samplesData } = useSamples();
  

  let conversationMessages = data?.messages?.filter(
    (msg: any) => msg.to === debtorId
  )

  conversationMessages = conversationMessages?.sort((a: any, b: any) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  const [message, setMessage] = useState<string>("")
  const { mutate } = useMutation({
    mutationFn: (data: CreateMessageRequest) => messageService.createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detor-notification', debtorId] })
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      setMessage("")
    }
  })

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 70; 
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
      
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [message]);

  function handleCreateMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!message.trim() || !debtorId) return
    
    const data: CreateMessageRequest = { 
      message: message.trim(), 
      to: debtorId 
    }
    mutate(data)
  }

  function handleBack() {
    queryClient.invalidateQueries({ queryKey: ['messages'] })
    navigate(-1)
  }

  const { mutate: deleteMessage, isPending } = useMutation({
    mutationFn: () => messageService.deleteConversation(debtorId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      navigate(-1)
    }
  })

  let samples = samplesData?.data?.samples || [];
  samples = samples.filter((sample: any) => sample.verified === true);

  const content = (
    <>
      <Button
        loading={isPending}
        onClick={() => setConfirmOpen(true)}
        className="w-full flex items-center justify-center gap-2"
        size="large"
        type="primary"
        danger
        htmlType="button"
        icon={<DeleteOutlined />} 
      >
        O'chirish
      </Button>
    </>
  )

  return (
    <div className="containers">
      <div className="flex fixed z-50 top-0 pt-[30px] w-full bg-white max-w-[400px] items-center border-b-[1px] border-[#ECECEC] justify-between px-3 pb-[11px] mb-[28px]">
        <button className="" onClick={() => handleBack()}> 
          <img src={BackIcon} alt="back" className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110" />
        </button>
        <h2 className="font-semibold !text-[20px]" >
          {isLoading ?
            <div className="w-[200px] h-[25px]">
              <SkeletonButton active className="!w-full !h-full !rounded-[20px] !overflow-hidden" />
            </div> : 
            debtor?.data.fullName || "Unknown"
          }
        </h2>
        <Popover className="debtor-single-popop" placement="bottomRight" content={content} trigger="click">
          <button> 
            <MoreOutlined className="!text-[24px] cursor-pointer duration-300 hover:scale-[1.2]" /> 
          </button>
        </Popover>
      </div>

      <div className="mt-[80px] bg-white min-h-screen px-4 pb-[80px] min-w-[400px] space-y-[20px]">
        {isLoading ? <Loading/> : conversationMessages.map((item : NotificationType, index: number) => (
          <div key={item.id}>
            <p className="font-medium !text-[12px] !text-center">

              {index == 0 ? 
                `${item.createdAt.split("T")[0].split("-")[2]} ${FindMonth(Number(item.createdAt.split("T")[0].split("-")[1]))}` : 
                Number(conversationMessages[index]?.createdAt?.split("T")[0].split("-")[2]) == Number(conversationMessages[index - 1]?.createdAt?.split("T")[0]?.split("-")[2]) ? 
                  "" : 
                  `${item.createdAt.split("T")[0].split("-")[2]} ${FindMonth(Number(item.createdAt.split("T")[0].split("-")[1]))}`
              }

            </p>
            <div style={{ borderRadius: "20px 20px 0px 20px" }} className="p-4 ml-auto relative max-w-[300px] !mt-[20px] bg-[#F5F5F5]">
              <p className="font-normal !text-[13px]">{item.message}</p>
              <span className="text-[10px] absolute bottom-[2px] right-[8px]">
                {item.createdAt.split("T")[1].split(".")[0]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleCreateMessage} autoComplete="off" className="flex fixed w-full border-t-[1px] border-[#ECECEC] px-4 max-w-[400px] bg-white py-[8px] bottom-[67px] mx-auto justify-between items-center">
        <button 
          type="button" 
          className="cursor-pointer hover:scale-[1.2] duration-300"
          onClick={() => setSamplesModalOpen(true)}> 
          <img src={sample} alt="" />
        </button>

        <div className="w-[90%] flex items-center justify-between pr-[18px] bg-[#F5F5F5] rounded-[20px]">

          <textarea
            ref={textareaRef}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="w-[90%] py-[10px] px-[20px] outline-none resize-none"
            rows={1}
            placeholder="Xabar yuborish..."
            style={{ maxHeight: '70px' }}
          />

          <button type="submit" className="cursor-pointer hover:scale-[1.2] duration-300"> 
            <img src={sendMsg} alt="" /> 
          </button>
        </div>
      </form>

      {confirmOpen && (
        <div
          onClick={() => setConfirmOpen(false)}
          className="fixed pl-8 inset-0 z-50000 flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-lg max-w-[350px] w-full p-6"
          >
            <h2 className="text-lg font-semibold text-black mb-2">Chat tarixini o'chirish</h2>
            <p className="text-gray-600 mb-6">
              Haqiqatan ham bu chatni o'chirmoqchimis? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#ECECEC] hover:bg-gray-300 text-black cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => {
                  deleteMessage();   
                  setConfirmOpen(false);
                }}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-[#F94D4D] hover:bg-red-600 text-white disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {samplesModalOpen && (
        <div
          onClick={() => setSamplesModalOpen(false)}
          className="absolute inset-0 z-40 flex items-end justify-center pb-[150px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-lg w-[350px] h-[50vh] flex flex-col border border-gray-200"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Namuna xabarlar</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {samples.map((sample: any) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    setMessage(sample.message);
                    setSamplesModalOpen(false);
                  }}
                  style={{ borderRadius: "20px 20px 0px 20px" }}
                  className="p-3 border border-gray-200 bg-[#F5F5F5]  cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <p className="text-sm text-gray-800">{sample.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default React.memo(Conversation)
