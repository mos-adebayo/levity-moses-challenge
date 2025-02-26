export const deliverNotification = (message: string) => {
  // mocked function for sending email or SMS
  return new Promise((resolve) => setTimeout(() => resolve(`Notification sent: ${message}`), 100));
};
