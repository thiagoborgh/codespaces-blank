import apiService from './api';

export const attendanceService = {
  async getAttendanceData(consultationId: string) {
    const response = await (apiService as any).api.get(`/attendance/${consultationId}`);
    return response.data.data;
  },

  async updateSOAP(consultationId: string, soapSection: string, soapData: any) {
    const response = await (apiService as any).api.post(`/attendance/${consultationId}/update_soap`, {
      soap_section: soapSection,
      soap_data: soapData
    });
    return response.data;
  },

  async finalizeAttendance(consultationId: string, finalizationData: any) {
    const response = await (apiService as any).api.post(`/attendance/${consultationId}/finalize`, {
      finalization_data: finalizationData
    });
    return response.data;
  }
};
