// ChatBox.js

import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatBox = ({
	messages,
	audioOn,
	selectLanguage,
	onDataFromChild,
	handleIsWriting,
loading,
}) => {
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
	}, [messages, handleIsWriting]);
// console.log("loading: ",loading);
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
					handleIsWriting={handleIsWriting}
					loader={loading}
				/>
			))}
{loading && (
				<div className='  text-left mx-auto w-11/12 border-t-2 border-[#D0D3DB]'>
					<div
						className={` mx-2 my-2 
						 '' 
					 border-[#D0D3DB] relative w-full`}>
						<img
							src='https://ui-chatbot1.s3.eu-north-1.amazonaws.com/LOGO-mr-30.png'
							alt=''
							className=' mx-1 my-2 min-w-min absolute top-0 -left-5'
						/>
						<div className='flex-col py-2 pl-6 mb-5 w-full'>
							<div className='flex w-full'>
								<span className='text-base font-bold block align-middle whitespace-nowrap'>
									MR Agent
								</span>
							</div>
							<img
								src='https://ui-chatbot1.s3.eu-north-1.amazonaws.com/loader.gif'
								alt=''
								className=' mx-1 my-2 inline-block w-8 h-8 '
							/>
							<span>Je réfléchis...</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatBox;
