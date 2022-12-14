import {
  format as formatDateFns,
  formatISO as formatISODateFns,
  parseISO as parseISODateFns,
  isEqual as isEqualDateFns,
  compareAsc as compareAscDateFns,
  formatDistance as formatDistanceDateFns,
} from 'date-fns';

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
  if (isValidDate(newDate)) {
    return newDate;
  }
  if (isIsoDate(newDate)) {
    // For iso date
    newDate = parseISODateFns(newDate);
  } else if (!Number.isNaN(newDate)) {
    // For timestamp date
    newDate = new Date(newDate * 1000);
  }
  if (!isValidDate(newDate)) {
    // Default return date if date is not valid
    newDate = new Date();
  }
  return newDate;
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
  isValidDate,
  isIsoDate,
  parseDate,
  formatDate,
  formatDateFns,
  formatISODateFns,
  parseISODateFns,
  isEqualDateFns,
  compareAscDateFns,
  formatDistanceDateFns,
};
