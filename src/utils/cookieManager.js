// Cookie Manager för Grodis App
// Hanterar användarinformation utan inloggning

const COOKIE_PREFIX = 'grodis_';
const COOKIE_EXPIRY_DAYS = 365; // 1 år

// Hjälpfunktioner för cookies
function setCookie(name, value, days = COOKIE_EXPIRY_DAYS) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  const cookieValue = `${COOKIE_PREFIX}${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  console.log('Setting cookie:', cookieValue);
  document.cookie = cookieValue;
}

function getCookie(name) {
  const nameEQ = `${COOKIE_PREFIX}${name}=`;
  console.log('Looking for cookie with prefix:', nameEQ);
  const ca = document.cookie.split(';');
  console.log('All cookies:', document.cookie);
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        const value = JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
        console.log('Found cookie:', name, value);
        return value;
      } catch (e) {
        console.warn('Kunde inte parsa cookie:', name, e);
        return null;
      }
    }
  }
  console.log('Cookie not found:', name);
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
    console.log('Loading user data from cookies:', savedData);
    if (savedData) {
      // Merge med default data för att hantera nya fält
      return { ...defaultUserData, ...savedData };
    }
    return { ...defaultUserData };
  }

  // Spara användardata till cookies
  saveUserData() {
    console.log('Saving user data:', this.userData);
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
    // Konvertera storyId till sträng för konsistent jämförelse
    const storyIdStr = String(storyId);
    const index = this.userData.favorites.indexOf(storyIdStr);
    if (index > -1) {
      this.userData.favorites.splice(index, 1);
    } else {
      this.userData.favorites.push(storyIdStr);
    }
    this.saveUserData();
    return this.userData.favorites;
  }

  isFavorite(storyId) {
    // Konvertera storyId till sträng för konsistent jämförelse
    const storyIdStr = String(storyId);
    return this.userData.favorites.includes(storyIdStr);
  }

  // Hantera lästa stories
  markAsRead(storyId) {
    // Konvertera storyId till sträng för konsistent jämförelse
    const storyIdStr = String(storyId);
    if (!this.userData.readStories.includes(storyIdStr)) {
      this.userData.readStories.push(storyIdStr);
      this.saveUserData();
    }
  }

  isRead(storyId) {
    // Konvertera storyId till sträng för konsistent jämförelse
    const storyIdStr = String(storyId);
    return this.userData.readStories.includes(storyIdStr);
  }

  // Sätt senast lästa story
  setLastReadStory(storyId) {
    // Konvertera storyId till sträng för konsistent jämförelse
    this.userData.lastReadStory = String(storyId);
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