import { readFileSync, writeFileSync } from "fs";

// Read the content of movies.json
const rawData = readFileSync("static/movies.json", "utf-8");
const moviesData = JSON.parse(rawData);

// Create a new array with selected properties (title, year, crew_gender)
const simplifiedMovies = moviesData.map((movie) => ({
	title: movie.title,
	year: movie.year,
	crew_gender: movie.crew_gender,
}));

// Write the simplified data to a new file
const simplifiedJson = JSON.stringify(simplifiedMovies, null, 2); // the last argument is for indentation
writeFileSync("simplified_movies.json", simplifiedJson);

console.log("Simplified data has been written to simplified_movies.json");
