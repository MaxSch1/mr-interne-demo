// ChatBox.js

import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatBox = ({ messages, audioOn, selectLanguage, onDataFromChild }) => {
	const chatBoxRef = useRef(null);
	const getLastUserMessage = (messages, currentIndex) => {
		for (let i = currentIndex - 1; i >= 0; i--) {
			if (messages[i].isUser) {
				return messages[i];
			}
		}
		return null; // Aucun message d'utilisateur précédent
	};
	useEffect(() => {
		// Faites défiler vers le bas lorsque de nouveaux messages arrivent
		chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
	}, [messages]);

	return (
		<div
			className='overflow-y-auto  h-full md:px-12 mt-5'
			ref={chatBoxRef}>
			{messages.map((message, index) => (
				<ChatMessage
					key={index}
					message={message}
					isLastMessage={index === messages.length - 1}
					lastUserMessage={getLastUserMessage(messages, index)}
					audioOn={audioOn}
					selectLanguage={selectLanguage}
					onDataFromChild={onDataFromChild}
				/>
			))}
		</div>
	);
};

export default ChatBox;
