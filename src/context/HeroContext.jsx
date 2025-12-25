import { createContext, useContext, useRef } from "react";

const HeroContext = createContext();

export function HeroProvider({ children }) {
  const heroRef = useRef(null);
  return <HeroContext.Provider value={{ heroRef }}>{children}</HeroContext.Provider>;
}

export function useHero() {
  return useContext(HeroContext);
}
