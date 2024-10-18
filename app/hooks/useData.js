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
import { getHomeData } from "../../utils/gethomedata";
import { getStateData } from "../../utils/getstatedata";
import { Slice } from "lucide-react";

const DataContext = createContext();

export const HomeDataProvider = ({ children }) => {
  const [homeData, setHomeData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Check if we have cached data
      const cachedHomeData = localStorage.getItem("cachedHomeData");
      const cachedStateData = localStorage.getItem("cachedStateData");
      const cachedTimestamp = localStorage.getItem("cachedTimestamp");

      // If we have cached data and it's less than 1 hour old, use it
      if (
        cachedHomeData &&
        cachedTimestamp &&
        cachedStateData &&
        Date.now() - parseInt(cachedTimestamp) < 360000
      ) {
        setHomeData(JSON.parse(cachedHomeData));
        setStateData(JSON.parse(cachedStateData));
        setLoading(false);
        return;
      }

      // Fetch  home data
      const prehomeData = await getHomeData();
      const prestateData = await getStateData();
      console.log("======state data============", prestateData.slice(0, 3));

      // Combine data
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const combinedData = shuffleArray(prehomeData);

      // Cache the data and timestamp
      localStorage.setItem("cachedHomeData", JSON.stringify(combinedData));
      localStorage.setItem("cachedStateData", JSON.stringify(prestateData));
      localStorage.setItem("cachedTimestamp", Date.now().toString());

      setHomeData(combinedData);
      setStateData(prestateData);
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
    <DataContext.Provider
      value={{ homeData, stateData, loading, refreshEvents: getAllData }}>
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
