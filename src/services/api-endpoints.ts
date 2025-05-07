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
    onboarding: {
        inviteTeam: '/invite-team',
        createWorkSpace: '/workspace',
    },
    user: {
        me: 'user/me',
        profile: '/user/',
    },
    project: {
        createProject: '/project',
        listProjects: '/project',
    },
    llm: {
        chat: '/chat/',
    },
})

export default endpoints
