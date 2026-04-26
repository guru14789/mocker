const { GoogleGenerativeAI } = require("@google/generative-ai");
const { YoutubeTranscript } = require('youtube-transcript');
const axios = require('axios');
const cheerio = require('cheerio');

// Initialize Gemini with API Key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_FIREBASE_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
});

/**
 * Helper to extract transcript from YouTube URL
 */
const getYoutubeContent = async (url) => {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        return transcript.map(t => t.text).join(' ');
    } catch (err) {
        console.error('YouTube Transcript Error:', err);
        throw new Error('Could not fetch YouTube transcript. Ensure the video has captions enabled.');
    }
};

/**
 * Helper to scrape public web content
 */
const getWebContent = async (url) => {
    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);
        
        // Remove script, style, and nav tags
        $('script, style, nav, footer, header').remove();
        
        // Get main content text
        const content = $('body').text().replace(/\s+/g, ' ').trim();
        return content.slice(0, 15000); // Limit to ~15k chars for Gemini context
    } catch (err) {
        console.error('Web Scraping Error:', err);
        throw new Error('Could not scrape the provided URL. The site might be protected or private.');
    }
};

/**
 * AI Controller for generating structured questions using Gemini 1.5 Flash.
 */
const generateQuestions = async (req, res) => {
    let { topic, prompt, count = 5, difficulty = 'medium', sourceUrl } = req.body;
    
    try {
        let contextText = prompt || '';

        // If a source URL is provided, try to fetch content from it
        if (sourceUrl) {
            console.log(`[Gemini] Fetching content from source: ${sourceUrl}`);
            if (sourceUrl.includes('youtube.com') || sourceUrl.includes('youtu.be')) {
                contextText = await getYoutubeContent(sourceUrl);
            } else {
                contextText = await getWebContent(sourceUrl);
            }
            // Enhance the prompt with the fetched context
            prompt = `Topic: ${topic}\n\nContext from ${sourceUrl}:\n${contextText}`;
        }

        console.log(`[Gemini] Generating ${count} questions for topic: ${topic}`);

        const geminiPrompt = `
            You are an expert examiner. Generate ${count} professional multiple-choice questions BASED STRICTLY on the provided context/study material.
            
            Study Material / Context: "${prompt}"
            Topic Category: ${topic}
            Difficulty Level: ${difficulty}

            INSTRUCTIONS:
            1. Extract core concepts from the provided context.
            2. Create challenging but fair questions with 4 distinct options.
            3. Ensure only one option is correct.
            4. Provide a detailed "explanation" for why the answer is correct based on the material.
            
            Return ONLY a JSON array of objects with exactly this structure:
            {
              "questions": [
                {
                  "questionText": "string",
                  "options": [
                    {"label": "A", "text": "string"},
                    {"label": "B", "text": "string"},
                    {"label": "C", "text": "string"},
                    {"label": "D", "text": "string"}
                  ],
                  "correctAnswers": ["A"],
                  "marks": 2,
                  "negativeMarks": 0.5,
                  "topic": "${topic}",
                  "explanation": "string justifying the answer using the context provided"
                }
              ]
            }
        `;

        const result = await model.generateContent(geminiPrompt);
        const response = await result.response;
        const text = response.text();
        
        let questionsData;
        try {
            questionsData = JSON.parse(text);
        } catch (parseErr) {
            console.error("Gemini JSON parse error:", parseErr, "Raw text length:", text.length);
            const jsonMatch = text.match(/\[.*\]/s) || text.match(/\{.*\}/s);
            if (jsonMatch) {
                questionsData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not parse Gemini response as JSON");
            }
        }

        const questions = Array.isArray(questionsData) ? questionsData : questionsData.questions;

        res.status(200).json({ 
            success: true, 
            questions: questions.slice(0, count),
            metadata: {
                engine: 'Gemini 1.5 Flash',
                topic: topic,
                count: questions.length,
                source: sourceUrl ? 'URL' : 'Direct Text'
            }
        });

    } catch (err) {
        console.error('Gemini Generation Error:', err);
        
        // Robust Fallback
        const mockQuestions = Array.from({ length: count }).map((_, i) => ({
            questionText: `[Fallback] Question about ${topic || 'the topic'} #${i + 1}?`,
            options: [
                { label: 'A', text: `Primary standard approach to ${topic || 'the problem'}` },
                { label: 'B', text: `Secondary optimized method` },
                { label: 'C', text: `Legacy system consideration` },
                { label: 'D', text: `None of the above` }
            ],
            correctAnswers: [['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]],
            marks: 2,
            negativeMarks: 0.5,
            topic: topic || 'General',
            explanation: `This answer is correct because in ${topic || 'this context'}, it provides the most efficient and standard-compliant way to achieve the objective.`
        }));

        res.status(200).json({ 
            success: true, 
            questions: mockQuestions,
            metadata: {
                engine: 'Mocker-Fallback-Engine',
                error: err.message
            },
            note: "Generated using fallback mode. Error: " + err.message
        });
    }
};

module.exports = { generateQuestions };
