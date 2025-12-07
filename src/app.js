import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const env = process.env;
const app = express();
const port = env.port || 3000;

let cache = {
    timestamp: 0,
    rawData: null,
    selected: null
};
const CACHE_DURATION = 10 * 1000; // 10 sec

app.get('/listening', async (req, res) => {
    console.log('Received request at /listening');

    const now = Date.now();

    if (cache.rawData && (now - cache.timestamp) < CACHE_DURATION) {
        console.log('Serving from cache');
        return res.json({ status: 'success', selected: cache.selected, raw: cache.rawData });
    }

    try {
        console.log(`Fetching YTMDesk state from: ${env.ytmdesk_host}/api/v1/state`);

        const response = await fetch(`${env.ytmdesk_host}/api/v1/state`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${env.ytmdesk_token}`
            }
        });

        console.log(`HTTP status: ${response.status}`);

        const data = await response.json();
        console.log('Raw data received:', JSON.stringify(data, null, 2));

        const selected = data?.player?.queue?.items?.find(i => i.selected === true) || null;
        console.log('Currently selected track:', selected);

        cache.rawData = data;
        cache.selected = selected;
        cache.timestamp = now;

        res.json({ status: 'success', selected, raw: data });

    } catch (error) {
        console.error('Error fetching YTMDesk state:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`ytmdesk-api is running on port ${port}`);
});
