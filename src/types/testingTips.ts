type MatchStatus = "Not Started" | "Live" | "Finished";
type PredictionType = "basic" | "premium" | "super-premium" ;
type Status = "pending" | "won" | "lost";
type RiskLevel = "Low" | "Medium" | "High";
type MatchImportance = "Low" | "Medium" | "High" | "Critical";

type Market =
  | "Over 2.5 Goals"
  | "GG"
  | "1X2"
  | "Handicap"
  | "BTTS"
  | "Over 1.5 Goals"
  | "Double Chance"
  | string;


interface WinProbabilities {
  home: number;
  draw: number;
  away: number;
}

interface ExpectedGoals {
  home: number;
  away: number;
}

interface TeamForm {
  home: string;
  away: string;
}

interface H2HSummary {
  played: number;
  home_wins: number;
  draws: number;
  away_wins: number;
  avg_goals: number;
  last_meeting: string;
}

interface InjuryAlert {
  active: boolean;
  home_team: string;
  away_team: string;
}

interface TierPrediction {
  market: Market;
  prediction: string;
  reason: string;
  confidence: number;
}

interface AlternativeTip {
  market: string;
  prediction: string;
  reason: string;
  confidence: number;
}

export interface MatchPrediction {

  id: string;
  livescoreId: string;

  date: string;
  league: string;

  homeTeam: string;
  awayTeam: string;

  time: string;
  score: string;

  matchStatus: MatchStatus;
  markets: Market;

  prediction: string;
  reason: string;

  type: PredictionType;
  status: Status;

  expected_score: string;

  confidence_score: number;

  risk_level: RiskLevel;

  value_rating: number;

  tip_of_the_day: boolean;

  match_importance: MatchImportance;

  league_round: string;

  referee: string | null;


  // Optional fields
  win_probabilities?: WinProbabilities;

  expected_goals?: ExpectedGoals;

  form?: TeamForm;

  h2h_summary?: H2HSummary;

  key_factors?: string[];

  injury_alert?: InjuryAlert;

  basic_prediction?: TierPrediction;

  premium_prediction?: TierPrediction;

  super_premium_prediction?: TierPrediction | null;

  alternative_tip?: AlternativeTip | null;
}

// types/testingTips.ts  — add this alongside MatchPrediction
export interface DailyTipsDoc {
  id: string;
  date: string;
  generated_at: string;
  uploadedAt: string;
  total: number;
  summary: {
    basic: number;
    premium: number;
    super_premium: number;
    tip_of_the_day: string;
  };
  matches: MatchPrediction[];
}


interface Summary {

  basic: number;

  premium: number;

  super_premium: number;

  tip_of_the_day: string;
}


export interface TestingTips {

  date: string;

  generated_at: string;

  total: number;

  summary: Summary;

  matches: MatchPrediction[];
}