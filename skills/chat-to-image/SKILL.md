# Chat-to-Image Skill

## Description
Fetches chat history from Feishu/Lark, renders it to a privacy-protected HTML view, and (planned) converts it to an image for sharing.

## Usage

### Fetch and Render
```bash
node skills/chat-to-image/fetch_and_render.js --source <chat_id> --output <path.html>
```

### Send Image
```bash
node skills/chat-to-image/send_image.js --image <path.png> --target <chat_id>
```

## Future Evolution
- Integrate Playwright to snapshot the HTML to PNG automatically.
- Unify into a single `index.js` command.
