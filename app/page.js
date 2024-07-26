'use client'
import { useState } from 'react';

export default function Home() {
	const [concurrency, setConcurrency] = useState(10);
	const [isRunning, setIsRunning] = useState(false);
	const [results, setResults] = useState([]);
	const [errors, setErrors] = useState([]);

	const handleStart = async () => {
		setIsRunning(true);
		setResults([]);
		setErrors([]);

		const limit = parseInt(concurrency, 10);
		const totalRequests = 1000;
		const requestsPerSecond = limit;

		let activeRequests = 0;
		let completedRequests = 0;
		let requestIndex = 1;

		const sendRequest = async (index) => {
			try {
				const response = await fetch(`/api?index=${index}`);
				if (response.ok) {
					const data = await response.json();
					setResults((prevResults) => [...prevResults, data.index]);
				} else if (response.status === 429) {
					setErrors((prevErrors) => [...prevErrors, `Request ${index} failed with 429`]);
				} else {
					setErrors((prevErrors) => [...prevErrors, `Request ${index} failed with status ${response.status}`]);
				}
			} catch (error) {
				setErrors((prevErrors) => [...prevErrors, `Request ${index} failed with error ${error.message}`]);
			}
		};

		const requestLoop = async () => {
			while (completedRequests < totalRequests) {
				if (activeRequests < limit && requestIndex <= totalRequests) {
					activeRequests++;
					sendRequest(requestIndex).then(() => {
						activeRequests--;
						completedRequests++;
					});
					requestIndex++;
				}
				await new Promise((resolve) => setTimeout(resolve, 1000 / requestsPerSecond));
			}
			setIsRunning(false);
		};

		requestLoop();
	};

	return (
		<div>
			<input
				type="number"
				value={concurrency}
				onChange={(e) => setConcurrency(e.target.value)}
				min="0"
				max="100"
				required
				disabled={isRunning}
			/>
			<button onClick={handleStart} disabled={isRunning}>
				Start
			</button>
			<div>
				<h3>Results:</h3>
				<ul>
					{results.map((result, index) => (
						<li key={index}>Request {result}</li>
					))}
				</ul>
			</div>
			<div>
				<h3>Errors:</h3>
				<ul>
					{errors.map((error, index) => (
						<li key={index}>{error}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
