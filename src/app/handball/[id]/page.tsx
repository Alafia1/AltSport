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
  ranking: number;
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

  //   const count = IceAnalysis(
  //     home,
  //     matchEvent.homeTeam.id,
  //     away,
  //     matchEvent.awayTeam.id
  //   );
  return (
    <div className="bg-slate-600">
      <MaxWidthWrapper>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex gap-5">
                <div className="relative">
                  {matchEvent.homeTeam.name}{" "}
                  {matchEvent.homeTeam.ranking && (
                    <span className="bg-slate-900 text-sm text-slate-200 rounded-full p-1">
                      {matchEvent.homeTeam.ranking}
                    </span>
                  )}
                </div>
                <span> Vs </span>
                <div>
                  {matchEvent.awayTeam.name}{" "}
                  {matchEvent.awayTeam.ranking && (
                    <span className="bg-slate-900 text-sm text-slate-200 rounded-full p-1">
                      {matchEvent.awayTeam.ranking}
                    </span>
                  )}
                </div>
              </div>
            </CardTitle>
            <CardDescription>{matchEvent.tournament.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {/* {count.map((outcome) => (
                <div key={outcome}>
                  <p>{outcome}</p>
                </div>
              ))} */}
            </div>
          </CardContent>
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
                    <TableHead>P1</TableHead>
                    <TableHead>P2</TableHead>
                    <TableHead>P3</TableHead>
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
                        </TableCell>
                        <TableCell>
                          <span>
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
                          </span>
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
                  Last 10 games for {matchEvent.awayTeam.name}{" "}
                  {matchEvent.awayTeam.id}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Against</TableHead>
                    <TableHead>P1</TableHead>
                    <TableHead>P2</TableHead>
                    <TableHead>P3</TableHead>
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
                        </TableCell>
                        <TableCell>
                          <span>
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
                          </span>
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
