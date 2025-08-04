// Cookie Manager för Grodis App
// Hanterar användarinformation utan inloggning

const COOKIE_PREFIX = 'grodis_';
const COOKIE_EXPIRY_DAYS = 365; // 1 år

// Hjälpfunktioner för cookies
function setCookie(name, value, days = COOKIE_EXPIRY_DAYS) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${COOKIE_PREFIX}${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const nameEQ = `${COOKIE_PREFIX}${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
      } catch (e) {
        console.warn('Kunde inte parsa cookie:', name, e);
        return null;
      }
    }
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${COOKIE_PREFIX}${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Användardata struktur
const defaultUserData = {
  names: [''],
  genders: ['kvinna'],
  favorites: [],
  readStories: [],
  lastReadStory: null,
  participantCount: 1,
  preferences: {
    autoSave: true,
    showFavorites: true,
    showReadStories: true
  }
};

// Huvudklass för användardata
class UserDataManager {
  constructor() {
    this.userData = this.loadUserData();
  }

  // Ladda användardata från cookies
  loadUserData() {
    const savedData = getCookie('user_data');
    if (savedData) {
      // Merge med default data för att hantera nya fält
      return { ...defaultUserData, ...savedData };
    }
    return { ...defaultUserData };
  }

  // Spara användardata till cookies
  saveUserData() {
    setCookie('user_data', this.userData);
  }

  // Uppdatera och spara data
  updateUserData(newData) {
    this.userData = { ...this.userData, ...newData };
    this.saveUserData();
  }

  // Hantera namn och kön
  updateNamesAndGenders(names, genders) {
    this.userData.names = names;
    this.userData.genders = genders;
    this.userData.participantCount = names.length;
    this.saveUserData();
  }

  // Hantera favoriter
  toggleFavorite(storyId) {
    const index = this.userData.favorites.indexOf(storyId);
    if (index > -1) {
      this.userData.favorites.splice(index, 1);
    } else {
      this.userData.favorites.push(storyId);
    }
    this.saveUserData();
    return this.userData.favorites;
  }

  isFavorite(storyId) {
    return this.userData.favorites.includes(storyId);
  }

  // Hantera lästa stories
  markAsRead(storyId) {
    if (!this.userData.readStories.includes(storyId)) {
      this.userData.readStories.push(storyId);
      this.saveUserData();
    }
  }

  isRead(storyId) {
    return this.userData.readStories.includes(storyId);
  }

  // Sätt senast lästa story
  setLastReadStory(storyId) {
    this.userData.lastReadStory = storyId;
    this.saveUserData();
  }

  // Hämta senast lästa story
  getLastReadStory() {
    return this.userData.lastReadStory;
  }

  // Hantera preferenser
  updatePreferences(preferences) {
    this.userData.preferences = { ...this.userData.preferences, ...preferences };
    this.saveUserData();
  }

  // Rensa all användardata
  clearAllData() {
    deleteCookie('user_data');
    this.userData = { ...defaultUserData };
  }

  // Exportera användardata (för debugging)
  exportUserData() {
    return { ...this.userData };
  }

  // Importera användardata (för debugging)
  importUserData(data) {
    this.userData = { ...defaultUserData, ...data };
    this.saveUserData();
  }

  // Hämta statistik
  getStats() {
    return {
      totalFavorites: this.userData.favorites.length,
      totalRead: this.userData.readStories.length,
      participantCount: this.userData.participantCount,
      lastRead: this.userData.lastReadStory
    };
  }
}

// Skapa en global instans
const userDataManager = new UserDataManager();

// Exportera funktioner för enkel användning
export const updateNamesAndGenders = (names, genders) => userDataManager.updateNamesAndGenders(names, genders);
export const toggleFavorite = (storyId) => userDataManager.toggleFavorite(storyId);
export const isFavorite = (storyId) => userDataManager.isFavorite(storyId);
export const markAsRead = (storyId) => userDataManager.markAsRead(storyId);
export const isRead = (storyId) => userDataManager.isRead(storyId);
export const setLastReadStory = (storyId) => userDataManager.setLastReadStory(storyId);
export const getLastReadStory = () => userDataManager.getLastReadStory();
export const updatePreferences = (preferences) => userDataManager.updatePreferences(preferences);
export const clearAllData = () => userDataManager.clearAllData();
export const exportUserData = () => userDataManager.exportUserData();
export const importUserData = (data) => userDataManager.importUserData(data);
export const getStats = () => userDataManager.getStats();

// Exportera manager-instansen också
export default userDataManager; 