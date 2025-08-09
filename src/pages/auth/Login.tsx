import { Link, useNavigate } from "react-router-dom"
import Logo from "../../assets/icons/LOGO.svg"
import { Button, Input } from "antd"
import PasswordIcon from "../../assets/icons/passwordIcon.svg"
import LoginIcon from "../../assets/icons/usernameIcon.svg"
import { useFormik } from "formik"
import { LoginSchema } from "../../validation/Login"
import { useState } from "react"
import { api } from "../../api"
import { useCookies } from "react-cookie"
import toast from "react-hot-toast"
import { PATH } from "../../shared/hooks/Path"
import React from "react"

const Login = () => {
  const [isPending, setPending] = useState(false)
  const [, setCookie] = useCookies(['token'])
  const navigate = useNavigate()
  const { values, errors, handleBlur, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (data) => {
      setPending(true)
      try {
        const response = await api.post("/sellers/login", data)
        if (response.data.statusCode === 200) {
          localStorage.setItem("accessToken", response.data.accessToken)
          setCookie("token", response.data.accessToken, {
            path: "/",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
          })
          toast.success(response.data.message)
          navigate("/")
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Login failed. Please try again.")
        }
      } finally {
        setPending(false)
      }
    }
  })
  return (
    <div className="containers relative !pt-[90px] h-[100vh]">
      <img className="logo-icon mb-[32px] w-[40px] h-[40px]" src={Logo} alt="Logo" />
      <h1 className="!mb-[12px]">Dasturga kirish</h1>
      <p>Iltimos, tizimga kirish uchun username va parolingizni kiriting.</p>
      <form onSubmit={handleSubmit} className="mt-[38px]" autoComplete="off">
        <label>
          <Input
            className={`${errors.username && touched.username ? "!border-red-500 !text-red-500" : ""}`}
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            prefix={<img src={LoginIcon} alt="" />}
            allowClear
            name="username"
            type="text"
            size="large"
            placeholder="Username"
          />
          {errors.username && touched.username && <span className="text-[13px] text-red-500">{errors.username}</span>}
        </label>
        <label>
          <Input.Password
            className={`${errors.password && touched.password ? "!border-red-500 !text-red-500" : ""} mt-[24px]`}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            prefix={<img src={PasswordIcon} alt="" />}
            allowClear
            name="password"
            type="password"
            size="large"
            placeholder="Password"
          />
          {errors.password && touched.password && <span className="text-[13px] text-red-500">{errors.password}</span>}
        </label>
        <Link className="text-[13px] mb-[46px] text-[#3478F7] border-b-[1px] border-[#3478F7] w-[130px] ml-auto block text-end mt-[10px]" to={PATH.forgotPassword}>Parolni unutdingizmi?</Link>
        <Button
          loading={isPending}
          htmlType="submit"
          className={`w-full !h-[45px] !text-[18px] !font-medium" size="large ${isPending ? "cursor-not-allowed" : ""}`}
          type="primary"
        >
          Kirish
        </Button>
      </form>
      <p className="absolute bottom-0 !font-normal !pb-[10px]">Hisobingiz yo'q bo'lsa, tizimga kirish huquqini olish uchun <span className="text-[#3478F7] cursor-pointer">do'kon administratori</span> bilan bog'laning.</p>
    </div>
  )
}
export default React.memo(Login)