import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize userData from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('userData');
      if (savedData && savedData !== 'null') {
        const parsed = JSON.parse(savedData);
        setUserData(parsed);
        console.log('✅ UserContext loaded data:', parsed);
      }
    } catch (error) {
      console.error('❌ Error loading userData:', error);
      localStorage.removeItem('userData');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserData = (data) => {
    try {
      setUserData(data);
      if (data) {
        localStorage.setItem('userData', JSON.stringify(data));
        console.log('✅ UserContext updated:', data);
      }
    } catch (error) {
      console.error('❌ Error updating userData:', error);
    }
  };

  const clearUserData = () => {
    setUserData(null);
    localStorage.removeItem('userData');
  };

  const hasCompleteUserData = () => {
    let dataToCheck = userData;
    
    if (!dataToCheck) {
      try {
        const saved = localStorage.getItem('userData');
        if (saved && saved !== 'null') {
          dataToCheck = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Error reading localStorage:', error);
      }
    }
    
    const hasData = dataToCheck && 
                   dataToCheck.name && 
                   typeof dataToCheck.name === 'string' &&
                   dataToCheck.name.trim().length >= 2 && 
                   dataToCheck.phone && 
                   typeof dataToCheck.phone === 'string' &&
                   dataToCheck.phone.trim().length >= 7;
    
    console.log('🔍 Complete data check:', {
      contextData: userData,
      checkingData: dataToCheck,
      name: dataToCheck?.name,
      nameLength: dataToCheck?.name?.trim().length,
      phone: dataToCheck?.phone,
      phoneLength: dataToCheck?.phone?.trim().length,
      result: hasData
    });
    
    return hasData;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ 
      userData, 
      updateUserData, 
      clearUserData, 
      hasCompleteUserData,
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
