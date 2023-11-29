<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";

	////////////////////////////////
	// VARIABLES + DEFAULT STATES //
	////////////////////////////////
	let data = [];
	let filteredData = [];
	let selectedCategory = "CINEMATOGRAPHY"; // Default selected category

	onMount(async () => {
		const response = await fetch("/oscars.json");
		data = await response.json();
		filterData();
		createBarChart();
	});

	// Define the data's parameters
	let categories = ["CINEMATOGRAPHY", "WRITING", "DIRECTING", "FILM EDITING"];
	let quarters = [
		{ startYear: 1920, endYear: 1945 },
		{ startYear: 1945, endYear: 1960 },
		{ startYear: 1960, endYear: 1985 },
		{ startYear: 1985, endYear: 2020 },
	];

	/////////////////////////////////////////////////////////////////
	// FILTER THE DATA BY MALE/FEMALE WINNERS/NOMINEES PER QUARTER //
	/////////////////////////////////////////////////////////////////

	// Filter the data by Male and Female Nominees and Winners per category per quarter
	function filterData() {
		filteredData = [];

		quarters.forEach((quarter) => {
			let filteredCategoryData = data.filter((item) => {
				return (
					parseInt(item.year) >= quarter.startYear && // Check if the item is later than the quarter's start year
					parseInt(item.year) < quarter.endYear && // Check if the item is earlier than the quarter's end year
					item.category === selectedCategory // Check if the item has the selected category
				);
			});
			filteredData.push({
				// Push that data into a new array with the quarter and for each item the right gender and status
				quarter,
				maleNominees: filteredCategoryData.filter(
					(item) => item.gender === "male" && item.status === "nominated"
				).length,
				femaleNominees: filteredCategoryData.filter(
					(item) => item.gender === "female" && item.status === "nominated"
				).length,
				maleWinners: filteredCategoryData.filter(
					(item) => item.gender === "male" && item.status === "winner"
				).length,
				femaleWinners: filteredCategoryData.filter(
					(item) => item.gender === "female" && item.status === "winner"
				).length,
			});
		});
		createBarChart(); // Update the chart when the category changes
	}

	///////////////////////////
	// CREATE THE BAR CHART //
	///////////////////////////

	function createBarChart() {
		// Set the values in variables
		const margin = { top: 20, right: 20, bottom: 30, left: 40 };
		const width = 700 - margin.left - margin.right;
		const height = 300 - margin.top - margin.bottom;

		const svg = d3
			.select("#chart-container")
			.style("z-index", 500)
			.html("") // Clear existing content
			.append("svg")
			.attr("width", width + margin.left + margin.right) // Container width includes margins
			.attr("height", height + margin.top + margin.bottom) // Container height includes margins
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`); // Position the groups inside the chart-container

		/////////////
		// SCALES //
		////////////

		// X-axis scale (years as points)
		const pointScale = d3
			.scalePoint()
			.domain(quarters.map((d) => [d.startYear, d.endYear]).flat()) // Use start-year and end-year as separate points on the axis
			.range([0, width]);

		// Y-axis scale (amount of nominees/winners as points)
		const yScale = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(
					filteredData,
					(
						d // Make the max domain dependant on the amount of nominees/winners in the selected category
					) =>
						Math.max(
							d.maleNominees + d.maleWinners,
							d.femaleNominees + d.femaleWinners
						)
				),
			])
			.range([height, 0]);

		// Colorscale of the bars to differentiate between men/women and nominees/winners
		const colorScale = d3
			.scaleOrdinal()
			.domain([
				"maleNominees",
				"maleWinners",
				"femaleNominees",
				"femaleWinners",
			])
			.range(["#cbdde8", "#99c1cc", "#fd9bd4", "#fc33a8"]); // light-blue to hot-pink

		////////////////////
		// BARS (STACKED) //
		////////////////////

		const barWidth = pointScale.step() / 4;

		// Male Nominees and Winners stacked
		svg
			.selectAll(".maleBars")
			.data(filteredData)
			.enter()
			.append("rect")
			.attr("class", "maleBars")
			.attr("x", (d) => pointScale(d.quarter.startYear))
			.attr("y", (d) => yScale(d.maleWinners))
			.attr("width", barWidth)
			.style("cursor", "pointer")
			.attr("height", (d) => height - yScale(d.maleWinners))
			.style("fill", colorScale("maleWinners"));

		svg
			.selectAll(".maleBarsNominees")
			.data(filteredData)
			.enter()
			.append("rect")
			.attr("class", "maleBarsNominees")
			.attr("x", (d) => pointScale(d.quarter.startYear))
			.attr("y", (d) => yScale(d.maleWinners + d.maleNominees))
			.attr("width", barWidth)
			.style("cursor", "pointer")
			.attr("height", (d) => height - yScale(d.maleNominees))
			.style("fill", colorScale("maleNominees"));

		// Female Nominees and Winners stacked
		svg
			.selectAll(".femaleBars")
			.data(filteredData)
			.enter()
			.append("rect")
			.attr("class", "femaleBars")
			.attr("x", (d) => pointScale(d.quarter.startYear) + barWidth)
			.attr("y", (d) => yScale(d.femaleWinners))
			.attr("width", barWidth)
			.style("cursor", "pointer")
			.attr("height", (d) => height - yScale(d.femaleWinners))
			.style("fill", colorScale("femaleWinners"));

		svg
			.selectAll(".femaleBarsNominees")
			.data(filteredData)
			.enter()
			.append("rect")
			.attr("class", "femaleBarsNominees")
			.attr("x", (d) => pointScale(d.quarter.startYear) + barWidth)
			.attr("y", (d) => yScale(d.femaleWinners + d.femaleNominees))
			.attr("width", barWidth)
			.style("cursor", "pointer")
			.attr("height", (d) => height - yScale(d.femaleNominees))
			.style("fill", colorScale("femaleNominees"));

		svg
			.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(pointScale));

		svg.append("g").call(d3.axisLeft(yScale));

		////////////////
		// BAR VALUES //
		////////////////

		// Bar values male bars
		svg
			.selectAll(".barValues")
			.data(filteredData)
			.enter()
			.append("text")
			.attr("class", "barValues")
			.attr("x", (d) => pointScale(d.quarter.startYear) + barWidth / 2)
			.attr("y", (d) => yScale(d.maleWinners) - 5) // Adjust the y-position for better visibility
			.style("text-anchor", "middle")
			.text((d) => d.maleWinners)
			.style("fill", "black")
			.style("font-size", "10px");

		svg
			.selectAll(".barValuesNominees")
			.data(filteredData)
			.enter()
			.append("text")
			.attr("class", "barValuesNominees")
			.attr("x", (d) => pointScale(d.quarter.startYear) + barWidth / 2)
			.attr("y", (d) => yScale(d.maleWinners + d.maleNominees) - 5) // Adjust the y-position for better visibility
			.style("text-anchor", "middle")
			.text((d) => d.maleNominees)
			.style("fill", "black")
			.style("font-size", "10px");

		// Bar values female bars
		svg
			.selectAll(".barValuesFemale")
			.data(filteredData)
			.enter()
			.append("text")
			.attr("class", "barValuesFemale")
			.attr("x", (d) => pointScale(d.quarter.startYear) + (barWidth / 2 + 70))
			.attr("y", (d) => yScale(d.femaleWinners) - 2)
			.style("text-anchor", "middle")
			.text((d) => (d.femaleWinners !== 0 ? d.femaleWinners : ""))
			.style("fill", "black")
			.style("font-size", "10px");

		svg
			.selectAll(".barValuesFemaleNominees")
			.data(filteredData)
			.enter()
			.append("text")
			.attr("class", "barValuesFemaleNominees")
			.attr("x", (d) => pointScale(d.quarter.startYear) + (barWidth / 2 + 40))
			.attr("y", (d) => yScale(d.femaleWinners + d.femaleNominees) - 5)
			.style("text-anchor", "middle")
			.text((d) => (d.femaleNominees !== 0 ? d.femaleNominees : ""))
			.style("fill", "black")
			.style("font-size", "10px");

		////////////
		// LEGEND //
		////////////

		const legend = svg
			.selectAll(".legend")
			.data([
				"Male Nominees",
				"Male Winners",
				"Female Nominees",
				"Female Winners",
			])
			.enter()
			.append("g")
			.attr("class", "legend")
			.attr("transform", (d, i) => `translate(0,${i * 20})`);

		legend
			.append("rect")
			.attr("x", width - 18)
			.attr("width", 18)
			.attr("height", 18)
			.attr("fill", colorScale);

		legend
			.append("text")
			.attr("x", width - 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.style("font-size", "10px")
			.text((d) => d);
	}
</script>

<div>
	<div>
		{#each categories as category}
			<label>
				<input
					type="radio"
					bind:group={selectedCategory}
					value={category}
					on:change={filterData}
				/>
				{category}
			</label>
		{/each}
	</div>

	<div id="chart-container" />
</div>

<div id="tooltip">
	<span id="tooltipcontent" />
</div>

<style>
	#tooltip {
		z-index: 9999 !important;
	}
</style>
