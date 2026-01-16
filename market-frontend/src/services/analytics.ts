import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '';

export const initGA = () => {
  if (!MEASUREMENT_ID) {
    console.warn('Google Analytics: Brak Measurement ID w .env');
    return;
  }

  if (!(window as any).ga_initialized) {
    ReactGA.initialize(MEASUREMENT_ID);
    (window as any).ga_initialized = true;
  }
};

export const logPageView = () => {
  if (!MEASUREMENT_ID) return;
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

export const logEvent = (category: string, action: string, label?: string) => {
  if (!MEASUREMENT_ID) return;
  ReactGA.event({
    category,
    action,
    label,
  });
};
