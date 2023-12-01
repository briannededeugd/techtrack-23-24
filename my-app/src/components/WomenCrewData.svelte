<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";

	let data = [];
	let el;

	onMount(async () => {
		try {
			///////////////////////////////////////////
			// FETCHING DATA AND DATA TRANSFORMATION //
			//////////////////////////////////////////

			const response = await fetch("/simplified_movies.json");
			data = await response.json();

			function convertYearsToNumbers() {
				const years = data.map((movie) => parseInt(movie.year, 10));
				return years;
			}

			convertYearsToNumbers();

			///////////////////////////////////////////
			// CALCULATE OVERALL PERCENTAGE OF WOMEN //
			///////////////////////////////////////////

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
			calculateOverallPercentage(data, 1945, 1970, 2);
			calculateOverallPercentage(data, 1970, 1995, 3);
			calculateOverallPercentage(data, 1995, 2020, 4);

			// Define quarters
			const quarters = [
				{ startYear: 1920, endYear: 1945 },
				{ startYear: 1945, endYear: 1970 },
				{ startYear: 1970, endYear: 1995 },
				{ startYear: 1995, endYear: 2020 },
			];

			////////////////////////////////////////
			// DRAWING D3 VISUALISATION WITH DATA //
			////////////////////////////////////////

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

				// X-axis with quarters and their start- and endyear seperately, by using flat
				const pointScale = d3
					.scalePoint()
					.domain(quarters.map((d) => [d.startYear, d.endYear]).flat())
					.range([0, 700]);

				// Add axis with the years
				const axisBottom = d3.axisBottom(pointScale);
				d3.select("#axis").call(axisBottom);

				// Draw circles based on the percentageWomen and x position
				d3.select("#scale")
					.selectAll("g")
					.data(percentageWomenArray)
					.join("g")
					.attr("class", "bubble-group")
					.each(function (d, i) {
						const group = d3.select(this);

						// Remove existing elements within the group
						group.selectAll("*").remove();

						group
							.append("image")
							.attr("xlink:href", "female.svg")
							.attr("width", d * 16) // Use the value from the array to set the width of the image
							.attr("height", d * 16) // Use the value from the array to set the height of the image
							.attr("x", pointScale(quarters[i].startYear))
							.attr("y", -d * 8) // Adjust the y position to center the icon vertically
							.style("cursor", "pointer")
							.style("z-index", 1)
							.style("fill", "#cbdde8") // Default blue color
							.on("mouseover", handleMouseOver)
							.on("mouseout", handleMouseOut);
					});

				// Create the defaultstate of the tooltip
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

				// Have tooltip show up when an element is being hovered, with the relevant data being displayed
				function handleMouseOver(event, d) {
					const image = d3.select(event.currentTarget);
					image
						.transition()
						.attr("xlink:href", "pinkfemale.svg")
						.attr("width", d * 19)
						.attr("height", d * 19);

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
						"We're hovering on Y-coordinate",
						event.clientY,
						"and x-coordinate",
						event.clientX
					);
				}

				// Have tooltip disappear when the user is no longer hovering
				function handleMouseOut(event, d) {
					const image = d3.select(event.currentTarget);
					image
						.transition()
						.attr("xlink:href", "female.svg")
						.attr("width", d * 16)
						.attr("height", d * 16); // Change to pink color on hover

					tooltip.style("visibility", "hidden");

					console.log("We're no longer hovering");
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
