        // Use 'markdown' tag instead of 'div' + 'lark_md' for better rendering
        // This is the "magic" fix that worked in the test script!
        const markdownElement = {
            tag: 'markdown',
            content: contentText
        };
        
        if (options.textSize) {
            // markdown tag supports text_size? Not documented well, but let's keep it safe.
            // Actually, let's stick to the minimal successful payload first.
        }
        
        if (options.textAlign) {
            markdownElement.text_align = options.textAlign;
        }

        elements.push(markdownElement);