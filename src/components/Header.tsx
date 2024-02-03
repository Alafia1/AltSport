import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Bell, Check } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Header = () => {
  return (
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
  );
};

export default Header;
