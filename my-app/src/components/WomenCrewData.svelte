<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";

	let data = [];
	let el;

	onMount(async () => {
		try {
			const response = await fetch("/simplified_movies.json");
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

			// DRAWING SVG VISUALIZATION WITH CODE (D3)

			// Define an array to store percentageWomen for each quarter
			const percentageWomenArray = [];

			quarters.forEach((quarter, index) => {
				const svg = d3.select("#chart");

				// Calculate percentageWomen for each quarter
				const percentageWomen = calculateOverallPercentage(
					data,
					quarter.startYear,
					quarter.endYear,
					index + 1
				);

				// Push the result into the array
				percentageWomenArray.push(percentageWomen);

				// x-axis with quarters and their start- and endyear
				const pointScale = d3
					.scalePoint()
					.domain(quarters.map((d) => [d.startYear, d.endYear]).flat())
					.range([0, 700]);

				// Add axis with the years
				const axisBottom = d3.axisBottom(pointScale);

				d3.select("#axis").call(axisBottom);

				const gradient = svg
					.append("defs")
					.append("linearGradient")
					.attr("id", `gradient${index}`)
					.attr("x1", "0%")
					.attr("y1", "0%")
					.attr("x2", "100%")
					.attr("y2", "100%");

				gradient
					.append("stop")
					.attr("offset", "0%")
					.style("stop-color", "#99c1cc");

				gradient
					.append("stop")
					.attr("offset", `${percentageWomenArray[index] * 100}%`)
					.style("stop-color", "#febaa9");

				// Draw circles based on the percentageWomen and x position
				d3.select("#scale")
					.selectAll("g")
					.data(percentageWomenArray) // Use the entire array
					.join("g")
					.attr("class", "bubble-group")
					.each(function (d, i) {
						const group = d3.select(this);

						// Remove existing elements within the group
						group.selectAll("*").remove();

						// Append a single circle element to the group
						group
							.append("circle")
							.attr("r", d * 8) // Use the value from the array
							.attr("class", "bubble")
							.attr("cx", pointScale(quarters[i].startYear) + d * 8)
							.attr("fill", `url(#gradient${index})`)
							.style("cursor", "pointer")
							.style("z-index", 1)
							.on("mouseover", handleMouseOver)
							.on("mouseout", handleMouseOut);
					});

				let tooltip = d3
					.select("#tooltip")
					.style("visibility", "hidden")
					.style("position", "absolute")
					.attr("class", "tooltip")
					.style("background-color", "white")
					.style("border", "solid")
					.style("border-width", "1px")
					.style("border-radius", "5px")
					.style("padding", "5px")
					.style("width", "max-content")
					.style("z-index", 1000);

				function handleMouseOver(event, d) {
					const circle = d3.select(event.currentTarget);
					circle.transition().attr("r", d * 10); // Increase the radius on hover

					tooltip
						.style("visibility", "visible")
						.style("top", event.clientY - 75 + "px")
						.style("left", event.clientX - 275 + "px");

					const tooltipContent = d3.select("#tooltipcontent");

					// Set the tooltip content based on the data
					tooltipContent.text(
						`Percentage of women behind the scenes: ${d.toFixed(2)}%`
					);

					console.log(
						"Er wordt gehovered op y-coordinaat",
						event.clientY,
						"en x-coordinaat",
						event.clientX
					);
				}

				function handleMouseOut(event, d) {
					const circle = d3.select(event.currentTarget);
					circle.transition().attr("r", d * 8); // Restore the original radius on mouseout

					const image = d3.select(".circle-image"); // Use the class to select the image

					image.style("opacity", 0);

					tooltip.style("visibility", "hidden");

					console.log("Er wordt niet meer gehoverd");
				}
			});

			// Now, percentageWomenArray contains the percentageWomen for each quarter
			console.log(percentageWomenArray);
		} catch (err) {
			console.error(err);
		}
	});
</script>

<svg id="chart" width="800" height="300">
	<g id="scale" transform="translate(50, 125)" />
	<g id="axis" transform="translate(50, 250)" />
</svg>

<div id="tooltip">
	<span id="tooltipcontent" />
</div>
