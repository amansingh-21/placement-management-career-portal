import api from "./api.js";

export const getCompanies = async (
  status = ""
) => {
  const response = await api.get(
    "/admin/companies",
    {
      params: status ? { status } : {},
    }
  );

  return response.data.data.companies;
};

export const updateCompanyApproval = async (
  companyId,
  approvalStatus
) => {
  const response = await api.put(
    `/admin/companies/${companyId}/approval`,
    {
      approvalStatus,
    }
  );

  return response.data.data.company;
};