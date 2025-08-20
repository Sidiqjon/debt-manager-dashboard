import { useNavigate } from "react-router-dom";
import BackIcon from "../../assets/icons/goback_arrow.svg";
import React, { useState } from "react";
import { useSamples, useDeleteSample, useUpdateSample, type Sample } from "../../services/Samples";
import Loading from "../../components/Loading";
import dots from "../../assets/icons/dots.svg"
import Line from "../../assets/icons/Line.svg"
import { PATH } from "../../shared/hooks/Path";

const Samples = () => {
  const navigate = useNavigate();
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const [editingSample, setEditingSample] = useState<Sample | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const { data: samplesData, isLoading, error } = useSamples();
  const deleteSampleMutation = useDeleteSample();
  const updateSampleMutation = useUpdateSample();

  function handleBack() {
    navigate(`${PATH.reports}`);
  }

  function handleCreateSample() {
    navigate(`${PATH.reports}/samples/create`);
  }

  function handleSampleOptions(sample: Sample, event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    setButtonPosition({
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right
    });
    setSelectedSample(sample);
  }

  function handleEdit() {
    if (selectedSample) {
      setEditMessage(selectedSample.message);
      setEditingSample(selectedSample);
      setShowEditDialog(true);
      setSelectedSample(null);
    }
  }

  function closeEditDialog() {
    setShowEditDialog(false);
    setEditMessage("");
    setEditingSample(null);
  }


  function handleUpdateSample() {
    if (editingSample && editMessage.trim()) {
      updateSampleMutation.mutate(
        { id: editingSample.id, data: { message: editMessage.trim() } },
        {
          onSuccess: () => {
            closeEditDialog();
          },
        }
      );
    }
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    if (selectedSample) {
      deleteSampleMutation.mutate(selectedSample.id);
      setSelectedSample(null);
      setShowDeleteDialog(false);
    }
  }

  function closeOptionsModal() {
    setSelectedSample(null);
  }

  function closeDeleteDialog() {
    setShowDeleteDialog(false);
  }

  function handleToggleVerified(id: string, verified: boolean) {
    updateSampleMutation.mutate({ id, data: { verified } });
  }

  if (isLoading) {
    return (
      <div className="containers">
        <div className="flex fixed z-50 top-0 pt-[30px] w-full bg-white max-w-[400px] items-center border-b-[1px] border-[#ECECEC] justify-between px-3 pb-[11px] mb-[28px]">
          <button className="" onClick={() => handleBack()}>
            <img src={BackIcon} alt="back" className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110" />
          </button>
          <h2 className="font-semibold !text-[20px]">Namunalar</h2>
          <div className="w-6 h-6"></div>
        </div>
        <div className="pt-[400px] px-3 flex justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="containers">
        <div className="flex fixed z-50 top-0 pt-[30px] w-full bg-white max-w-[400px] items-center border-b-[1px] border-[#ECECEC] justify-between px-3 pb-[11px] mb-[28px]">
          <button className="" onClick={() => handleBack()}>
            <img src={BackIcon} alt="back" className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110" />
          </button>
          <h2 className="font-semibold !text-[20px]">Namunalar</h2>
          <div className="w-6 h-6"></div>
        </div>
        <div className="pt-[100px] px-3 flex justify-center">
          <div className="text-center text-red-500">Xatolik yuz berdi</div>
        </div>
      </div>
    );
  }

  const samples = samplesData?.data?.samples || [];

  return (
    <div className="containers">
      <div className="flex fixed z-50 top-0 pt-[30px] w-full bg-white max-w-[400px] items-center border-b-[1px] border-[#ECECEC] justify-between px-3 pb-[11px] mb-[28px]">
        <button className="" onClick={() => handleBack()}>
          <img src={BackIcon} alt="back" className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110" />
        </button>
        <h2 className="font-semibold !text-[20px]">Namunalar</h2>
        <div className="w-6 h-6"></div>
      </div>

      <div className="pt-[100px] bg-white min-h-screen min-w-[400px] px-3 pb-[100px]">
        {samples.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Hozircha namunalar yo'q</p>
            <p className="text-sm text-gray-400 mb-6">"Qo'shish" tugmasi orqali namuna yarating</p>
          </div>
        ) : (
          <div className="space-y-3">
            {samples.map((sample) => (
              <div key={sample.id} className="bg-[#F5F5F5] rounded-[16px] p-4 relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">

                    <div className="flex items-center space-x-2 mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVerified(sample.id, !sample.verified);
                        }}
                        className={`cursor-pointer relative inline-flex h-4 w-[32px] items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                          sample.verified ? 'bg-[#735CD8]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-[10px] w-[10px] transform rounded-full bg-white transition duration-200 ease-in-out ${
                            sample.verified ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>                   
                    <p className="text-gray-800 text-sm leading-relaxed">{sample.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Tel: +998 20 001 1010
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleSampleOptions(sample, e)}
                    className="ml-3 p-1"
                  >
                    <img src={dots} alt="" className="cursor-pointer w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleCreateSample}
          className="fixed bottom-20 cursor-pointer left-1/2 !ml-4 transform -translate-x-1/2 bg-[#3478F7] text-white px-6 py-3 rounded-lg font-medium max-w-[360px] w-[calc(100%-24px)] flex items-center justify-center space-x-2"
        >
          <span className="text-xl">+</span>
          <span>Qo'shish</span>
        </button>
      </div>

      {selectedSample && (
        <div className="fixed inset-0 z-50" onClick={closeOptionsModal}>
          <div 
            className="absolute overflow-hidden bg-white border border-gray-200 rounded-[16px] shadow-lg py-2 w-34" 
            style={{
              top: `${buttonPosition.top}px`,
              right: `${buttonPosition.right}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                closeOptionsModal();
                handleEdit();
              }}
              className="cursor-pointer w-full px-4 py-2 text-left text-md hover:bg-gray-100"
            >
              Tahrirlash
            </button>
            <div className="px-4">
              <img src={Line} alt="" />
            </div>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-md text-[#F94D4D] hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              O'chirish
            </button>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div onClick={closeDeleteDialog} className="fixed inset-0 z-50 flex !pl-[30px] items-center justify-center bg-black/50">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-lg max-w-[350px] w-full p-6">
            <h2 className="text-lg font-semibold text-black mb-2">Namunani o'chirish</h2>
            <p className="text-gray-600 mb-6">
              Haqiqatan ham bu namunani o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 rounded-lg bg-[#ECECEC] hover:bg-gray-300 text-black cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteSampleMutation.isPending}
                className="px-4 py-2 rounded-lg bg-[#F94D4D] hover:bg-red-600 text-white disabled:opacity-50 cursor-pointer"
              >
                {deleteSampleMutation.isPending ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}


      {showEditDialog && (
        <div onClick={closeEditDialog} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-lg !ml-[30px] max-w-[350px] w-full p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Namunani tahrirlash</h2>
            <textarea
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4"
              placeholder="Namuna matnini kiriting..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeEditDialog}
                className="px-4 py-2 rounded-lg bg-[#ECECEC] hover:bg-gray-300 text-black cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleUpdateSample}
                disabled={!editMessage.trim() || updateSampleMutation.isPending}
                className="px-4 py-2 rounded-lg bg-[#3478F7] hover:bg-blue-600 text-white disabled:opacity-50 cursor-pointer"
              >
                {updateSampleMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default React.memo(Samples);