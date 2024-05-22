import axios from 'axios';
import * as fs from 'fs/promises';
import 'dotenv/config';

const YOUR_XI_API_KEY = process.env.ELEVENLABS_API_KEY;

async function getAllVoices() {
	try {
		const url = 'https://api.elevenlabs.io/v1/voices';

		const headers = {
			Accept: 'application/json',
			'xi-api-key': YOUR_XI_API_KEY,
			'Content-Type': 'application/json'
		};

		const response = await axios.get(url, { headers });
		const data = response.data;

		const voices = data.voices.map((voice: { name: string; voice_id: string }) => {
			console.log(`${voice.name}; ${voice.voice_id}`);
			return { name: voice.name, voice_id: voice.voice_id };
		});

		await fs.writeFile('voices.json', JSON.stringify(voices, null, 2));
		console.log('Voices data saved to voices.json');
	} catch (error) {
		console.error('Error:', error);
	}
}

async function createAudio({
	text,
	filepath,
	voice = 'Nicole',
	update_voices = false
}: {
	text: string;
	filepath: string;
	voice?: string;
	update_voices?: boolean;
}) {
	// check if voices.json exists, if not, fetch voices
	try {
		await fs.access('voices.json');

		if (update_voices) {
			await getAllVoices();
		}
	} catch (error) {
		await getAllVoices();
	}

	const headers = {
		Accept: 'application/json',
		'xi-api-key': YOUR_XI_API_KEY
	};
	try {
		// load voices.json
		const voicesData = await fs.readFile('voices.json', 'utf8');
		const voices = JSON.parse(voicesData);

		// find the voice object by name
		const voice_obj = voices.find((v: { name: string }) => v.name === voice);

		if (!voice_obj) {
			console.error(`Voice named ${voice} not found.`);
			return;
		}

		const voice_id = voice_obj.voice_id;
		const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/with-timestamps`;

		const data = {
			text,
			model_id: 'eleven_multilingual_v1',
			voice_settings: {
				stability: 0.5,
				similarity_boost: 0.75
			}
		};

		const response = await axios.post(url, data, { headers });

		if (response.status !== 200) {
			console.error(`Error encountered, status: ${response.status}, content: ${response.data}`);
			return;
		}

		const response_dict = response.data;

		// The "audio_base64" entry in the dictionary contains the audio as a base64 encoded string,
		// we need to decode it into bytes in order to save the audio as a file
		const audio_bytes = Buffer.from(response_dict['audio_base64'], 'base64');

		// remove filename from filepath
		const folderpath = filepath.replace(/\/[^/]*$/, '');

		// create folders if necessary
		await fs.mkdir(folderpath, { recursive: true });

		await fs.writeFile(filepath + '.mp3', audio_bytes);
		console.log('Audio file saved as ' + filepath + '.mp3');

		// The 'alignment' entry contains the mapping between input characters and their timestamps
		console.log(response_dict['alignment']);

		// write to file
		await fs.writeFile(filepath + '.json', JSON.stringify(response_dict['alignment'], null, 2));
		console.log('Alignment data saved as ' + filepath + '.json');
	} catch (error) {
		console.error('Error:', error);
	}
}

export async function generateSpokenTexts({
	texts,
	voices,
	folder,
	update_voices = false
}: {
	texts: string[];
	voices: string[];
	folder: string;
	update_voices?: boolean;
}) {
	for (const voice of voices) {
		// to lowercase, get rid of everything not a letter
		const voice_folder = voice.toLowerCase().replace(/[^a-z]/g, '');

		// check if folder exists, if it does, print warning and exit
		try {
			await fs.access(folder + '/' + voice_folder);
			console.error(`Folder ${folder}/${voice_folder} already exists, skipping.`);
			return;
		} catch (error) {
			// if folder doesn't exist, create it
			await fs.mkdir(folder + '/' + voice_folder, { recursive: true });
		}

		if (update_voices) {
			await getAllVoices();
		}

		for (let i = 0; i < texts.length; i++) {
			await createAudio({
				text: texts[i],
				filepath: folder + '/' + voice_folder + '/part_' + i,
				voice,
				update_voices: false
			});
		}
	}
}
