import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { useDebtor } from "../../services/Debtor"
import { useUploadImages } from "../../services/Image"
import { CreateDebtorSchema } from "../../validation/Debtor"
import { PATH } from "../../shared/hooks/Path"
import goback_arrow from "../../assets/icons/goback_arrow.svg"

const CreateDebtor = () => {
  const navigate = useNavigate()
  const [phoneNumbers, setPhoneNumbers] = useState([""]) 
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])

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
              imageFilenames = data.filenames || []
              submitDebtor(values, imageFilenames)
            },
            onError: () => {
              toast.error("Rasmlarni yuklashda xatolik")
            }
          })
        } else {
          submitDebtor(values, imageFilenames)
        }
      } catch (error) {
        toast.error("Xatolik yuz berdi")
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
        navigate(`${PATH.customers}/${data.data.id}`)
      },
      onError: () => {
        toast.error("Mijozni yaratishda xatolik")
      }
    })
  }

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""])
  }

  const updatePhoneNumber = (index: number, value: string) => {
    const updated = [...phoneNumbers]
    updated[index] = value
    setPhoneNumbers(updated)
    formik.setFieldValue("phoneNumbers", updated)
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

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Ismi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Ismini kiriting"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none"
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Telefon raqami <span className="text-red-500">*</span>
            </label>
            {phoneNumbers.map((phone, index) => (
              <input
                key={index}
                type="text"
                placeholder="Telefon raqami"
                value={phone}
                onChange={(e) => updatePhoneNumber(index, e.target.value)}
                className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none mb-3"
              />
            ))}
            <button
              type="button"
              onClick={addPhoneNumber}
              className="text-blue-600 text-sm font-medium"
            >
              + Ko'proq qo'shish
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Yashash manzili</label>
            <input
              type="text"
              name="address"
              placeholder="Yashash manzilini kiriting"
              value={formik.values.address}
              onChange={formik.handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Eslatma</label>
            <input
              type="text"
              name="notice"
              placeholder="Affiristlarga qoldi kunim"
              value={formik.values.notice}
              onChange={formik.handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rasm biriktirish</label>
            <div className="grid grid-cols-2 gap-4">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    O'zgartitrish
                  </div>
                </div>
              ))}
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer text-center">
                  <div className="w-8 h-8 mx-auto mb-2">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 26.6667V5.33333C4 4.59695 4.29467 3.89057 4.82278 3.36556C5.35089 2.84056 6.06261 2.66667 6.8 2.66667H25.2C25.9374 2.66667 26.6491 3.01905 27.1772 3.54406C27.7053 4.06906 28 4.77543 28 5.51181V26.4882C28 27.2246 27.7053 27.9309 27.1772 28.4559C26.6491 28.981 25.9374 29.3333 25.2 29.3333H6.8C6.06261 29.3333 5.35089 29.1594 4.82278 28.6344C4.29467 28.1094 4 27.4031 4 26.6667Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.6667 13.3333C11.7713 13.3333 12.6667 12.438 12.6667 11.3333C12.6667 10.2287 11.7713 9.33333 10.6667 9.33333C9.56203 9.33333 8.66669 10.2287 8.66669 11.3333C8.66669 12.438 9.56203 13.3333 10.6667 13.3333Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M28 21.3334L21.3333 14.6667L6.8 29.3334" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Rasm qo'shish</p>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
        <div className="containers">
        <button
        type="button"
        onClick={() => formik.handleSubmit()}
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium disabled:opacity-50"
        >
        {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </button>

        </div>
      </div>
    </div>
  )
}

export default CreateDebtor