// skills/arxiv-watcher/index.js
const https = require('https');

const ARGS = process.argv.slice(2);
let QUERY = ARGS[0] || 'all:artificial intelligence';
const MAX_RESULTS = ARGS[1] || 5;

// Intelligent query handling
if (!QUERY.includes(':')) {
    QUERY = `all:${QUERY}`;
}

// Helper to fetch data
function fetchArxiv(query, max) {
    const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(query)}&start=0&max_results=${max}&sortBy=submittedDate&sortOrder=descending`;
    
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', (err) => reject(err));
        });
    });
}

// Simple XML helper
function extractTag(xml, tag) {
    const regex = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 'gs');
    const matches = [];
    let match;
    while ((match = regex.exec(xml)) !== null) {
        matches.push(match[1].trim());
    }
    return matches;
}

// Helper to clean XML entities (basic)
function cleanText(text) {
    return text
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

async function main() {
    try {
        console.error(`[ArXiv] Searching for: "${QUERY}" (limit: ${MAX_RESULTS})`);
        const xml = await fetchArxiv(QUERY, MAX_RESULTS);

        // Split by entry
        const entries = xml.split('<entry>');
        // Remove the header (first part)
        entries.shift();

        const papers = entries.map(entry => {
            const idMatch = /<id>(.*?)<\/id>/.exec(entry);
            const publishedMatch = /<published>(.*?)<\/published>/.exec(entry);
            const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/.exec(entry);
            const summaryMatch = /<summary[^>]*>([\s\S]*?)<\/summary>/.exec(entry);
            
            // Authors
            const authorMatches = [];
            const authorRegex = /<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g;
            let authorMatch;
            while ((authorMatch = authorRegex.exec(entry)) !== null) {
                authorMatches.push(authorMatch[1]);
            }

            // PDF Link - robust match for type="application/pdf"
            // Example: <link title="pdf" href="http://arxiv.org/pdf/2101.00001v1" rel="related" type="application/pdf"/>
            let pdfLink = null;
            const pdfMatch = /<link[^>]*href="(.*?)"[^>]*type="application\/pdf"[^>]*>/.exec(entry);
            if (pdfMatch) {
                pdfLink = pdfMatch[1];
            } else {
                // Fallback: look for title="pdf"
                 const titlePdfMatch = /<link[^>]*title="pdf"[^>]*href="(.*?)"[^>]*>/.exec(entry);
                 if (titlePdfMatch) pdfLink = titlePdfMatch[1];
            }

            return {
                id: idMatch ? idMatch[1] : null,
                published: publishedMatch ? publishedMatch[1] : null,
                title: titleMatch ? cleanText(titleMatch[1]) : 'No Title',
                authors: authorMatches,
                summary: summaryMatch ? cleanText(summaryMatch[1]) : '',
                pdf_link: pdfLink
            };
        });

        console.log(JSON.stringify(papers, null, 2));

    } catch (error) {
        console.error("Error fetching ArXiv data:", error);
        process.exit(1);
    }
}

main();
