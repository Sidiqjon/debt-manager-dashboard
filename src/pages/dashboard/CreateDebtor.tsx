import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { useDebtor } from "../../services/Debtor"
import { useUploadImages } from "../../services/Image"
import { CreateDebtorSchema } from "../../validation/Debtor"
import { PATH } from "../../shared/hooks/Path"
import goback_arrow from "../../assets/icons/goback_arrow.svg"
import { IoIosAddCircle } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
import update from "../../assets/icons/update.svg"
import uploadImg from "../../assets/icons/uploadImg.svg"
import React from "react"

const CreateDebtor = () => {
  const navigate = useNavigate()
  const [phoneNumbers, setPhoneNumbers] = useState([""]) 
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [showNoticeInput, setShowNoticeInput] = useState(false)

  const { mutate: createDebtor, isPending } = useDebtor().createDebtor()
  const { mutate: uploadImages } = useUploadImages()

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumbers: [""],
      address: "",
      notice: ""
    },
    validationSchema: CreateDebtorSchema,
    onSubmit: async (values) => {
      try {
        let imageFilenames: string[] = []
        
        if (selectedImages.length > 0) {
          uploadImages(selectedImages, {
            onSuccess: (data) => {
              imageFilenames = data.fileNames
              submitDebtor(values, imageFilenames)
            },
            onError: (error:unknown) => {
                if (typeof error === "object" && error && "response" in error) {
                  const axiosError = error as { response?: { data?: { message?: string } } };
                  toast.error(axiosError.response?.data?.message || "Rasm yuklashda xatolik yuz berdi");
                } else {
                  toast.error("Rasm yuklashda xatolik yuz berdi");
                }
            }
          })
        } else {
          submitDebtor(values, imageFilenames)
        }
      } catch (error) {
        toast.error("Mijozni yaratishda xatolik yuz berdi!")
      }
    }
  })

  const submitDebtor = (values: any, images: string[]) => {
    const filteredPhoneNumbers = phoneNumbers.filter(phone => phone.trim())
    
    createDebtor({
      ...values,
      phoneNumbers: filteredPhoneNumbers,
      images
    }, {
      onSuccess: (data) => {
        toast.success("Mijoz muvaffaqiyatli yaratildi")
        navigate(`${PATH.customers}/detail/${data.data.id}`)
      },
      onError: (error) => {
        toast.error(error?.message || "Mijozni yaratishda xatolik")
      }
    })
  }

  const addPhoneNumber = () => {
    // setPhoneNumbers([...phoneNumbers, ""])
    const updated = [...phoneNumbers, ""];
    setPhoneNumbers(updated);
    formik.setFieldValue("phoneNumbers", updated, true);
  }

  const updatePhoneNumber = (index: number, value: string) => {
    const updated = [...phoneNumbers]
    updated[index] = value
    setPhoneNumbers(updated)
    formik.setFieldValue("phoneNumbers", updated, true)
  }

  const removePhoneNumber = (index: number) => {
    if (phoneNumbers.length > 1) {
      const updated = phoneNumbers.filter((_, i) => i !== index)
      setPhoneNumbers(updated)
      formik.setFieldValue("phoneNumbers", updated, true)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(prev => [...prev, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const replaceImage = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const updatedImages = [...selectedImages]
      updatedImages[index] = file
      setSelectedImages(updatedImages)

      const reader = new FileReader()
      reader.onload = (e) => {
        const updatedPreviews = [...imagePreview]
        updatedPreviews[index] = e.target?.result as string
        setImagePreview(updatedPreviews)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="containers !pt-4">
        
        <div className="flex items-center justify-between mb-6">
          <img
            src={goback_arrow}
            alt="Back"
            className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110"
            onClick={() => navigate(PATH.customers)}
          />
          <h1 className="text-xl font-semibold text-gray-900">Mijoz yaratish</h1>
          <div className="w-6 h-6"></div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6 pb-12">
          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Ismi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Ismini kiriting"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Telefon raqami <span className="text-red-500">*</span>
            </label>
            {phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center gap-[10px] mb-3">
                <input
                  type="text"
                  placeholder="Telefon raqami"
                  value={phone}
                  onChange={(e) => updatePhoneNumber(index, e.target.value)}
                  onBlur={() => formik.setFieldTouched(`phoneNumbers[${index}]`, true)}
                  className="flex-1 bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                {phoneNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhoneNumber(index)}
                    className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <CiCircleRemove className="w-5 h-5 cursor-pointer" />
                  </button>
                )}
              </div>
            ))}
            {Array.isArray(formik.errors.phoneNumbers) &&
              formik.errors.phoneNumbers.map((err, i) =>
                err && (Array.isArray(formik.touched.phoneNumbers) ? formik.touched.phoneNumbers[i] : false) ? (
                  <div key={i} className="text-red-500 text-sm">
                    {err}
                  </div>
                ) : null
              )}

            <button
              type="button"
              onClick={addPhoneNumber}
              className="flex items-center gap-2 text-blue-600 text-sm font-medium cursor-pointer"
            >
              <IoIosAddCircle className="w-5 h-5" />
              Ko'proq qo'shish
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">Yashash manzili <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="address"
              placeholder="Yashash manzilini kiriting"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
              {formik.touched.address && formik.errors.address && (
                <div className="text-red-500 text-sm">{formik.errors.address}</div>)}
          </div>

          <div>
            {!showNoticeInput ? (
              <button
                type="button"
                onClick={() => setShowNoticeInput(true)}
                className="w-full bg-white border border-[#ECECEC] rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-blue-600 text-sm font-medium cursor-pointer"
              >
                <IoIosAddCircle className="w-5 h-5" />
                Eslatma qo'shish
              </button>
            ) : (
              <div>
                <label className="block text-sm font-medium text-[#000000] mb-2">Eslatma</label>
                <textarea
                  name="notice"
                  placeholder="Eslatma kiriting"
                  value={formik.values.notice}
                  onChange={formik.handleChange}
                  rows={4} 
                  className="w-full bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">Rasm biriktirish</label>
            <div className="grid grid-cols-2 gap-4">

              {imagePreview.map((preview, index) => (
                <div key={index} className="relative">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-29 object-cover rounded-[16px] border border-[#ECECEC]"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-[-5px] right-[-5px] w-5 h-5 flex items-center justify-center text-red-600 bg-white rounded-full hover:bg-red-200 cursor-pointer"
                  >
                    <CiCircleRemove className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => replaceImage(index, e)}
                    className="hidden"
                    id={`replace-image-${index}`}
                  />
                  <label
                    htmlFor={`replace-image-${index}`}
                    className="absolute inset-0 bg-black flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-40 transition-opacity rounded-[16px]"
                  >
                    <img src={update} alt="update img" className="w-5 h-5 text-white" />
                    <p className="text-white text-xs">O'zgartirish</p>
                  </label>
                </div>
              ))}

              
              <div className="border-2 border-dashed border-gray-300 rounded-[16px] h-29 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer text-center flex flex-col items-center">
                  <img src={uploadImg} alt="Upload" className="w-5 h-5 mb-1" />
                  <p className="text-[#000000B2] text-xs">Rasm qo'shish</p>
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => formik.handleSubmit()}
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl py-4 font-medium text-base disabled:cursor-not-allowed transition-colors cursor-pointer mt-4"
            >
              {isPending ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default React.memo(CreateDebtor)