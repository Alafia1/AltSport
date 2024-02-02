const express = require("express");
const next = require("next");
const axios = require("axios");
const { PrismaClient, Status } = require("@prisma/client");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

async function insertEventData(eventData) {
  const {
    tournament,
    season,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    periods,
    ...matchData
  } = eventData;

  const existLeague = await prisma.league.findFirst({
    where: {
      id: tournament.id,
    },
  });
  const createdLeague = !existLeague
    ? await prisma.league.create({
        data: {
          id: tournament.id,
          name: tournament.name,
          slug: tournament.slug,
        },
      })
    : existLeague;

  const existSeason = await prisma.season.findFirst({
    where: {
      id: season.id,
    },
  });
  const createdSeason = !existSeason
    ? await prisma.season.create({
        data: {
          id: season.id,
          name: season.name,
          year: season.year,
        },
      })
    : existSeason;

  const existHome = await prisma.team.findFirst({
    where: {
      id: homeTeam.id,
    },
  });
  const createdHomeTeam = !existHome
    ? await prisma.team.create({
        data: {
          id: homeTeam.id,
          name: homeTeam.name,
          slug: homeTeam.slug,
          shortname: homeTeam.shortName,
          code: homeTeam.nameCode,
          national: homeTeam.national,
        },
      })
    : existHome;

  const existAway = await prisma.team.findFirst({
    where: {
      id: awayTeam.id,
    },
  });
  const createdAwayTeam = !existAway
    ? await prisma.team.create({
        data: {
          id: awayTeam.id,
          name: awayTeam.name,
          slug: awayTeam.slug,
          shortname: awayTeam.shortName,
          code: awayTeam.nameCode,
          national: awayTeam.national,
        },
      })
    : existAway;

  const existMatch = await prisma.match.findFirst({
    where: {
      id: eventData.id,
    },
  });
  const createdMatch = !existMatch
    ? await prisma.match.create({
        data: {
          id: eventData.id,
          date: eventData.startTimestamp,
          slug: eventData.slug,
          status:
            eventData.status.type === "finished"
              ? Status.FINISHED
              : eventData.status.type === "notstarted"
              ? Status.NOTSTARTED
              : Status.INPROGRESS,
          leagueId: createdLeague.id,
          seasonId: createdSeason.id,
          homeTeamId: createdHomeTeam.id,
          awayTeamId: createdAwayTeam.id,
        },
      })
    : existMatch;

  const existHomeScore = await prisma.homeScore.findFirst({
    where: {
      matchId: eventData.id,
    },
  });

  const createdHomeScore = !existHomeScore
    ? eventData.status.type === "notstarted"
      ? await prisma.homeScore.create({
          data: {
            matchId: createdMatch.id,
          },
        })
      : eventData.status.type === "inprogress"
      ? await prisma.homeScore.create({
          data: {
            matchId: createdMatch.id,
          },
        })
      : eventData.status.type === "finished"
      ? await prisma.homeScore.create({
          data: {
            matchId: createdMatch.id,
            period1: homeScore.period1,
            period2: homeScore.period2,
            period3: homeScore.period3,
            period4: homeScore.period4,
          },
        })
      : await prisma.homeScore.update({
          where: {
            matchId: createdMatch.id,
          },
          data: {
            period1: homeScore.period1,
            period2: homeScore.period2,
            period3: homeScore.period3,
            period4: homeScore.period4,
          },
        })
    : await prisma.homeScore.update({
        where: {
          matchId: createdMatch.id,
        },
        data: {
          period1: homeScore.period1,
          period2: homeScore.period2,
          period3: homeScore.period3,
          period4: homeScore.period4,
        },
      });

  const existAwayScore = await prisma.awayScore.findFirst({
    where: {
      matchId: eventData.id,
    },
  });

  const createdAwayScore = !existAwayScore
    ? eventData.status.type === "notstarted"
      ? await prisma.awayScore.create({
          data: {
            matchId: createdMatch.id,
          },
        })
      : eventData.status.type === "inprogress"
      ? await prisma.awayScore.create({
          data: {
            matchId: createdMatch.id,
          },
        })
      : eventData.status.type === "finished"
      ? await prisma.awayScore.create({
          data: {
            matchId: createdMatch.id,
            period1: awayScore.period1,
            period2: awayScore.period2,
            period3: awayScore.period3,
            period4: awayScore.period4,
          },
        })
      : await prisma.awayScore.update({
          where: {
            matchId: createdMatch.id,
          },
          data: {
            period1: awayScore.period1,
            period2: awayScore.period2,
            period3: awayScore.period3,
            period4: awayScore.period4,
          },
        })
    : await prisma.awayScore.update({
        where: {
          matchId: createdMatch.id,
        },
        data: {
          period1: awayScore.period1,
          period2: awayScore.period2,
          period3: awayScore.period3,
          period4: awayScore.period4,
        },
      });

  // Insert other related data as needed

  return createdMatch;
}

app.prepare().then(() => {
  const server = express();

  // Your Express middleware and routes go here
  server.get("/api/test", (req, res) => {
    res.json({
      message: "Hello and welcome to All-Sport using NextJS and Express",
    });
  });

  server.get("/api/fetch/basketball/", async (req, res) => {
    try {
      // Fetch basketball events from SofaScore API
      const response = await axios.get(
        "https://api.sofascore.com/api/v1/sport/basketball/scheduled-events/2024-01-20"
      );
      const eventsToSave = response.data.events;
      for (const event of eventsToSave) {
        insertEventData(event)
          .then((result) => {
            console.log("Event data inserted:", result);
          })
          .catch((error) => {
            console.error("Error inserting event data:", error);
          })
          .finally(async () => {
            await prisma.$disconnect();
          });
      }
      res.json(eventsToSave[0]);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  server.get("/api/fetch/football/", async (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedToday = `${year}-${month}-${day}`;
    console.log(formattedToday);
    const dateParam = req.query.date || formattedToday;

    try {
      // Fetch basketball events from SofaScore API
      const response = await axios.get(
        `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${dateParam}`
      );
      const eventsToSave = response.data.events;
      for (const event of eventsToSave) {
        insertFootballEventData(event)
          .then((result) => {
            console.log("Event data inserted:", result);
          })
          .catch((error) => {
            console.error("Error inserting event data:", error);
          })
          .finally(async () => {
            await prisma.$disconnect();
          });
      }
      res.json(eventsToSave[0]);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  server.get("/api/games/", async (req, res) => {
    const enrichedGames = [];

    const teamGames = await prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: 3409 }, { awayTeamId: 3409 }],
      },
    });

    for (const game of teamGames) {
      const league = await prisma.league.findFirst({
        where: {
          id: game.leagueId,
        },
      });
      const homeTeam = await prisma.team.findFirst({
        where: {
          id: game.homeTeamId,
        },
      });
      const awayTeam = await prisma.team.findFirst({
        where: {
          id: game.awayTeamId,
        },
      });
      const homeScore = await prisma.homeScore.findFirst({
        where: {
          matchId: game.id,
        },
      });
      const awayScore = await prisma.awayScore.findFirst({
        where: {
          matchId: game.id,
        },
      });
      const enrichedGame = {
        ...game,
        league: league || null,
        homeTeam: homeTeam || null,
        awayTeam: awayTeam || null,
        homeScore: homeScore || null,
        awayScore: awayScore || null, // Use null if league is not found
      };

      enrichedGames.push(enrichedGame);
    }

    res.json({ match: enrichedGames });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
