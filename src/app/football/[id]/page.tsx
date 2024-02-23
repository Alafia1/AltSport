import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

async function getMatchStat(id: number, team: boolean) {
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

  if (matchStats.statistics[0]) {
    let length = matchStats.statistics[0].groups.length;
    const tvDataFull = matchStats.statistics[0].groups[length - 5];
    return (
      <>
        <TableCell>
          {team ? (
            <span>{tvDataFull.statisticsItems[0].home}</span>
          ) : (
            <span>{tvDataFull.statisticsItems[0].away}</span>
          )}
        </TableCell>
        <TableCell>
          {team
            ? tvDataFull.statisticsItems[0].away
            : tvDataFull.statisticsItems[0].home}
        </TableCell>
      </>
    );
  }
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
        <div className="flex flex-col md:flex-row gap-2 mt-2">
          <div className="flex-1 border-slate-800 border-2 rounded-md">
            <div className="w-full">
              <div className="flex justify-center font-semibold text-slate-200">
                {matchEvent.homeTeam.name}
              </div>
              <Table>
                <TableCaption>
                  Last 10 games for {matchEvent.homeTeam.name}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Against</TableHead>
                    <TableHead>Score For</TableHead>
                    <TableHead>Score Ag</TableHead>
                    <TableHead>Corner For</TableHead>
                    <TableHead>Corner Ag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs font-thin">
                  {homeMatches
                    .slice(-10)
                    .reverse()
                    .map((match) => (
                      <TableRow key={match.id} className="text-slate-200">
                        <TableCell>
                          {match.homeTeam.id === matchEvent.homeTeam.id
                            ? match.awayTeam.name
                            : match.homeTeam.name}{" "}
                          (
                          {match.homeTeam.id === matchEvent.homeTeam.id
                            ? "H"
                            : "A"}
                          )
                        </TableCell>
                        <TableCell>
                          <span>
                            {match.homeTeam.id === matchEvent.homeTeam.id ? (
                              <span>{match.homeScore?.current}</span>
                            ) : (
                              <span>{match.awayScore?.current}</span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span>
                            {match.homeTeam.id === matchEvent.homeTeam.id ? (
                              <span>{match.awayScore?.current}</span>
                            ) : (
                              <span>{match.homeScore?.current}</span>
                            )}
                          </span>
                        </TableCell>
                        {match.status.type === "finished" &&
                          getMatchStat(
                            match.id,
                            match.homeTeam.id === matchEvent.homeTeam.id
                          )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex-1 border-slate-800 border-2 rounded-md">
            <div className="w-full">
              <div className="flex justify-center font-semibold text-slate-200">
                {matchEvent.awayTeam.name}
              </div>
              <Table>
                <TableCaption>
                  Last 10 games for {matchEvent.awayTeam.name}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Against</TableHead>
                    <TableHead>Score For</TableHead>
                    <TableHead>Score Ag</TableHead>
                    <TableHead>Corner For</TableHead>
                    <TableHead>Corner Ag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs font-thin">
                  {awayMatches
                    .slice(-10)
                    .reverse()
                    .map((match) => (
                      <TableRow key={match.id} className="text-slate-200">
                        <TableCell>
                          {match.homeTeam.id === matchEvent.awayTeam.id
                            ? match.awayTeam.name
                            : match.homeTeam.name}{" "}
                          (
                          {match.homeTeam.id === matchEvent.awayTeam.id
                            ? "H"
                            : "A"}
                          )
                        </TableCell>
                        <TableCell>
                          <span>
                            {match.homeTeam.id === matchEvent.awayTeam.id ? (
                              <span>{match.homeScore?.current}</span>
                            ) : (
                              <span>{match.awayScore?.current}</span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span>
                            {match.homeTeam.id === matchEvent.awayTeam.id ? (
                              <span>{match.awayScore?.current}</span>
                            ) : (
                              <span>{match.homeScore?.current}</span>
                            )}
                          </span>
                        </TableCell>

                        {match.status.type === "finished" &&
                          getMatchStat(
                            match.id,
                            match.homeTeam.id === matchEvent.awayTeam.id
                          )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
