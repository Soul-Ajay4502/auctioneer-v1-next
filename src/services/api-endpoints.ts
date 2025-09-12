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
        statistics: '/user/stats/me',
    },
    leagues: {
        all: '/leagues',
        getById: '/leagues/:id',
    },
    teams: {
        all: '/teams/',
        getById: '/teams/:id',
    },
    meta: {
        getLeagueByUuid: '/meta/get-league/:uuid',
    },
    players: {
        all: '/players/',
        getById: '/players/:id',
        sendOtpForPlayerRegistration: '/players/send-otp',
        verifyOtpForPlayerRegistration: '/players/verify-otp',
        registerPlayer: '/players/register',
    },
})

export default endpoints
