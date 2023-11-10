<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";

	let data = [];
	let el;

	onMount(async () => {
		try {
			const response = await fetch("/movies.json");
			data = await response.json();

			function convertYearsToNumbers() {
				const years = data.map((movie) => parseInt(movie.year, 10));
				return years;
			}

			convertYearsToNumbers();

			// Define a function to calculate overall percentage of women in the crew for a quarter
			function calculateOverallPercentage(
				data,
				startYear,
				endYear,
				quarterNumber
			) {
				var quarter = data.filter((movie) => {
					return movie.year >= startYear && movie.year <= endYear;
				});

				// Initialize variables to keep track of the total counts
				var totalWomenCount = 0;
				var totalCrewMembers = 0;

				// Calculate counts for each movie and accumulate the totals
				quarter.forEach((movie) => {
					var womenCrew = JSON.parse(movie.crew_gender);

					// Count women in the crew for this movie
					var womenCount = womenCrew.filter((gender) => gender === 1).length;

					// Accumulate the counts
					totalWomenCount += womenCount;
					totalCrewMembers += womenCrew.length;
				});

				// Calculate the overall percentage for the entire quarter
				var overallPercentageWomen = (totalWomenCount / totalCrewMembers) * 100;

				// Log the overall result with quarter number
				console.log(
					`Female crew members in Quarter ${quarterNumber}: ${totalWomenCount} (${Number(
						overallPercentageWomen.toFixed(2)
					)}%)`
				);
			}

			// Call the function for each quarter
			calculateOverallPercentage(data, 1920, 1945, 1);
			calculateOverallPercentage(data, 1945, 1960, 2);
			calculateOverallPercentage(data, 1960, 1985, 3);
			calculateOverallPercentage(data, 1985, 2020, 4);
		} catch (err) {
			console.error(err);
		}
	});
</script>

<svg width="800" height="80">
	<g id="wrapper" transform="translate(40, 40)" />
</svg>
