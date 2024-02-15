import { format } from "date-fns";
import { create } from "zustand";

interface DateState {
  date: string;
  setDate: (date: string) => void;
}

export const useDateStore = create<DateState>()((set) => ({
  date: format(new Date(), "yyyy-MM-dd"),
  setDate: (date: string) => set({ date }),
}));
