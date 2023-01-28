const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
};
export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('default', options).format(Date.parse(date));
};
