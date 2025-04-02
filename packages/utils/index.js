function formatDateAndTimeToString(date) {
  const dateObject = new Date(date * 1000);
  return dateObject.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
};

function daysLeftToDate(date) {
  const dateObject = new Date(date * 1000);
  const daysLeft = Math.ceil((dateObject.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return daysLeft;
};

export { formatDateAndTimeToString, daysLeftToDate };