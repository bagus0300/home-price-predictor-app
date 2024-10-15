import React from "react";
import { getEventDetail } from "@/app/api/fetchdata";
import { Navigation } from "@/app/components/nav";
import { EventDetailPage } from "./eventDetail";

const Page = async ({ params }) => {
    const { id } = params;
    const eventDetail = await getEventDetail(id);

    return (
        <div>
            <Navigation />
            <EventDetailPage eventDetail={eventDetail} />
        </div>
    );
};

export default Page;