import axios from 'axios';

export const handleDownloadContract = async (
  loanId: string,
  fullName: string,
  apiUrl: string,
  setLoadingId: any
) => {
  setLoadingId(loanId);
  try {
    const { data } = await axios.get(`${apiUrl}/pdfBuilder/${loanId}`, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([data]));
    Object.assign(document.createElement('a'), {
      href: url,
      download: `Contrato de Financiamento ${fullName}.pdf`
    }).click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao baixar contrato:", error);
  } finally {
    setLoadingId(null);
  }
};
