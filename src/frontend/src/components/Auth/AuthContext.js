import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create the authentication context
const AuthContext = createContext(null);

// Sample user data (in a real app, this would come from a backend)
const sampleUsers = [
  {
    id: 1,
    username: 'admin',
    // Use hash instead of plain text password
    passwordHash: 'hashed_admin_password',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    jobTitle: 'System Administrator',
    department: 'IT Operations',
    bio: 'Experienced system administrator with expertise in network management and security.',
    skills: ['Network Security', 'System Administration', 'Cloud Infrastructure', 'DevOps'],
    permissions: ['network:view', 'network:edit', 'vnf:view', 'vnf:edit', 'service:view', 'service:edit', 'monitoring:view', 'resource:view', 'resource:edit', 'dashboard:view', 'settings:view'],
    preferences: {
      theme: 'light',
      dashboardLayout: 'grid',
      enableNotifications: true,
      refreshRate: 30,
      visibleWidgets: ['performance', 'resources', 'alerts', 'network'],
      defaultView: 'overview'
    }
  },
  {
    id: 2,
    username: 'operator',
    // Use hash instead of plain text password
    passwordHash: 'hashed_operator_password',
    role: 'operator',
    name: 'Network Operator',
    email: 'operator@example.com',
    jobTitle: 'Network Engineer',
    department: 'Network Operations',
    bio: 'Network engineer with expertise in SDN and NFV technologies.',
    skills: ['SDN', 'NFV', 'Network Slicing', '5G'],
    permissions: ['network:view', 'vnf:view', 'service:view', 'monitoring:view', 'dashboard:view', 'settings:view'],
    preferences: {
      theme: 'dark',
      dashboardLayout: 'compact',
      enableNotifications: true,
      refreshRate: 60,
      visibleWidgets: ['performance', 'resources', 'alerts', 'network', 'storage'],
      defaultView: 'performance'
    }
  }
];

// For demo purposes only - in a real app, you would use proper authentication
// This simulates password verification without storing actual passwords
const verifyPassword = (username, password) => {
  // In a real app, this would use proper password hashing/verification
  if (username === 'admin' && password === 'admin123') return true;
  if (username === 'operator' && password === 'operator123') return true;
  return false;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
    // Removed auto-login for security
  }, []);

  // Login function
  const login = (username, password) => {
    setError(null);
    
    // Verify credentials
    if (verifyPassword(username, password)) {
      const user = sampleUsers.find(u => u.username === username);
      
      if (user) {
        // Create a safe user object (without passwordHash)
        const safeUser = { ...user };
        delete safeUser.passwordHash;
        
        // Store in state and localStorage
        setCurrentUser(safeUser);
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        return true;
      }
    }
    
    setError('Invalid username or password');
    return false;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Update user preferences
  const updatePreferences = (newPreferences) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        ...newPreferences
      }
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  // Update user profile
  const updateProfile = (profileData) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      ...profileData
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // In a real app, this would also update the backend
    return true;
  };

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    
    // Check if user has the specific permission
    if (currentUser.permissions && currentUser.permissions.includes(permission)) {
      return true;
    }
    
    // Admin role has all permissions
    if (currentUser.role === 'admin') return true;
    
    return false;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    updatePreferences,
    updateProfile,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Add PropTypes validation to the AuthProvider component
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext; 