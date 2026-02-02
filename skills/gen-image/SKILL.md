# Google Imagen Skill (Nano Banana)

Generate images using Google's **Imagen 4.0** (or 3.0) via the Gemini API.

## Requirements
- `GEMINI_API_KEY` in `.env` (Must have access to `imagen-4.0-generate-001` or similar)

## Usage

```bash
node skills/gen-image/index.js "Your prompt here"
```

## Output
- Images are saved to `media/generated/`
- Returns the local file path
