import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { useDebtor } from "../../services/Debtor"
import { useUploadImages } from "../../services/Image"
import { CreateDebtorSchema } from "../../validation/Debtor"
import { PATH } from "../../shared/hooks/Path"
import Loading from "../../components/Loading"
import ImageUpload from "../../components/ImageUpload"
import goback_arrow from "../../assets/icons/goback_arrow.svg"
import { IoIosAddCircle } from "react-icons/io"
import { CiCircleRemove } from "react-icons/ci"
import React from "react"

const UpdateDebtor = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const [phoneNumbers, setPhoneNumbers] = useState([""]) 
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [showNoticeInput, setShowNoticeInput] = useState(false)
  const [initialImages, setInitialImages] = useState<string[]>([])

  const { data: debtorData, isLoading } = useDebtor().getDebtor(id!)
  const { mutate: updateDebtor, isPending } = useDebtor().updateDebtor(id!)
  const { mutateAsync: uploadImages } = useUploadImages()

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
          const data = await uploadImages(selectedImages)
          imageFilenames = data.filenames || data.fileNames || []
        }

        submitUpdate(values, imageFilenames)
      } catch (error) {
        if (typeof error === "object" && error && "response" in error) {
          const axiosError = error as { response?: { data?: { message?: string } } }
          toast.error(axiosError.response?.data?.message || "Rasm yuklashda xatolik yuz berdi")
        } else {
          toast.error("Rasm yuklashda xatolik yuz berdi")
        }
      }
    }

  })

  useEffect(() => {
    if (debtorData?.data) {
      const debtor = debtorData.data
      const phoneNumbersArray = debtor.phoneNumbers?.map(phone => 
        typeof phone === 'string' ? phone : phone.number || ""
      ) || [""]
      
      formik.setValues({
        fullName: debtor.fullName || "",
        phoneNumbers: phoneNumbersArray,
        address: debtor.address || "",
        notice: debtor.notice || ""
      })
      
      setPhoneNumbers(phoneNumbersArray)
      setShowNoticeInput(!!debtor.notice)
      
      const imageUrls = debtor.debtorImages?.map(img => img.image) || []
      setInitialImages(imageUrls)
    }
  }, [debtorData])

  const submitUpdate = (values: any, images: string[]) => {
    const filteredPhoneNumbers = phoneNumbers.filter(phone => phone.trim())
    
    updateDebtor({
      fullName: values.fullName,
      phoneNumbers: filteredPhoneNumbers,
      address: values.address,
      notice: values.notice,
      images: images.length > 0 ? images : initialImages
    }, {
      onSuccess: () => {
        toast.success("Mijoz muvaffaqiyatli yangilandi")
        navigate(`${PATH.customers}/detail/${id}`)
      },
      onError: (error) => {
        toast.error(error?.message || "Mijozni yangilashda xatolik")
      }
    })
  }

  const addPhoneNumber = () => {
    const updated = [...phoneNumbers, ""]
    setPhoneNumbers(updated)
    formik.setFieldValue("phoneNumbers", updated, true)
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

  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files)
  }

  if (isLoading) {
    return <Loading />
  }

  if (!debtorData?.data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Mijoz topilmadi!</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="containers bg-white !pt-4">
        <div className="flex items-center justify-between mb-6">
          <img
            src={goback_arrow}
            alt="Back"
            className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110"
            onClick={() => navigate(`${PATH.customers}/detail/${id}`)}
          />
          <h1 className="text-xl font-semibold text-gray-900">Mijozni tahrirlash</h1>
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
              <div className="text-red-500 text-sm">{formik.errors.address}</div>
            )}
          </div>

          <div>
            {!showNoticeInput && !formik.values.notice ? (
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

          <ImageUpload
            initialImages={initialImages}
            onImagesChange={handleImagesChange}
            maxImages={10}
            label="Rasm biriktirish"
          />

          <div>
            <button
              type="button"
              onClick={() => formik.handleSubmit()}
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl py-4 font-medium text-base disabled:cursor-not-allowed transition-colors cursor-pointer mt-4"
            >
              {isPending ? "Saqlanmoqda..." : "Yangilash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default React.memo(UpdateDebtor)