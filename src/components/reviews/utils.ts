export const formatedDate = (serverDate: string): string => {
  const date = new Date(serverDate);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long'
  });
};
