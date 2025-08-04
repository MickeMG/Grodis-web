// Firebase configuration - använder miljövariabler
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "grodis-a3cc8.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "grodis-a3cc8",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "grodis-a3cc8.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "924262395417",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:924262395417:web:2eec96d92b82178ee6c488",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-CZCQGNNWQQ"
};

// Initialize Firebase
let app = null;
let analytics = null;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    
    // Log page view
    logEvent(analytics, 'page_view', {
      page_title: 'Grodis Landing Page',
      page_location: window.location.href
    });
    
    console.log('Firebase Analytics initierat');
  } catch (error) {
    console.error('Firebase initieringsfel:', error);
  }
} else {
  console.log('Firebase API-nyckel saknas i miljövariabler');
}

export { app, analytics, logEvent };
export default firebaseConfig;