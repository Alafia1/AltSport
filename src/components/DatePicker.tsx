"use client";

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

const DatePicker = () => {
  const [date, setDate] = useState<Date>();
  return (
    <div>
      <Popover>
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
      </Popover>
    </div>
  );
};

export default DatePicker;