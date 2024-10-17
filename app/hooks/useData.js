"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import moment from "moment";
import axios from "axios";
import { getHomeData } from "../../util/gethomedata";
import { Slice } from "lucide-react";

const DataContext = createContext();

export const HomeDataProvider = ({ children }) => {
  const [data, setHomeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Check if we have cached data
      const cachedData = localStorage.getItem("cachedData");
      const cachedTimestamp = localStorage.getItem("cachedTimestamp");

      // If we have cached data and it's less than 1 hour old, use it
      if (
        cachedData &&
        cachedTimestamp &&
        Date.now() - parseInt(cachedTimestamp) < 360000
      ) {
        setHomeData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      // Fetch  home data
      const homeData = await getHomeData();

      // Combine data
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const combinedData = shuffleArray(homeData);

      // Cache the data and timestamp
      localStorage.setItem("cachedData", JSON.stringify(combinedData));
      localStorage.setItem("cachedTimestamp", Date.now().toString());

      setHomeData(combinedData);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  return (
    <DataContext.Provider value={{ data, loading, refreshEvents: getAllData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within an DataProvider");
  }
  return context;
};
