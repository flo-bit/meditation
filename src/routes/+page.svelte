<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Slider } from '$lib/components/ui/slider';
	import Toggle from '$lib/toggle.svelte';

	// @ts-ignore
	import { Howl } from 'howler';
	import { onMount } from 'svelte';

	let playing = false;
	let time = 0;

	let audioParts: Howl[] = [];

	type Meditation = {
		name: string;
		text: string;
		parts: string[];
		pauses: number[];
		length: number;
		voices: string[];
	};

	let meditation: Meditation | undefined = undefined;

	let currentPart = -1;

	let started = false;

	let audioPause = 0;

	let songs = ['piano', 'lofi'];

	let song = songs[0];
	let currentSong = song;

	let meditationNames = [
		'river',
		'breathing',
		'gummybear',
		'cosmic',
		'forest',
		'mountain',
		'ocean',
		'gratitude',
		'bodyscan',
		'cloud',
		'affirmations',
		'innerlight',
		'garden',
		'candle'
	];

	let music: Howl | null = null;

	$: if (song !== currentSong) {
		currentSong = song;

		// get current volume
		let volume = 0.5;

		if (music) {
			volume = music.volume();
			music.stop();
		}

		music = new Howl({
			src: [`${main_url}music/${song}.mp3`],
			loop: true,
			volume: volume,
			onload: () => {
				if (playing) {
					music.play();
				}
			}
		});
	}

	let sounds = ['river', 'rain', 'fire', 'birds', 'wind', 'ocean'];

	let sound = sounds[0];
	let currentSound = sound;

	let soundEffect: Howl | null = null;

	$: if (sound !== currentSound) {
		currentSound = sound;

		let volume = 0.3;
		if (soundEffect) {
			volume = soundEffect.volume();
			soundEffect.stop();
		}

		soundEffect = new Howl({
			src: [`${main_url}sounds/${sound}.mp3`],
			loop: true,
			volume: volume,
			onload: () => {
				if (playing) {
					soundEffect.play();
				}
			}
		});
	}

	let main_url: string = '';

	onMount(async () => {
		main_url = window.location.href;

		// get rid of the last part of the url (everything after the last /)
		main_url = main_url.substring(0, main_url.lastIndexOf('/') + 1);

		let name = meditationNames[Math.floor(Math.random() * meditationNames.length)];

		// see if meditation is in url params
		const urlParams = new URLSearchParams(window.location.search);
		const meditationName = urlParams.get('m');
		if (meditationName) {
			name = meditationName;
		}

		console.log('loading meditation', name);

		// load /name/data.json
		let response = await fetch(`${main_url}meditation/${name}/en/data.json`);
		meditation = await response.json();

		if (!meditation) {
			return;
		}

		let voice = meditation.voices[0].toLowerCase();

		audioPause = meditation.pauses[0];

		// load /name/voice/0.mp3, /name/voice/1.mp3, ...
		for (let i = 0; i < meditation.parts.length; i++) {
			audioParts.push(
				new Howl({
					src: [`${main_url}meditation/${name}/en/${voice}/part_${i}.mp3`],
					volume: 1,
					onend: () => {
						partFinished();
					}
				})
			);
		}

		music = new Howl({
			src: [`${main_url}music/${song}.mp3`],
			loop: true,
			volume: 0.5
		});

		soundEffect = new Howl({
			src: [`${main_url}sounds/${sound}.mp3`],
			loop: true,
			volume: 0.3
		});
	});

	function partFinished() {
		audioPause = meditation?.pauses[currentPart + 1] ?? 0;
	}

	function playPause() {
		playing = !playing;

		if (!started) {
			music.play();
			soundEffect.play();

			started = true;
			setInterval(loop, 100);

			return;
		}

		if (playing) {
			music.play();
			soundEffect.play();

			if (currentPart >= 0 && currentPart < audioParts.length && audioPause < 0)
				audioParts[currentPart].play();
		} else {
			music.pause();
			soundEffect.pause();

			if (currentPart >= 0 && currentPart < audioParts.length && audioPause < 0)
				audioParts[currentPart].pause();
		}
	}

	function finished() {
		console.log('finished', time);
		//music.stop();
		//soundEffect.stop();
		currentPart = 0;

		playing = false;
	}

	function loop() {
		if (!playing) return;

		time += 0.1;

		if (audioPause > 0) {
			audioPause -= 0.1;

			if (audioPause <= 0) {
				console.log('next part');
				currentPart++;
				if (currentPart >= (meditation?.parts.length ?? 0)) {
					finished();
					return;
				}

				audioParts[currentPart].play();
			}
		}
	}

	let backgrounds = ['flowfield', 'mandala', 'noise', 'rectangles', 'spiral', 'triangles'];

	let background = backgrounds[0];

	let mouseMoved = true;

	let mouseMovedTimeout: NodeJS.Timeout | null = null;
</script>

<svelte:body
	on:keydown={(e) => {
		if (e.key === 'b') {
			// change background
			background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
		}

		if (e.key === 'f') {
			// toggle fullscreen
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				document.documentElement.requestFullscreen();
			}
		}
	}}
	on:mousemove={() => {
		mouseMoved = true;

		if (mouseMovedTimeout) {
			clearTimeout(mouseMovedTimeout);
		}

		mouseMovedTimeout = setTimeout(() => {
			mouseMoved = false;
		}, 1000);
	}}
/>

{#if main_url}
	{#key background}
		<iframe
			class="absolute inset-0 h-full w-full -z-10 overflow-hidden"
			src="{main_url}backgrounds/{background}/index.html"
			title="background animation"
		></iframe>
	{/key}
{/if}

<button on:click={playPause} class="h-screen w-screen group cursor-pointer outline-none">
	<div class="flex items-center justify-center h-screen z-10">
		<div
			class="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 ease-in-out text-white hover:text-white/80 {playing &&
			!mouseMoved
				? 'opacity-0 hover:opacity-100'
				: ''}"
		>
			{#if playing}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-24 h-24"
				>
					<path
						fill-rule="evenodd"
						d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
						clip-rule="evenodd"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-24 h-24"
				>
					<path
						fill-rule="evenodd"
						d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</div>
	</div>
</button>

<Dialog.Root>
	<Dialog.Trigger
		class="absolute bottom-2 right-2 z-10 p-4 bg-white/5 border border-white/10 outline-none hover:bg-white/10 backdrop-blur-xl transition-all duration-300 ease-in-out rounded-xl cursor-pointer {playing &&
		!mouseMoved
			? 'opacity-0 hover:opacity-100'
			: ''}"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
			<path
				fill-rule="evenodd"
				d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
				clip-rule="evenodd"
			/>
		</svg>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Description>
				<div class="text-sm text-white">
					<div class="text-lg font-semibold text-left">Background</div>
					<div class="flex items-start mt-2 flex-wrap">
						{#each backgrounds as bg}
							<Toggle value={bg} bind:selected={background} />
						{/each}
					</div>

					<div class="text-lg font-semibold mt-6 text-left">Music</div>
					<div class="flex items-start mt-2">
						{#each songs as s}
							<Toggle value={s} bind:selected={song} />
						{/each}
					</div>

					<div class="flex items-center mt-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6 mr-4 text-white"
						>
							<path
								d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z"
							/>
							<path
								d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z"
							/>
						</svg>
						<Slider
							value={[50]}
							max={100}
							step={1}
							onValueChange={(val) => {
								if (music) {
									music.volume(val[0] / 100);
								}
							}}
						/>
					</div>

					<div class="text-lg font-semibold mt-6 text-left">Sounds</div>
					<div class="flex items-start mt-2">
						{#each sounds as s}
							<Toggle value={s} bind:selected={sound} />
						{/each}
					</div>

					<div class="flex items-center mt-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6 mr-4 text-white"
						>
							<path
								d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z"
							/>
							<path
								d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z"
							/>
						</svg>
						<Slider
							value={[30]}
							max={100}
							step={1}
							onValueChange={(val) => {
								if (soundEffect) {
									soundEffect.volume(val[0] / 100);
								}
							}}
						/>
					</div>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
