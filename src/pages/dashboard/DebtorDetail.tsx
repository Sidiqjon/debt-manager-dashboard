import { useState, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDebtor, type Debt, type PaymentSchedule } from "../../services/Debtor";
import { PATH } from "../../shared/hooks/Path";
import Loading from "../../components/Loading";
import goback_arrow from "../../assets/icons/goback_arrow.svg"
import dots from "../../assets/icons/dots.svg"
import Line from "../../assets/icons/Line.svg"
import { IoIosAddCircle } from "react-icons/io";
import { toast } from 'react-hot-toast';
const DebtorDetail: React.FC = () => {

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [showModal, setShowModal] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const { data, isLoading } = useDebtor().getDebtor(id!);

  const { mutate: deleteDebtorMutation, isPending: isDeleting } = useDebtor().deleteDebtor();

  const handleDeleteDebtor = () => {
    if (!id) {
      toast.error("Mijoz ID topilmadi!");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    const loadingToast = toast.loading("Mijoz o'chirilmoqda...");
    deleteDebtorMutation(id!, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        toast.success("Mijoz muvaffaqiyatli o'chirildi!", { duration: 4000 });
        setConfirmOpen(false);
        setShowModal(false);
        navigate(PATH.customers);
      },
      onError: (error) => {
        toast.dismiss(loadingToast);
        console.error("Deletion failed:", error);
        toast.error("Mijozni o'chirishda xatolik yuz berdi!", { duration: 4000 });
      }
    });
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const container = document.querySelector('.containers');
    if (container) {
      container.scrollTo(0, 0);
      container.scrollTop = 0;
    }
  }, [id]);

  useLayoutEffect(() => {
    if (!isLoading && data) {
      window.scrollTo(0, 0);
      const container = document.querySelector('.containers');
      if (container) {
        container.scrollTo(0, 0);
      }
    }
  }, [isLoading, data]);

  const calculateTotalDebt = (): number => {
    if (!data?.data.debts) return 0;
    return data.data.debts.reduce((total: number, debt: Debt) => {
      return total + parseInt(debt.amount);
    }, 0);
  };

  const getTotalRemainingDebt = (): number => {
    return parseInt(data?.data.remainingDebtBalance || "0");
  };

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-US").replace(/,/g, " ");
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = [
      "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
      "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  };

  const getNextPayment = (debt: Debt): PaymentSchedule | null => {
    if (!debt.paymentSchedules) return null;
    const unpaidSchedules = debt.paymentSchedules.filter(
      (schedule: PaymentSchedule) => !schedule.isPaid
    );
    if (unpaidSchedules.length === 0) return null;

    const nextPayment = unpaidSchedules.reduce(
      (earliest: PaymentSchedule, current: PaymentSchedule) => {
        return new Date(current.dueDate) < new Date(earliest.dueDate)
          ? current
          : earliest;
      }
    );

    return nextPayment;
  };

  const calculateProgress = (debt: Debt): number => {
    const totalAmount = parseInt(debt.amount);
    if (totalAmount === 0) return 100;

    if (!debt.paymentSchedules) return 0;

    const paidAmount = debt.paymentSchedules.reduce(
      (total: number, schedule: PaymentSchedule) => {
        return total + (schedule.isPaid ? parseInt(schedule.paidAmount || "0") : 0);
      },
      0
    );

    return (paidAmount / totalAmount) * 100;
  };

  const getRemainingAmount = (debt: Debt): number => {
    const totalAmount = parseInt(debt.amount);
    if (!debt.paymentSchedules) return totalAmount;

    const paidAmount = debt.paymentSchedules.reduce(
      (total: number, schedule: PaymentSchedule) => {
        return total + (schedule.isPaid ? parseInt(schedule.paidAmount || "0") : 0);
      },
      0
    );

    return totalAmount - paidAmount;
  };

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Mijoz topilmadi!</div>
      </div>
    );
  }

  const debtor = data.data;

  return (
    <div className="containers bg-white min-h-screen !pt-4">

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-9">
          <button onClick={() => navigate(PATH.customers)}>
            <img src={goback_arrow} alt="back" className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110" />
          </button>
          <h1 className="text-[22px] capitalize font-semibold text-black">{debtor.fullName}</h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowModal(!showModal)}
            className="w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            <img src={dots} alt="menu" className="w-5 h-5" />
          </button>
          {showModal && (
            <div className="absolute right-0 top-8 overflow-hidden bg-white border border-gray-200 rounded-[16px] shadow-lg py-2 w-34 z-50">
              <button 
                onClick={() => {
                  setShowModal(false)
                  navigate(`${PATH.customers}/update/${id}`)
                }}
                className="cursor-pointer w-full px-4 py-2 text-left text-md hover:bg-gray-100"
              >
                Tahrirlash
              </button>
              <div className="px-4" ><img src={Line} alt="" /></div>
              <button
                onClick={handleDeleteDebtor}
                disabled={isDeleting}
                className="w-full px-4 py-2 text-left text-md text-[#F94D4D] hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'O\'chirilmoqda...' : 'O\'chirish'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#BBD2FC] rounded-[20px] p-6 mb-6">
        <div>
          <p className="text-sm text-[#000000] mb-2">Umumiy nasiya:</p>
          <p className="text-3xl font-bold text-black">
            {formatAmount(calculateTotalDebt())} <span className="text-lg">so'm</span>
          </p>
          <p className="text-[12px] text-gray-600 mt-2">Qolgan qarz:</p>
          <p className="text-2xl font-bold text-red-500">
            {formatAmount(getTotalRemainingDebt())} <span className="text-lg">so'm</span>
          </p>
        </div>
      </div>

      <div className="">
        <h2 className="text-xl font-semibold mb-4 text-black">Faol nasiyalar</h2>

        {debtor.debts.filter((debt: Debt) => parseInt(debt.amount) > 0).length === 0 ? (
          <div className="text-center py-20">
            <p className="text-black font-semibold text-lg mb-2">
              Mijozda hali nasiya mavjud emas
            </p>
            <div className="px-12">
              <p className="text-gray-500 text-sm">
                Nasiya yaratish uchun pastdagi "+" tugmasini bosing
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {debtor.debts
              .filter((debt: Debt) => parseInt(debt.amount) > 0)
              .map((debt: Debt) => {
                const nextPayment = getNextPayment(debt);
                const progress = calculateProgress(debt);
                const remainingAmount = getRemainingAmount(debt);

                return (
                  <div
                    onClick={() => navigate(`${PATH.customers}/debt-detail/${debt.id}`)}
                    key={debt.id}
                    className="bg-[#F6F6F6] border border-gray-100 rounded-2xl p-4 shadow-sm hover:transition-transform hover:scale-102 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-[8px]">
                      <span className="text-md text-[#000000]">{formatDate(debt.date)}</span>
                      <span className="text-lg font-semibold text-[#3478F7]">
                        {formatAmount(parseInt(debt.amount))} so'm
                      </span>
                    </div>

                    <h3 className="font-semibold mb-2 text-black">{debt.productName}</h3>

                    {nextPayment && (
                      <div className="mb-4">
                        <p className="text-[14px] text-[#000000] mb-1">
                          Keyingi to'lov: {formatDate(nextPayment.dueDate)}
                        </p>
                        <p className="text-[13px] text-[#000000]">
                          <span className="text-lg font-semibold text-[#735CD8]" >{formatAmount(parseInt(nextPayment.amount))} </span> so'm
                        </p>
                      </div>
                    )}

                    <div className="w-full bg-[#CCCCCC] rounded-full h-2 mb-2">
                      <div
                        className="bg-[#30AF49] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[15px] text-[#000000]">
                        To'landi: <span className="text-[#30AF49] font-semibold" >{formatAmount(parseInt(debt.amount) - remainingAmount)}</span> <span className="text-[#000000] text-[13px]" >so'm</span>
                      </span>
                      <span className="text-gray-600">{Math.round(progress)}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        <div className="sticky bottom-1 z-10 mt-5">
          <div className="flex justify-end">
            <button
              onClick={() => navigate(`${PATH.customers}/debt-create/${debtor.id}`)}
              className="bg-[#3478F7] hover:bg-[#0951d8ce] shadow-[0px_2px_4px_0px_#3478F74D] transition-all duration-300 ease-in-out transform hover:scale-102 text-white rounded-[10px] px-6 py-3 flex items-center space-x-2 font-medium cursor-pointer">
              <IoIosAddCircle className="w-6 h-6" />
              <span>Qo'shish</span>
            </button>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div onClick={() => setConfirmOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-lg max-w-[350px] w-full p-6">
            <h2 className="text-lg font-semibold text-black mb-2">Mijozni o'chirish</h2>
            <p className="text-gray-600 mb-6">
              Haqiqatan ham bu mijozni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#ECECEC] hover:bg-gray-300 text-black cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-[#F94D4D] hover:bg-red-600 text-white disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}


      {showModal && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowModal(false)}
        ></div>
      )}
    </div>
  );
};

export default DebtorDetail;