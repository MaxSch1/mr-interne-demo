import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const Disclaimer = ({ onIDGenerated, show }) => {
	const [showDisclaimer, setShowDisclaimer] = useState(true);
	const [acceptedConditions, setAcceptedConditions] = useState(false);
	const [captchaSuccess, setCaptchaSuccess] = useState(false);
	useEffect(() => {
		setShowDisclaimer(show);
		setAcceptedConditions(false);
		setCaptchaSuccess(false);
	}, [show]);

	const handleCaptchaSuccess = () => {
		setCaptchaSuccess(true);
	};

	const handleDisclaimerClose = () => {
		if (acceptedConditions) {
			// Générez un ID unique à l'aide de uuid
			const chatID = uuidv4();

			// Créez un cookie avec l'ID
			Cookies.set('ChatID', chatID, { expires: 7 });

			// Ajoutez ici toute autre logique que vous souhaitez exécuter après l'acceptation
			console.log(
				"Captcha réussi, termes acceptés, cookie créé avec l'ID:",
				chatID
			);
			onIDGenerated(chatID);
			setShowDisclaimer(false);
		} else {
			alert('Veuillez accepter les conditions et réussir le captcha.');
		}
	};

	return (
		<div
			className={`${
				showDisclaimer ? 'block' : 'hidden'
			} fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center`}>
			<div className='mx-auto  bg-white p-5 rounded-xl w-11/12 sm:w-[502px]  text-center shadow-xl '>
				<p className='text-xl font-semibold my-5'>Conditions d'utilisation:</p>
				<div className='text-left'>
					<p className='text-base my-4'>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud
					</p>
				</div>
				<div className='flex justify-center items-center my-4'>
					<label className=' '>
						<input
							type='checkbox'
							checked={acceptedConditions}
							onChange={() => setAcceptedConditions(!acceptedConditions)}
							className='w-5 h-5 m-2  rounded-sm accent-blue-500  forced-colors:appearance-auto '
						/>
					</label>
					<div className='text-xs text-left'>
						Je suis d’accord avec les conditions générales d’utilisation
						<br />
						<a
							href='#'
							className='text-xs text-blue-600 underline'>
							Conditions générales d’utilisation
						</a>
					</div>
				</div>

				<ReCAPTCHA
					sitekey='votre-clé-recaptcha'
					onChange={handleCaptchaSuccess}
					className='flex justify-center items-center'
				/>
				<button
					onClick={handleDisclaimerClose}
					className={`${
						!captchaSuccess ? 'opacity-50' : ''
					} py-1 px-8 text-white rounded-lg bg-gradient-to-r from-blue-600 to-blue-300 my-3`}
					style={{ boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.2)' }}>
					J'y vais!
				</button>
			</div>
		</div>
	);
};

export default Disclaimer;
