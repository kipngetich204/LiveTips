type MatchStatus = "Not Started" | "Live" | "Finished";

type Status = "pending" | "won" | "lost";

type RiskLevel = "Low" | "Medium" | "High";

type MatchImportance = "Low" | "Medium" | "High" | "Critical";

type Market = string;

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

export interface Prediction {
  market: string;
  prediction: string;
  confidence: number;
  result: string | null;
}

export interface PredictionTier {
  predictions: Prediction[];
  reason: string;
}

interface AlternativeTip {
  market: string;
  prediction: string;
  confidence: number;
  reason: string;
}

export interface MatchPredictions {
  basic: PredictionTier;
  premium: PredictionTier;
  super_premium: PredictionTier;
}

export interface MatchPrediction {
  id: string;
  livescoreId: string;

  date: string;
  league: string;
  league_round: string;

  homeTeam: string;
  awayTeam: string;

  time: string;
  score: string;

  matchStatus: MatchStatus;
  status: Status;

  reason: string;

  expected_score: string;

  confidence_score: number;

  risk_level: RiskLevel;

  value_rating: number;

  tip_of_the_day: boolean;

  match_importance: MatchImportance;

  referee: string | null;

  predictions: MatchPredictions;

  win_probabilities?: WinProbabilities;

  expected_goals?: ExpectedGoals;

  form?: TeamForm;

  h2h_summary?: H2HSummary;

  key_factors?: string[];

  injury_alert?: InjuryAlert;

  alternative_tip?: AlternativeTip | null;
}


interface Summary {
  basic: number;
  premium: number;
  super_premium: number;
  tip_of_the_day: string;
}

export interface DailyTipsDoc {
  id: string;
  date: string;
  generated_at: string;
  uploadedAt: string;
  total: number;
  summary: Summary;
  matches: MatchPrediction[];
}


export interface TestingTips {
  date: string;
  generated_at: string;
  total: number;
  summary: Summary;
  matches: MatchPrediction[];
}