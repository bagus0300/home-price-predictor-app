"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { getHomeData } from "../../utils/gethomedata";
import { getStateData } from "../../utils/getstatedata";

const DataContext = createContext();

const HOME_STORE = "homeData";
const STATE_STORE = "stateData";
const TIMESTAMP_KEY = "dataTimestamp";

export const HomeDataProvider = ({ children }) => {
  const [homeData, setHomeData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(true);

  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving data to localStorage: ${error}`);
    }
  };

  const getFromStorage = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error retrieving data from localStorage: ${error}`);
      return null;
    }
  };

  const getAllData = useCallback(async () => {
    setLoading(true);
    try {
      const cachedHomeData = getFromStorage(HOME_STORE);
      const cachedStateData = getFromStorage(STATE_STORE);
      const cachedTimestamp = getFromStorage(TIMESTAMP_KEY);

      if (
        cachedHomeData &&
        cachedStateData &&
        cachedTimestamp &&
        Date.now() - cachedTimestamp < 3600000 // 1 hour
      ) {
        setHomeData(cachedHomeData);
        setStateData(cachedStateData);
        setLoading(false);
        return;
      }

      const prehomeData = await getHomeData();
      const prestateData = await getStateData();

      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const combinedData = shuffleArray(prehomeData);

      saveToStorage(HOME_STORE, combinedData);
      saveToStorage(STATE_STORE, prestateData);
      saveToStorage(TIMESTAMP_KEY, Date.now());

      setHomeData(combinedData);
      setStateData(prestateData);
    } catch (error) {
      console.error("Error fetching or caching data:", error);
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
