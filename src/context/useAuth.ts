import { useContext } from 'react';
import { AuthContext } from './AuthContextTypes';
import type { AuthContextType } from './AuthContextTypes';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
