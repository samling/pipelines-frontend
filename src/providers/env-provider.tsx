'use client'
import { createContext, useContext, ReactNode } from 'react'

interface EnvContextType {
  PIPELINES_API_BASE_URL: string;
  PIPELINES_API_KEY: string;
}

export const EnvContext = createContext<EnvContextType>({
  PIPELINES_API_BASE_URL: '',
  PIPELINES_API_KEY: ''
});

interface EnvProviderProps {
  children: ReactNode
  env: EnvContextType
}

export const EnvProvider = ({ children, env }: EnvProviderProps) => {
  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>
}

export const useEnvContext = () => useContext(EnvContext)