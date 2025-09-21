# simple-wa-bot
# 🤖 Simple WhatsApp Bot

A clean, modular WhatsApp bot built with Baileys library featuring pairing code connection and essential commands.

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/Baileys-6.7.8+-blue.svg)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- 🔗 **Pairing Code Connection** - No QR scan needed
- 🎭 **View Once Revealer** - Reveal view once messages
- 🎨 **Sticker Creator** - Create stickers from images/videos  
- 🎵 **Media Player** - Play custom music and images
- 🧮 **Calculator** - Built-in calculator
- 📱 **QR Generator** - Generate QR codes
- 🎮 **Fun Commands** - Games, quotes, facts
- 🛡️ **Error Handling** - Robust error management
- 📁 **Modular Structure** - Clean, organized codebase
- ⚙️ **Easy Setup** - Automated configuration wizard

## 📋 Requirements

- Node.js 16+ 
- Android device with Termux (recommended)
- WhatsApp account
- Stable internet connection

## 🚀 Quick Start (Termux)

### 1. Install Termux
Download from [F-Droid](https://f-droid.org/en/packages/com.termux/) (recommended)

### 2. Auto Installation
```bash
# Update Termux
pkg update && pkg upgrade -y

# Download installer
curl -o install.sh https://raw.githubusercontent.com/yourusername/simple-wa-bot/main/install-termux.sh

# Run installer
chmod +x install.sh
./install.sh
```

### 3. Manual Installation
```bash
# Install dependencies
pkg install nodejs npm git -y
termux-setup-storage

# Clone repository
cd /sdcard
git clone https://github.com/yourusername/simple-wa-bot.git
cd simple-wa-bot

# Install packages
npm install

# Setup bot
node setup.js

# Start bot
npm start
```

## ⚙️ Configuration

The setup wizard will ask for:
- **Bot Name** - Display name for your bot
- **Prefix** - Command prefix (default: .)
- **Owner Number** - Your WhatsApp number (with country code)
- **Timezone** - Your timezone (default: Asia/Jakarta)

Manual config: Edit `config/config.js`

## 🔗 Pairing Process

1. Run `npm start`
2. Enter your WhatsApp number when prompted
3. Bot will generate an 8-digit pairing code
4. Open WhatsApp → Settings → Linked Devices
5. Tap "Link a Device" 
6. Enter the pairing code
7. Bot connects automatically ✅

## 📱 Commands

### Basic Commands
| Command | Description |
|---------|-------------|
| `.ping` | Check bot response time |
| `.menu` | Display all commands |
| `.info` | Bot and system information |
| `.runtime` | Show bot uptime |

### Media Commands
| Command | Description |
|---------|-------------|
| `.rvo` | Reveal view once messages |
| `.sticker` | Create sticker from image/video |
| `.toimg` | Convert sticker to image |
| `.take <pack> \| <author>` | Change sticker pack info |
| `.music` | Play bot background music |
| `.welcome` | Send welcome message with image |
| `.download` | Download media from message |
| `.getimg <url>` | Get image from URL |

### Fun Commands
| Command | Description |
|---------|-------------|
| `.say <text>` | Make bot say something |
| `.reverse <text>` | Reverse text |
| `.calculate <math>` | Calculator |
| `.qr <text>` | Generate QR code |
| `.quote` | Random inspirational quote |
| `.fact` | Random interesting fact |
| `.flip` | Flip a coin |
| `.dice [sides]` | Roll dice |
| `.random <min> <max>` | Generate random number |

## 📁 Project Structure

```
simple-wa-bot/
├── index.js              # Main bot file
├── package.json          # Dependencies
├── setup.js              # Setup wizard
├── config/
│   ├── config.js         # Bot configuration
│   └── config.example.js # Config template
├── lib/
│   ├── functions.js      # Helper functions
│   └── handler.js        # Message handler
├── commands/
│   ├── basic.js          # Basic commands
│   ├── media.js          # Media commands
│   └── fun.js            # Fun commands
├── media/
│   ├── music.mp3         # Bot background music
│   ├── welcome.jpg       # Welcome image
│   └── thumb.jpg         # Bot thumbnail
├── sessions/
│   └── auth/             # Session files (auto-generated)
├── temp/                 # Temporary files
└── logs/                 # Log files
```

## 🎵 Custom Media Files

Replace these files with your own:

1. **`media/music.mp3`** - Bot background music (< 50MB)
2. **`media/welcome.jpg`** - Welcome message image  
3. **`media/thumb.jpg`** - Bot thumbnail (512x512 recommended)

## 🛠️ Production Deployment

### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup auto-startup
pm2 startup
```

### PM2 Commands
```bash
pm2 status          # Check status
pm2 logs wa-bot     # View logs
pm2 restart wa-bot  # Restart bot
pm2 stop wa-bot     # Stop bot
pm2 monit           # Monitor resources
```

## 📊 Monitoring

- **Logs**: `pm2 logs wa-bot`
- **Status**: Check bot response with `.ping`
- **Memory**: Use `.info` command
- **Uptime**: Use `.runtime` command

## 🔧 Troubleshooting

### Bot won't connect
```bash
# Clear sessions and retry
rm -rf sessions/auth/*
npm start
```

### Commands not working
- Check prefix in config
- Verify bot permissions
- Check error logs

### Memory issues
```bash
# Restart bot
pm2 restart wa-bot

# Clear cache
npm cache clean --force
```

### Package installation fails
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Updates

```bash
# Update bot code
git pull origin main

# Update dependencies  
npm install

# Restart bot
pm2 restart wa-bot
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/awesome-feature`)
3. Commit changes (`git commit -am 'Add awesome feature'`)
4. Push to branch (`git push origin feature/awesome-feature`)
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

- This bot is for educational purposes only
- Use responsibly and follow WhatsApp's Terms of Service
- The developers are not responsible for any misuse
- Keep your session files secure and private

## 🆘 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/yourusername/simple-wa-bot/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/simple-wa-bot/discussions)
- 📖 **Wiki**: [Documentation](https://github.com/yourusername/simple-wa-bot/wiki)

## 🙏 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API library
- [WhatsApp](https://whatsapp.com) - Messaging platform
- All contributors and users

---

**⭐ If you found this helpful, please give it a star!**

Made with ❤️ for the open-source community
