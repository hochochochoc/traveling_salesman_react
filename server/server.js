const express = require("express");
const fs = require("fs");
const cors = require("cors"); // Import cors package
const app = express();
const port = 5000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post("/api/write-cities", (req, res) => {
  const { cities } = req.body;

  const csvHeader = [
    "City Name",
    "Latitude",
    "Longitude",
    "Country Name",
    "Region",
    "Population",
  ];

  const csvRows = cities.map((city) => [
    city.name,
    city.latitude,
    city.longitude,
    city.country,
    city.region,
    city.population,
  ]);

  const csvContent = [csvHeader, ...csvRows]
    .map((row) => row.join(","))
    .join("\n");

  fs.writeFile(
    "./countryData/countries.csv",
    csvContent,
    { flag: "a" },
    (err) => {
      if (err) {
        console.error("Error writing to file:", err); // Log the error
        return res.status(500).send("Error writing to file");
      }
      res.send("Data written to countries.csv");
    },
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
