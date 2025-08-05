import { useState, useCallback } from "react";
import api from "../../services/root.service.js";

export const useGetFundings = () => {
  const [fundings, setFundings] = useState([]);

  const fetchFundings = useCallback(async () => {
    try {
      const res = await api.get("/funding/get");
      setFundings(res.data.data);
    } catch (error) {
      console.error("Error fetching fundings:", error);
    }
  }, []);

  return { fundings, setFundings, fetchFundings };
};

export default useGetFundings;