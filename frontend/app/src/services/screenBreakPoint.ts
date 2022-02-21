import { ref } from 'vue';

export const screensSize = {
  all: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const screenBreakpoints = {
  all: ((val: number): boolean => (screensSize.all <= val)),
  sm: ((val: number): boolean => (screensSize.sm <= val)),
  md: ((val: number): boolean => (screensSize.md <= val)),
  lg: ((val: number): boolean => (screensSize.lg <= val)),
  xl: ((val: number): boolean => (screensSize.xl <= val)),
  '2xl': ((val: number): boolean => (screensSize['2xl'] <= val)),
};

export const getBreakpoint = (w: number): string => {
  if (screenBreakpoints['2xl'](w)) return '2xl';
  if (screenBreakpoints.xl(w)) return 'xl';
  if (screenBreakpoints.lg(w)) return 'lg';
  if (screenBreakpoints.md(w)) return 'md';
  if (screenBreakpoints.sm(w)) return 'sm';
  return 'all';
};

const debounce = (func: ((...args: any) => void), wait: number) => {
  let timeout: number | undefined;
  return (...args: any) => {
    const later = () => {
      timeout = undefined;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const screenInfo = ref({
  w: window.innerWidth,
  h: window.innerHeight,
  breakpoint: getBreakpoint(window.innerWidth),
  is: ((...breakpoints: string[]) => (breakpoints.includes(screenInfo.value.breakpoint))),
});

window.addEventListener(
  'resize',
  debounce(() => {
    screenInfo.value.w = window.innerWidth;
    screenInfo.value.h = window.innerHeight;
    screenInfo.value.breakpoint = getBreakpoint(window.innerWidth);
  }, 200),
  false,
);

export default {
  screenInfo,
};
