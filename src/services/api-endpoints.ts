const endpoints = Object.freeze({
    authentication: {
        signUp: '/auth/signup',
        signIn: '/auth/login',
        signOut: '/auth/logout',
        refresh: '/auth/refresh',
        verifyOtp: '/auth/verify-email',
        resendOtp: '/auth/resend-verification',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password',
    },
    user: {
        me: 'user/me',
        profile: '/user/',
        statistics: '/user/stats/me'
    },
    leagues: {
        all: '/leagues',
        getById: '/leagues/:id',
    },
    teams: {
        all: '/teams/',
        getById: '/teams/:id',
    }
})

export default endpoints
