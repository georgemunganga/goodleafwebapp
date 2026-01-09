// hooks/useKYC.ts
import { useApiCall } from './useApiCall';
import KYCService from '@/services/KYCService';
import { KYCData, KYCStatus } from '@/services/KYCService';

export function useKYC() {
  const getStatusCall = useApiCall<KYCStatus>();
  const submitCall = useApiCall<any>();

  const getKYCStatus = async () => {
    return getStatusCall.execute(async () => {
      return await KYCService.getKYCStatus();
    });
  };

  const submitKYC = async (kycData: KYCData) => {
    return submitCall.execute(async () => {
      return await KYCService.submitKYC(kycData);
    });
  };

  return {
    getKYCStatus,
    submitKYC,
    ...getStatusCall,
    ...submitCall
  };
}