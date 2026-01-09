import { repaymentAPI } from "@/lib/api";
import { BankDetails, Repayment } from "@/types";

class RepaymentService {
  async getRepayments(): Promise<Repayment[]> {
    try {
      const response = await repaymentAPI.getRepayments();
      return response.data;
    } catch (error) {
      console.error("Get repayments error:", error);
      throw error;
    }
  }

  async getBankDetails(): Promise<BankDetails> {
    try {
      const response = await repaymentAPI.getBankDetails();
      return response.data;
    } catch (error) {
      console.error("Get bank details error:", error);
      throw error;
    }
  }
}

export default new RepaymentService();
