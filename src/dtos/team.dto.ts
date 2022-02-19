export interface CreateTeamDto {
    name: string;
    squad: Array<Squad>;
}

export interface Squad {
    name: string;
    position: string;
}

export interface SearchTeamsDto {
    name: string;
    player: string;
    position: string;
}

export interface PutTeamDto {
    name: string;
    squad: Array<Squad>;
}

export interface PatchTeamDto extends Partial<PutTeamDto> { }