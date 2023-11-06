<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";
	var data = [4, 8, 15, 16, 23, 42];

	onMount(() => {
		// Set up the SVG container
		const svg = select("#chart")
			.append("svg")
			.attr("width", 400)
			.attr("height", 200);

		// Create scales
		const xScale = scaleBand()
			.domain(data.map((d, i) => i))
			.range([0, 400])
			.padding(0.1);

		const yScale = scaleLinear()
			.domain([0, max(data)])
			.range([0, 200]);

		// Create and render bars
		svg
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", (d, i) => xScale(i))
			.attr("y", (d) => 200 - yScale(d))
			.attr("width", xScale.bandwidth())
			.attr("height", (d) => yScale(d))
			.attr("fill", "steelblue");
	});
</script>

<div id="chart" />
