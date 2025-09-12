import { create } from 'zustand'

export const useGlobalStateStore = create<{
    tokenExpiry: number | null
    setTokenExpiry: (expiry: number | null) => void
}>((set) => ({
    tokenExpiry: null,
    setTokenExpiry: (expiry) => set({ tokenExpiry: expiry }),
}))
