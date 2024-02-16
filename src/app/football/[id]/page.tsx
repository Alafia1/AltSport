import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { BiFootball } from "react-icons/bi";

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

type StatisticsItem = {
  name: string;
  home: string;
  away: string;
  compareCode: number;
  statisticsType: "positive" | "negative";
  valueType: "event" | "team";
  homeValue: number;
  awayValue: number;
};

type Group = {
  groupName: string;
  statisticsItems: StatisticsItem[];
};

type PeriodGroup = {
  period: string;
  groups: Group[];
};

type StatisticsData = {
  statistics: PeriodGroup[];
};

type Events = {
  events: Event[];
};

type Details = {
  event: Event;
};

async function getEventDetails(id: number) {
  const res = await fetch(`${process.env.API_URL}/api/v1/event/${id}`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const event: Details = await res.json();

  return event;
}

async function getMatchStat(id: number) {
  const stats = await fetch(
    `https://api.sofascore.com/api/v1/event/${id}/statistics`,
    {
      next: { revalidate: 600 },
    }
  );

  if (!stats.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error("Failed to fetch data");
    return null;
  }

  const matchStats: StatisticsData = await stats.json();

  var length = matchStats.statistics[1].groups.length;

  const fullTime = matchStats.statistics[0];
  const first = matchStats.statistics[1];
  const second = matchStats.statistics[2];
  const tvDataFull = fullTime.groups[length - 5];
  const tvData1 = first.groups[length - 5];
  const tvData2 = second.groups[length - 5];
  const corner1 = tvData1.statisticsItems[0];
  const corner2 = tvData2.statisticsItems[0];

  const cornerFirst = `${corner1.home} - ${corner1.away}`;
  const cornerSecond = `${corner2.home} - ${corner2.away}`;

  const yellowFirst = `${tvData1.statisticsItems[2].home} - ${tvData1.statisticsItems[2].away}`;
  const yellowSecond = `${tvData2.statisticsItems[2].home} - ${tvData2.statisticsItems[2].away}`;

  const throwFirst = `${tvData1.statisticsItems[4].home} - ${tvData1.statisticsItems[4].away}`;
  const throwSecond = `${tvData2.statisticsItems[4].home} - ${tvData2.statisticsItems[4].away}`;

  return (
    <div>
      <span>
        Corner: <span>1st Half: {cornerFirst}</span>{" "}
        <span>
          2nd Half: {cornerSecond} Full-time:{" "}
          {corner1.homeValue + corner2.homeValue} {"-"}{" "}
          {corner2.awayValue + corner1.awayValue}{" "}
        </span>{" "}
        <span className="font-bold">
          {corner1.homeValue +
            corner2.homeValue +
            corner2.awayValue +
            corner1.awayValue}
        </span>
      </span>
      <h3>
        Yellow Card: <span>1st Half: {yellowFirst}</span>{" "}
        <span>
          2nd Half: {yellowSecond} FT:{" "}
          {tvData1.statisticsItems[2].homeValue +
            tvData2.statisticsItems[2].homeValue}{" "}
          -{" "}
          {tvData1.statisticsItems[2].awayValue +
            tvData2.statisticsItems[2].awayValue}
        </span>
        {"    "}
        <span className="font-bold ml-3">
          (
          {tvData1.statisticsItems[2].homeValue +
            tvData2.statisticsItems[2].homeValue +
            tvData1.statisticsItems[2].awayValue +
            tvData2.statisticsItems[2].awayValue}
          )
        </span>
      </h3>
      <h3>
        Throw In: <span>1st Half: {throwFirst}</span>{" "}
        <span>2nd Half: {throwSecond}</span>
      </h3>
    </div>
  );
}
async function getTeamMatch(id: number) {
  const res = await fetch(
    `${process.env.API_URL}/api/v1/team/${id}/events/last/0`,
    {
      next: { revalidate: 600 },
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const teamMatch: Events = await res.json();
  return teamMatch;
}
const page = async ({ params }: { params: { id: number } }) => {
  const matchEvent = (await getEventDetails(params.id)).event;
  const homeMatches = (await getTeamMatch(matchEvent.homeTeam.id)).events;
  const awayMatches = (await getTeamMatch(matchEvent.awayTeam.id)).events;
  return (
    <div className="bg-slate-600">
      <MaxWidthWrapper>
        <Card>
          <CardHeader>
            <CardTitle>
              {matchEvent.homeTeam.name} Vs {matchEvent.awayTeam.name}
            </CardTitle>
            <CardDescription>{matchEvent.tournament.name}</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            {homeMatches
              .slice(-10)
              .reverse()
              .map((match) => (
                <div key={match.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {match.homeTeam.name} Vs {match.awayTeam.name}
                      </CardTitle>
                      <CardDescription>
                        {matchEvent.tournament.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <span>
                          {" "}
                          <BiFootball className="inline" />
                          Score:{" "}
                        </span>
                        <span>
                          1st Half: {match.homeScore?.period1} -{" "}
                          {match.awayScore?.period1}
                        </span>{" "}
                        <span>
                          2nd Half: {match.homeScore?.period2} -{" "}
                          {match.awayScore?.period2} FullTime:{" "}
                          {match.homeScore?.current} -{" "}
                          {match.awayScore?.current}
                        </span>
                        {match.status.type === "finished" &&
                          getMatchStat(match.id)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
          <div className="flex-1">
            {awayMatches
              .slice(-10)
              .reverse()
              .map((match) => (
                <div key={match.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {match.homeTeam.name} Vs {match.awayTeam.name}
                      </CardTitle>
                      <CardDescription>
                        {matchEvent.tournament.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h3>
                          Score:{" "}
                          <span>
                            1st Half: {match.homeScore?.period1} -{" "}
                            {match.awayScore?.period1}
                          </span>{" "}
                          <span>
                            2nd Half: {match.homeScore?.period2} -{" "}
                            {match.awayScore?.period2}
                          </span>
                        </h3>
                        {match.status.type === "finished" &&
                          getMatchStat(match.id)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
