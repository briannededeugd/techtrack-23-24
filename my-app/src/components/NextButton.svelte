<script>
	export let onClick;
</script>

<!-- NEXT -->
<button class="next" on:click={onClick}>
	<span class="circle" aria-hidden="true">
		<span class="icon arrow" />
	</span>
	<span class="text">Continue</span>
</button>

<style>
	:root {
		--bg: #f3f8fa;
		--white: #f7f2f1;
		--buttonbg: #121212;
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
		background: var(--white);
	}

	.arrow {
		-webkit-transition: width 0.5s;
		transition: width 0.5s;
		left: 0.625rem;
		width: 1.125rem;
		height: 0.125rem;
		background: none;
		position: absolute;
	}

	.next .arrow::before {
		position: absolute;
		content: "";
		top: -0.25rem;
		right: 0.0625rem;
		width: 0.625rem;
		height: 0.625rem;
		border-top: 0.125rem solid #fff;
		border-right: 0.125rem solid #fff;
		transform: rotate(45deg);
	}

	.text {
		position: absolute;
		left: 2.5rem;
		margin: 0;
		padding: 0;
		display: none;
		color: var(--white);
	}

	.next {
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

	.next:hover {
		width: clamp(9em, 15vw, 4em);
		height: 3rem;
		gap: 3rem;
		background: var(--buttonbg);
		border-radius: 0.5rem;
	}

	.next:hover {
		cursor: pointer;
	}

	.next:hover .text {
		display: inline-block;
		color: var(--white);
	}
</style>
