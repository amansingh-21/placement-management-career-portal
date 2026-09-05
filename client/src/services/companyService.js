import api from "./api.js";

export const createCompany = async (companyData) => {
  const response = await api.post(
    "/company/",
    companyData
  );

  return response.data.data.company;
};

export const getMyCompany = async () => {
  const response = await api.get(
    "/company/me"
  );

  return response.data.data.company;
};

export const updateMyCompany = async (companyData) => {
  const response = await api.put(
    "/company/me",
    companyData
  );

  return response.data.data.company;
};