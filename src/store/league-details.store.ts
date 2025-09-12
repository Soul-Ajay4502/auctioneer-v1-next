import { League as LeagueDetails } from '@/utils/common-types-utils'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type LeagueStore = {
    leagueData: LeagueDetails | null
    setLeagueDetails: (leagueData: LeagueDetails) => void
    clearLeagueDetails: () => void
}

export const useLeagueStore = create<LeagueStore>()(
    persist(
        (set) => ({
            leagueData: null,
            setLeagueDetails: (leagueData) => set({ leagueData }),
            clearLeagueDetails: () => set({ leagueData: null }),
        }),
        {
            name: 'leagueDetails', // localStorage key
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ leagueData: state.leagueData }),
        },
    ),
)
