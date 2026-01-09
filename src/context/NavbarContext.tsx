
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarContextType {
  isNavbarVisible: boolean;
  setNavbarVisible: (visible: boolean) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [isNavbarVisible, setNavbarVisible] = useState(true);

  return (
    <NavbarContext.Provider value={{ isNavbarVisible, setNavbarVisible }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};
