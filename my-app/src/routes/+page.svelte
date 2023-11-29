<script>
	import { onMount, afterUpdate, onDestroy } from "svelte";
	import * as d3 from "d3";

	// PAGES
	import Introduction from "../components/Introduction.svelte";
	import WomenCrew from "../components/WomenCrew.svelte";
	import WomenOscars from "../components/WomenOscars.svelte";
	import Conclusion from "../components/Conclusion.svelte";

	// DATA
	import WomenCrewData from "../components/WomenCrewData.svelte";
	import WomenOscarsData from "../components/WomenOscarsData.svelte";

	import HomeButton from "../components/HomeButton.svelte";
	import PreviousButton from "../components/PreviousButton.svelte";
	import NextButton from "../components/NextButton.svelte";

	// let src = "/img/female.svg";
	let currentSlide = 1;
	let progress = 0;

	function updateHash(slideNumber) {
		window.location.hash = `slide-${slideNumber}`;
	}

	function nextSlide() {
		const nextSlide = document.getElementById(`slide-${currentSlide + 1}`);
		if (nextSlide) {
			currentSlide += 1;
			updateHash(currentSlide);
			updateProgress();
		} else {
			currentSlide = 1;
			updateHash(currentSlide);
			updateProgress();
		}
	}

	function prevSlide() {
		const prevSlide = document.getElementById(`slide-${currentSlide - 1}`);
		if (prevSlide) {
			currentSlide -= 1;
			updateHash(currentSlide);
			updateProgress();
		}
	}

	function updateProgress() {
		const totalSlides = 4;
		progress = ((currentSlide - 1) / (totalSlides - 1)) * 100;
	}

	afterUpdate(() => {
		updateProgress();
	});

	onMount(() => {
		function handleScroll() {
			const totalSlides = 4;
			const slider = d3.select("#slider");
			let scrollPosition = slider.node().scrollLeft;
			console.log("THE SCROLLPOSITION IS", scrollPosition);

			// Use clientWidth to get the total width of the slider
			let slideWidth = slider.node().clientWidth / totalSlides;

			// Calculate the active slide based on the scroll position
			let currentSlide = Math.floor(scrollPosition / slideWidth) + 1;
			let progress = ((currentSlide - 1) / (totalSlides - 1)) * 100;
			console.log("HANDLESCROLL SAYS CURRENTSLIDE IS", currentSlide);
		}

		const slider = d3.select("#slider");
		slider.on("scroll", handleScroll);
	});
</script>

<head>
	<link href="/style.css" rel="stylesheet" />
</head>

<main>
	<section class="content">
		<section class="slider-wrapper">
			<section id="slider">
				<section id="slide-1">
					<section class="slide-content">
						<Introduction />
					</section>
				</section>
				<section id="slide-2">
					<section class="slide-content">
						<WomenCrew />
						<WomenCrewData />
					</section>
				</section>
				<section id="slide-3">
					<section class="slide-content">
						<WomenOscars />
						<WomenOscarsData />
					</section>
				</section>
				<section id="slide-4">
					<section class="slide-content">
						<Conclusion />
					</section>
				</section>
			</section>
		</section>

		<div class="slider-nav">
			<PreviousButton onClick={prevSlide} />
			<section class="progress-bar">
				<div class="progress" style="width: {progress}%" />
			</section>
			{#if currentSlide === 4}
				<HomeButton onClick={nextSlide} />
			{:else}
				<NextButton onClick={nextSlide} />
			{/if}
		</div>
	</section>
</main>

<style>
	* {
		scroll-behavior: smooth !important;
	}

	main {
		height: 100%;
		width: 100vw;
	}

	.slide-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 16px;
		padding: 5vh 5vw;
		height: 80%;
		background: rgba(255, 255, 255, 0.75);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(6.4px);
	}

	.slider-wrapper {
		position: absolute;
		display: block;
		overflow-x: auto;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		scroll-snap-align: center !important;
		scroll-snap-type: x mandatory !important;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	#slider {
		background-image: url("/moviestarsbg.jpeg");
		background-size: cover;
		background-attachment: scroll;
		display: flex;
		flex-direction: row;
		align-items: center;
		scroll-snap-type: x mandatory;
		overflow-x: auto;
		scrollbar-width: none;
		height: 100vh;
		width: 400vw;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	#slider > section {
		max-width: 100%;
		margin: 0 auto;
		padding: 0 20vw;
		scroll-snap-align: center;
		height: max-content;
		width: 80vw;
	}

	.slider-nav {
		position: absolute;
		bottom: 5%;
		left: 50%;
		transform: translateX(-50%);
		display: grid;
		grid-template-columns: 2fr 4fr 2fr;
		grid-template-rows: 1fr;
		grid-column-gap: 0px;
		grid-row-gap: 0px;

		align-items: center;
		width: 45vw;
	}

	.progress-bar {
		height: 0.5rem;
		width: 100%;
		background: rgba(255, 255, 255, 0.19);
		border: solid 0.5px black;
		border-radius: 8px;
		overflow: hidden;
		margin-right: 0.5rem;
	}

	.progress {
		height: 100%;
		background: linear-gradient(90deg, #99c1cc, #d39080);
		transition: all 0.6s ease-in-out;
	}

	.slider-wrapper::-webkit-scrollbar,
	#slider::-webkit-scrollbar {
		display: none;
	}
</style>
