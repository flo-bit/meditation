<script lang="ts">
	export let selected: string;

	export let value: string;
</script>

<button
	class="py-1.5 px-2.5 hover:bg-white/5 rounded-xl text-sm transition-all duration-200 {selected === value ? 'bg-white/5' : ''}"
	on:click={() => {
		selected = value;
	}}
>
	{value}
</button>
