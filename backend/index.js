const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const SearchHistory = require('./model/SearchHistory');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error('Missing Mongo_URI environment variable');
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

//connect mongodb
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongodb is connected")
    }).catch(err => {
        console.error("MongoDB connection error:", err)
    })

// fetch and store in database
app.use(cors({origin:'http://localhost:3000'}))
app.use(express.json())

app.get('/api/opportunities', async (req, res) => {
    const keyword = req.query.keyword;
    console.log(keyword);
    const apiUrl = `https://sam.gov/api/prod/sgs/v1/search/?random=${Date.now()}&index=opp&page=0&sort=-modifiedDate&size=25&mode=search&responseType=json&q=${keyword}&qMode=ALL&is_active=true`
    try {
        const response = await axios.get(apiUrl);
        // console.log(response);
        const opportunities = response.data._embedded.results.map(item => ({
            id: item._id || 'sample ID',
            title: item.title || 'sample title',
            summary: item.descriptions[0]?.content || 'No summary is available',
            description: item.descriptions[0]?.content || 'No summary is available',
            solicitationNumber: item.solicitationNumber || 'sample solicitationNumber',
            responseDate: item.responseDate || 'sample response Date',
            publishDate: item.publishDate || 'publishedDate',
            isActive: item.isActive || 'sample is Active',
            modifiedDate: item.modifiedDate || 'modified',
            organization: item.organizationHierarchy.map(org => org.name).join('>'),
            aiSummary: '' //placeholder for Ai summary

        }))
        // svae the search hisotry
        const searchHistory = new SearchHistory({
            keyword,
            opportunities
        })
        console.log('Saving Search History');
        await searchHistory.save();
        res.json(opportunities);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'error fetching opportunities' });
    }
})


// openai
app.post('/api/summarize', async (req, res) => {
    const { text } = req.body;
    try {
      const completion = await openai.createCompletion({
        model: 'gpt-4',
        prompt: `Summarize the following text: ${text}`,
        max_tokens: 150
      });
      res.json({ summary: completion.data.choices[0].text.trim() });
    } catch (error) {
      res.status(500).json({ error: 'Error generating summary' });
    }
  });

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})