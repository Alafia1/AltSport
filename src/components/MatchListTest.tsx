import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
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

async function getMatchList(sports: string) {
  const res = await fetch(
    `https://api.sofascore.com/api/v1/sport/${sports}/scheduled-events/2024-02-15`,
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
const MatchListTest = async ({ sport }: MatchListProps) => {
  const matchEvents = (await getMatchList(sport)).events;
  const countries = matchEvents.map((match) => match.tournament.category.name);
  const uniquesCountries = countries.filter(
    (value, index, self) => self.indexOf(value) === index
  );
  return (
    <div>
      <div className="bg-slate-200">
        {uniquesCountries.map((country) => (
          <div
            key={country}
            className="bg-slate-800 flex justify-between text-slate-200 p-3 border-2 rounded-lg"
          >
            <Collapsible className="w-full">
              <CollapsibleTrigger className="w-full">
                <div className="flex justify-between">
                  <p>{country}</p>
                  <ChevronDown />
                </div>
              </CollapsibleTrigger>

              {matchEvents.map((match) =>
                match.tournament.category.name === country ? (
                  <CollapsibleContent key={match.id}>
                    <Link
                      href={`/${sport}/${match.id}`}
                      className=" flex justify-between text-slate-200"
                    >
                      <div className="flex w-2/4">
                        <div className="flex flex-col-reverse px-5">
                          <div className="flex flex-col items-center">
                            <p>{getTime(match.startTimestamp)}</p>
                            <p>-</p>
                          </div>
                        </div>
                        <div className="flex flex-col px-5">
                          <div>
                            <h5 className="text-slate-400">
                              {match.tournament.name}
                            </h5>
                          </div>
                          <p>{match.homeTeam.name} </p>
                          <p>{match.awayTeam.name}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-end mr-10">
                        <p>
                          {match.homeScore ? match.homeScore?.current : "-"}
                        </p>
                        <p>
                          {match.awayScore ? match.awayScore?.current : "-"}
                        </p>
                      </div>
                    </Link>
                    <hr />
                  </CollapsibleContent>
                ) : null
              )}
            </Collapsible>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchListTest;
