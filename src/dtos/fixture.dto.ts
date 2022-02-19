export interface CreateFixtureDto {
    teamA: Array<FixtureTeam>;
    teamB: Array<FixtureTeam>;
    matchInfo: Array<MatchInfo>;
}

export interface FixtureTeam {
    name: string;
    score: number;
}

export interface MatchInfo {
    date: Date;
    stadium: string;
}

export interface SearchFixturesDto {
    name: string;
    date: Date;
    stadium: string;
    status: string;
}

export interface PatchFixtureDto {
    
}

