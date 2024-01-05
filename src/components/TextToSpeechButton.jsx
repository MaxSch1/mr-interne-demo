// Import necessary libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TextToSpeechButton = ({ textToSpeak, isLastMessage, audioOn, selectLanguage }) => {
	const [audioFile, setAudioFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [audioVisible, setAudioVisible] = useState(false);
const [chunks, setChunks] = useState('');

	const handleTextToSpeech = async () => {
		try {
			if (audioVisible) {
				setAudioVisible(false);
				setAudioFile(null);
setChunks('');

				return;
			}
			// Set loading state to true
			setLoading(true);

			// Make a POST request to the text-to-speech API endpoint
			console.log('lang for TTS:', selectLanguage);
			console.log('text for TTS:', chunks);

			const response = await axios.post(
				'https://cbmr-tts-stt-v2.azurewebsites.net/api/TTSapi?code=yZ3yfJzonO7vsq7seVmOm5gno3wMUYKO3UYVXuRBvvv7AzFuQnsG5g==',
				{ Ai_message: chunks, auth_key : "Ecp)KyWhR}%kdA5$-C-InQopRp$MTQ8DINtPDY^kQQQZ&[2Q5U", lang: selectLanguage  },
				{ responseType: 'arraybuffer' }
			);

			const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
			const audioUrl = URL.createObjectURL(audioBlob);
			setAudioVisible(true);
			setAudioFile(audioUrl);
			console.log(audioFile);
		} catch (error) {
			if (error.response) {
				// La requête a été effectuée et le serveur a répondu avec un code d'erreur
				console.error("Réponse du serveur avec code d'erreur:", error.response);
			} else if (error.request) {
				// La requête a été effectuée, mais aucune réponse n'a été reçue
				console.error('Aucune réponse du serveur reçue:', error.request);
			} else {
				// Une erreur s'est produite lors de la configuration de la requête
				console.error(
					'Erreur lors de la configuration de la requête:',
					error.message
				);
			}
		} finally {
			// Set loading state back to false
			setLoading(false);
		}
	};

	useEffect(() => {
		if (audioOn && chunks !== '') {
			handleTextToSpeech();
		}
// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audioOn, chunks]);

useEffect(() => {
		setChunks(textToSpeak);
	}, [textToSpeak]);
	return (
		<div
			className={`ml-1 flex w-2/3 ${
				audioVisible ? 'bg-[#002EFF] rounded-full' : ''
			} transition-transform`}>
			<button
				className={`bg-[#002EFF] text-white px-1 py-1 rounded-full ml-2 inline ${
					isLastMessage ? '' : 'hidden'
				}`}
				onClick={handleTextToSpeech}
				disabled={loading}>
				<svg
					width='19'
					height='19'
					viewBox='0 0 18 19'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className=''>
					<path
						d='M8.25 3.95825L4.5 7.12492H1.5V11.8749H4.5L8.25 15.0416V3.95825Z'
						stroke='white'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
					<path
						d='M14.3025 3.90283C15.7086 5.38743 16.4984 7.4007 16.4984 9.49992C16.4984 11.5991 15.7086 13.6124 14.3025 15.097M11.655 6.69742C12.358 7.43971 12.753 8.44635 12.753 9.49596C12.753 10.5456 12.358 11.5522 11.655 12.2945'
						stroke='white'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</button>

			{audioFile && audioVisible && (
				<audio
					controls
					autoPlay={audioOn}
					src={audioFile}
					className=' custom-audio '
				/>
			)}
		</div>
	);
};

export default TextToSpeechButton;
