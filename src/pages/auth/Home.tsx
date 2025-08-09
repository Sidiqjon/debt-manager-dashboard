import { useNavigate } from "react-router-dom"
import { PATH } from "../../shared/hooks/Path"
import { useEffect } from "react"
import React from "react"

const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(PATH.login)
  }, [])
  return ""
}

export default React.memo(Home)