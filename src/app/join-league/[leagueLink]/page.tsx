'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import EmailVerification from './verify-email'
import RegisterForm from './register-form'
import { useQuery } from '@tanstack/react-query'
import { leaguesService } from '@/services/leagues.services'
import { League } from '@/utils/common-types-utils'

const JoinToLeague = () => {
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const { leagueLink } = useParams()
    const leagueLinkStr = Array.isArray(leagueLink) ? leagueLink[0] : leagueLink
    const uuid = leagueLinkStr?.substring(leagueLinkStr.indexOf('-') + 1)
    const onAfterEmailVerification = () => {
        setTimeout(() => {
            setIsEmailVerified(true)
        }, 1500)
    }
    const [league, setLeague] = useState<League | null>(null)
    const { data } = useQuery({
        queryKey: ['leagues', uuid],
        queryFn: () => leaguesService.getLeagueByUuid(uuid as string),
        // enabled: !!uuid && !isEmailVerified
    })

    return (
        <div>
            {!isEmailVerified ? (
                <EmailVerification onAfterEmailVerification={onAfterEmailVerification} />
            ) : (
                <RegisterForm leagueDetails={data?.data as League} />
            )}
        </div>
    )
}

export default JoinToLeague
