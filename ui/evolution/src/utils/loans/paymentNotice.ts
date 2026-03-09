import axios from 'axios';

export const handleDownloadPaymentNotice = async (
  loanId: string,
  fullName: string,
  apiUrl: string,
  setLoadingId: any
) => {
  setLoadingId(loanId);
  try {
    const { data } = await axios.get(`${apiUrl}/payment-notice/${loanId}`, { 
      responseType: 'blob' 
    });
    
    const url = URL.createObjectURL(new Blob([data]));
    Object.assign(document.createElement('a'), {
      href: url,
      download: `Payment Notice ${fullName}.pdf`
    }).click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao baixar payment notice:", error);
  } finally {
    setLoadingId(null);
  }
};