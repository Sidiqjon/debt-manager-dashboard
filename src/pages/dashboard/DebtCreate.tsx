import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { useDebt } from "../../services/Debt"
import { useUploadImages } from "../../services/Image"
import { CreateDebtSchema } from "../../validation/Debt"
import { PATH } from "../../shared/hooks/Path"
import goback_arrow from "../../assets/icons/goback_arrow.svg"
import { IoIosAddCircle } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
import update from "../../assets/icons/update.svg"
import uploadImg from "../../assets/icons/uploadImg.svg"
import React from "react"
import datecalendar from "../../assets/icons/datecalendar.svg"
import Calendar from "../../components/Calendar"

const deadlineMap: Record<string, string> = {
  ONE_MONTH: "1 oy",
  TWO_MONTHS: "2 oy",
  THREE_MONTHS: "3 oy",
  FOUR_MONTHS: "4 oy",
  FIVE_MONTHS: "5 oy",
  SIX_MONTHS: "6 oy",
  SEVEN_MONTHS: "7 oy",
  EIGHT_MONTHS: "8 oy",
  NINE_MONTHS: "9 oy",
  TEN_MONTHS: "10 oy",
  ELEVEN_MONTHS: "11 oy",
  TWELVE_MONTHS: "12 oy"
}

interface FormValues {
  productName: string;
  date: string;
  deadline: string;
  comment: string;
  amount: string;
}

const DebtCreate: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [showNoticeInput, setShowNoticeInput] = useState<boolean>(false)
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [isTodayChecked, setIsTodayChecked] = useState<boolean>(false)
  const [displayDate, setDisplayDate] = useState<string>("")
  const calendarRef = useRef<HTMLDivElement>(null)

  const { mutate: createDebt, isPending } = useDebt().createDebt()
  const { mutateAsync: uploadImages } = useUploadImages()

  const formik = useFormik<FormValues>({
    initialValues: {
      productName: "",
      date: "",
      deadline: "",
      comment: "",
      amount: "",
    },
    validationSchema: CreateDebtSchema,
    onSubmit: async (values) => {
      try {

        let imageFilenames: string[] = []

        if (selectedImages.length > 0) {
          const data = await uploadImages(selectedImages)
          imageFilenames = data.fileNames
        }
        submitDebt(values, imageFilenames)
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

  const submitDebt = (values: FormValues, images: string[]) => {
    let isoDate = values.date
    if (values.date && values.date.includes(".")) {
      const [year, month, day] = values.date.split("T")[0].split("-");
      const now = new Date()
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())
      isoDate = dateObj.toISOString()
    }
    createDebt({
      debtorId: id!,
      ...values,
      date: isoDate,
      amount: values.amount,
      deadline: values.deadline || "TWELVE_MONTHS",
      images
    }, {
      onSuccess: (data: any) => {
        toast.success("Nasiya muvaffaqiyatli yaratildi")
        navigate(`${PATH.customers}/debt-detail/${data.data.id}`)
        // navigate(`${PATH.customers}/detail/${data.data.debtorId}`)
      },
      onError: (error: any) => {
        toast.error(error?.message || "Nasiyani yaratishda xatolik")
      }
    })
  }

  const formatTodayDate = (): { iso: string, display: string } => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    return {
      iso: now.toISOString(),
      display: `${day}.${month}.${year}`
    };
  };

  const handleTodayCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsTodayChecked(isChecked);

    if (isChecked) {
      const todayFormats = formatTodayDate();
      formik.setFieldValue('date', todayFormats.iso);
      setDisplayDate(todayFormats.display);
    } else {
      setDisplayDate("");
    }
  };

  const handleDateSelect = (isoDate: string, displayDate: string) => {
    formik.setFieldValue('date', isoDate);
    setDisplayDate(displayDate);
    setIsTodayChecked(false);
    setShowCalendar(false);
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      formik.setFieldValue('amount', value === '' ? '' : parseInt(value))
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
    <div className="min-h-screen">
      <div className="containers bg-white !pt-4">

        <div className="flex items-center justify-between mb-6">
          <img
            src={goback_arrow}
            alt="Back"
            className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110"
            onClick={() => navigate(`${PATH.customers}/detail/${id}`)}
          />
          <h1 className="text-xl font-semibold text-gray-900">Nasiya yaratish</h1>
          <div className="w-6 h-6"></div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6 pb-12">
          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Mahsulot Nomi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productName"
              placeholder="Mahsulot nomi"
              value={formik.values.productName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {formik.touched.productName && formik.errors.productName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.productName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">
              Mahsulot Narxi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="amount"
              placeholder="Mahsulot narxi"
              value={formik.values.amount}
              onChange={handleAmountChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">Sana <span className="text-red-500">*</span></label>
            <div className="flex gap-4 items-center">
              <div className="w-[75%] relative" ref={calendarRef}>
                <input
                  type="text"
                  name="date"
                  placeholder="Sanani tanlang"
                  value={displayDate}
                  onClick={handleCalendarToggle}
                  readOnly
                  className="w-full outline-none bg-[#F6F6F6] border border-[#ECECEC] placeholder-gray-400 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                />
                <img
                  src={datecalendar}
                  alt=""
                  className="absolute right-3 bottom-4 cursor-pointer"
                  onClick={handleCalendarToggle}
                />
                {showCalendar && (
                  <Calendar
                    onDateSelect={handleDateSelect}
                    selectedDate={displayDate}
                    onClose={() => setShowCalendar(false)}
                  />
                )}
              </div>
              <div className="w-[25%]">
                <label className="flex items-center cursor-pointer text-base">
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={isTodayChecked}
                    onChange={handleTodayCheckbox}
                  />
                  <span className="w-[18px] h-[18px] mr-2 rounded border-2 border-gray-300 peer-checked:border-green-500 relative after:content-[''] after:absolute after:left-[4px] after:top-[0px] after:w-[5px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-green-500 after:rotate-45 after:opacity-0 peer-checked:after:opacity-100"></span>
                  Bugun
                </label>
              </div>
            </div>
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-2">Muddat <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                name="deadline"
                value={formik.values.deadline}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-[#F6F6F6] border border-[#ECECEC] rounded-xl px-4 py-3 text-gray-900 cursor-pointer appearance-none pr-10 outline-none">
                <option value="" hidden>Qarz muddatini tanlang</option>
                <option value="" disabled>Oyni tanlang</option>
                {deadlineMap && Object.entries(deadlineMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {formik.touched.deadline && formik.errors.deadline && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.deadline}</p>
            )}
          </div>

          <div>
            {!showNoticeInput ? (
              <button
                type="button"
                onClick={() => setShowNoticeInput(true)}
                className="w-full bg-white border border-[#ECECEC] rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-blue-600 text-sm font-medium cursor-pointer"
              >
                <IoIosAddCircle className="w-5 h-5" />
                Izoh qo'shish
              </button>
            ) : (
              <div>
                <label className="block text-sm font-medium text-[#000000] mb-2">Eslatma</label>
                <textarea
                  name="comment"
                  placeholder="Izoh yozing"
                  value={formik.values.comment}
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
              type="submit"
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

export default React.memo(DebtCreate)
