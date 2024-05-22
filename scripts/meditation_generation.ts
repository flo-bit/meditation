import * as fs from 'fs/promises';
import * as path from 'path';
import OpenAI from 'openai';
import 'dotenv/config';
import { generateSpokenTexts } from './voice_generation';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

type Meditation = {
	name: string;
	text: string;
	parts: string[];
	pauses: number[];
	length: number;
	voices: string[];
};

async function generateMeditationData(
	name: string,
	length: number = 3,
	focus: string | undefined = undefined
) {
	const meditation: Meditation = {
		name,
		text: '',
		parts: [],
		pauses: [],
		length,
		voices: []
	};

	const folderPath = path.join(__dirname, name);

	// Check if folder already exists
	try {
		await fs.access(folderPath);
		console.error(`Folder "${name}" already exists. Please choose a different name.`);
		return;
	} catch (error) {
		// Folder does not exist, proceed to create it
		await fs.mkdir(folderPath, { recursive: true });
	}

	const focusInstruction = focus ? `The meditation shoud focus on "${focus}".` : '';

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'system',
				content: `Write a ${length} minutes meditation guide that will be converted to speech. ${focusInstruction}
Don't start with 'Welcome to the meditation' or something like that but jump right in. Also don't end with 'Thank you for meditating' or 'Namaste' or something like that.
At the beinning and end and in between the meditation, add pauses by writing <PAUSE: X> where X is the number of seconds to pause for.`
			}
		]
	});

	if (!completion.choices[0].message.content) {
		throw new Error('No content');
	}

	meditation.text = completion.choices[0].message.content;

	// Split the meditation text into parts and pauses
	const regex = /<PAUSE: (\d+)>/g;
	let match;
	let lastIndex = 0;

	while ((match = regex.exec(meditation.text)) !== null) {
		// Extract the text part before the pause
		const textPart = meditation.text.substring(lastIndex, match.index).trim();
		if (textPart) {
			meditation.parts.push(textPart);
		}
		// Extract the pause duration
		const pauseDuration = parseInt(match[1], 10);
		meditation.pauses.push(pauseDuration);

		lastIndex = regex.lastIndex;
	}

	// Add any remaining text after the last pause
	const remainingText = meditation.text.substring(lastIndex).trim();
	if (remainingText) {
		meditation.parts.push(remainingText);
		// Add a default pause duration after the last part
		meditation.pauses.push(5); // You can adjust this default pause duration as needed
	}

	// Ensure there is a pause before the first part
	if (meditation.parts.length >= meditation.pauses.length) {
		meditation.pauses.unshift(5); // Add a default pause before the first part
	}

	return meditation;
}

async function saveMeditationData(meditation: Meditation, name: string) {
	// Save the meditation to a JSON file in the created folder
	const filePath = path.join(name, 'data.json');
	await fs.writeFile(filePath, JSON.stringify(meditation, null, 2));

	console.log(`Meditation saved to ${filePath}`);
}

const topics = [
	{
		name: 'ocean',
		focus:
			'imagining sitting on a beach, watching gentle waves come in and out, synchronizing your breathing with the rhythm of the waves, and feeling a sense of calm wash over you with each breath'
	},
	{
		name: 'gratitude',
		focus:
			'reflecting on three things you are grateful for, allowing yourself to fully feel the gratitude and letting it fill you with warmth and contentment'
	},
	{
		name: 'bodyscan',
		focus:
			'performing a body scan, starting from your toes and moving up to your head, pausing at each body part, noticing any tension and allowing it to release'
	},
	{
		name: 'cloud',
		focus:
			'visualizing yourself lying on a soft, fluffy cloud, floating gently in the sky, feeling the weightlessness and the support of the cloud, and letting go of any worries'
	},
	{
		name: 'affirmations',
		focus:
			"repeating positive affirmations silently or aloud, focusing on affirmations that resonate with you, such as 'I am calm,' 'I am strong,' and 'I am at peace'"
	},
	{
		name: 'innerlight',
		focus:
			'imagining a warm, glowing light within you, visualizing it expanding with each breath, filling your entire body with warmth and positivity, and letting this light represent peace and healing'
	},
	{
		name: 'garden',
		focus:
			'envisioning a beautiful, tranquil garden, walking through it, noticing the flowers, the scent of fresh blooms, and the sound of a gentle stream, finding a peaceful spot to sit and absorb the serenity'
	},
	{
		name: 'candle',
		focus:
			'visualizing a candle flame in front of you, focusing on its steady flicker and the way it dances, and letting your mind become absorbed in the flame, clearing away other thoughts and distractions'
	}
];

async function generateMeditation({
	name,
	length = 3,
	voices = ['Nicole'],
	focus
}: {
	name: string;
	length?: number;
	voices?: string[];
	focus?: string;
}) {
	const data = await generateMeditationData(name + '/en', length, focus);

	if (!data) return;

	data.voices = voices;

	await saveMeditationData(data, name + '/en');

	await generateSpokenTexts({
		texts: data.parts,
		voices: voices,
		folder: path.join(__dirname, name + '/en'),
		update_voices: false
	});
}

async function generateAll() {
	for (const topic of topics) {
		await generateMeditation({
			name: topic.name,
			length: 5,
			voices: ['Nicole'],
			focus: topic.focus
		});
	}
}

generateAll();
