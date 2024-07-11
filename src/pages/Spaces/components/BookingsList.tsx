import React from "react";
import IconMinus from "../../../components/Icon/IconMinus";

const stats = [
  {
    name: "Total Views",
    stat: 0,
    previousStat: "70,946",
    change: "12%",
    changeType: "increase",
  },
  {
    name: "Total Bookings",
    stat: 0,
    previousStat: "56.14%",
    change: "2.02%",
    changeType: "increase",
  },
  {
    name: "Total Earned",
    stat: "$0",
    previousStat: "28.62%",
    change: "4.05%",
    changeType: "decrease",
  },
];


export default function BookingsList() {
  return (
    <div className="panel">
      <div className="w-full font-semibold">
        <dl className="grid grid-cols-1 divide-y divide-gray-200 overflow-hidden md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map((item) => (
            <div key={item.name} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-semibold text-zinc-700">
                {item.name}
              </dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-center text-2xl font-bold text-zinc-600">
                  {item.stat}
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    <IconMinus className="h-5 w-5 inline-block" />
                  </span>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
