import React, { useState, useEffect } from 'react';

const LanguageSelector = ({ onLanguageChange }) => {
	const [selectedLanguage, setSelectedLanguage] = useState('fr');
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const handleLanguageChange = (newLanguage) => {
		setSelectedLanguage(newLanguage);
		setDropdownVisible(false);
		onLanguageChange(newLanguage);
	};

	const toggleDropdown = () => {
		setDropdownVisible(!dropdownVisible);
	};

	useEffect(() => {
		onLanguageChange(selectedLanguage);
	}, [selectedLanguage, onLanguageChange]);

	return (
		<div className='relative'>
			<div
				className='flex items-center cursor-pointer'
				onClick={toggleDropdown}>
				<div className='flex items-baseline'>
					<svg
						width='19'
						height='19'
						viewBox='0 0 19 19'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<g clip-path='url(#clip0_1_348)'>
							<path
								d='M9.50016 17.4166C13.8724 17.4166 17.4168 13.8722 17.4168 9.49992C17.4168 5.12766 13.8724 1.58325 9.50016 1.58325C5.12791 1.58325 1.5835 5.12766 1.5835 9.49992C1.5835 13.8722 5.12791 17.4166 9.50016 17.4166Z'
								stroke='#002EFF'
								stroke-width='2'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
							<path
								d='M1.5835 9.5H17.4168'
								stroke='#002EFF'
								stroke-width='2'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
							<path
								d='M9.50016 1.58325C11.4803 3.75111 12.6057 6.56445 12.6668 9.49992C12.6057 12.4354 11.4803 15.2487 9.50016 17.4166C7.51998 15.2487 6.39465 12.4354 6.3335 9.49992C6.39465 6.56445 7.51998 3.75111 9.50016 1.58325Z'
								stroke='#002EFF'
								stroke-width='2'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
						</g>
						<defs>
							<clipPath id='clip0_1_348'>
								<rect
									width='19'
									height='19'
									fill='white'
								/>
							</clipPath>
						</defs>
					</svg>
					<svg
						width='7'
						height='5'
						viewBox='0 0 7 5'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M1 1L3.5 4L6 1'
							stroke='#002EFF'
							stroke-width='1.7'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
					</svg>
				</div>
				<div className='ml-2 text-blue-600'>{selectedLanguage}</div>
			</div>

			{dropdownVisible && (
				<div className='absolute mt-1 text-blue-600 text-left px-2 z-50 bg-white rounded border border-gray-300'>
					{/* Custom dropdown content */}
					<div
						className='cursor-pointer'
						onClick={() => handleLanguageChange('fr')}>
						Français
					</div>
					<div
						className='cursor-pointer'
						onClick={() => handleLanguageChange('en')}>
						English
					</div>
					<div
						className='cursor-pointer'
						onClick={() => handleLanguageChange('nl')}>
						Nederlands
					</div>
					<div
						className='cursor-pointer'
						onClick={() => handleLanguageChange('de')}>
						Deutsch
					</div>
				</div>
			)}
		</div>
	);
};

export default LanguageSelector;
