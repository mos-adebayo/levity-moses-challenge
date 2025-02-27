export const deliverNotification = (message: string): Promise<string> => {
  // mocked function for sending email or SMS
  return new Promise((resolve) => setTimeout(() => resolve(message), 20));
};
