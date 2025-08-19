import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSeller } from "../../services/Seller";
import { Skeleton, Avatar } from "antd";
import profileIcon from "../../assets/icons/profileIcon.svg"
import goback_arrow from "../../assets/icons/goback_arrow.svg"
import { useImage } from "../../services/Image"

const SellerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  let sellerId = id;

  const { getSellerProfile } = useSeller();
  const { data: seller, isLoading, error } = getSellerProfile(sellerId || "");

  const { data: imageUrl } = useImage(seller?.data.image ?? "")

  if (isLoading) {
    return (
      <div className="p-4 containers !pt-4 bg-white min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <img src={goback_arrow} alt="" className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110"  onClick={() => navigate(-1)}/>
          <h1 className="text-xl font-bold">Shaxsiy ma'lumotlar</h1>
          <div className="w-6 h-6"></div>
        </div>
        <div className="flex flex-col items-center mb-8">
          <Skeleton.Avatar size={120} className="mb-4" />
          <Skeleton.Button size="small" />
        </div>
        <div className="space-y-6">
          <Skeleton paragraph={{ rows: 2 }} />
          <Skeleton paragraph={{ rows: 2 }} />
          <Skeleton paragraph={{ rows: 2 }} />
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="p-4 containers !pt-4 bg-white min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <img src={goback_arrow} alt="" className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110"  onClick={() => navigate(-1)}/>
          <h1 className="text-xl font-bold">Shaxsiy ma'lumotlar</h1>
          <div className="w-6 h-6"></div>
        </div>
        <div className="text-center text-red-500">
          Ma'lumotlarni yuklashda xatolik yuz berdi
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 containers !pt-4 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <img src={goback_arrow} alt="" className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110"  onClick={() => navigate(-1)}/>
        <h1 className="text-xl font-bold">Shaxsiy ma'lumotlar</h1>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Avatar 
            size={120} 
            src={imageUrl} 
            className="bg-[#E7E7E7]"
          >
            {seller.data.fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div className="absolute bottom-0 right-0 rounded-full p-2">
            <img src={profileIcon} alt="" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#000000] mb-2">
            Ismi familiya
          </label>
          <div className="bg-[#F6F6F6] border border-[#ECECEC] rounded-lg p-3">
            <span className="text-gray-900">
              {seller.data.fullName}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#000000] mb-2">
            Telefon raqam
          </label>
          <div className="bg-[#F6F6F6] border border-[#ECECEC] rounded-lg p-3">
            <span className="text-gray-900">
              {seller.data.phoneNumber || 'Kiritilmagan'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#000000] mb-2">
            Elektron pochta
          </label>
          <div className="bg-[#F6F6F6] border border-[#ECECEC] rounded-lg p-3">
            <span className="text-gray-900">
              {seller.data.email || 'Kiritilmagan'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SellerProfile);