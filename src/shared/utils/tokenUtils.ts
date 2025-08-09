export const decodeToken = (token: string) => {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch (error) {
    return null
  }
}

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("accessToken")
  if (!token) return null
  
  const decoded = decodeToken(token)
  return decoded?.sub || null
}