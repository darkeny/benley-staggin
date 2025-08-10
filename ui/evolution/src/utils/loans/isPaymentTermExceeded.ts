export const isPaymentTermExceeded = (createdAt: string | Date): boolean => {
    const loanCreatedAt = new Date(createdAt);
    const currentDate = new Date();
    const diffInTime = currentDate.getTime() - loanCreatedAt.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
  
    return diffInDays < 30;
  };
  