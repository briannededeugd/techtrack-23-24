<script>
	import { onMount, afterUpdate, onDestroy } from "svelte";

	////////////////
	// COMPONENTS //
	////////////////

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

	////////////////
	// NAVIGATION //
	////////////////

	let currentSlide = 1;
	let progress = 0;

	function updateHash(slideNumber) {
		console.log(slideNumber);
		window.location.hash = `slide-${slideNumber}`;
	}

	function nextSlide() {
		// get the nextSlide button ready by defining what comes after the slide we're currently on.
		const nextSlide = document.getElementById(`slide-${currentSlide + 1}`);

		if (nextSlide != null) {
			updateHash(currentSlide + 1);
		} else {
			updateHash(1);
			console.log("going home");
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

	///////////////////////////
	// INTERSECTION OBSERVER //
	///////////////////////////

	let observer;

	onMount(() => {
		const options = {
			root: null,
			rootMargin: "0px",
			threshold: 0.5,
		};

		observer = new IntersectionObserver(handleIntersection, options);

		// Observe each slide
		for (let i = 1; i <= 4; i++) {
			observer.observe(document.getElementById(`slide-${i}`));
		}
	});

	onDestroy(() => {
		// Cleanup when the component is destroyed
		if (observer) {
			observer.disconnect();
		}
	});

	function handleIntersection(entries) {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// Get the slide number from the entry target
				const slideNumber = parseInt(entry.target.id.split("-")[1]);

				// Update currentSlide and progress
				currentSlide = slideNumber;
				console.log("observer slide", currentSlide);
				updateProgress();

				let hash = `#slide-${slideNumber}`;
				if (window.location.hash !== hash) {
					history.pushState({}, window.DataTransferItemList, hash);
				}
			}
		});
	}

	afterUpdate(() => {
		updateProgress();
	});
</script>

<head>
	<link href="/style.css" rel="stylesheet" />
</head>

<main>
	<section class="content">
		<section class="slider-wrapper">
			<p>
				FEMALE REPRESENTATION IN CINEMA FEMALE REPRESENTATION IN CINEMA FEMALE
				REPRESENTATION IN CINEMA FEMALE REPRESENTATION IN CINEMA FEMALE
				REPRESENTATION IN CINEMA FEMALE REPRESENTATION IN CINEMA FEMALE
				REPRESENTATION IN CINEMA FEMALE REPRESENTATION IN CINEMA FEMALE
				REPRESENTATION IN CINEMA
			</p>
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
			<PreviousButton onClick={prevSlide} isFirstSlide={currentSlide === 1} />
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
	/*///////////////////
	// GENERAL STYLES ///
	///////////////////*/

	* {
		scroll-behavior: smooth !important;
	}

	main {
		height: 100%;
		width: 100vw;
	}

	/*///////////
	// SLIDER ///
	///////////*/

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
		z-index: 1;
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

	.slider-wrapper p {
		position: fixed;
		top: 2em;
		max-width: 100vw;
		overflow: hidden;
		white-space: nowrap;
		background: #fc33a8;
	}

	#slider {
		background-image: url("/moviestars.jpg");
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
		margin-left: 0;
		padding: 0 17.5vw;
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

	.slider-wrapper::-webkit-scrollbar,
	#slider::-webkit-scrollbar {
		display: none;
	}

	#slide-3 {
		will-change: transform;
	}

	/*/////////////////
	// PROGRESS BAR ///
	/////////////////*/

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
		background: #fc33a8;
		transition: all 0.6s ease-in-out;
	}
</style>
