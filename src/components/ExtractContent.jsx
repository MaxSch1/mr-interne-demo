/* eslint-disable no-loop-func */
import { useState, useEffect } from 'react';

const useApiResponse = () => {
	const [data, setData] = useState('');
	const [loading, setLoading] = useState(false);
	// const [isWriting, setIsWriting] = useState(true);
	// setIsWriting(true);
	useEffect((response) => {
		const fetchData = async (response) => {
			try {
				setLoading(true);

				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				console.log(reader);
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
			} catch (error) {
				setLoading(false);
				// Handle errors during streaming
			}
		};
		
		fetchData(response);
		// setIsWriting(false);
	}, []);
	console.log("AAASSASAS",data)
	return { data };
};

export default useApiResponse;
