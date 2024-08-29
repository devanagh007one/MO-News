const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.get('/latest-news', async (req, res) => {
    try {
        // Fetch the HTML from the news page
        const { data } = await axios.get('https://motoroctane.com/news');
        
        // Load the HTML into cheerio
        const $ = cheerio.load(data);

        // Initialize an array to hold the news data
        const news = [];

        // Find each news item and extract the necessary details
        $('.section_post_box').each((index, element) => {
            const title = $(element).find('.title a').text().trim();
            const url = $(element).find('.title a').attr('href');
            const thumbnail = $(element).find('.thumbnail img').attr('data-lazy-src'); // Get lazy-loaded image
            const authorDate = $(element).find('.post_author_date').text().trim();

            // Push the extracted data to the news array if all elements are found
            if (title && url && thumbnail && authorDate) {
                news.push({
                    title,
                    url,
                    thumbnail,
                    authorDate
                });
            }
        });

        // Send the news data as JSON response
        res.json(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('An error occurred while fetching the news');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
