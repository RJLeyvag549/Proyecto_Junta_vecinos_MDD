import api from "../../services/root.service.js";

export const useCreateFunding = (fetchFundings) => {
  const createFunding = async (formData) => {
    await api.post("/funding/create", formData);
    fetchFundings();
  };
  return { createFunding };
};

export default useCreateFunding;