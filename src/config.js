// API-konfiguration för Grodis
const config = {
  // Lokal utveckling
  development: {
    apiUrl: 'http://localhost:3001'
  },
  // Produktion (Statiska JSON-filer)
  production: {
    apiUrl: 'https://www.grodis.app' // GitHub Pages URL
  }
};

// Välj rätt konfiguration baserat på miljö
const environment = process.env.NODE_ENV || 'development';
const currentConfig = config[environment];

export const API_BASE_URL = currentConfig.apiUrl;

// Fallback till lokal API om produktion inte är konfigurerad ännu
export const getApiUrl = () => {
  if (environment === 'production' && !currentConfig.apiUrl.includes('grodis.app')) {
    return config.development.apiUrl;
  }
  return currentConfig.apiUrl;
}; 