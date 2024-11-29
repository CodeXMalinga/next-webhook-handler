'use client';

import React, { useEffect, useState } from "react";

export default function LatestEmployeeDisplay() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchEmployeeNumber = async () => {
      try {
        const response = await fetch("/iclock/cdata");
        
        if (!response.ok) {
          throw new Error('Failed to fetch employee number');
        }
        
        const data = await response.json();
        setEmployeeNumber(data.employeeNumber);
        setLastUpdated(new Date());
        setError(null);
      } catch (error) {
        console.error("Error fetching employee number:", error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    };

    // Initial fetch
    fetchEmployeeNumber();

    // Set up interval to check for updates
    const interval = setInterval(fetchEmployeeNumber, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif", 
      maxWidth: "600px", 
      margin: "0 auto" 
    }}>
      <h1>Latest Fingerprint Check-in</h1>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <>
          <p style={{ 
            fontSize: "24px", 
            color: "green",
            textAlign: "center"
          }}>
            Latest Employee Number: <strong>{employeeNumber || 'No Data'}</strong>
          </p>
          {lastUpdated && (
            <p style={{ 
              fontSize: "14px", 
              color: "gray",
              textAlign: "center"
            }}>
              Last Updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}