import { invoke } from "@tauri-apps/api/core";

// Invoke Tauri commands (React -> Tauri -> Rust -> SQLite)
export const getBeneficiaries = async () => {
  try {
    return await invoke("list_beneficiaries");
  } catch (error) {
    console.error("Failed to fetch beneficiaries:", error);
    throw error;
  }
};

export const createBeneficiary = async (beneficiaryData) => {
  try {
    return await invoke("create_beneficiary", { data: beneficiaryData });
  } catch (error) {
    console.error("Failed to create beneficiary:", error);
    throw error;
  }
};

export const updateBeneficiary = async (id, beneficiaryData) => {
  try {
    return await invoke("update_beneficiary", { id, data: beneficiaryData });
  } catch (error) {
    console.error("Failed to update beneficiary:", error);
    throw error;
  }
};

export const deleteBeneficiary = async (id) => {
  try {
    return await invoke("delete_beneficiary", { id });
  } catch (error) {
    console.error("Failed to delete beneficiary:", error);
    throw error;
  }
};