export interface LeagueCreator {
    id: number
    display_name?: string
    email?: string
}

export interface League {
    league_id: number
    league_name: string
    league_full_name: string
    league_locations: string
    total_players: number
    total_teams: number
    has_unsold: boolean
    league_start_date: string
    league_end_date: string
    registration_fee: string
    created_by: number
    registration_end_date: string
    player_base_price: string
    bid_amount_per_team: string
    auction_start_date: string
    break_points: string
    increments: string
    minimum_player_count: number
    created_at: string
    updated_at: string | null
    deleted_at: string | null
    join_link: string
    createdAt: string
    updatedAt: string | null
    deletedAt: string | null
    creator: {
        id: number
        display_name: string
        email: string
    }
    registered_teams_count: number
    registered_players_count: number
}

export interface Pagination {
    currentPage: number
    limit: number
    total: number //items
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
}

export interface Teams {
    id: number
    team_name: string
    league_id: number
    max_amount_for_bid: string
    max_amount_per_player: string
    balance_amount: string
    is_auction_started: boolean
    created_date: string
    updated_date: string
    deleted_date: string
    createdAt: string
    updatedAt: string
    deletedAt: string
    league: League
    team_owner: string
    team_owner_phone: string
    jersey_color: string
}

export interface Player {
    player_id: number
    player_name: string
    place: string
    whatsapp_no: string
    current_team: string | null
    player_role: string
    batting_style: string
    bowling_style: string
    player_photo: string | null
    sold_to: string | null
    sold_amount: number | null
    is_unsold: boolean
    email: string
    is_admin_approved: boolean
    league: League
}
