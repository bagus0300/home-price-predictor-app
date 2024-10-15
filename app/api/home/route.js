import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'script', 'home_data.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const homeData = JSON.parse(jsonData);
    const getHomeIdFromUrl =(url)=> {
        const idRegex = /\/home\/(\d+)$/;
        const match = url.match(idRegex);
        return match ? match[1] : null;
    }

    const getCityFromAddress = (address)=> {
        const parts = address.split(',');
        if (parts.length >= 2) {
            return parts[parts.length - 2].trim();
        }
        return null;
    }

    const formattedHomeData = homeData.map(home => {
        return {
        id : getHomeIdFromUrl(home?.home_url),
        home_url: home?.home_url,
        image_link: home?.image_link,
        address: home?.address,
        city : getCityFromAddress(home?.address),
        price: home?.price,
        beds: home?.beds,
        baths: home?.baths,
        area: home?.area,
      };
    });

    return NextResponse.json(formattedHomeData);
  } catch (error) {
    console.error('Error reading or parsing home data:', error);
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 });
  }
}