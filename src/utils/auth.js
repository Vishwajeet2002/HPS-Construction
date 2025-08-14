// HPS Constructions Authentication System

const USERS = {
  'admin@hpsconstructions.com': {
    password: 'admin123',
    role: 'admin',
    name: 'HPS Admin'
  },
  'client@hpsconstructions.com': {
    password: 'client123',
    role: 'client',
    name: 'HPS Client'
  }
};

export function isAuthenticated() {
  const user = localStorage.getItem('hps_user');
  const authTime = localStorage.getItem('hps_auth_time');
  
  if (!user || !authTime) return false;
  
  // Check if session is still valid (24 hours)
  const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
  const currentTime = new Date().getTime();
  const loginTime = parseInt(authTime);
  
  if (currentTime - loginTime > sessionDuration) {
    logout();
    return false;
  }
  
  return true;
}

export function getCurrentUser() {
  const userData = localStorage.getItem('hps_user');
  return userData ? JSON.parse(userData) : null;
}

export function login(email, password, rememberMe = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate API call delay
      const user = USERS[email];
      
      if (!user || user.password !== password) {
        reject(new Error('Invalid email or password'));
        return;
      }
      
      const userData = {
        email: email,
        role: user.role,
        name: user.name,
        loginTime: new Date().getTime()
      };
      
      // Store user data
      localStorage.setItem('hps_user', JSON.stringify(userData));
      localStorage.setItem('hps_auth_time', userData.loginTime.toString());
      
      if (rememberMe) {
        localStorage.setItem('hps_remember_email', email);
      } else {
        localStorage.removeItem('hps_remember_email');
      }
      
      resolve(userData);
    }, 1500); // Simulate network delay
  });
}

export function logout() {
  localStorage.removeItem('hps_user');
  localStorage.removeItem('hps_auth_time');
  localStorage.removeItem('hps_remember_email');
}

// Utility functions
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatLoginTime(timestamp) {
  return new Date(timestamp).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}
