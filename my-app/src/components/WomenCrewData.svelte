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
				var percentageWomen = Number(
					(totalWomenCount / totalCrewMembers) * 100
				);

				// Log the overall result with quarter number
				console.log(
					`Female crew members in Quarter ${quarterNumber}: ${totalWomenCount} (${percentageWomen.toFixed(
						2
					)}%)`
				);

				return percentageWomen; // to give it to the visualization as a parameter
			}

			// Call the function for each quarter
			calculateOverallPercentage(data, 1920, 1945, 1);
			calculateOverallPercentage(data, 1945, 1960, 2);
			calculateOverallPercentage(data, 1960, 1985, 3);
			calculateOverallPercentage(data, 1985, 2020, 4);

			// Define quarters
			const quarters = [
				{ startYear: 1920, endYear: 1945 },
				{ startYear: 1945, endYear: 1960 },
				{ startYear: 1960, endYear: 1985 },
				{ startYear: 1985, endYear: 2020 },
			];

			// TEKENEN VAN SVG VISUALISATIE

			quarters.forEach((quarter, index) => {
				const svg = d3.select("#chart");

				const percentageWomen = calculateOverallPercentage(
					data,
					quarter.startYear,
					quarter.endYear,
					index + 1
				);

				const bubble = svg
					.append("circle")
					.data("quarters")
					.attr("r", percentageWomen * 8)
					.attr("class", "bubble")
					.attr("transform", `translate(${index * 200}, 150)`);

				// x-axis met quarters of jaartallen ervan?
				const pointScale = d3
					.scalePoint()
					.domain([].concat(...quarters.map((d) => [d.startYear, d.endYear])))
					.range([0, 700]);

				//Voeg een as toe met de dagen van de week (afgekort)
				const axisBottom = d3.axisBottom(pointScale);

				d3.select("#axis1").call(axisBottom);
			});
		} catch (err) {
			console.error(err);
		}
	});
</script>

<svg id="chart" width="800" height="300">
	<g id="axis1" transform="translate(50, 250)" />
</svg>
