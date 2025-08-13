import React, { useState, useEffect } from "react"
import { CiCircleRemove } from "react-icons/ci"
import update from "../assets/icons/update.svg"
import uploadImg from "../assets/icons/uploadImg.svg"
// import { useUploadImages } from "../services/Image"

interface ImageUploadProps {
  initialImages?: string[]
  onImagesChange: (files: File[], previews: string[]) => void
  maxImages?: number
  label: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
    initialImages = [], 
    onImagesChange, 
    maxImages = 10 ,
    label = "Rasm biriktirish"
  }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  // const uploadMutation = useUploadImages()

  useEffect(() => {
    if (initialImages.length > 0) {
      const previews = initialImages.map(img => 
        img.startsWith("http") 
          ? img 
          : `${import.meta.env.VITE_API_BASE_URL}/upload/${img}`
      )
      setImagePreview(previews)
    }
  }, [initialImages])


  useEffect(() => {
    onImagesChange(selectedImages, imagePreview)
  }, [selectedImages, imagePreview, onImagesChange])


  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (imagePreview.length + files.length > maxImages) {
      return
    }

    setSelectedImages(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files || [])
  //   if (imagePreview.length + files.length > maxImages) {
  //     return
  //   }

  //   setSelectedImages(prev => [...prev, ...files])

  //   files.forEach(file => {
  //     const reader = new FileReader()
  //     reader.onload = (e) => {
  //       setImagePreview(prev => [...prev, e.target?.result as string])
  //     }
  //     reader.readAsDataURL(file)
  //   })

  //   uploadMutation.mutate(files, {
  //     onSuccess: (uploaded) => {
  //       const filenames = uploaded.map((u: { filename: string }) => u.filename)
  //       setImagePreview(prev => [...prev, ...filenames])
  //     }
  //   })
  // }

  const replaceImage = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const updatedImages = [...selectedImages]
      if (index >= selectedImages.length) {
        updatedImages.push(file)
      } else {
        updatedImages[index] = file
      }
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
    if (index < selectedImages.length) {
      setSelectedImages(prev => prev.filter((_, i) => i !== index))
    }
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  const canAddMore = imagePreview.length < maxImages

  return (
    <div>
      <label className="block text-sm font-medium text-[#000000] mb-2">{label}</label>
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

        {canAddMore && (
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
        )}
      </div>
    </div>
  )
}

export default ImageUpload