import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GiAmericanFootballBall,
  GiHockey,
  GiSoccerBall,
  GiTennisBall,
} from "react-icons/gi";
import { BiBasketball } from "react-icons/bi";
import MatchList from "@/components/MatchList";
import DatePicker from "@/components/DatePicker";

export default function Home() {
  //const [date, setDate] = useState<Date>();
  return (
    <main className="relative">
      <div className="bg-slate-600 h-10">
        <MaxWidthWrapper>
          <div className="flex justify-between">
            <Tabs defaultValue="football" className="w-full">
              <TabsList className="bg-slate-600 active:bg-slate-800">
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
                <TabsTrigger value="america-football">
                  <GiAmericanFootballBall className="mr-2" />
                  American Football
                </TabsTrigger>
              </TabsList>
              <TabsContent value="football">
                <MatchList sport="football" />
              </TabsContent>
              <TabsContent value="basketball">
                <MatchList sport="basketball" />
              </TabsContent>
            </Tabs>
            <div>
              <DatePicker />
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      <div className="bg-slate-700 w-full h-40"></div>
    </main>
  );
}
