<script>
	import { page } from '$app/stores';

	const dev = process.env.NODE_ENV === 'development';
</script>


<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<h1>{$page.status}</h1>

<p>{$page.error.message}</p>
