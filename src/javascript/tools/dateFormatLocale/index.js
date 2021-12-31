const options = { weekday: undefined, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

const dateFormatLocale = (dayjsInstance, preferredLocale) => {
  const jsDate = dayjsInstance.toDate();
  return jsDate.toLocaleString(preferredLocale, options);
};

export default dateFormatLocale;
