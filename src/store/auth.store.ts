import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { api, apiAuth } from '@/config/axios-config'
import endpoints from '@/services/api-endpoints'
import { AxiosError } from 'axios'

interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    img_url: string
    workspaces: []
}
interface Workspace {
    id: number
    name: string
    img_url: string
    invite_link: string
    plan: number
}
interface AuthStore {
    // State
    user: User | null
    pendingVerificationEmail: string | null
    accessToken: string | null
    currentWorkspace: Workspace | null

    // Actions
    setPendingVerificationEmail: (email: string | null) => void
    setAccessToken: (token: string | null) => void
    setUser: (user: User | null) => void
    setCurrentWorkSpace: (workspace: Workspace | null) => void

    // Async Actions
    login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>
    logout: () => Promise<void>
    fetchMyDetails: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            pendingVerificationEmail: null,
            accessToken: null,
            currentWorkspace: null,

            setPendingVerificationEmail: (email) => set({ pendingVerificationEmail: email }),
            setAccessToken: (token) => set({ accessToken: token }),
            setUser: (user) => set({ user }),
            setCurrentWorkSpace: (workspace) => set({ currentWorkspace: workspace }),

            login: async (credentials) => {
                try {
                    const response = await apiAuth.post(endpoints.authentication.signIn, credentials)
                    set({ accessToken: response.data.accessToken })

                    document.cookie = 'auth_session=true; path=/; max-age=86400; samesite=strict; secure'
                    return { success: true }
                } catch (error) {
                    const err = error as AxiosError<{ message: string }>
                    return {
                        success: false,
                        message: err.response?.data?.message || 'Login failed',
                    }
                }
            },

            fetchMyDetails: async () => {
                try {
                    const response = await api.get(endpoints.user.me)
                    set((state) => {
                        const hasCurrentWorkspace = !!state.currentWorkspace && Object.keys(state.currentWorkspace).length > 0

                        return {
                            user: response.data.user,
                            currentWorkspace: hasCurrentWorkspace
                                ? state.currentWorkspace
                                : response?.data?.user?.workspaces?.[0] || {},
                        }
                    })
                } catch (error) {
                    console.error('Fetching user details failed:', error)
                    set({ user: null })
                }
            },

            logout: async () => {
                try {
                    await apiAuth.post(endpoints.authentication.signOut)
                    document.cookie = 'auth_session=; path=/; max-age=0'
                    useAuthStore.setState({
                        user: null,
                        accessToken: null,
                        pendingVerificationEmail: null,
                        currentWorkspace: null,
                    })
                } catch (error) {
                    console.error('Logout failed:', error)
                }
            },
        }),
        {
            name: 'auth-storage',

            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                pendingVerificationEmail: state.pendingVerificationEmail,
                user: state.user,
                currentWorkspace: state.currentWorkspace,
            }),
        },
    ),
)
