// Fare calculation: ₹20 for first hour, ₹10 for each additional hour
export const calculateFare = (durationInMinutes: number): number => {
  if (durationInMinutes <= 0) return 0;
  
  const hours = Math.ceil(durationInMinutes / 60);
  
  if (hours === 1) {
    return 20;
  }
  
  return 20 + (hours - 1) * 10;
};

export const formatDuration = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hrs === 0) {
    return `${mins} min`;
  }
  
  return `${hrs}h ${mins}m`;
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};
