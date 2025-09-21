# simple-wa-bot
# Create these files:

# README.md
echo "# Simple WhatsApp Bot

A simple and clean WhatsApp bot built with Baileys library.

## Features
- ✅ Pairing code connection
- ✅ Basic commands (ping, menu, info)
- ✅ Media commands (rvo, sticker, toimg)
- ✅ Fun commands (calculator, qr, quotes)
- ✅ Clean modular structure
- ✅ Error handling
- ✅ Owner commands

## Installation

1. Clone this repository:
\`\`\`bash
git clone https://github.com/yourusername/simple-wa-bot.git
cd simple-wa-bot
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Setup configuration:
\`\`\`bash
cp config/config.example.js config/config.js
nano config/config.js  # Edit with your settings
\`\`\`

4. Run the bot:
\`\`\`bash
npm start
\`\`\`

## Configuration
Edit \`config/config.js\` file:
- Replace owner numbers
- Set your timezone
- Customize bot settings

## Commands
- \`.ping\` - Check bot response
- \`.menu\` - Show all commands
- \`.rvo\` - Reveal view once messages
- \`.sticker\` - Create stickers
- \`.calculate\` - Calculator
- And more...

## License
MIT License

## Support
Create an issue if you need help!" > README.md

# Create directories
mkdir -p sessions/auth
mkdir -p temp
mkdir -p media

# Create placeholder thumb
echo "Add a thumbnail image here (thumb.jpg)" > media/README.md

# Create PM2 ecosystem file
echo "module.exports = {
  apps: [{
    name: 'wa-bot',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};" > ecosystem.config.js

# Create start script
echo "#!/bin/bash
echo \"Starting Simple WhatsApp Bot...\"
npm install
npm start" > start.sh
chmod +x start.sh

# Create install script for Termux
echo "#!/bin/bash
echo \"Installing dependencies for Termux...\"
pkg update && pkg upgrade -y
pkg install nodejs npm git -y
echo \"Dependencies installed successfully!\"
echo \"Now run: npm install\"" > install-termux.sh
chmod +x install-termux.sh
