// API-konfiguration för Grodis
const config = {
  // Lokal utveckling
  development: {
    apiUrl: 'http://localhost:3001'
  },
  // Produktion (Firebase Functions)
  production: {
    apiUrl: 'https://us-central1-grodis-a3cc8.cloudfunctions.net' // Firebase Functions URL
  }
};

// Välj rätt konfiguration baserat på miljö
const environment = process.env.NODE_ENV || 'development';
const currentConfig = config[environment];

export const API_BASE_URL = currentConfig.apiUrl;

// Fallback till lokal API om produktion inte är konfigurerad ännu
export const getApiUrl = () => {
  if (environment === 'production' && !currentConfig.apiUrl.includes('cloudfunctions.net')) {
    return config.development.apiUrl;
  }
  return currentConfig.apiUrl;
}; 