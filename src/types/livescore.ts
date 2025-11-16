// types.ts
export interface Team {
  id: number;
  name: string;
  logo: string;
  winner?: boolean;
}

export interface Teams {
  home: Team;
  away: Team;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag?: string;
  season: number;
  round: string;
  standings: boolean;
}

export interface FixtureInfo {
  id: number;
  referee?: string;
  timezone: string;
  date: string;
  timestamp: number;
  venue: {
    id?: number;
    name?: string;
    city?: string;
  };
  status: {
    long?: string;
    short?: string;
    elapsed?: number;
    extra?: string;
  };
}

export interface Goals {
  home?: number;
  away?: number;
}

export interface ScoreDetail {
  home?: number;
  away?: number;
}

export interface Score {
  halftime: ScoreDetail;
  fulltime: ScoreDetail;
  extratime: ScoreDetail;
  penalty: ScoreDetail;
}

export interface FullFixture {
  fixture: FixtureInfo;
  league: League;
  teams: Teams;
  goals: Goals;
  score: Score;
}
