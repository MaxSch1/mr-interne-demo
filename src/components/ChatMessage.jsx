// ChatMessage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextToSpeechButton from './TextToSpeechButton';

const ChatMessage = ({
	message,
	isLastMessage,
	lastUserMessage,
	audioOn,
	selectLanguage,
	onDataFromChild,
	handleIsWriting,
}) => {
	const [userAgreed, setUserAgreed] = useState(false);
	const [userDisagreed, setUserDisagreed] = useState(false);

	const handleAgree = async () => {
		setUserAgreed(true);
		setUserDisagreed(false);

		sendFeedback(lastUserMessage.text, 1);
	};

	const handleDisagree = async () => {
		setUserDisagreed(true);
		setUserAgreed(false);

		sendFeedback(lastUserMessage.text, 0);
	};
	const sendFeedback = async (text, binaire) => {
		try {
			await axios.post(
				'https://cbmr-mfeedback.azurewebsites.net/api/Feedback?code=KvV3PM6hTqJwxPLVu34-3oa5oj2TPsTZfGVNPl9_tkXEAzFu6mJ-2Q==',
				{
					chat_response: text,
					feedback: binaire,
					ChatID: "TempFromCBUI",
					auth_key: "q8olbmjjOmONSx'Qvu04rFjNKRP^%CRr+ELaluZnZEnH%]ca+w"
				}
			);
		} catch (error) {
			console.error('Erreur lors de la récupération du feedback :', error);
			// Gérer les erreurs d'API
		}
	};
	const [agreeButtonText, setAgreeButtonText] = useState('I Agree');
	const [disagreeButtonText, setDisagreeButtonText] = useState('I Disagree');
	useEffect(() => {
		// Mettez en place une logique pour changer le texte des boutons en fonction de la langue sélectionnée
		switch (selectLanguage) {
			case 'en':
				setAgreeButtonText('I Agree');
				setDisagreeButtonText('I Disagree');
				break;
			case 'de':
				setAgreeButtonText('Ich stimme zu');
				setDisagreeButtonText('Ich stimme nicht zu');
				break;
			case 'nl':
				setAgreeButtonText('Ik ga akkoord');
				setDisagreeButtonText('Ik ga niet akkoord');
				break;
			case 'fr':
				setAgreeButtonText("Je suis d'accord");
				setDisagreeButtonText("Je ne suis pas d'accord");
				break;
			default:
				setAgreeButtonText("Je suis d'accord"); // La langue par défaut
				setDisagreeButtonText("Je ne suis pas d'accord"); // La langue par défaut
		}
	}, [selectLanguage]);

	const [data, setData] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async (response) => {
			try {
				setLoading(true);

				const reader = response.body.getReader();
				const decoder = new TextDecoder();

				while (true) {
					const { value, done } = await reader.read();

					if (done) {
						setLoading(false);
						break;
					}

					const decodedChunk = decoder.decode(value, { stream: true });
					const jsonMatch = [
						...decodedChunk.matchAll(/data: ({.*?})(?=\s*event: data|\s*$)/gs),
					];

					jsonMatch.forEach((match) => {
						const jsonStr = match[1].trim();

						try {
							const jsonData = JSON.parse(jsonStr);

							if ('content' in jsonData) {
								setData((prevValue) => `${prevValue}${jsonData.content}`);
								// Continue reading the next chunk
							}
						} catch (e) {
							console.error('Failed to parse JSON:', e);
						}
					});
				}
				handleIsWriting(loading);
			} catch (error) {
				setLoading(false);
				// Handle errors during streaming
			}
		};
		if (!message.isUser && typeof message.text === 'string') {
			setData(message.text);
		} else if (!message.isUser) {
			fetchData(message.text);
		}
	}, [data, message.text]);

	useEffect(() => {
		if (!loading) {
			onDataFromChild(data);
		}
	}, [data]);

	return (
		<div className='  text-left mx-auto w-11/12 '>
			<div
				className={`flex mx-2 my-2 ${
					isLastMessage ? '' : 'border-b-2'
				} border-[#D0D3DB] relative w-full`}>
				{message.isUser ? (
					<svg
						width='30'
						height='30'
						viewBox='0 0 30 30'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className=' mx-1 my-2 min-w-min absolute top-0 -left-5'>
						<rect
							x='0.5'
							y='0.5'
							width='29'
							height='29'
							rx='14.5'
							stroke='black'
						/>
						<path
							d='M22.0165 23.023V21.3176C22.0165 20.413 21.6571 19.5454 21.0174 18.9058C20.3778 18.2661 19.5102 17.9067 18.6056 17.9067H11.7839C10.8793 17.9067 10.0117 18.2661 9.37206 18.9058C8.7324 19.5454 8.37305 20.413 8.37305 21.3176V23.023'
							stroke='black'
							stroke-width='2'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
						<path
							d='M15.1931 14.4958C17.0768 14.4958 18.6039 12.9687 18.6039 11.0849C18.6039 9.20116 17.0768 7.67407 15.1931 7.67407C13.3093 7.67407 11.7822 9.20116 11.7822 11.0849C11.7822 12.9687 13.3093 14.4958 15.1931 14.4958Z'
							stroke='black'
							stroke-width='2'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
					</svg>
				) : (
					<img
						src='https://ui-chatbot1.s3.eu-north-1.amazonaws.com/WhatsApp+Image+2024-01-04+%C3%A0+18.29+1+(1).png'
						alt=''
						className=' mx-1 my-2 min-w-min absolute top-0 -left-5'
					/>
				)}
				<div className='flex-col py-2 pl-6 mb-5 w-full'>
					<div className='flex w-full'>
						<span className='text-base font-bold block align-middle whitespace-nowrap'>
							{message.isUser ? 'You' : 'Liloo AI'}
						</span>
						{message.isUser && isLastMessage
							? ''
							: isLastMessage && (
									<TextToSpeechButton
										textToSpeak={data}
										isLastMessage
										audioOn={audioOn}
										selectLanguage = {selectLanguage}
																			/>
							  )}
					</div>
					<span className='text-justify max-w-prose text-base font-medium '>
						{message.isUser ? (
							message.text
						) : loading ? (
							<i>Fetching data...</i>
						) : (
							data
						)}
					</span>
					{!message.isUser && isLastMessage && (
						<div className='mt-2 text-white flex sm:block'>
							{userAgreed || userDisagreed ? (
								<button
									className={`${
										userAgreed ? 'bg-green-500' : 'bg-gray-500'
									} text-white text-xs px-8 sm:px-16 py-1 rounded-xl mr-28`}>
									{userAgreed ? "Je suis d'accord" : "Je ne suis pas d'accord"}
								</button>
							) : (
								<>
									<button
										onClick={() => handleAgree()}
										className='bg-[#002EFF]  text-xs px-6 sm:px-16 py-1 rounded-xl mr-2 w-full sm:w-auto'
										style={{ boxShadow: '2px 3px 4px rgba(0, 0, 0, 0.2)' }}>
										{agreeButtonText}
									</button>
									<button
										onClick={() => handleDisagree()}
										className='bg-[#002EFF]  text-xs px-6 sm:px-16 py-1 rounded-xl w-full sm:w-auto'
										style={{ boxShadow: '2px 3px 4px rgba(0, 0, 0, 0.2)' }}>
										{disagreeButtonText}
									</button>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
