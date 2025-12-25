import type { FullFixture } from "../types/livescore"

export const mockLivescore: FullFixture[] = [
  {
    "fixture": {
      "id": 1001,
      "referee": "John Smith",
      "timezone": "UTC",
      "date": "2025-01-10T18:00:00Z",
      "timestamp": 1736532000,
      "venue": { "id": 1, "name": "Emirates Stadium", "city": "London" },
      "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 }
    },
    "league": {
      "id": 39,
      "name": "Premier League",
      "country": "England",
      "logo": "https://logo.com/epl.png",
      "flag": "https://flag.com/eng.png",
      "season": 2024,
      "round": "Regular Season - 20",
      "standings": true
    },
    "teams": {
      "home": { "id": 1, "name": "Arsenal", "logo": "https://logo.com/arsenal.png", "winner": true },
      "away": { "id": 2, "name": "Chelsea", "logo": "https://logo.com/chelsea.png", "winner": false }
    },
    "goals": { "home": 2, "away": 1 },
    "score": {
      "halftime": { "home": 1, "away": 0 },
      "fulltime": { "home": 2, "away": 1 },
      "extratime": {},
      "penalty": {}
    }
  },
  {
    "fixture": {
      "id": 1002,
      "referee": "Carlos Ruiz",
      "timezone": "UTC",
      "date": "2025-01-11T20:00:00Z",
      "timestamp": 1736625600,
      "venue": { "id": 2, "name": "Camp Nou", "city": "Barcelona" },
      "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 }
    },
    "league": {
      "id": 140,
      "name": "La Liga",
      "country": "Spain",
      "logo": "https://logo.com/laliga.png",
      "flag": "https://flag.com/es.png",
      "season": 2024,
      "round": "Regular Season - 18",
      "standings": true
    },
    "teams": {
      "home": { "id": 3, "name": "Barcelona", "logo": "https://logo.com/barca.png", "winner": true },
      "away": { "id": 4, "name": "Valencia", "logo": "https://logo.com/valencia.png", "winner": false }
    },
    "goals": { "home": 3, "away": 0 },
    "score": {
      "halftime": { "home": 2, "away": 0 },
      "fulltime": { "home": 3, "away": 0 },
      "extratime": {},
      "penalty": {}
    }
  },
  {
    "fixture": {
      "id": 1003,
      "referee": "Felix Braun",
      "timezone": "UTC",
      "date": "2025-01-12T17:30:00Z",
      "timestamp": 1736703000,
      "venue": { "id": 3, "name": "Allianz Arena", "city": "Munich" },
      "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 }
    },
    "league": {
      "id": 78,
      "name": "Bundesliga",
      "country": "Germany",
      "logo": "https://logo.com/bundesliga.png",
      "flag": "https://flag.com/de.png",
      "season": 2024,
      "round": "Matchday 17",
      "standings": true
    },
    "teams": {
      "home": { "id": 5, "name": "Bayern Munich", "logo": "https://logo.com/bayern.png", "winner": false },
      "away": { "id": 6, "name": "RB Leipzig", "logo": "https://logo.com/leipzig.png", "winner": false }
    },
    "goals": { "home": 2, "away": 2 },
    "score": {
      "halftime": { "home": 1, "away": 1 },
      "fulltime": { "home": 2, "away": 2 },
      "extratime": {},
      "penalty": {}
    }
  },
  {
    "fixture": {
      "id": 1004,
      "referee": "Marco Guida",
      "timezone": "UTC",
      "date": "2025-01-13T19:45:00Z",
      "timestamp": 1736797500,
      "venue": { "id": 4, "name": "San Siro", "city": "Milan" },
      "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 }
    },
    "league": {
      "id": 135,
      "name": "Serie A",
      "country": "Italy",
      "logo": "https://logo.com/seriea.png",
      "flag": "https://flag.com/it.png",
      "season": 2024,
      "round": "Round 19",
      "standings": true
    },
    "teams": {
      "home": { "id": 7, "name": "AC Milan", "logo": "https://logo.com/milan.png", "winner": true },
      "away": { "id": 8, "name": "Roma", "logo": "https://logo.com/roma.png", "winner": false }
    },
    "goals": { "home": 1, "away": 0 },
    "score": {
      "halftime": { "home": 0, "away": 0 },
      "fulltime": { "home": 1, "away": 0 },
      "extratime": {},
      "penalty": {}
    }
  },
  {
    "fixture": {
      "id": 1005,
      "referee": "Benoit Bastien",
      "timezone": "UTC",
      "date": "2025-01-14T21:00:00Z",
      "timestamp": 1736888400,
      "venue": { "id": 5, "name": "Parc des Princes", "city": "Paris" },
      "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 }
    },
    "league": {
      "id": 61,
      "name": "Ligue 1",
      "country": "France",
      "logo": "https://logo.com/ligue1.png",
      "flag": "https://flag.com/fr.png",
      "season": 2024,
      "round": "Week 18",
      "standings": true
    },
    "teams": {
      "home": { "id": 9, "name": "PSG", "logo": "https://logo.com/psg.png", "winner": true },
      "away": { "id": 10, "name": "Lyon", "logo": "https://logo.com/lyon.png", "winner": false }
    },
    "goals": { "home": 4, "away": 1 },
    "score": {
      "halftime": { "home": 2, "away": 1 },
      "fulltime": { "home": 4, "away": 1 },
      "extratime": {},
      "penalty": {}
    }
  },
  {
    "fixture": {
      "id": 1006,
      "timezone": "UTC",
      "date": "2025-01-15T18:30:00Z",
      "timestamp": 1736965800,
      "venue": { "id": 6, "name": "Johan Cruyff Arena", "city": "Amsterdam" },
      "status": { "long": "Not Started", "short": "NS" }
    },
    "league": {
      "id": 88,
      "name": "Eredivisie",
      "country": "Netherlands",
      "logo": "https://logo.com/eredivisie.png",
      "flag": "https://flag.com/nl.png",
      "season": 2024,
      "round": "Round 19",
      "standings": true
    },
    "teams": {
      "home": { "id": 11, "name": "Ajax", "logo": "https://logo.com/ajax.png" },
      "away": { "id": 12, "name": "PSV", "logo": "https://logo.com/psv.png" }
    },
    "goals": {},
    "score": {
      "halftime": {},
      "fulltime": {},
      "extratime": {},
      "penalty": {}
    }
  },
  {
    "fixture": {
      "id": 1007,
      "timezone": "UTC",
      "date": "2025-01-16T20:00:00Z",
      "timestamp": 1737057600,
      "venue": { "id": 7, "name": "Estadio do Dragão", "city": "Porto" },
      "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 }
    },
    "league": {
      "id": 94,
      "name": "Primeira Liga",
      "country": "Portugal",
      "logo": "https://logo.com/liga-portugal.png",
      "flag": "https://flag.com/pt.png",
      "season": 2024,
      "round": "Matchday 17",
      "standings": true
    },
    "teams": {
      "home": { "id": 13, "name": "Porto", "logo": "https://logo.com/porto.png", "winner": true },
      "away": { "id": 14, "name": "Braga", "logo": "https://logo.com/braga.png", "winner": false }
    },
    "goals": { "home": 2, "away": 0 },
    "score": {
      "halftime": { "home": 1, "away": 0 },
      "fulltime": { "home": 2, "away": 0 },
      "extratime": {},
      "penalty": {}
    }
  },
  {
    "fixture": {
      "id": 1008,
      "timezone": "UTC",
      "date": "2025-01-17T19:00:00Z",
      "timestamp": 1737140400,
      "venue": { "id": 8, "name": "Celtic Park", "city": "Glasgow" },
      "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 }
    },
    "league": {
      "id": 179,
      "name": "Scottish Premiership",
      "country": "Scotland",
      "logo": "https://logo.com/scotland.png",
      "flag": "https://flag.com/gb-sct.png",
      "season": 2024,
      "round": "Round 22",
      "standings": true
    },
    "teams": {
      "home": { "id": 15, "name": "Celtic", "logo": "https://logo.com/celtic.png", "winner": true },
      "away": { "id": 16, "name": "Rangers", "logo": "https://logo.com/rangers.png", "winner": false }
    },
    "goals": { "home": 1, "away": 0 },
    "score": {
      "halftime": { "home": 0, "away": 0 },
      "fulltime": { "home": 1, "away": 0 },
      "extratime": {},
      "penalty": {}
    }
  },
  {
    "fixture": {
      "id": 1009,
      "timezone": "UTC",
      "date": "2025-01-18T16:00:00Z",
      "timestamp": 1737225600,
      "venue": { "id": 9, "name": "Red Bull Arena", "city": "Salzburg" },
      "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 }
    },
    "league": {
      "id": 218,
      "name": "Austrian Bundesliga",
      "country": "Austria",
      "logo": "https://logo.com/austria.png",
      "flag": "https://flag.com/at.png",
      "season": 2024,
      "round": "Round 18",
      "standings": true
    },
    "teams": {
      "home": { "id": 17, "name": "RB Salzburg", "logo": "https://logo.com/salzburg.png", "winner": false },
      "away": { "id": 18, "name": "Rapid Wien", "logo": "https://logo.com/rapid.png", "winner": false }
    },
    "goals": { "home": 1, "away": 1 },
    "score": {
      "halftime": { "home": 1, "away": 0 },
      "fulltime": { "home": 1, "away": 1 },
      "extratime": {},
      "penalty": {}
    }
  },
  {
    "fixture": {
      "id": 1010,
      "timezone": "UTC",
      "date": "2025-01-19T21:00:00Z",
      "timestamp": 1737310800,
      "venue": { "id": 10, "name": "Estadio Azteca", "city": "Mexico City" },
      "status": { "long": "Not Started", "short": "NS" }
    },
    "league": {
      "id": 262,
      "name": "Liga MX",
      "country": "Mexico",
      "logo": "https://logo.com/ligamx.png",
      "flag": "https://flag.com/mx.png",
      "season": 2025,
      "round": "Clausura - 2",
      "standings": true
    },
    "teams": {
      "home": { "id": 19, "name": "Club América", "logo": "https://logo.com/america.png" },
      "away": { "id": 20, "name": "Chivas", "logo": "https://logo.com/chivas.png" }
    },
    "goals": {},
    "score": {
      "halftime": {},
      "fulltime": {},
      "extratime": {},
      "penalty": {}
    }
  },
  {
    "fixture": {
      "id": 1011,
      "timezone": "UTC",
      "date": "2025-01-20T23:00:00Z",
      "timestamp": 1737394800,
      "venue": { "id": 11, "name": "La Bombonera", "city": "Buenos Aires" },
      "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 }
    },
    "league": {
      "id": 128,
      "name": "Liga Profesional",
      "country": "Argentina",
      "logo": "https://logo.com/argentina.png",
      "flag": "https://flag.com/ar.png",
      "season": 2024,
      "round": "Round 5",
      "standings": true
    },
    "teams": {
      "home": { "id": 21, "name": "Boca Juniors", "logo": "https://logo.com/boca.png", "winner": true },
      "away": { "id": 22, "name": "River Plate", "logo": "https://logo.com/river.png", "winner": false }
    },
    "goals": { "home": 2, "away": 0 },
    "score": {
      "halftime": { "home": 1, "away": 0 },
      "fulltime": { "home": 2, "away": 0 },
      "extratime": {},
      "penalty": {}
    }
  }
]
