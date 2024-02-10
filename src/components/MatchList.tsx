import { env } from "process";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { match } from "assert";
import { format } from "date-fns";
import Link from "next/link";

interface MatchListProps {
  sport: string;
}

type Category = {
  name: string;
};

type Tournament = {
  name: string;
  category: Category;
};

type Team = {
  name: string;
};

type Score = {
  current?: number;
};

type Event = {
  id: number;
  tournament: Tournament;
  homeTeam: Team;
  awayTeam: Team;
  startTimestamp: number;
  homeScore?: Score;
  awayScore?: Score;
};

type Events = {
  events: Event[];
};
1706889427000;
1706893200;

async function getMatchList(sports: string) {
  const res = await fetch(
    `https://api.sofascore.com/api/v1/sport/${sports}/scheduled-events/2024-02-10`,
    { next: { revalidate: 600 } }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const events: Events = await res.json();

  return events;
}

function getTime(timeStamp: number) {
  const date = new Date(timeStamp * 1000);
  const formattedTime = format(date, "HH:mm");

  return formattedTime;
}
const MatchList = async ({ sport }: MatchListProps) => {
  const matchEvents = (await getMatchList(sport)).events;

  return (
    <div>
      <div className="bg-slate-200">
        {matchEvents.map((match) => (
          <Link key={match.id} href={`/${sport}/${match.id}`}>
            <div className="bg-slate-800 flex justify-between text-slate-200 p-3 border-2 rounded-lg">
              <div className="flex w-2/4">
                <div className="flex flex-col-reverse px-5">
                  <div className="flex flex-col items-center">
                    <p>{getTime(match.startTimestamp)}</p>
                    <p>-</p>
                  </div>
                </div>
                <div className="flex flex-col px-5">
                  <div>
                    <h2 className="text-1xl font-bold">
                      {match.tournament.category.name}
                    </h2>
                    <h5 className="text-slate-400">{match.tournament.name}</h5>
                  </div>
                  <p>{match.homeTeam.name} </p>
                  <p>{match.awayTeam.name}</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-end mr-10">
                <p>{match.homeScore ? match.homeScore?.current : "-"}</p>
                <p>{match.awayScore ? match.awayScore?.current : "-"}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MatchList;
