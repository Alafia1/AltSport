type Category = {
  name: string;
};

type Tournament = {
  name: string;
  category: Category;
};

type Team = {
  name: string;
  id: number;
};

type Score = {
  current?: number;
  period1?: number;
  period2?: number;
  period3?: number;
  period4?: number;
};

type Status = {
  type: string;
};

type Event = {
  id: number;
  tournament: Tournament;
  homeTeam: Team;
  awayTeam: Team;
  startTimestamp: number;
  homeScore?: Score;
  awayScore?: Score;
  status: Status;
};

type Events = {
  events: Event[];
};

export const Analysis = (
  home: Events,
  homeId: number,
  away: Events,
  awayId: number
) => {
  const possibleOutcome: string[] = [];
  const homeQ1: number[] = [];
  const homeQ2 = [];
  const homeQ3 = [];
  const homeQ4 = [];
  const homeQ1Against: number[] = [];
  const homeQ2Against = [];
  const homeQ3Against = [];
  const homeQ4Against = [];
  const awayQ1: number[] = [];
  const awayQ2 = [];
  const awayQ3 = [];
  const awayQ4 = [];
  const awayQ1Against: number[] = [];
  const awayQ2Against = [];
  const awayQ3Against = [];
  const awayQ4Against = [];

  home.events
    .slice(-10)
    .reverse()
    .map((match) => {
      if (homeId === match.homeTeam.id) {
        homeQ1.push(match.homeScore?.period1!);
        homeQ2.push(match.homeScore?.period2);
        homeQ3.push(match.homeScore?.period3);
        homeQ4.push(match.homeScore?.period4);
        homeQ1Against.push(match.awayScore?.period1!);
        homeQ2Against.push(match.awayScore?.period2);
        homeQ3Against.push(match.awayScore?.period3);
        homeQ4Against.push(match.awayScore?.period4);
      } else {
        homeQ1.push(match.awayScore?.period1!);
        homeQ2.push(match.awayScore?.period2);
        homeQ3.push(match.awayScore?.period3);
        homeQ4.push(match.awayScore?.period4);
        homeQ1Against.push(match.homeScore?.period1!);
        homeQ2Against.push(match.homeScore?.period2);
        homeQ3Against.push(match.homeScore?.period3);
        homeQ4Against.push(match.homeScore?.period4);
      }
    });

  away.events
    .slice(-10)
    .reverse()
    .map((match) => {
      if (awayId === match.homeTeam.id) {
        awayQ1.push(match.homeScore?.period1!);
        awayQ2.push(match.homeScore?.period2!);
        awayQ3.push(match.homeScore?.period3!);
        awayQ4.push(match.homeScore?.period4!);
        awayQ1Against.push(match.awayScore?.period1!);
        awayQ2Against.push(match.awayScore?.period2!);
        awayQ3Against.push(match.awayScore?.period3!);
        awayQ4Against.push(match.awayScore?.period4!);
      } else {
        awayQ1.push(match.awayScore?.period1!);
        awayQ2.push(match.awayScore?.period2!);
        awayQ3.push(match.awayScore?.period3!);
        awayQ4.push(match.awayScore?.period4!);
        awayQ1Against.push(match.homeScore?.period1!);
        awayQ2Against.push(match.homeScore?.period2!);
        awayQ3Against.push(match.homeScore?.period3!);
        awayQ4Against.push(match.homeScore?.period4!);
      }
    });
  const homeOver19Count = homeQ1.filter((number) => number > 19).length;
  const awayOver19Count = awayQ1.filter((number) => number > 19).length;
  const homeOver19CountAgainst = homeQ1Against.filter(
    (number) => number > 19
  ).length;
  const awayOver19CountAgainst = awayQ1Against.filter(
    (number) => number > 19
  ).length;

  if (homeOver19Count <= 3 && awayOver19Count <= 3)
    possibleOutcome.push("1st Quarter Under 40.5 - YES");
  if (homeOver19Count >= 8 && awayOver19Count >= 8)
    possibleOutcome.push("1st Quarter Over 38.5 - YES");
  if (homeOver19Count >= 8)
    possibleOutcome.push("Home Team 1st Quarter Over 18.5 - YES");
  if (awayOver19Count >= 8)
    possibleOutcome.push("Away Team 1st Quarter Over 18.5 - YES");
  if (homeOver19Count <= 3)
    possibleOutcome.push("Home Team 1st Quarter Under 20.5 - YES");
  if (awayOver19Count <= 3)
    possibleOutcome.push("Away Team 1st Quarter Under 20.5 - YES");

  return possibleOutcome;
};
