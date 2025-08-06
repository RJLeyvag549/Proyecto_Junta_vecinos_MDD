import api from "../../services/root.service.js";

export const useEditFunding = (fetchFundings) => {
  const editFunding = async (id, form) => {
    try {
      const response = await api.put(`/funding/update/${id}`, form);
      await fetchFundings();
      return response.data;
    } catch (error) {
      console.error('Error en useEditFunding:', error);
      throw error;
    }
  };
  return { editFunding };
};

export default useEditFunding;