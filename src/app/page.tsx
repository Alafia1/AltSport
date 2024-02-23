import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GiAmericanFootballBall,
  GiBaseballBat,
  GiHockey,
  GiSoccerBall,
  GiTennisBall,
  GiVolleyballBall,
} from "react-icons/gi";
import { BiBasketball } from "react-icons/bi";
import MatchListTest from "@/components/MatchListTest";

export default function Home() {
  return (
    <main className="relative">
      <div className="bg-slate-600 h-10">
        <MaxWidthWrapper>
          <div className="flex justify-between">
            <Tabs defaultValue="football" className="w-full ">
              <TabsList className="bg-slate-600 active:bg-slate-800 flex flex-col md:flex-row">
                <TabsTrigger value="football">
                  <GiSoccerBall className="mr-2" /> Football
                </TabsTrigger>
                <TabsTrigger value="basketball">
                  <BiBasketball className="mr-2" /> Basketball
                </TabsTrigger>
                <TabsTrigger value="icehockey">
                  <GiHockey className="mr-2" /> Ice Hockey
                </TabsTrigger>
                <TabsTrigger value="tennis">
                  <GiTennisBall className="mr-2" /> Tennis
                </TabsTrigger>
                <TabsTrigger value="volleyball">
                  <GiVolleyballBall className="mr-2" /> Volleyball
                </TabsTrigger>
                <TabsTrigger value="handball">
                  <GiVolleyballBall className="mr-2" /> Handball
                </TabsTrigger>
                <TabsTrigger value="america-football">
                  <GiAmericanFootballBall className="mr-2" />
                  American Football
                </TabsTrigger>
                <TabsTrigger value="baseball">
                  <GiBaseballBat className="mr-2" />
                  Baseball
                </TabsTrigger>
              </TabsList>
              <TabsContent value="football">
                <MatchListTest sport="football" />
              </TabsContent>
              <TabsContent value="basketball">
                <MatchListTest sport="basketball" />
              </TabsContent>
              <TabsContent value="icehockey">
                <MatchListTest sport="ice-hockey" />
              </TabsContent>
              <TabsContent value="tennis">
                <MatchListTest sport="tennis" />
              </TabsContent>
              <TabsContent value="volleyball">
                <MatchListTest sport="volleyball" />
              </TabsContent>
              <TabsContent value="handball">
                <MatchListTest sport="handball" />
              </TabsContent>
              <TabsContent value="america-football">
                <MatchListTest sport="american-football" />
              </TabsContent>
              <TabsContent value="baseball">
                <MatchListTest sport="baseball" />
              </TabsContent>
            </Tabs>
            <div>{/* <DatePicker /> */}</div>
          </div>
        </MaxWidthWrapper>
      </div>
      <div className="bg-slate-700 w-full h-40"></div>
    </main>
  );
}
