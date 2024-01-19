// ChatModal.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatInput from './ChatInput';
import ChatBox from './ChatBox';
import ChatSuggestions from './ChatSuggestions';
import ChatHeader from './ChatHeader';

import Disclaimer from './Disclaimer';
import Cookies from 'js-cookie';

const ChatModal = () => {
	const [messages, setMessages] = useState([]);
	const [userMessage, setUserMessage] = useState('');
	const [suggestions, setSuggestion] = useState([
		"Qu'est ce que le MR?",
			'Quels améliorations proposez-vous pour les transports publics ?',
			'Quelles sont vos solutions pour la crise du logement ?',
			'Comptez-vous augmenter ou diminuer les impôts ?',
	]);
	const [selectLanguage, setSelectLanguage] = useState('fr');
	const [isAudioOn, setIsAudioOn] = useState(true);
	const [history, setHistory] = useState([]);
	const [isWriting, setIsWriting] = useState(false);
	const [generatedID, setGeneratedID] = useState(null);
	const [showDisclaimer, setShowDisclaimer] = useState(true);
	
	const [chunks, setChunks] = useState('');

	const handleDataFromChild = (data) => {
		// La fonction de rappel pour remonter les données du composant enfant
		
setChunks(data);
	};
		const handleLanguageChange = (selectedLanguage) => {
		setSelectLanguage(selectedLanguage);
		// console.log((`LANGUEtestla: ${selectLanguage}`));
	};

	const handleAudioChange = (audioOn) => {
		setIsAudioOn(audioOn);
	};

	const addMessage = async (text, isUser = true) => {
		if (text !== '') {
			setMessages((prevMessages) => [...prevMessages, { text, isUser }]);
			setIsWriting(true);

			// Si le message est de l'utilisateur, envoyez-le à l'API et attendez la réponse
			if (isUser) {
				// Envoie le message de l'utilisateur à l'API
			console.log(`id from func: ${generatedID}`);
			console.log(`lang frim func: ${selectLanguage}`);
			sendUserMessageToAPI(text, generatedID,selectLanguage);
			setUserMessage(text);
			}
		}
	};
	const fecthHistoriqueMessage = async () => {
		try {
			console.log(`CHATID FETCG HISTORY: ${generatedID}`)
			const response = await axios.post(
				'https://cbmr-get-send-chats-api.azurewebsites.net/api/Getdata?code=dxmA8N9uL1gtuiSdLDITKVXpNRYSUJ09x9ryZeHNhgb6AzFu9Js6GQ==',
				{
					ChatID: generatedID,
					auth_key: "Q)[[ba%kOSb4$Dsep=hW#^epgqTmC_RFMqRDcd1=pHGbHk1d~d"
				}
			);
// Assurez-vous que response.data a la structure attendue
			const data = response.data;

			// Adaptation des messages
			const adaptedMessages = data.Messages.map((message) => [
				{ text: message.User_Message, isUser: true },
				{ text: message.AI_Message, isUser: false },
			]);

			setMessages([...messages, ...adaptedMessages.flat()]);
		} catch (error) {
			console.error('Erreur lors de la requête API :', error);
			// Gérer les erreurs d'API
		}
	};
	const [loader, setloader] = useState(false);
	const sendUserMessageToAPI = async (text, generatedID,selectedLanguage) => {
		try {
			setloader(true);
			const response = await fetch(
				'https://cbmr-demo-int-18-01-ylhttgdmua-ew.a.run.app/stream',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						input: {
							question: text,
							ChatID: generatedID,
							language : selectedLanguage,
							mobile : "n",
						},
						config: {},
						kwargs: {}
					}),
				}
			);
			console.log(response);
			if (!response.ok) {
				throw new Error(`Erreur HTTP! Statut: ${response.status}`);
			}
			setMessages((prevMessages) => [
				...prevMessages,
				{ text: response, isUser: false },
			]);
setloader(false);
		} catch (error) {
			console.error('Erreur lors de la requête API :', error);
			// Gérer les erreurs d'API
		}
	};
	
	const sendUserMessageAndAIResponseToHistory = async (
		userMessage,
		aiResponse
	  ) => {
		// // console.log("prevUsermessage", prevUserMessage);
		
		// // Check if userMessage or aiResponse is empty, or if userMessage hasn't changed
		// if (!userMessage.trim() || !aiResponse.trim()) {
		//   console.log("Conditions not met for sending message to API");
		//   return; // Exit the function early
		// }
		if (userMessage && aiResponse && !isWriting) {
		try {
		  console.log("FROM USER: ", userMessage);
		  console.log("FROM AI: ", aiResponse);
		  console.log("FROM GID: ", generatedID);
		  const response = await axios.post(
			'https://cbmr-get-send-chats-api.azurewebsites.net/api/Testdb?code=8dL0T-5a41sWjxn73ARjCm660dP9oF9ytfJRCvhqBm26AzFup69ZFQ==',
			{
			  ChatID: generatedID,
			  auth_key : "Q)[[ba%kOSb4$Dsep=hW#^epgqTmC_RFMqRDcd1=pHGbHk1d~d",
			  User_message: userMessage,
			  AI_message: aiResponse,
			}
		  );
		  console.log(response);
		} catch (error) {
		  console.error("Erreur lors de la requête API pour l'historique :", error);
		  // Handle API errors for history here
		}
	} else {
		console.log("User message or AI response is empty, not sending to API.");
	}
	  };

	const fetchSuggestions = async (userMessage, IAmessage,selectedLanguage) => {
		if (userMessage && IAmessage && !isWriting) {
		try {
			console.log((`LANGUESUGG: ${selectedLanguage}`));
			const response = await axios.post(
				'https://cbmr-suggapi.azurewebsites.net/api/SuggAPI?code=0Zs6OvMWFVEO1zWmGRyKaJ0lMdIUrTe7ySaMv-X8dth9AzFuDtA_3g==',
				{
					ChatID: generatedID,
					lang: selectedLanguage,
					AI_ans: IAmessage,
					auth_key: "WiDAFu3p}^(co%RponDjEF@LPK#$QvE7@$z~Png9ifB8c5;Qcd",
				}
			);
			console.log(response);
			setSuggestion(response.data);

			// Assurez-vous que la structure de la réponse est correcte
		} catch (error) {
			console.error('Erreur lors de la récupération des suggestions :', error);
			// Gérer les erreurs d'API
		}
	} else {
		console.log("User message or AI response is empty, not sending to API.");
	}
	};

	useEffect(() => {
		const timerId = setTimeout(() => {
			if (chunks !== '') {

			sendUserMessageAndAIResponseToHistory(userMessage, chunks);
			fetchSuggestions(userMessage, chunks,selectLanguage);
			setChunks(''); // Clear chunks after sending
			}
	}, 1000); // Adjust the delay as needed

		return () => clearTimeout(timerId);
// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chunks, userMessage]);

	const handleSuggestionClick = (suggestion) => {
		if (!isWriting) {
			addMessage(suggestion, true);
		}
	};
	useEffect(() => {
		// Vérifiez si le cookie 'ChatID' existe
		const existingChatID = Cookies.get('ChatID');

		if (existingChatID) {
			// Si le cookie existe, masquez le composant Disclaimer et définissez l'ID de la conversation
			setShowDisclaimer(false);
			setGeneratedID(existingChatID);
			fecthHistoriqueMessage();
		} else {
			// Si le cookie n'existe pas, affichez le composant Disclaimer
			setShowDisclaimer(true);
			setMessages([]);
		}
// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showDisclaimer, generatedID]);

	const handleIDGeneration = (id) => {
		setGeneratedID(id);
		setShowDisclaimer(false);
	};
	const handleDeleteChatID = (deletechatID) => {
		setShowDisclaimer(deletechatID);
		setMessages([]);
		setHistory([]);
		setSuggestion([
			"Qu'est ce que le MR?",
			'Quels améliorations proposez-vous pour les transports publics ?',
			'Quelles sont vos solutions pour la crise du logement ?',
			'Comptez-vous augmenter ou diminuer les impôts ?',
		]);
	};
	const handleIsWriting = (finishMessage) => {
		setIsWriting(finishMessage);
		console.log("FINISHMESSAGE",finishMessage);
	};

	return (
		<div
			className={` fixed top-0 left-0 w-full h-full flex items-center bg-black bg-opacity-40`}>
			<Disclaimer
				onIDGenerated={handleIDGeneration}
				show={showDisclaimer}
			/>

			<div
				className={`w-full sm:h-5/6  h-4/6 flex justify-center ${
					!showDisclaimer ? '' : 'z-30 blur-sm'
				}  `}>
				<div className='relative bg-gradient-to-b from-[#FFFFFF] to-[#E3E9FF] mx-4 px-4 pt-4 rounded-2xl w-11/12 sm:w-4/5 h-full border-[1px] border-[#A8A8A8] shadow-2xl flex flex-col justify-end text-center '>
					<ChatHeader
						onLanguageChange={handleLanguageChange}
						onAudioClick={handleAudioChange}
						chatId={generatedID}
						deletechatID={handleDeleteChatID}
					/>
					<ChatBox
						messages={messages}
						audioOn={isAudioOn}
						selectLanguage={selectLanguage}
						onDataFromChild={handleDataFromChild}
						handleIsWriting={handleIsWriting}
						loading={loader}
					/>
					<ChatSuggestions
						onSuggestionClick={handleSuggestionClick}
						suggestions={suggestions}
					/>
					<ChatInput
						addMessage={addMessage}
						disabled={isWriting}
						selectLanguage={selectLanguage}
					/>
					<div className='flex items-center justify-between'>
						<a
							className='flex items-center text-xs my-1 mx-0.5  md:mx-6'
							href='https://www.meridiem.be/home'
							target='_blank' rel='noopener noreferrer'>
							<div className='mx-2 my-1 flex-shrink-0 bg-[#1B163C] rounded-md'>
								<img
									src='https://ui-chatbot1.s3.eu-north-1.amazonaws.com/LOGO_32.png'
									alt=''
									className='object-none w-full h-full  min-w-min'
								/>
							</div>
							<span className='flex-shrink-0'>powered by</span>
							<span className='underline ml-1 flex-shrink-0'> Meridiem</span>
						</a>
						<span className='text-xs my-1 max-sm:hidden text-gray-400 mx-2 md:mx-7'>
							Ce chat est en version beta, nous vous recommandons vivement de nous partager vos suggestions ou toute erreur que vous rencontrez.
						</span>
					</div>

				</div>
			</div>
		</div>
	);
};

export default ChatModal;
