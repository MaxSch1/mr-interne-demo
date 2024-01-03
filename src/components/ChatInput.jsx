// ChatInput.js

import React, { useEffect, useState, useRef } from 'react';
import RectangleGenerator from './RectangleGenerator';
import axios from 'axios';

const ChatInput = ({ addMessage, disabled, selectLanguage }) => {
	const [inputText, setInputText] = useState('');
	const [messageCount, setMessageCount] = useState(0);
	const [lastMessageTime, setLastMessageTime] = useState(null);
	const [placeholder, setPlaceholder] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (canSendMessage()) {
			await addMessage(inputText);
			setInputText('');
			updateMessageCount();
		} else {
			alert('Limite de messages atteinte. Veuillez réessayer plus tard.');
		}
	};
	useEffect(() => {
		// Mettez en place une logique pour changer le placeholder en fonction de la langue sélectionnée
		switch (selectLanguage) {
			case 'en':
				setPlaceholder('Type your message here...');
				break;
			case 'de':
				setPlaceholder('Geben Sie Ihre Nachricht hier ein...');
				break;
			case 'nl':
				setPlaceholder('Typ hier uw bericht...');
				break;
			case 'fr':
				setPlaceholder('Tapez votre message ici...');
				break;
			default:
				setPlaceholder('Tapez votre message ici...'); // La langue par défaut
		}
	}, [selectLanguage]);
	const [recording, setRecording] = useState(false);
	const audioRef = useRef(null);
	const mediaRecorder = useRef(null);

	const startRecording = () => {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				const recorder = new MediaRecorder(stream);
				const audioChunks = [];

				recorder.ondataavailable = (e) => {
					if (e.data.size > 0) {
						audioChunks.push(e.data);
					}
				};

				recorder.onstop = () => {
					const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
					if (audioRef.current) {
						const audioUrl = URL.createObjectURL(audioBlob);
						audioRef.current.src = audioUrl;
					}

					// Envoi du fichier audio à votre API
					transcribeAudio(audioBlob);

					setRecording(false);
				};

				recorder.start();
				mediaRecorder.current = recorder;
				setRecording(true);
			})
			.catch((err) => {
				console.error("Erreur lors de l'accès au microphone :", err);
			});
	};

	const stopRecording = () => {
		// Arrête l'enregistrement
		if (mediaRecorder.current) {
			mediaRecorder.current.stop();
		}
	};

	const transcribeAudio = async (audioFile) => {
		try {
			const formData = new FormData();
			formData.append('file', audioFile, 'audio.mp3');
			console.log('Contenu de FormData :', formData.get('file'));
			const response = await axios.post(
				'https://cbmr-tts-stt-v2.azurewebsites.net/api/STT?code=lF1fymi58KpeeU1O3HOkd5cGi3Kqw4eHoGEOQkaFHwQpAzFuZ0rk2w==',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			if (response.data && response.data.text_transcript) {
				setInputText(response.data.text_transcript);
			}
		} catch (error) {
			console.error('Erreur lors de la transcription audio :', error);
			// Gérer les erreurs d'API
		}
	};

	const updateMessageCount = () => {
		setMessageCount(messageCount + 1);
		setLastMessageTime(new Date());
	};

	const canSendMessage = () => {
		const now = new Date();
		const timeDifference = now - lastMessageTime;
		const millisecondsPerHour = 60 * 60 * 1000;

		return messageCount < 25 || timeDifference >= millisecondsPerHour;
	};
	// Effet pour réinitialiser le compteur après une heure
	useEffect(() => {
		const interval = setInterval(() => {
			setMessageCount(0);
			setLastMessageTime(new Date());
		}, 60 * 60 * 1000); // Réinitialiser toutes les heures

		return () => clearInterval(interval);
	}, []);

	return (
		<form
			onSubmit={handleSubmit}
			className={`mt-2 flex items-center justify-center ${
				disabled ? 'opacity-50' : ''
			}`}>
			<div className='relative w-full md:mx-6 '>
				<label htmlFor='audioFileInput'>
					<button
						type='button'
						onClick={recording ? stopRecording : startRecording}
						className={`bg-[#002EFF] text-white rounded-full  py-2 ${
							recording ? 'w-full h-full  pl-4 ' : 'mr-2 ml-1 my-1 px-3'
						} absolute left-0 flex items-center `}>
						<svg
							width='11'
							height='18'
							viewBox='0 0 15 22'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M7.22694 1C6.51912 1 5.84029 1.28118 5.33979 1.78168C4.83928 2.28219 4.55811 2.96101 4.55811 3.66883V10.7857C4.55811 11.4935 4.83928 12.1724 5.33979 12.6729C5.84029 13.1734 6.51912 13.4545 7.22694 13.4545C7.93475 13.4545 8.61358 13.1734 9.11409 12.6729C9.61459 12.1724 9.89577 11.4935 9.89577 10.7857V3.66883C9.89577 2.96101 9.61459 2.28219 9.11409 1.78168C8.61358 1.28118 7.93475 1 7.22694 1Z'
								stroke='white'
								stroke-width='2'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
							<path
								d='M13.4545 9.00648V10.7857C13.4545 12.4373 12.7985 14.0212 11.6306 15.189C10.4628 16.3569 8.87885 17.013 7.22727 17.013C5.5757 17.013 3.99177 16.3569 2.82393 15.189C1.65609 14.0212 1 12.4373 1 10.7857V9.00648'
								stroke='white'
								stroke-width='2'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
							<path
								d='M7.22705 17.013V20.5714'
								stroke='white'
								stroke-width='2'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
							<path
								d='M3.66895 20.5715H10.7858'
								stroke='white'
								stroke-width='2'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
						</svg>
						{recording ? <>{<RectangleGenerator count={80} />}</> : ''}
					</button>
				</label>
				<input
					id='audioFileInput'
					type='file'
					accept='audio/mp3'
					onChange={() => {}}
					className='hidden'
				/>
				<input
					type='text'
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					maxLength={250}
					placeholder={placeholder}
					className={` ${
						recording ? ' bg-[#002EFF]' : 'bg-white '
					}w-full  p-2 pl-12 pr-12 rounded-full  italic-placeholder border-[1px] focus:outline-none `}
					style={{ boxShadow: '3px 4px 3px rgba(0, 0, 0, 0.2)' }}
					disabled={disabled} // pl-10 pour laisser de l'espace pour le bouton audio
				/>
				<button
					type='submit'
					className={`absolute right-0 text-white rounded-full py-2 px-1.5 mr-1 my-1  ${
						recording ? 'bg-white ' : 'bg-[#002EFF] '
					}`}>
					<svg
						width='18'
						height='18'
						viewBox='0 0 18 18'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='ml-1'>
						<path
							d='M16.5689 8.28446C17.1586 8.57928 17.1586 9.42072 16.5689 9.71554L1.15777 17.4211C0.625848 17.6871 -8.95063e-07 17.3003 -8.64295e-07 16.7056L-5.27099e-07 10.1881C-5.21728e-07 10.0842 0.0794329 9.99769 0.182868 9.98879L9.55574 9.18299C9.79772 9.16219 9.80039 8.80921 9.55876 8.78474L0.179847 7.83488C0.0777164 7.82453 -4.00369e-07 7.73855 -3.95058e-07 7.63589L-6.69697e-08 1.29443C-3.62014e-08 0.699721 0.625851 0.312924 1.15777 0.578885L16.5689 8.28446Z'
							fill={` ${recording ? 'blue' : 'white'}`}
						/>
					</svg>
				</button>
			</div>
		</form>
	);
};

export default ChatInput;
