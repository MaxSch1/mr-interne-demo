import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import axios from 'axios';
import Cookies from 'js-cookie';

const ChatHeader = ({
	onAudioClick,
	onLanguageChange,
	chatId,
	deletechatID,
}) => {
	const [isAudioOn, setIsAudioOff] = useState(false);
	const fetchDownload = async () => {
		try {
			// Utilisez onDownloadClick pour obtenir les informations nécessaires, par exemple l'ID de la conversation
			console.log(chatId)
			const response = await axios.post(
				'https://cbmr-topdf.azurewebsites.net/api/topdf?code=QXjUfEUuiNvitMdY1IwSAyAMXj7UL4jOugK1H8jdt-usAzFuQ8mT4w==',
				{
					ChatID: chatId,
					auth_key : "VSoHghJ~l4g&xNr~{YHgy^Xe$w6Jb6UG=yv,!Y-GgkEtRRB7LL"
				},
				{ responseType: 'blob' } // Indiquez à Axios que la réponse est un fichier
			);

			// Créez un objet blob à partir de la réponse
			const blob = new Blob([response.data], { type: 'application/pdf' });

			// Créez un objet URL pour le blob
			const url = window.URL.createObjectURL(blob);

			// Créez un lien temporaire pour déclencher le téléchargement
			const a = document.createElement('a');
			a.href = url;
			a.download = 'conversation.pdf';
			document.body.appendChild(a);
			a.click();

			// Libérez l'URL de l'objet blob après le téléchargement
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Erreur lors de la récupération des suggestions :', error);
			// Gérer les erreurs d'API
		}
	};

	const toggleAudioSelector = () => {
		setIsAudioOff((prev) => !prev);
		onAudioClick(isAudioOn);
	};
	useEffect(() => {
		onAudioClick(isAudioOn); // Appelle la fonction de rappel avec la nouvelle langue
		// Appelle la nouvelle fonction de rappel
	}, [isAudioOn, onAudioClick]);
	const handleLanguageChange = (selectedLanguage) => {
		onLanguageChange(selectedLanguage);
	};
	const handleDeleteCookies = () => {
		// Supprimez le cookie en utilisant la clé spécifique que vous avez utilisée
		Cookies.remove('ChatID');
		deletechatID(true);
		// Ajoutez ici toute autre logique que vous souhaitez exécuter après la suppression du cookie
		console.log('Cookies supprimés avec succès.');
	};

	return (
		<div className='flex justify-between items-center absolute top-0 left-0 my-1 w-full pr-5 pl-3'>
			<div className='flex items-baseline '>
				<button
					onClick={toggleAudioSelector}
					className='bg-[#002EFF] text-white p-1 rounded-full mr-1'>
					{isAudioOn ? (
						<svg
							width='18'
							height='19'
							viewBox='0 0 18 19'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
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
					) : (
						<svg
							width='20'
							height='20'
							viewBox='0 0 25 25'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<rect
								width='20'
								height='20'
								rx='12.5'
								fill='#002EFF'
							/>
							<path
								d='M12.25 6.95834L8.5 10.125H5.5V14.875H8.5L12.25 18.0417V6.95834Z'
								stroke='white'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M18.3023 6.90292C19.7083 8.38752 20.4982 10.4008 20.4982 12.5C20.4982 14.5992 19.7083 16.6125 18.3023 18.0971M15.6548 9.69751C16.3578 10.4398 16.7527 11.4464 16.7527 12.496C16.7527 13.5457 16.3578 14.5523 15.6548 15.2946'
								stroke='white'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M6 20L19.5 4.5'
								stroke='white'
								strokeWidth='2'
								strokeLinecap='round'
							/>
						</svg>
					)}
				</button>

				{/* Bouton Changer de Langue */}
				<button className=' mx-1 flex items-baseline'>
					<LanguageSelector onLanguageChange={handleLanguageChange} />
				</button>
			</div>
			{/* Bouton Télécharger Conversation */}
			<div className='flex'>
				<button
					onClick={fetchDownload}
					className=' text-gray-400  ml-2 flex items-center text-xs hover:underline max-sm:hidden'>
					<svg
						width='13'
						height='13'
						viewBox='0 0 13 13'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='mr-2'>
						<g clipPath='url(#clip0_1_338)'>
							<path
								d='M11.375 8.125V10.2917C11.375 10.579 11.2609 10.8545 11.0577 11.0577C10.8545 11.2609 10.579 11.375 10.2917 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V8.125'
								stroke='#B0B0B0'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M3.7915 5.41675L6.49984 8.12508L9.20817 5.41675'
								stroke='#B0B0B0'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M6.5 8.125V1.625'
								stroke='#B0B0B0'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</g>
						<defs>
							<clipPath id='clip0_1_338'>
								<rect
									width='13'
									height='13'
									fill='white'
								/>
							</clipPath>
						</defs>
					</svg>
					Download conversation
				</button>
				<button
					onClick={handleDeleteCookies}
					className='text-gray-400  mx-3 text-xs border-2 p-2 rounded-lg '>
					Reset
				</button>
			</div>
		</div>
	);
};

export default ChatHeader;
