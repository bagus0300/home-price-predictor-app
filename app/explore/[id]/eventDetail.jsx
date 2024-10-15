"use client";
import React from "react";
import { LoadingComponent } from "@/app/components/loading";
import Image from "next/image";
import { MapPinIcon, CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

// Helper function to get the largest image
const getLargestImage = (images) => {
  return images.reduce((largest, current) => {
    return (current.width * current.height > largest.width * largest.height) ? current : largest;
  });
};

export const EventDetailPage = ({ eventDetail }) => {
  const [isLoading, setLoading] = useState(true);
  const [event, setEvent] = useState(eventDetail);
  const [largestImage, setLargestImage] = useState(null);

  useEffect(() => {
    if (eventDetail) {
      setEvent(eventDetail);
      setLargestImage(getLargestImage(eventDetail.images));
      setLoading(false);
    } else {
      setLoading(true);
      setEvent(undefined);
      setLargestImage(null);
    }
  }, [eventDetail]);

  return (
    <div>
      {!isLoading && event && largestImage? (
        <div className="px-6 pt-20 mx-auto space-y-8 max-w-[100rem] lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
          <div className="flex flex-row gap-4 lg:flex-row justify-center items-start">
            <div className="flex flex-col w-full max-w-[800px] mx-auto lg:mx-0 gap-4 lg:w-[60%]">
              <div className="w-full h-[500px] relative rounded-lg overflow-hidden">
                <Image src={largestImage?.url || event?.images[0].url} fill={true} alt={event?.name} />
              </div>
              <div className="bg-zinc-800 p-4 text-zinc-200 rounded-lg">
                <div className="flex"></div>
                <div className="py-2">
                  <h2 className="z-20 mt-4 text-3xl font-extrabold duration-1000 lg:text-5xl text-zinc-200 group-hover:text-white font-display">
                    {event?.name}
                  </h2>
                </div>
                <div className="py-2 flex">
                  <div className="w-12 h-12 rounded-xl border border-solid border-slate-500 mr-3 flex justify-center items-center">
                    <CalendarIcon className="text-zinc-400 min-w-[40px]" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-lg font-bold break-words">
                      {event?.dates?.start?.localTime}
                    </p>
                    <p>{event?.dates.timezone}</p>
                  </div>
                </div>
                <div className="py-2 flex">
                  <div className="w-12 h-12 rounded-xl border border-solid border-slate-500 mr-3 flex justify-center items-center">
                    <MapPinIcon className="text-zinc-400 min-w-[40px]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold break-words">
                      {event?._embedded?.venues[0]?.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-zinc-200 w-full max-w-[650px] mx-auto lg:mx-0 lg:w-[40%] flex-row">
              <div className="p-4 rounded-lg bg-zinc-800 w-full">
                <div className="py-4">
                  <p className="text-3xl font-extrabold pl-4 border-l-4 border-green-400">
                    About the event
                  </p>
                </div>
                <div className="w-full h-[2px] bg-slate-500 mb-4"></div>
                <div>
                  <div className="event-description break-words">
                    {event?.accessibility?.info ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: event?.accessibility?.info,
                        }}
                      />
                    ) : (
                      <p>No Information</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-row gap-4 w-full">
                <div className="mt-4 w-full xl:w-[50%] p-4 rounded-lg bg-zinc-800">
                  <div className="my-2 pl-2 border-l-4 border-green-400 flex items-center">
                    <p className="text-lg font-bold text-zinc-300">Price </p>
                  </div>
                  <div className="w-full h-[2px] bg-slate-500 mb-4"></div>
                  {event?.priceRanges?.min ? (
                    <div className="my-2 pl-2 flex items-center">
                      <p className="text-lg w-full font-semibold break-words">
                        {event?.priceRanges[0].min}{" "}
                        {event.priceRanges[0].currency}{" "}
                      </p>
                    </div>
                  ) : (
                    <p>No price</p>
                  )}
                </div>
                <div className="mt-4 w-full p-4 rounded-lg bg-zinc-800">
                  <div className="my-2 pl-2 border-l-4 border-green-400 flex items-center">
                    <p className="text-lg font-bold text-zinc-300">Address</p>
                  </div>
                  <div className="w-full h-[2px] bg-slate-500 mb-4"></div>
                  <div className="my-2 pl-2 flex items-center">
                    <div className="pl-2 break-words">
                      <p className="text-lg w-full font-semibold break-words">
                        {" "}
                        {event?._embedded?.venues[0]?.address.line1}{" "}
                        {event?._embedded?.venues[0]?.city.name}{" "}
                        {event?._embedded?.venues[0]?.country.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-full p-4 rounded-lg bg-zinc-800">
                  <div className="my-2 pl-2 border-l-4 border-green-400 flex items-center">
                    <p className="text-lg font-bold text-zinc-300 cursor-pointer">
                      Ticket Reservation
                    </p>
                  </div>
                  <div className="w-full h-[2px] bg-slate-500 mb-4"></div>
                  <Link href={event?.url} target="blank">
                    <div className="my-2 pl-2 flex items-center">
                      <div className="pl-2 break-words">
                        <p className="text-lg w-full font-semibold break-words">
                          {event?.url}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};