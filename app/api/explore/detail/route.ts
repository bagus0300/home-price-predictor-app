// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// export async function GET(req: NextRequest) {
//     try {
//         const id = req.nextUrl.searchParams.get("id");
//         const result = await axios.get(`https://www.web3event.org/web3event/api/v3/event/detail/${id}`)
//         return NextResponse.json({data: result.data.data}, {status: 200})
//     } catch (error: any) {
//         console.error('Error fetching web3event detail:', error);
//         return NextResponse.json({ error: error.message }, { status: 500 })
//     }
// }


import {NextRequest, NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;

export async function GET(req: NextRequest) {

    try {
    
    const id = req.nextUrl.searchParams.get("id");
    const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${apiKey}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}