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

export const IceAnalysis = (
  home: Events,
  homeId: number,
  away: Events,
  awayId: number
) => {
  const possibleOutcome: string[] = [];
  const homeQ1: number[] = [];
  const homeQ2 = [];
  const homeQ3 = [];
  const homeTotal: number[] = [];
  const homeQ1Against: number[] = [];
  const homeQ2Against = [];
  const homeQ3Against = [];
  const homeTotalAgainst: number[] = [];
  const awayQ1: number[] = [];
  const awayQ2 = [];
  const awayQ3 = [];
  const awayTotal: number[] = [];
  const awayQ1Against: number[] = [];
  const awayQ2Against = [];
  const awayQ3Against = [];
  const awayTotalAgainst: number[] = [];

  home.events
    .slice(-10)
    .reverse()
    .map((match) => {
      if (homeId === match.homeTeam.id) {
        homeQ1.push(match.homeScore?.period1!);
        homeQ2.push(match.homeScore?.period2);
        homeQ3.push(match.homeScore?.period3);
        homeTotal.push(match.homeScore?.current!);
        homeQ1Against.push(match.awayScore?.period1!);
        homeQ2Against.push(match.awayScore?.period2);
        homeQ3Against.push(match.awayScore?.period3);
        homeTotalAgainst.push(match.awayScore?.current!);
      } else {
        homeQ1.push(match.awayScore?.period1!);
        homeQ2.push(match.awayScore?.period2);
        homeQ3.push(match.awayScore?.period3);
        homeTotal.push(match.awayScore?.current!);
        homeQ1Against.push(match.homeScore?.period1!);
        homeQ2Against.push(match.homeScore?.period2);
        homeQ3Against.push(match.homeScore?.period3);
        homeTotalAgainst.push(match.homeScore?.current!);
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
        awayTotal.push(match.homeScore?.current!);
        awayQ1Against.push(match.awayScore?.period1!);
        awayQ2Against.push(match.awayScore?.period2!);
        awayQ3Against.push(match.awayScore?.period3!);
        awayTotalAgainst.push(match.awayScore?.current!);
      } else {
        awayQ1.push(match.awayScore?.period1!);
        awayQ2.push(match.awayScore?.period2!);
        awayQ3.push(match.awayScore?.period3!);
        awayTotal.push(match.awayScore?.current!);
        awayQ1Against.push(match.homeScore?.period1!);
        awayQ2Against.push(match.homeScore?.period2!);
        awayQ3Against.push(match.homeScore?.period3!);
        awayTotalAgainst.push(match.homeScore?.current!);
      }
    });

  const totalHome = homeTotal.map(
    (value, index) => value + homeTotalAgainst[index]
  );
  const totalHomeUnder7 = totalHome.filter((number) => number <= 7).length;

  const totalAway = awayTotal.map(
    (value, index) => value + awayTotalAgainst[index]
  );

  const totalAwayUnder7 = totalAway.filter((number) => number <= 7).length;

  const totalHomeP1 = homeQ1.map(
    (value, index) => value + homeQ1Against[index]
  );
  const totalAwayP1 = awayQ1.map(
    (value, index) => value + awayQ1Against[index]
  );

  const totalHomeP1Over1 = totalHomeP1.filter((number) => number > 0).length;
  const totalAwayP1Over1 = totalAwayP1.filter((number) => number > 0).length;

  if (totalHomeUnder7 >= 8 && totalAwayUnder7 >= 8) {
    possibleOutcome.push("Total Under 7.5 - YES");
  }
  if (totalHomeP1Over1 >= 8 && totalAwayP1Over1 >= 8)
    possibleOutcome.push("1st Period Over 0.5 - YES");

  return possibleOutcome;
};
