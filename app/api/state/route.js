import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "script",
      "home_analyze_data.json"
    );
    const jsonData = await fs.readFile(filePath, "utf8");
    const stateData = JSON.parse(jsonData);
    const getCity = (location) => {
      // Split the string by the comma to separate the city and state
      let parts = location.split(",");

      // Trim whitespace and return the first part, which is the city
      return parts[0].trim();
    };

    const formattedStateData = Object.entries(stateData).flatMap(
      ([state, stateInfo]) => {
        return stateInfo.cities.map((city) => ({
          state,
          description: stateInfo?.state_description,
          city: getCity(city?.city),
          average_price: city?.avg_list_price,
          sqft_price: city?.avg_price_per_sqft,
        }));
      }
    );

    return NextResponse.json(formattedStateData);
  } catch (error) {
    console.error("Error reading or parsing stateData:", error);
    return NextResponse.json(
      { error: "Failed to fetch stateData" },
      { status: 500 }
    );
  }
}
