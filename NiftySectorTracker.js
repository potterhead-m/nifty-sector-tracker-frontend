import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axios from "axios";

export default function NiftySectorTracker() {
  const [sectors, setSectors] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSectorData();
    const interval = setInterval(fetchSectorData, 30000); // Auto-update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSectorData = async () => {
    try {
      const apiUrl = "https://nifty-sector-tracker-backend.onrender.com";
      const response = await axios.get(`${apiUrl}/api/getNiftySectors`);
      setSectors(response.data);
    } catch (error) {
      console.error("Error fetching sector data", error);
      setError("Failed to load sector data. Please try again later.");
    }
  };

  const fetchStockData = async (sector) => {
    try {
      setSelectedSector(sector);
      const apiUrl = "https://nifty-sector-tracker-backend.onrender.com";
      const response = await axios.get(`${apiUrl}/api/getStocksBySector?sector=${sector}`);
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stock data", error);
      setError("Failed to load stock data. Please try again later.");
    }
  };

  useEffect(() => {
    if (selectedSector) {
      fetchStockData(selectedSector);
      const interval = setInterval(() => fetchStockData(selectedSector), 15000); // Auto-update every 15 seconds
      return () => clearInterval(interval);
    }
  }, [selectedSector]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nifty Sector Tracker</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-3 gap-4">
        {sectors.map((sector) => (
          <motion.div key={sector.name} whileHover={{ scale: 1.05 }}>
            <Card onClick={() => fetchStockData(sector.name)} className="p-4 cursor-pointer">
              <CardContent>
                <h2 className="text-lg font-semibold">{sector.name}</h2>
                <p>Current: {sector.current}</p>
                <p>ATH: {sector.allTimeHigh}</p>
                <p>Drop from ATH: {((sector.allTimeHigh - sector.current) / sector.allTimeHigh * 100).toFixed(2)}%</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedSector && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">Stocks in {selectedSector}</h2>
          <div className="grid grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <motion.div key={stock.name} whileHover={{ scale: 1.05 }}>
                <Card className="p-4">
                  <CardContent>
                    <h3 className="text-lg font-semibold">{stock.name}</h3>
                    <p>Current: {stock.current_price}</p>
                    <p>52W High: {stock.high_52_week}</p>
                    <p>52W Low: {stock.low_52_week}</p>
                    <p>ATH: {stock.all_time_high}</p>
                    <p>ATL: {stock.all_time_low}</p>
                    <p>Drop from ATH: {((stock.all_time_high - stock.current_price) / stock.all_time_high * 100).toFixed(2)}%</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
