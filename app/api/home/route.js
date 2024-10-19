import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "script", "home_data.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const homeData = JSON.parse(jsonData);

    const getHomeIdFromUrl = (url) => {
      const idRegex = /\/home\/(\d+)$/;
      const match = url.match(idRegex);
      return match ? match[1] : null;
    };

    const getCityFromAddress = (address) => {
      const parts = address.split(",");
      if (parts.length >= 2) {
        return parts[parts.length - 2].trim();
      }
      return null;
    };

    // Create a Map to store unique homes by URL
    const uniqueHomes = new Map();

    const formattedHomeData = homeData
      .filter(
        (home) =>
          home.image_link !==
          "https://ssl.cdn-redfin.com/photo/92/islphoto/870/genIslnoResize.3231870_0.jpg"
      )
      .forEach((home) => {
        // Only keep the first occurrence of each home_url
        if (!uniqueHomes.has(home.home_url)) {
          uniqueHomes.set(home.home_url, {
            id: getHomeIdFromUrl(home?.home_url),
            home_url: home?.home_url,
            image_link: home?.image_link,
            address: home?.address,
            city: home?.city,
            price: home?.price,
            beds: home?.beds,
            baths: home?.baths,
            area: home?.area,
          });
        }
      });

    // Convert Map values to array
    const uniqueHomeArray = Array.from(uniqueHomes.values());

    return NextResponse.json(uniqueHomeArray);
  } catch (error) {
    console.error("Error reading or parsing home data:", error);
    return NextResponse.json(
      { error: "Failed to fetch home data" },
      { status: 500 }
    );
  }
}
