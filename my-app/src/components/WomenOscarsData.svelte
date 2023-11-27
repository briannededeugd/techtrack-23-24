<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";

	let data = [];
	let filteredData = [];
	let selectedCategory = "CINEMATOGRAPHY"; // Default selected category

	onMount(async () => {
		const response = await fetch("/oscars.json");
		data = await response.json();
		filterData();
		createBarChart();
	});

	let categories = ["CINEMATOGRAPHY", "WRITING", "DIRECTING", "FILM EDITING"];
	let quarters = [
		{ startYear: 1920, endYear: 1945 },
		{ startYear: 1945, endYear: 1960 },
		{ startYear: 1960, endYear: 1985 },
		{ startYear: 1985, endYear: 2020 },
	];

	function filterData() {
		filteredData = [];
		quarters.forEach((quarter) => {
			let filteredCategoryData = data.filter((item) => {
				return (
					parseInt(item.year) >= quarter.startYear &&
					parseInt(item.year) < quarter.endYear &&
					item.category === selectedCategory
				);
			});
			filteredData.push({
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

	function createBarChart() {
		const tooltip = d3.select("#tooltip");
		const tooltipContent = d3.select("#tooltipcontent");

		const margin = { top: 20, right: 20, bottom: 30, left: 40 };
		const width = 700 - margin.left - margin.right;
		const height = 300 - margin.top - margin.bottom;

		const svg = d3
			.select("#chart-container")
			.html("") // Clear existing content
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const pointScale = d3
			.scalePoint()
			.domain(quarters.map((d) => [d.startYear, d.endYear]).flat())
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(filteredData, (d) =>
					Math.max(
						d.maleNominees + d.maleWinners,
						d.femaleNominees + d.femaleWinners
					)
				),
			])
			.range([height, 0]);

		const colorScale = d3
			.scaleOrdinal()
			.domain([
				"maleNominees",
				"maleWinners",
				"femaleNominees",
				"femaleWinners",
			])
			.range(["#cbdde8", "#99c1cc", "#febaa9", "#f39977"]);

		const barWidth = pointScale.step() / 4;

		let maleNomineeAccumulator = 0;
		let maleWinnerAccumulator = 0;
		let femaleNomineeAccumulator = 0;
		let femaleWinnerAccumulator = 0;

		// Male Nominees and Winners stacked
		svg
			.selectAll(".maleBars")
			.data(filteredData)
			.enter()
			.append("rect")
			.attr("class", "maleBars")
			.attr("x", (d) => pointScale(d.quarter.startYear))
			.attr("y", (d) => yScale(maleWinnerAccumulator + d.maleWinners))
			.attr("width", barWidth)
			.attr("height", (d) => height - yScale(d.maleWinners))
			.style("fill", colorScale("maleWinners"))
			.on("mouseover", function (event, d) {
				showTooltip(
					`Male nominees this quarter: ${d.maleNominees}<br>Male winners this quarter: ${d.maleWinners}`
				);
			})
			.on("mouseout", hideTooltip);

		svg
			.selectAll(".maleBarsNominees")
			.data(filteredData)
			.enter()
			.append("rect")
			.attr("class", "maleBarsNominees")
			.attr("x", (d) => pointScale(d.quarter.startYear))
			.attr("y", (d) =>
				yScale(maleWinnerAccumulator + d.maleWinners + d.maleNominees)
			)
			.attr("width", barWidth)
			.attr("height", (d) => height - yScale(d.maleNominees))
			.style("fill", colorScale("maleNominees"))
			.on("mouseover", function (event, d) {
				showTooltip(
					`Male nominees this quarter: ${d.maleNominees}<br>Male winners this quarter: ${d.maleWinners}`
				);
			})
			.on("mouseout", hideTooltip);

		// Female Nominees and Winners stacked
		svg
			.selectAll(".femaleBars")
			.data(filteredData)
			.enter()
			.append("rect")
			.attr("class", "femaleBars")
			.attr("x", (d) => pointScale(d.quarter.startYear) + barWidth)
			.attr("y", (d) => yScale(femaleWinnerAccumulator + d.femaleWinners))
			.attr("width", barWidth)
			.attr("height", (d) => height - yScale(d.femaleWinners))
			.style("fill", colorScale("femaleWinners"))
			.on("mouseover", function (event, d) {
				showTooltip(
					`Female nominees this quarter: ${d.femaleNominees}<br>Female winners this quarter: ${d.femaleWinners}`
				);
			})
			.on("mouseout", hideTooltip);

		svg
			.selectAll(".femaleBarsNominees")
			.data(filteredData)
			.enter()
			.append("rect")
			.attr("class", "femaleBarsNominees")
			.attr("x", (d) => pointScale(d.quarter.startYear) + barWidth)
			.attr("y", (d) =>
				yScale(femaleWinnerAccumulator + d.femaleWinners + d.femaleNominees)
			)
			.attr("width", barWidth)
			.attr("height", (d) => height - yScale(d.femaleNominees))
			.style("fill", colorScale("femaleNominees"))
			.on("mouseover", function (event, d) {
				showTooltip(
					`Female nominees this quarter: ${d.femaleNominees}<br>Female winners this quarter: ${d.femaleWinners}`
				);
			})
			.on("mouseout", hideTooltip);

		function showTooltip(content) {
			tooltip.transition().duration(200).style("opacity", 0.9);
			tooltipContent.html(content);
		}

		function hideTooltip() {
			tooltip.transition().duration(200).style("opacity", 0);
		}

		svg
			.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(pointScale));

		svg.append("g").call(d3.axisLeft(yScale));

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
			.text((d) => d);
	}

	function getStartYear(quarter) {
		return quarter.startYear;
	}

	function getEndYear(quarter) {
		return quarter.endYear;
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

<style>
	/* rect {
		transition: height 0.8s, y 0.8s;
	} */
</style>
