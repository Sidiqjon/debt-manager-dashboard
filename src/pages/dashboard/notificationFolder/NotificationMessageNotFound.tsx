import notFoundImg from "../../../assets/images/notFoundImg.svg"
const NotificationMessageNotFound = () => {
  return (
    <div className='flex items-center flex-col justify-center text-center mt-[100px]'>
        <img className='mb-[28px]' src={notFoundImg} alt="Not Found Img" width={160} height={160} />
        <h2 className='!text-[28px] !font-semibold'>Ma’lumot yo‘q</h2>
    </div>
  )
}

export default NotificationMessageNotFound