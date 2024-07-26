const express = require('express');
const app = express();

let requestCount = 0;
let startTime = Date.now();

app.get('/api/:index', (req, res) => {
	const index = parseInt(req.params.index, 10);
	const currentTime = Date.now();

	if (currentTime - startTime >= 1000) {
		requestCount = 0;
		startTime = currentTime;
	}

	requestCount++;

	if (requestCount > 50) {
		return res.status(429).send('Too Many Requests');
	}

	const delay = Math.floor(Math.random() * 1000) + 1;

	setTimeout(() => {
		res.json({ index });
	}, delay);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
