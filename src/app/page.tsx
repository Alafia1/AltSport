import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaFootball } from "react-icons/fa6";
import {
  GiAmericanFootballBall,
  GiHockey,
  GiSoccerBall,
  GiTennisBall,
} from "react-icons/gi";
import { BiBasketball } from "react-icons/bi";
import MatchList from "@/components/MatchList";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export default function Home() {
  //const [date, setDate] = useState<Date>();
  return (
    <main>
      <div className=" bg-slate-800 w-full h-20 flex items-center">
        <MaxWidthWrapper>
          <div className=" h-full flex justify-between items-center">
            <div className="flex justify-around items-center">
              <Check size={64} color="#1d9031" />
              <h3 className=" font-bold text-5xl text-slate-200">All Stats</h3>
            </div>
            <div className="flex justify-around items-center">
              <Input size={60} content="Search" className="bg-slate-200" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex justify-around items-center mr-5">
                <h5 className=" text-xl text-slate-200 mr-2">Favorite</h5>
                <Bell size={34} color="#1d9031" />
              </div>
              <div className="flex justify-around items-center">
                <Avatar>
                  <AvatarImage src="/User-Avatar.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
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
                football Lorem, ipsum dolor sit amet consectetur adipisicing
                elit. Eius totam earum saepe molestias aut? Animi, quasi velit
                laboriosam dolore officiis quaerat vero quidem voluptas?
                Excepturi dignissimos nesciunt recusandae dolorem animi
                voluptatum consequatur, minus ad asperiores modi nemo facilis
                officia, illum distinctio. Rem asperiores itaque, ipsum facilis
                necessitatibus ducimus nisi nam perspiciatis. Non ut ad
                voluptate facilis, quod ipsam quaerat tenetur temporibus
                doloremque corrupti dolore unde maxime fugit a debitis iste
                itaque illo. Dignissimos quae saepe obcaecati culpa alias
                molestiae dolorem dicta accusamus inventore explicabo repellat
                consequatur laudantium aut aspernatur optio assumenda, facere
                quam vero consequuntur sed qui necessitatibus blanditiis!
                Ducimus?
              </TabsContent>
              <TabsContent value="basketball">basketball</TabsContent>
            </Tabs>
            <div>
              {/* <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !date && "text-primary"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover> */}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </main>
  );
}
