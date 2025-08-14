import { useNavigate, useParams } from 'react-router-dom'
import success from '../assets/images/success.svg'
import { Button } from 'antd'

const SuccessModal = () => {
  const {id} = useParams()
    const navigate = useNavigate()
  return (
    <div className='fixed z-[9999] top-0 bottom-0 left-0 right-0 bg-white h-[100vh] flex items-center justify-center'>
        <div className='text-center'>
            <img className='mb-[27px]' src={success} alt="Success img" width={200} height={131} />
            <h2 className='!text-[#3478F7] !mb-[12px] !text-[22px]'>Ajoyib!</h2>
            <p className='!font-medium !text-[16px]'>Muvaffaqiyatli so‘ndirildi</p>
        </div>
        <div className='px-[16px] w-full !max-w-[400px] !absolute !bottom-[16px]'>
            <Button onClick={() => navigate(`/debtor/${id}`)} className="!h-[42px] !font-medium !text-[14px] !w-full" size="large" htmlType="button" type="primary">Ortga</Button>
        </div>
    </div>
  )
}

export default SuccessModal