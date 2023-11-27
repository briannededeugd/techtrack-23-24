<script>
	export let onClick;
</script>

<!-- home -->
<button class="home" on:click={onClick}>
	<span class="circle" aria-hidden="true">
		<span class="icon">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
			</svg>
		</span>
	</span>
	<span class="text">Go Home</span>
</button>

<style>
	:root {
		--bg: #f3f8fa;
		--white: #f7f2f1;
		--buttonbg: #f39977;
		transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
	}

	* {
		box-sizing: border-box;
		&::before,
		&::after {
			box-sizing: border-box;
		}
	}

	button {
		position: relative;
		display: inline-block;
		cursor: pointer;
		outline: none;
		border: 0;
		vertical-align: middle;
		text-decoration: none;
		background: transparent;
		padding: 0;
		font-size: inherit;
		font-family: inherit;
		margin-left: auto;
		justify-self: end;
	}

	.icon {
		transition: all, 0.45s, cubic-bezier(0.65, 0, 0.076, 1);
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;
		background: none;
		fill: var(--white);
	}

	.icon svg {
		-webkit-transition: width 0.5s;
		transition: width 0.5s;
		top: 0.675rem;
		left: 0.725rem;
		width: 1.5rem; /* Adjust the width and height as needed */
		height: 1.5rem;
		background: none;
		position: absolute;
	}

	.text {
		position: absolute;
		left: 2.5rem;
		margin: 0;
		padding: 0;
		display: none;
		color: var(--white);
	}

	.home {
		display: flex;
		gap: 0;
		align-items: center;

		-webkit-transition: all 0.25s; /* Apply transition to all properties */
		transition: all 0.25s; /* Apply transition to all properties */
		position: relative;
		margin: 0;
		width: 3rem;
		height: 3rem;
		background: var(--buttonbg);
		border-radius: 1.625rem;
	}

	.home:hover {
		width: clamp(9em, 15vw, 4em);
		height: 3rem;
		gap: 3rem;
		background: var(--buttonbg);
		border-radius: 0.5rem;
	}

	.home:hover {
		cursor: pointer;
	}

	.home:hover .text {
		display: inline-block;
		color: var(--white);
	}
</style>
