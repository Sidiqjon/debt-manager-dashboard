import { useCookies } from "react-cookie";
import paymentArrow from "../../assets/icons/paymentArrow.svg"
import CustomModal from "../../components/CustomModal"
import { useState } from "react";
import logout from "../../assets/images/logout.svg"
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
import React from "react";
import { decodeToken } from "../../shared/utils/tokenUtils";
// import { api } from "../../api";
import { PATH } from "../../shared/hooks/Path"

const Settings = () => {
  const [cookies, , removeCookie] = useCookies(['token']);
  const [openModal, setOpenModal] = useState<boolean>(false)
  const navigate = useNavigate()
  
  const settingsList = [
    {
      id: 1,
      heading: "Asosiy",
      children: [
        { id: 2, title: "Shaxsiy ma'lumotlar" },
        { id: 3, title: "Xavfsizlik" },
      ]
    },
    {
      id: 4,
      heading: "Boshqa",
      children: [
        { id: 5, title: "Yordam" },
        { id: 6, title: "Taklif va shikoyatlar" },
        { id: 7, title: "Dastur haqida" },
        { id: 8, title: "Ommaviy oferta" },
        { id: 9, title: "Maxfiylik siyosati" },
      ]
    },
    {
      id: 10,
      heading: "Chiqish",
      children: []
    }
  ]

  // const { mutate: logOut, isPending } = useMutation({
  //   mutationFn: () => api.post("/sellers/logout"),
  //   onSuccess: () => {
  //     removeCookie("token");
  //     navigate("/");
  //   },
  //   onError: (error) => {
  //     console.error("Logout failed:", error);
  //     removeCookie("token");
  //     navigate("/");
  //   }
  // });

  const handleLogout = () => {
    removeCookie("token");
    navigate(PATH.login);
    setOpenModal(false);
  };

  const handleItemClick = (item2 : { id: number, title: string }) => {
    if (item2.id === 2) {
      const token = cookies.token;
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          const sellerId = decodedToken.sub || decodedToken.id;
          navigate(`${PATH.settings}/seller-profile/${sellerId}`);
        }
      }
    }
  };

  return (
    <>
      <div className="containers bg-white min-h-screen !pt-4">
        <div className="pb-[16px] border-b-[1px] border-[#ECECEC]">
          <h2 className="!font-semibold !text-[20px]">Sozlamalar</h2>
        </div>
        <div>
          {settingsList.map(item => (
            <div className="cursor-pointer" key={item.id}>
              <div onClick={() => item.heading == "Chiqish" ? setOpenModal(true) : {}}>
                <h2 className={`!font-medium !mt-[28px] !mb-[2px] !text-[16px] ${item.heading == "Chiqish" ? "text-[#F94D4D]" : "!text-[#3478F7]"}`}>{item.heading}</h2>
              </div>
              <ul>
                {item.children.length > 0 && item.children.map(item2 => (
                  <div key={item2.id} className="py-[18px] border-b-[1px] border-[#ECECEC] flex items-center justify-between" onClick={() => handleItemClick(item2)}>
                    <p className="!font-medium !text-[16px]">{item2.title}</p>
                    <img src={paymentArrow} alt="" className="payment-debt" />
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <CustomModal show={openModal} setShow={setOpenModal}>
        <div className="text-center w-full">
          <img className="mx-auto mb-[16px]" src={logout} alt="LogOut Img" width={60} height={60} />
          <h2 className="!font-bold !text-[18px]">Hisobdan chiqish</h2>
          <p className="!font-normal !text-[14px] mb-[49px]">Siz haqiqatan hisobdan chiqmoqchimisiz?</p>
          <div className="flex items-center justify-between">
            <Button 
              onClick={handleLogout}
              type="default" 
              size="large" 
              className="!h-[42px] !text-[14px] !font-bold !text-[#3478F7] !w-[48%] flex items-center justify-center"
            >
              Ha, chiqish
            </Button>
            <Button onClick={() => setOpenModal(false)} type="primary" size="large" className="!h-[42px] !text-[14px] !font-bold !w-[48%] flex items-center !bg-[#F94D4D] justify-center">Bekor qilish</Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}
export default React.memo(Settings)