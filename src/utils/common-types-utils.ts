export interface LeagueCreator {
    id: number;
    display_name?: string;
    email?: string;
}

export interface League {
    league_id: number;
    league_name?: string;
    league_full_name?: string;
    league_locations?: string;
    total_players?: number;
    total_teams?: number;
    has_unsold?: boolean;
    league_start_date?: string;
    league_end_date?: string;
    registration_fee?: string;
    registration_end_date?: string;
    player_base_price?: string;
    bid_amount_per_team?: string;
    auction_start_date?: string;
    break_points?: string; // You can convert to number[] if needed
    increments?: string;   // You can convert to number[] if needed
    minimum_player_count?: number;
    created_at?: string;
    createdAt?: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
    creator?: LeagueCreator;
}

export interface Pagination {
    currentPage: number
    limit: number
    total: number //items
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
}