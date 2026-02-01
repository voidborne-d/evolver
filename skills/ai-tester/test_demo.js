import { AITester } from './runner.js';

// Simple demo script to verify functionality
// Run with: node skills/ai-tester/test_demo.js

(async () => {
    console.log("Starting AI Tester Demo...");
    
    // Keys are handled inside AITester from process.env

    const tester = new AITester({ debug: true });

    try {
        await tester.start('https://www.google.com');

        // 1. Check if we are on Google
        await tester.verify("I see the Google logo and a search bar.");

        // 2. Perform search (Combining click + type is hard in one atomic 'act', usually split)
        // Simplification for demo: Assume focus is on search bar or ask to click it.
        // Google usually focuses search bar automatically.
        await tester.act("Type 'OpenClaw AI' into the search bar and press Enter.");

        // 3. Verify results
        await tester.verify("I see search results related to OpenClaw.");

    } catch (error) {
        console.error("Test Failed:", error);
    } finally {
        await tester.stop();
    }
})();
