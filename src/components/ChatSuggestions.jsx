// ChatSuggestions.js

import React from 'react';

const ChatSuggestion = ({ suggestion, onClick }) => {
	return (
		<div className='md:w-1/2 pr-1 py-1'>
    <button
        onClick={() => onClick(suggestion)}
        className='bg-[#E4E8F2] text-black text-xs rounded-lg w-full h-9 px-2 py-0.5 mr-1 border-[1px] border-[#BDBDBD] hover:bg-gray-300 text-left font-semibold block leading-tight md:break-words break-words md:whitespace-normal whitespace-nowrap'
        style={{ boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.2)' }}>
        {suggestion}
    </button>
</div>
	);
};

const ChatSuggestions = ({ suggestions, onSuggestionClick }) => {
	return (
		<div className='mx-2 sm:mx-8 lg:mx-24 '>
			{/* <div className='flex  md:flex-wrap w-full overflow-x-auto no-scrollbar '>
				{Object.values(suggestions).map((suggestion, index) => (
					<ChatSuggestion
						key={index}
						suggestion={suggestion}
						onClick={onSuggestionClick}
					/>
				))}
			</div> */}
		</div>
	);
};

export default ChatSuggestions;
