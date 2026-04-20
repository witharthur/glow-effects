import { Signal, Wifi, BatteryFull } from "lucide-react";

export const StatusBar = () => (
  <div className="flex items-center justify-between px-6 pt-3 pb-2 text-foreground text-[15px] font-semibold">
    <span className="tabular-nums">9:41</span>
    <div className="flex items-center gap-1.5">
      <Signal className="h-4 w-4" strokeWidth={2.5} />
      <Wifi className="h-4 w-4" strokeWidth={2.5} />
      <BatteryFull className="h-5 w-5" strokeWidth={2} />
    </div>
  </div>
);
