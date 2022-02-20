import {
  format as formatDateFns,
  formatISO as formatISODateFns,
  parseISO as parseISODateFns,
  isEqual as isEqualDateFns,
  compareAsc as compareAscDateFns,
} from 'date-fns';

export const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatNumber = (amount: number | null | undefined, _separator: string | null | undefined = ',', _commaSeparator: string | null | undefined = '.'): string => {
  let newAmount = amount;
  if (newAmount === undefined || newAmount === null) newAmount = 0;
  let formatedNumber = numberFormatter.format(newAmount);
  if (_separator !== undefined && _separator !== null) {
    formatedNumber = formatedNumber.replace(/,/g, _separator);
  }
  if (_commaSeparator !== undefined && _commaSeparator !== null) {
    formatedNumber = formatedNumber.replace(/./g, _commaSeparator);
  }
  return formatedNumber;
};

export const isValidDate = (date: any): boolean => {
  if (date === undefined || date === null) return false;
  return (Object.prototype.toString.call(date) === '[object Date]' && !Number.isNaN(date));
};

export const isIsoDate = (date: any): boolean => {
  if (isValidDate(date)) return false;
  const regex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/g;
  return regex.test(date);
};

export const parseDate = (date: any): Date => {
  let newDate = date;
  if (isIsoDate(newDate)) {
    // For iso date
    newDate = parseISODateFns(newDate);
  } else if (!Number.isNaN(newDate)) {
    // For timestamp date
    newDate = new Date(newDate * 1000);
  }
  if (!isValidDate(date)) {
    // Default return date if date is not valid
    newDate = new Date();
  }
  return date;
};

export const formatDate = (date: any, format: string): string => formatDateFns(parseDate(date), format);

export {
  formatDateFns,
  formatISODateFns,
  parseISODateFns,
  isEqualDateFns,
  compareAscDateFns,
};

export default {
  numberFormatter,
  formatNumber,
  isValidDate,
  isIsoDate,
  parseDate,
  formatDate,
  formatDateFns,
  formatISODateFns,
  parseISODateFns,
  isEqualDateFns,
  compareAscDateFns,
};
