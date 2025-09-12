import endpoints from '@/services/api-endpoints'
import { useAuthStore } from '@/store/auth.store'
import axios, { AxiosResponse } from 'axios'

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})
export const apiAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        // If token expired and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Call refresh endpoint (uses the refresh token in HttpOnly cookie)
                const response = await apiAuth.post(endpoints.authentication.refresh)
                const { accessToken } = response.data

                // Update token in Zustand
                useAuthStore.getState().setAccessToken(accessToken)

                // Retry the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return axios(originalRequest)
            } catch (refreshError) {
                // If refresh fails (including 401), perform full logout
                console.log('Refresh token invalid or expired, logging out')
                // Clear refresh token by calling logout endpoint
                try {
                    await useAuthStore.getState().logout()
                    window.location.href = '/sign-in'
                } catch (e) {
                    console.error('Error during logout:', e)
                }
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)

export interface ApiResponse<T = AxiosResponse> {
    data: T
    message: string
    status: number
    pagination?: any
}
