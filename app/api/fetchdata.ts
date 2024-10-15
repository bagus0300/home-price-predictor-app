import axios from "axios";
import {NextRequest, NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
const querySize = "200"


// export const fetchEvents = async ( 
//   querySize: number = 200,
//   countryCode: string = 'GB,IE,DE,AT,CH,BE,NL,ES,IT,SE,NO,DK,FI,PL,CZ,HU,SK,BR,AR,CL,CA'
// ) => {
//   const apiKey = process.env.NEXT_PUBLIC_NEXT_PUBLIC_TICKETMASTER_API_KEY; // Make sure to set this in your environment variables

//   let allEvents: any[] = [];
  
//   for (let page = 0; page < 5; page++) { // Loop through 5 pages to get 1000 events
//     const ticketMasterURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=${querySize}&page=${page}&sort=date,asc&countryCode=${countryCode}`;
    
//     try {
//       const response: any = await axios.get(ticketMasterURL);
//       allEvents = allEvents.concat(response.data._embedded.events);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       throw error;
//     }
//   }
  
//   return allEvents;
// };


export const fetchEvents = async (totalEventLimit: number = 900) => {
  const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
  const countries = ['GB', 'IE', 'DE', 'AT', 'CH', 'BE', 'NL', 'ES', 'IT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'SK', 'BR', 'AR', 'CL', 'CA'];
  
  let allEvents: any[] = [];
  const eventsPerCountry = Math.floor(totalEventLimit / countries.length);

  for (const country of countries) {
    if (allEvents.length >= totalEventLimit) break;

    let countryEvents: any[] = [];
    let page = 0;

    while (countryEvents.length < eventsPerCountry) {
      const remainingSlots = totalEventLimit - allEvents.length;
      const querySize = Math.min(40, remainingSlots, eventsPerCountry - countryEvents.length);
      
      if (querySize <= 0) break;

      const ticketMasterURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=${querySize}&page=${page}&sort=date,asc&countryCode=${country}`;
      
      try {
        const response: any = await axios.get(ticketMasterURL);
        const events = response.data._embedded?.events || [];
        
        if (events.length === 0) break; // No more events for this country

        countryEvents = countryEvents.concat(events);
        page++;
      } catch (error) {
        console.error(`Error fetching events for ${country}:`, error);
        break;
      }
    }

    allEvents = allEvents.concat(countryEvents.slice(0, eventsPerCountry));
  }

  return allEvents;
};

// export const fetchWeb3event = async () => {
//   const data = {
//     "pages": 0,
//     "page_size": 0,
//     "status": 1,
//     "time": "",
//     "time_to": "",
//     "type": 1
//   };

//   try {
//     const result: any = await axios.post(`https://www.web3event.org/web3event/api/v2/map/events/query`,
//       data)
//     return result.data.data;
//   } catch (error) {
//     console.error('Error fetching web3event map data:', error);
//     throw error;
//   };
// };

export const fetchWeb3event = async () => {
  const data = {
    "pages": 0,
    "page_size": 0,
    "status": 1,
    "time": "",
    "time_to": "",
    "type": 1
  };

  try {
    console.log('Sending request to Web3Event API...');
    const result = await axios.post(`https://www.web3event.org/web3event/api/v2/map/events/query`, data);
    console.log('Received response:', result.data);
    if (!result.data.data || result.data.data.length === 0) {
      console.warn('API returned empty data');
    }
    return result.data.data || [];
  } catch (error : any) {
    console.error('Error fetching web3event map data:', error.response ? error.response.data : error.message);
    return [];
  }
};


export const getEvents = async (totalEventLimit: number = 900) => {
  const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
  const countries = ['GB', 'IE', 'DE', 'AT', 'CH', 'BE', 'NL', 'ES', 'IT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'SK', 'BR', 'AR', 'CL', 'CA'];
  
  let allEvents: any[] = [];
  const eventsPerCountry = Math.floor(totalEventLimit / countries.length);

  for (const country of countries) {
    if (allEvents.length >= totalEventLimit) break;

    let countryEvents: any[] = [];
    let page = 0;

    while (countryEvents.length < eventsPerCountry) {
      const remainingSlots = totalEventLimit - allEvents.length;
      const querySize = Math.min(150, remainingSlots, eventsPerCountry - countryEvents.length);
      
      if (querySize <= 0) break;

      const ticketMasterURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=${querySize}&page=${page}&sort=date,asc&countryCode=${country}`;
      
      try {
        const response: any = await axios.get(ticketMasterURL);
        const events = response.data._embedded?.events || [];
        
        if (events.length === 0) break; // No more events for this country

        countryEvents = countryEvents.concat(events);
        page++;
      } catch (error) {
        console.error(`Error fetching events for ${country}:`, error);
        break;
      }
    }

    allEvents = allEvents.concat(countryEvents.slice(0, eventsPerCountry));
  }

  return allEvents;
};



// export const fetchEvents = async (
//   minEventsPerCountry: number = 10,
//   maxEventsPerCountry: number = 30,
//   countries: string[] = ['GB', 'IE', 'DE', 'AT', 'CH', 'BE', 'NL', 'FR', 'ES', 'IT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'SK', 'BR', 'AR', 'CL', 'CA']
// ) => {
//   const apiKey = process.env.NEXT_PUBLIC_NEXT_PUBLIC_TICKETMASTER_API_KEY;

//   const getRandomEventsCount = () => 
//     Math.floor(Math.random() * (maxEventsPerCountry - minEventsPerCountry + 1)) + minEventsPerCountry;

//   const fetchEventsForCountry = async (countryCode: string) => {
//     const eventsCount = getRandomEventsCount();
//     const ticketMasterURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=${eventsCount}&sort=date,asc&countryCode=${countryCode}`;

//     try {
//       const response = await axios.get(ticketMasterURL);
//       return response.data._embedded?.events || [];
//     } catch (error) {
//       console.error(`Error fetching events for ${countryCode}:`, error);
//       return [];
//     }
//   };

//   try {
//     const allEvents = await Promise.all(countries.map(fetchEventsForCountry));
//     return allEvents.flat();
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     throw error;
//   }
// };






export const getEventDetail = async (id: string) => {
  try {
    const response: any = await axios.get(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${apiKey}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Ticketmaster event detail:', error);
    throw error;
  }
};

