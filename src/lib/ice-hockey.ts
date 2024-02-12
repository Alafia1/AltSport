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
  const homeEachPeriodOver1: number[] = [];
  const awayEachPeriodOver1: number[] = [];
  const homeEachPeriodOver2: number[] = [];
  const awayEachPeriodOver2: number[] = [];
  const homeEachPeriodOver3: number[] = [];
  const awayEachPeriodOver3: number[] = [];

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
      const p1 = match.homeScore?.period1! + match.awayScore?.period1!;
      const p2 = match.homeScore?.period2! + match.awayScore?.period2!;
      const p3 = match.homeScore?.period3! + match.awayScore?.period3!;

      if (p1 > 1 && p2 > 1 && p3 > 1) {
        homeEachPeriodOver1.push(1);
      }
      if (p1 > 2 && p2 > 2 && p3 > 2) {
        homeEachPeriodOver2.push(1);
      }
      if (p1 > 3 && p2 > 3 && p3 > 3) {
        homeEachPeriodOver3.push(1);
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
      const p1 = match.homeScore?.period1! + match.awayScore?.period1!;
      const p2 = match.homeScore?.period2! + match.awayScore?.period2!;
      const p3 = match.homeScore?.period3! + match.awayScore?.period3!;

      if (p1 > 1 && p2 > 1 && p3 > 1) {
        awayEachPeriodOver1.push(1);
      }
      if (p1 > 2 && p2 > 2 && p3 > 2) {
        awayEachPeriodOver2.push(1);
      }
      if (p1 > 3 && p2 > 3 && p3 > 3) {
        awayEachPeriodOver3.push(1);
      }
    });

  const totalHome = homeTotal.map(
    (value, index) => value + homeTotalAgainst[index]
  );
  const totalHomeUnder7 = totalHome.filter((number) => number <= 7).length;
  const totalHomeOver4 = totalHome.filter((number) => number >= 4).length;

  const totalAway = awayTotal.map(
    (value, index) => value + awayTotalAgainst[index]
  );

  const totalAwayUnder7 = totalAway.filter((number) => number <= 7).length;
  const totalAwayOver4 = totalAway.filter((number) => number > 4).length;

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
  if (totalHomeOver4 > 7 && totalAwayOver4 > 7)
    possibleOutcome.push("Total Over 4.5 - YES");
  if (totalHomeP1Over1 >= 8 && totalAwayP1Over1 >= 8)
    possibleOutcome.push("1st Period Over 0.5 - YES");
  if (homeEachPeriodOver1.length > 7 && awayEachPeriodOver1.length > 7)
    possibleOutcome.push("Each Period Over 1.5 - YES");
  if (homeEachPeriodOver1.length < 3 && awayEachPeriodOver1.length < 3)
    possibleOutcome.push("Each Period Over 1.5 - NO");
  if (homeEachPeriodOver2.length > 7 && awayEachPeriodOver2.length > 7)
    possibleOutcome.push("Each Period Over 2.5 - YES");
  if (homeEachPeriodOver2.length < 3 && awayEachPeriodOver2.length < 3)
    possibleOutcome.push("Each Period Over 2.5 - No");
  if (homeEachPeriodOver3.length > 7 && awayEachPeriodOver3.length > 7)
    possibleOutcome.push("Each Period Over 3.5 - YES");

  return possibleOutcome;
};
