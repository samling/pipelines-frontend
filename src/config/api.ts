'use client'
import { useEnvContext } from '@/providers/env-provider'

export const useApiConfig = () => {
  const env = useEnvContext();
  
  return {
    API_BASE_URL: env.PIPELINES_API_BASE_URL,
    API_KEY: env.PIPELINES_API_KEY,
    getApiHeaders: () => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.PIPELINES_API_KEY}`,
    })
  }
}