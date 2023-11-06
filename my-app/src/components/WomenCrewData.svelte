<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";

	let data = [];
	let el;

	onMount(async () => {
		try {
			const response = await fetch("/movies.json");
			data = await response.json();

			// Group the movies by 25-year intervals
			const groupedData = d3.groups(
				data,
				(d) => Math.floor((d.year - 1800) / 25) * 25
			);

			// Calculate the count of "1"s in crew_gender
			const bubbleData = groupedData.map(([key, values]) => ({
				year: key,
				count: d3.sum(
					values,
					(d) => d.crew_gender.filter((g) => g === 1).length
				),
			}));

			// Create the bubble chart
			const width = 800;
			const height = 400;

			const svg = d3
				.select("el")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

			const bubble = d3.pack(bubbleData).size([width, height]).padding(1.5);

			const nodes = d3.hierarchy({ children: bubbleData }).sum((d) => d.count);

			const node = svg
				.selectAll(".node")
				.data(bubble(nodes).descendants())
				.enter()
				.append("g")
				.attr("class", "node")
				.attr("transform", (d) => `translate(${d.x},${d.y})`);

			node
				.append("circle")
				.attr("r", (d) => d.r)
				.style("fill", "steelblue");

			node
				.append("text")
				.text((d) => d.data.year)
				.attr("dy", "0.3em")
				.style("fill", "white");
		} catch (error) {
			console.error("Error loading data:", error);
		}
	});
</script>

<div class="chart" bind:this={el} />
