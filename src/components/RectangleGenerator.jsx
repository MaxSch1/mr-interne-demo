import React, { useEffect, useState } from 'react';

const RectangleGenerator = ({ count }) => {
	const [rectangles, setRectangles] = useState([]);

	useEffect(() => {
		const generateRectangles = () => {
			const newRectangles = [];
			for (let i = 0; i < count; i++) {
				const height = Math.random() * 18 + 4;
				newRectangles.push({ height, id: i, visible: false });
			}
			setRectangles(newRectangles);
		};

		generateRectangles();
	}, [count]);

	useEffect(() => {
		const animateRectangles = () => {
			rectangles.forEach((rect, index) => {
				setTimeout(() => {
					setRectangles((prevRectangles) =>
						prevRectangles.map((r) =>
							r.id === rect.id ? { ...r, visible: true } : r
						)
					);
				}, index * 50);
			});
		};

		animateRectangles();
	}, [rectangles]);

	return (
		<div className='flex h-full ml-3 w-4/5 items-center'>
			{rectangles.map((rect) => (
				<div
					key={rect.id}
					style={{ height: `${rect.height}px` }}
					className={`w-0.5 bg-white rounded-md mr-0.5 ${
						rect.visible ? 'opacity-100' : 'opacity-0'
					} transition-opacity ease-out `}
				/>
			))}
		</div>
	);
};

export default RectangleGenerator;
