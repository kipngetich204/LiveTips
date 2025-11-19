

export interface Tiptype {
  id: string;
  livescoreId: string;
  date: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  reason: string;
  time: string;
  score:string
  matchStatus: "Live" | "Finished" | "Not Started";
  type: 'basic' | 'premium';
  status: 'pending' | 'won' | 'lost';
  markets: "Over 2.5 Goals" | "GG" | "1X2" | "Handicap" | "BTTS";
}

