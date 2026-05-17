"use client";

interface TelemetryGridProps {
  firmDetails: any;
  isEditMode: boolean;
  handleFieldSync: (field: string, val: any) => Promise<void>;
}

export function TelemetryGrid({ firmDetails, isEditMode, handleFieldSync }: TelemetryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:flex lg:flex-row lg:items-center lg:gap-x-0 w-full lg:w-auto mt-6 lg:mt-0">
      {[
        { label: "IEC STATUS", value: firmDetails.iec_status || "VERIFIED", field: "iec_status" },
        { label: "SHIPMENTS", value: firmDetails.shipments || "1000+", field: "shipments" },
        { label: "YEARS IN TRADE", value: firmDetails.years_in_trade ? `${firmDetails.years_in_trade} YRS` : "51 YRS", field: "years_in_trade" },
        { label: "LOCATION", value: firmDetails.location || "Jalandhar", field: "location" },
        { label: "GLOBAL RANK", value: firmDetails.global_rank || "TIER 1", field: "global_rank" },
        { label: "NET WORTH", value: firmDetails.net_worth || "50CR", field: "net_worth" },
      ].map(({ label, value, field }) => (
        <div key={field} className="flex flex-col gap-y-1 text-left lg:text-right lg:border-l lg:border-white/5 lg:pl-6 lg:pr-6 first:border-l-0 first:pl-0 last:pr-0">
          <span className="font-sans text-[9px] tracking-[0.25em] text-zinc-500 uppercase font-medium block">
            {label}
          </span>
          {isEditMode && (field === "shipments" || field === "years_in_trade" || field === "location") ? (
            <input
              defaultValue={String(value).replace(' YRS', '')}
              inputMode={field === "years_in_trade" ? "numeric" : "text"}
              className="bg-transparent border-b border-white/10 outline-none font-sans text-sm text-zinc-100 font-semibold tracking-wide uppercase block focus:border-[#D4CAA3] transition-colors px-0 text-left lg:text-right w-full lg:w-32"
              onBlur={(e) => {
                void handleFieldSync(field, e.target.value);
              }}
            />
          ) : (
            <span className="font-sans text-sm text-zinc-100 font-semibold tracking-wide uppercase block">
              {value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
