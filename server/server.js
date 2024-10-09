const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/write-cities", (req, res) => {
  const { cities } = req.body;

  // Read the existing CSV file to check for duplicates
  fs.readFile("./countryData/countries.csv", "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading the file:", err);
      return res.status(500).send("Error reading the file");
    }

    // Initialize existing cities from the CSV file
    const existingCities = new Set();
    if (data) {
      const rows = data.split("\n").slice(1); // Skip the header
      rows.forEach((row) => {
        const cols = row.split(",");
        if (cols.length > 0) {
          existingCities.add(cols[0].trim()); // Add city name to the set
        }
      });
    }

    // Filter out cities with "city" in their name and duplicates
    const uniqueCities = cities.filter((city) => {
      return (
        !existingCities.has(city.name) &&
        !city.name.toLowerCase().includes("city")
      );
    });

    // Prepare CSV rows for unique cities
    const csvRows = uniqueCities.map((city) => [
      city.name,
      city.latitude,
      city.longitude,
      city.countryName,
      city.region,
      city.population,
    ]);

    // If there are no new cities, respond accordingly
    if (csvRows.length === 0) {
      return res.send("No new cities to write.");
    }

    // Create CSV content
    const csvHeader = [
      "City Name",
      "Latitude",
      "Longitude",
      "CountryName",
      "Region",
      "Population",
    ];

    // Check if the file is empty before writing the header
    const isEmpty = !data || data.trim().length === 0;
    const csvContent = isEmpty ? [csvHeader, ...csvRows] : csvRows;

    // Create the CSV string
    const csvString = csvContent.map((row) => row.join(",")).join("\n");

    // Append new cities to the CSV file
    fs.writeFile(
      "./countryData/countries.csv",
      csvString + (isEmpty ? "" : "\n"), // Add a newline if not writing header
      { flag: "a" },
      (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing to file");
        }
        res.send("Data written to countries.csv");
      },
    );
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// TODO:
// Pagination so it starts adding cities after the ones I've already added...
// Exceptions for NYC, Mexico city, but exclude metropolitan area
// Somehow doesn't work for the US
