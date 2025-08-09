import { useState } from "react"
import { Button, Input } from "antd"
import { useNavigate } from "react-router-dom"
import { api } from "../../api"
import toast from "react-hot-toast"
import Logo from "../../assets/icons/LOGO.svg"
import React from "react"

const ForgotPassword = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Email kiritish majburiy")
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post("/sellers/request-password-reset", { email })
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        setStep('otp')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) {
      toast.error("OTP kodni kiriting")
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post("/sellers/verify-otp", { email, otp })
      if (response.data === true) {
        toast.success("OTP tasdiqlandi")
        setStep('password')
      } else {
        toast.error("Noto'g'ri OTP kod")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "OTP tasdiqlanmadi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    try {
      const response = await api.post("/sellers/request-password-reset", { email })
      if (response.data.statusCode === 200) {
        toast.success("OTP qayta yuborildi")
        setOtp('')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      toast.error("Barcha maydonlarni to'ldiring")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Parollar mos emas")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post("/sellers/reset-password", { 
        email, 
        newPassword 
      })
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        navigate("/login")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Parol o'zgartirilmadi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="containers relative !pt-[90px] h-[100vh]">
      <img className="logo-icon mb-[32px] w-[40px] h-[40px]" src={Logo} alt="Logo" />
      
      {step === 'email' && (
        <>
          <h1 className="!mb-[12px]">Parolni tiklash</h1>
          <p>Parolni tiklash uchun email manzilingizni kiriting.</p>
          <form onSubmit={handleEmailSubmit} className="mt-[38px]">
            <Input
              type="email"
              size="large"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              loading={isLoading}
              htmlType="submit"
              className="w-full !h-[45px] !text-[18px] !font-medium mb-[25px] mt-[25px]"
              type="primary"
            >
              OTP yuborish
            </Button>
            <Button
              type="link"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Loginqa qaytish
            </Button>
          </form>
        </>
      )}

      {step === 'otp' && (
        <>
          <h1 className="!mb-[12px]">OTP tasdiqlash</h1>
          <p>Emailingizga yuborilgan 6 raqamli kodni kiriting.</p>
          <form onSubmit={handleOtpSubmit} className="mt-[38px]">
            <Input
              size="large"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
            <Button
              loading={isLoading}
              htmlType="submit"
              className="w-full !h-[45px] !text-[18px] !font-medium mb-[25px] mt-[25px]"
              type="primary"
            >
              Tasdiqlash
            </Button>
            <Button
              type="link"
              className="w-full mb-[16px]"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              OTP qayta yuborish
            </Button>
            <Button
              type="link"
              className="w-full"
              onClick={() => setStep('email')}
            >
              Orqaga qaytish
            </Button>
          </form>
        </>
      )}

      {step === 'password' && (
        <>
          <h1 className="!mb-[12px]">Yangi parol</h1>
          <p>Yangi parolingizni kiriting.</p>
          <form onSubmit={handlePasswordSubmit} className="mt-[38px]">
            <Input.Password
              size="large"
              placeholder="Yangi parol"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-[24px]"
            />
            <Input.Password
              size="large"
              placeholder="Parolni tasdiqlang"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-[24px]"
            />
            <Button
              loading={isLoading}
              htmlType="submit"
              className="w-full !h-[45px] !text-[18px] !font-medium mb-[16px]"
              type="primary"
            >
              Parolni o'zgartirish
            </Button>
            <Button
              type="link"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Loginqa qaytish
            </Button>
          </form>
        </>
      )}
    </div>
  )
}

export default React.memo(ForgotPassword)