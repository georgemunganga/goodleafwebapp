// services/KYCService.ts
import { kycAPI } from '@/lib/api';

export interface KYCStatus {
  status: 'pending' | 'verified' | 'rejected';
  message: string;
  steps: Array<{
    step: string;
    status: 'completed' | 'pending' | 'rejected';
  }>;
}

export interface KYCData {
  nationalId: string;
  idType: string;
  salary: string;
  guarantor1Name: string;
  guarantor1Phone: string;
  guarantor2Name: string;
  guarantor2Phone: string;
  documents: string[];
}

class KYCService {
  async getKYCStatus(): Promise<KYCStatus> {
    try {
      const response = await kycAPI.getKYCStatus();
      return response.data;
    } catch (error) {
      console.error('Get KYC status error:', error);
      throw error;
    }
  }

  async submitKYC(kycData: KYCData): Promise<any> {
    try {
      const response = await kycAPI.submitKYC(kycData);
      return response.data;
    } catch (error) {
      console.error('Submit KYC error:', error);
      throw error;
    }
  }
}

export default new KYCService();