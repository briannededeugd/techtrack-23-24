<script>
	import { onMount, afterUpdate } from "svelte";
	import Test from "../components/Test.svelte";
	import Introduction from "../components/Introduction.svelte";
	import WomenCrew from "../components/WomenCrew.svelte";
	import WomenCrewData from "../components/WomenCrewData.svelte";

	import PreviousButton from "../components/PreviousButton.svelte";
	import NextButton from "../components/NextButton.svelte";
	import HomeButton from "../components/HomeButton.svelte";

	let src = "/img/female.svg";
	let currentSlide = 1;

	function updateHash(slideNumber) {
		window.location.hash = `slide-${slideNumber}`;
	}

	function nextSlide() {
		console.log("Next Slide");
		const nextSlide = document.getElementById(`slide-${currentSlide + 1}`);
		if (nextSlide) {
			currentSlide += 1;
			updateHash(currentSlide);
		} else {
			currentSlide = 1;
			updateHash(currentSlide);
		}
	}

	function prevSlide() {
		console.log("Previous Slide");
		const prevSlide = document.getElementById(`slide-${currentSlide - 1}`);
		if (prevSlide) {
			currentSlide -= 1;
			updateHash(currentSlide);
		}
	}
</script>

<head>
	<link href="/style.css" rel="stylesheet" />
</head>

<main>
	<section class="content">
		<section class="slider-wrapper">
			<section id="slider">
				<section id="slide-1">
					<Introduction />
					<div class="container">
						<PreviousButton
							isFirstSlide={currentSlide === 1}
							onClick={prevSlide}
						/>
						<NextButton onClick={nextSlide} />
					</div>
				</section>
				<section id="slide-2">
					<WomenCrew />
					<WomenCrewData />
					<div class="container">
						<PreviousButton onClick={prevSlide} />
						<NextButton onClick={nextSlide} />
					</div>
				</section>
				<section id="slide-3">
					<Introduction />
					<div class="container">
						<PreviousButton onClick={prevSlide} />
						<NextButton onClick={nextSlide} />
					</div>
				</section>
				<section id="slide-4">
					<Introduction />
					<Test />
					<div class="container">
						<PreviousButton onClick={prevSlide} />
						<HomeButton onClick={nextSlide} />
					</div>
				</section>
			</section>
		</section>

		<div class="slider-nav">
			<a href="#slide-1" class="nav-link">
				<img {src} alt="female icon" />
			</a>
			<a href="#slide-2" class="nav-link">
				<img {src} alt="female icon" />
			</a>
			<a href="#slide-3" class="nav-link">
				<img {src} alt="female icon" />
			</a>
			<a href="#slide-4" class="nav-link">
				<img {src} alt="female icon" />
			</a>
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
	}

	#slider {
		background-image: url("./img/illustratedbg.png");
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
	}

	#slider > section {
		max-width: 100%;
		margin: 0 auto;
		padding: 0 20vw;
		scroll-snap-align: center;
		height: 60vh;
		width: 80vw;
	}

	.slider-nav {
		position: absolute;
		bottom: 5%;
		left: 50%;
		transform: translateX(-50%);

		background: rgba(255, 255, 255, 0.19);
		border-radius: 16px;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(6.4px);
		-webkit-backdrop-filter: blur(6.4px);
		border: 1px solid rgba(255, 255, 255, 0.29);
		padding: 0.625rem;
	}

	.slider-nav a {
		text-decoration: none;
	}

	.nav-link {
		transition: background-color 0.3s ease, transform 0.3s ease;
	}

	.container {
		display: flex;
		justify-content: space-between;
		align-self: flex-end;
	}
</style>
