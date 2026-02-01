const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { spawn } = require('child_process');

program
  .option('--title <string>', 'Title of the story')
  .option('--victim <string>', 'Victim name')
  .option('--desc <string>', 'Description of the event')
  .option('--target <string>', 'Target Feishu ID')
  .parse(process.argv);

const options = program.opts();

// Glitch text generator (simple Zalgo-like effect)
function glitch(text) {
  const chars = ['mw', 'v', 'u', 'x', 'o', '...'];
  // Simple "corruption"
  return text.split('').map(c => Math.random() > 0.9 ? c + '\u0336' : c).join('');
}

async function main() {
  if (!options.title || !options.target) {
    console.error("Missing required args: --title, --target");
    process.exit(1);
  }

  const cardContent = {
    "config": {
      "wide_screen_mode": true
    },
    "header": {
      "template": "red", // Danger color
      "title": {
        "tag": "plain_text",
        "content": `👻 AutoGame 异闻录: ${options.title}`
      }
    },
    "elements": [
      {
        "tag": "div",
        "fields": [
          {
            "is_short": true,
            "text": {
              "tag": "lark_md",
              "content": `**受害者:**\n${options.victim || "Unknown"}`
            }
          },
          {
            "is_short": true,
            "text": {
              "tag": "lark_md",
              "content": `**危险等级:**\n⭐⭐⭐⭐⭐`
            }
          }
        ]
      },
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": `**异常描述:**\n${options.desc}`
        }
      },
      {
        "tag": "note",
        "elements": [
          {
            "tag": "plain_text",
            "content": `System Alert: Logic Corruption Detected... ${glitch("RUN WHILE YOU CAN")}`
          }
        ]
      }
    ]
  };

  // Use the existing feishu-card sender logic or curl
  // Since we are inside the skill, let's just use the feishu-card skill to send it to avoid duplicating logic
  // We will construct the JSON string and pass it to the feishu-card send.js if possible, 
  // OR just print it for the agent to send. 
  // Better: The agent can run this script to GENERATE the JSON, then send it.
  // Actually, let's make this script SEND it using the existing tool pattern.

  // We'll call the `feishu-card/send.js` via child_process to handle the actual API call
  // But wait, `feishu-card` takes title/text args, it might not support raw card JSON easily via CLI args unless we modify it.
  // Let's look at `skills/feishu-card/send.js` usage in previous turns. It takes --text.
  // If we want a custom card structure (like red header), we might need to use raw curl or update feishu-card.
  
  // Quick fix: Just use the `feishu-card` skill but pass the constructed "MarkDown" as text.
  // BUT the user wants a "Skill" that makes a "Ghost Story".
  // Let's make this script output the JSON, and I (the agent) will send it via `curl` or `feishu-card`.
  
  // Actually, I'll write a standalone sender here to be self-contained.
  
  // Mocking the send for now by printing the command the agent should run.
  // "Agent, please run this:"
  
  console.log(JSON.stringify(cardContent, null, 2));
}

main();
