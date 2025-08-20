import { useNavigate, useParams } from "react-router-dom";
import BackIcon from "../../assets/icons/goback_arrow.svg";
import React, { useState, useEffect } from "react";
import { useCreateSample, useUpdateSample, useSamples } from "../../services/Samples";
import { PATH } from "../../shared/hooks/Path";

const CreateSample = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  
  const { data: samplesData } = useSamples();
  const createSampleMutation = useCreateSample();
  const updateSampleMutation = useUpdateSample();

  useEffect(() => {
    if (isEditing && samplesData) {
      const sampleToEdit = samplesData.data.samples.find(sample => sample.id === id);
      if (sampleToEdit) {
        setMessage(sampleToEdit.message);
      }
    }
  }, [isEditing, id, samplesData]);

  useEffect(() => {
    setIsValid(message.trim().length > 0);
  }, [message]);

  function handleBack() {
    navigate(`${PATH.reports}/samples`);
  }

  function handleSubmit() {
    if (!isValid) return;

    const trimmedMessage = message.trim();
    
    if (isEditing && id) {
      updateSampleMutation.mutate(
        { id, data: { message: trimmedMessage } },
        {
          onSuccess: () => {
            navigate(`${PATH.reports}/samples`);
          },
        }
      );
    } else {
      createSampleMutation.mutate(
        { message: trimmedMessage },
        {
          onSuccess: () => {
            navigate(`${PATH.reports}/samples`);
          },
        }
      );
    }
  }

  const isLoading = createSampleMutation.isPending || updateSampleMutation.isPending;

  return (
    <div className="containers bg-white min-h-screen">
      <div className="flex fixed z-50 top-0 pt-[30px] w-full bg-white max-w-[375px] items-center border-b-[1px] border-[#ECECEC] justify-between px-3 pb-[11px] mb-[28px]">
        <button className="cursor-pointer" onClick={() => handleBack()}>
          <img src={BackIcon} alt="back" className="w-5 h-5 cursor-pointer transform transition-transform duration-300 hover:scale-110" />
        </button>
        <h2 className="font-semibold !text-[20px]">
          {isEditing ? "Namuna yaratish" : "Namuna yaratish"}
        </h2>
        <div className="w-6 h-6"></div>
      </div>

      <div className="pt-[100px] px-3 pb-[100px]">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Namuna
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Matn yozish..."
            className="w-full h-32 p-3 border bg-[#F6F6F6] border-[#ECECEC] rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {message.length}/500
            </span>
          </div>
        </div>

        <div className="bg-[#F8F8FF] rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-800 mb-2">Namuna ko'rinishi:</h3>
          <div className="bg-white rounded-lg p-3 border">
            <p className="text-sm text-gray-800 mb-2">
              Test uchun boladida, hozir bu yerga yozgani idea ham yoq togrisi
            </p>
            <p className="text-xs text-gray-500">
              Tel: +998 20 001 1010
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className={`fixed bottom-20 left-1/2 cursor-pointer transform -translate-x-1/2 px-6 py-3 rounded-lg font-medium max-w-[360px] w-[calc(100%-24px)] flex items-center justify-center ${
            isValid && !isLoading
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Saqlanmoqda..." : "Yaratish"}
        </button>
      </div>

    </div>
  );
};

export default React.memo(CreateSample);