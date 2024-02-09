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
import { Analysis } from "@/lib/basketball";

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

type Details = {
  event: Event;
};

async function getEventDetails(id: number) {
  const res = await fetch(`https://api.sofascore.com/api/v1/event/${id}`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const event: Details = await res.json();

  return event;
}

async function getTeamMatch(id: number) {
  const res = await fetch(
    `https://api.sofascore.com/api/v1/team/${id}/events/last/0`,
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
  const home = await getTeamMatch(matchEvent.homeTeam.id);
  const away = await getTeamMatch(matchEvent.awayTeam.id);
  const homeMatches = home.events;
  const awayMatches = away.events;

  const count = Analysis(
    home,
    matchEvent.homeTeam.id,
    away,
    matchEvent.awayTeam.id
  );

  console.log(count);
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
          <CardContent>
            <div>
              {count.map((outcome) => (
                <div key={outcome}>
                  <p>{outcome}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-2 mt-2">
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
                    <TableHead>Q1</TableHead>
                    <TableHead>Q2</TableHead>
                    <TableHead>1HT</TableHead>
                    <TableHead>Q3</TableHead>
                    <TableHead>Q4</TableHead>
                    <TableHead>2HT</TableHead>
                    <TableHead>Total</TableHead>
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
                              <>
                                <span className="text-green-400">
                                  {match.homeScore?.period1!}
                                </span>
                                {"-"}
                                <span className="text-red-400">
                                  {match.awayScore?.period1!}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-red-400">
                                  {match.homeScore?.period1!}
                                </span>
                                {"-"}
                                <span className="text-green-400">
                                  {match.awayScore?.period1!}
                                </span>
                              </>
                            )}
                          </span>
                          {" / "}
                          {match.homeScore?.period1 && match.homeScore?.period1
                            ? match.homeScore?.period1! +
                              match.awayScore?.period1!
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <span>
                            {match.homeTeam.id === matchEvent.homeTeam.id ? (
                              <>
                                <span className="text-green-400">
                                  {match.homeScore?.period2!}
                                </span>
                                {"-"}
                                <span className="text-red-400">
                                  {match.awayScore?.period2!}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-red-400">
                                  {match.homeScore?.period2!}
                                </span>
                                {"-"}
                                <span className="text-green-400">
                                  {match.awayScore?.period2!}
                                </span>
                              </>
                            )}
                          </span>
                          {" / "}
                          {match.homeScore?.period2 && match.homeScore?.period2
                            ? match.homeScore?.period2! +
                              match.awayScore?.period2!
                            : "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          <span>
                            {match.homeTeam.id === matchEvent.homeTeam.id ? (
                              <>
                                <span className="text-green-400">
                                  {match.homeScore?.period1! +
                                    match.homeScore?.period2!}
                                </span>
                                {"-"}
                                <span className="text-red-400">
                                  {match.awayScore?.period1! +
                                    match.awayScore?.period2!}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-red-400">
                                  {match.homeScore?.period1! +
                                    match.homeScore?.period2!}
                                </span>
                                {"-"}
                                <span className="text-green-400">
                                  {match.awayScore?.period1! +
                                    match.awayScore?.period2!}
                                </span>
                              </>
                            )}
                          </span>
                          {" / "}
                          {match.homeScore?.period1! +
                            match.awayScore?.period1! +
                            match.homeScore?.period2! +
                            match.awayScore?.period2!}
                        </TableCell>
                        <TableCell>
                          {match.homeTeam.id === matchEvent.homeTeam.id ? (
                            <>
                              <span className="text-green-400">
                                {match.homeScore?.period3!}
                              </span>
                              {"-"}
                              <span className="text-red-400">
                                {match.awayScore?.period3!}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-400">
                                {match.homeScore?.period3!}
                              </span>
                              {"-"}
                              <span className="text-green-400">
                                {match.awayScore?.period3!}
                              </span>
                            </>
                          )}
                          {" / "}
                          {match.homeScore?.period3 && match.homeScore?.period3
                            ? match.homeScore?.period3! +
                              match.awayScore?.period3!
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {match.homeTeam.id === matchEvent.homeTeam.id ? (
                            <>
                              <span className="text-green-400">
                                {match.homeScore?.period4!}
                              </span>
                              {"-"}
                              <span className="text-red-400">
                                {match.awayScore?.period4!}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-400">
                                {match.homeScore?.period4!}
                              </span>
                              {"-"}
                              <span className="text-green-400">
                                {match.awayScore?.period4!}
                              </span>
                            </>
                          )}
                          {" / "}
                          {match.homeScore?.period4 && match.homeScore?.period4
                            ? match.homeScore?.period4! +
                              match.awayScore?.period4!
                            : "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {match.homeTeam.id === matchEvent.homeTeam.id ? (
                            <>
                              <span className="text-green-400">
                                {match.homeScore?.period3! +
                                  match.homeScore?.period4!}
                              </span>
                              {"-"}
                              <span className="text-red-400">
                                {match.awayScore?.period3! +
                                  match.awayScore?.period4!}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-400">
                                {match.homeScore?.period3! +
                                  match.homeScore?.period4!}
                              </span>
                              {"-"}
                              <span className="text-green-400">
                                {match.awayScore?.period3! +
                                  match.awayScore?.period4!}
                              </span>
                            </>
                          )}
                          {" / "}
                          {match.homeScore?.period3! +
                            match.awayScore?.period3! +
                            match.homeScore?.period4! +
                            match.awayScore?.period4!}
                        </TableCell>
                        <TableCell className="font-bold">
                          {match.homeTeam.id === matchEvent.homeTeam.id ? (
                            <>
                              <span className="text-green-400">
                                {match.homeScore?.current!}
                              </span>
                              {"-"}
                              <span className="text-red-400">
                                {match.awayScore?.current!}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-400">
                                {match.homeScore?.current!}
                              </span>
                              {"-"}
                              <span className="text-green-400">
                                {match.awayScore?.current!}
                              </span>
                            </>
                          )}
                          {" / "}
                          {match.homeScore?.current! +
                            match.awayScore?.current!}
                        </TableCell>
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
                    <TableHead>Q1</TableHead>
                    <TableHead>Q2</TableHead>
                    <TableHead>1HT</TableHead>
                    <TableHead>Q3</TableHead>
                    <TableHead>Q4</TableHead>
                    <TableHead>2HT</TableHead>
                    <TableHead>Total</TableHead>
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
                              <>
                                <span className="text-green-400">
                                  {match.homeScore?.period1!}
                                </span>
                                {"-"}
                                <span className="text-red-400">
                                  {match.awayScore?.period1!}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-red-400">
                                  {match.homeScore?.period1!}
                                </span>
                                {"-"}
                                <span className="text-green-400">
                                  {match.awayScore?.period1!}
                                </span>
                              </>
                            )}
                          </span>
                          {" / "}
                          {match.homeScore?.period1 && match.homeScore?.period1
                            ? match.homeScore?.period1! +
                              match.awayScore?.period1!
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <span>
                            {match.homeTeam.id === matchEvent.awayTeam.id ? (
                              <>
                                <span className="text-green-400">
                                  {match.homeScore?.period2!}
                                </span>
                                {"-"}
                                <span className="text-red-400">
                                  {match.awayScore?.period2!}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-red-400">
                                  {match.homeScore?.period2!}
                                </span>
                                {"-"}
                                <span className="text-green-400">
                                  {match.awayScore?.period2!}
                                </span>
                              </>
                            )}
                          </span>
                          {" / "}
                          {match.homeScore?.period2 && match.homeScore?.period2
                            ? match.homeScore?.period2! +
                              match.awayScore?.period2!
                            : "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          <span>
                            {match.homeTeam.id === matchEvent.awayTeam.id ? (
                              <>
                                <span className="text-green-400">
                                  {match.homeScore?.period1! +
                                    match.homeScore?.period2!}
                                </span>
                                {"-"}
                                <span className="text-red-400">
                                  {match.awayScore?.period1! +
                                    match.awayScore?.period2!}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-red-400">
                                  {match.homeScore?.period1! +
                                    match.homeScore?.period2!}
                                </span>
                                {"-"}
                                <span className="text-green-400">
                                  {match.awayScore?.period1! +
                                    match.awayScore?.period2!}
                                </span>
                              </>
                            )}
                          </span>
                          {" / "}
                          {match.homeScore?.period1! +
                            match.awayScore?.period1! +
                            match.homeScore?.period2! +
                            match.awayScore?.period2!}
                        </TableCell>
                        <TableCell>
                          {match.homeTeam.id === matchEvent.awayTeam.id ? (
                            <>
                              <span className="text-green-400">
                                {match.homeScore?.period3!}
                              </span>
                              {"-"}
                              <span className="text-red-400">
                                {match.awayScore?.period3!}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-400">
                                {match.homeScore?.period3!}
                              </span>
                              {"-"}
                              <span className="text-green-400">
                                {match.awayScore?.period3!}
                              </span>
                            </>
                          )}
                          {" / "}
                          {match.homeScore?.period3 && match.homeScore?.period3
                            ? match.homeScore?.period3! +
                              match.awayScore?.period3!
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {match.homeTeam.id === matchEvent.awayTeam.id ? (
                            <>
                              <span className="text-green-400">
                                {match.homeScore?.period4!}
                              </span>
                              {"-"}
                              <span className="text-red-400">
                                {match.awayScore?.period4!}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-400">
                                {match.homeScore?.period4!}
                              </span>
                              {"-"}
                              <span className="text-green-400">
                                {match.awayScore?.period4!}
                              </span>
                            </>
                          )}
                          {" / "}
                          {match.homeScore?.period4 && match.homeScore?.period4
                            ? match.homeScore?.period4! +
                              match.awayScore?.period4!
                            : "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {match.homeTeam.id === matchEvent.awayTeam.id ? (
                            <>
                              <span className="text-green-400">
                                {match.homeScore?.period3! +
                                  match.homeScore?.period4!}
                              </span>
                              {"-"}
                              <span className="text-red-400">
                                {match.awayScore?.period3! +
                                  match.awayScore?.period4!}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-400">
                                {match.homeScore?.period3! +
                                  match.homeScore?.period4!}
                              </span>
                              {"-"}
                              <span className="text-green-400">
                                {match.awayScore?.period3! +
                                  match.awayScore?.period4!}
                              </span>
                            </>
                          )}
                          {" / "}
                          {match.homeScore?.period3! +
                            match.awayScore?.period3! +
                            match.homeScore?.period4! +
                            match.awayScore?.period4!}
                        </TableCell>
                        <TableCell className="font-bold">
                          {match.homeTeam.id === matchEvent.awayTeam.id ? (
                            <>
                              <span className="text-green-400">
                                {match.homeScore?.current!}
                              </span>
                              {"-"}
                              <span className="text-red-400">
                                {match.awayScore?.current!}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-400">
                                {match.homeScore?.current!}
                              </span>
                              {"-"}
                              <span className="text-green-400">
                                {match.awayScore?.current!}
                              </span>
                            </>
                          )}
                          {" / "}
                          {match.homeScore?.current! +
                            match.awayScore?.current!}
                        </TableCell>
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
