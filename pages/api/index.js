let requestCount = 0;
let startTime = Date.now();

export default async function handler(req, res) {
	const currentTime = Date.now();
	const { index } = req.query;

	// Reset request count every second
	if (currentTime - startTime >= 1000) {
		requestCount = 0;
		startTime = currentTime;
	}

	// Rate limiting: Return 429 if more than 50 requests per second
	if (requestCount >= 50) {
		return res.status(429).json({ error: 'Too many requests' });
	}

	requestCount++;

	// Random delay between 1ms to 1000ms
	const delay = Math.floor(Math.random() * 1000) + 1;
	await new Promise(resolve => setTimeout(resolve, delay));

	// Successful response with the request index
	res.status(200).json({ index });
}
