const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const { Configuration, OpenAIApi } = require('openai'); // Check if this import works
const SearchHistory = require('./model/SearchHistory');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Load MongoDB URI from environment variables
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error('Missing MONGO_URI environment variable');
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

app.get('/api/opportunities', async (req, res) => {
    const keyword = req.query.keyword;
    const apiUrl = `https://sam.gov/api/prod/sgs/v1/search/?random=${Date.now()}&index=opp&page=0&sort=-modifiedDate&size=25&mode=search&responseType=json&q=${keyword}&qMode=ALL&is_active=true`;

    try {
        const response = await axios.get(apiUrl);
        const opportunities = response.data._embedded.results.map(item => ({
            id: item._id,
            title: item.title,
            summary: item.descriptions[0]?.content || 'No summary available',
            description: item.descriptions[0]?.content || 'No description available',
            solicitationNumber: item.solicitationNumber,
            responseDate: item.responseDate,
            publishDate: item.publishDate,
            isActive: item.isActive,
            modifiedDate: item.modifiedDate,
            organization: item.organizationHierarchy.map(org => org.name).join(' > '),
            aiSummary: '' // Placeholder for AI summary
        }));

        // Save the search history
        const searchHistory = new SearchHistory({
            keyword,
            opportunities
        });
        console.log("Saving search history");
        await searchHistory.save();

        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching opportunities' });
    }
});

// app.post('/api/summarize', async (req, res) => {
//     const { text } = req.body;
//     try {
//         const completion = await openai.createCompletion({
//             model: 'gpt-4',
//             prompt: `Summarize the following text: ${text}`,
//             max_tokens: 150
//         });
//         res.json({ summary: completion.data.choices[0].text.trim() });
//     } catch (error) {
//         res.status(500).json({ error: 'Error generating summary' });
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
