#!/bin/bash

# WhatsApp Bot Auto Installer for Termux
# Created by Simple WA Bot Team

clear
echo "╔══════════════════════════════════════════╗"
echo "║       Simple WhatsApp Bot Installer      ║"
echo "║              For Termux                  ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running in Termux
if [[ ! -d "/data/data/com.termux" ]]; then
    print_error "This script is designed for Termux only!"
    exit 1
fi

print_status "Starting installation process..."

# Update packages
print_status "Updating Termux packages..."
pkg update -y && pkg upgrade -y
if [ $? -eq 0 ]; then
    print_success "Packages updated successfully"
else
    print_error "Failed to update packages"
    exit 1
fi

# Install required packages
print_status "Installing required packages..."
pkg install nodejs npm git curl wget python -y
if [ $? -eq 0 ]; then
    print_success "Required packages installed"
else
    print_error "Failed to install packages"
    exit 1
fi

# Setup storage access
print_status "Setting up storage access..."
termux-setup-storage
print_success "Storage access configured"

# Change to storage directory
cd /sdcard || {
    print_error "Failed to access storage directory"
    exit 1
}

# Ask for installation method
echo ""
echo -e "${CYAN}Choose installation method:${NC}"
echo "1. Clone from GitHub (if repository exists)"
echo "2. Create new project manually"
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        print_status "Please enter GitHub repository URL:"
        read -p "Repository URL: " repo_url
        if [[ -z "$repo_url" ]]; then
            print_error "Repository URL cannot be empty"
            exit 1
        fi
        
        print_status "Cloning repository..."
        git clone "$repo_url" simple-wa-bot
        if [ $? -eq 0 ]; then
            print_success "Repository cloned successfully"
            cd simple-wa-bot
        else
            print_error "Failed to clone repository"
            exit 1
        fi
        ;;
    2)
        print_status "Creating new project..."
        mkdir -p simple-wa-bot
        cd simple-wa-bot
        
        # Create basic project structure
        mkdir -p {config,lib,commands,sessions/auth,temp,media,logs}
        
        # Initialize npm
        npm init -y
        print_success "Project structure created"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Install dependencies
print_status "Installing Node.js dependencies..."
npm install @whiskeysockets/baileys@^6.7.8 qrcode-terminal pino chalk@^4.1.2 moment-timezone fs-extra axios node-fetch@^2.7.0 sharp file-type@^16.5.4
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if files exist (for manual setup)
if [ "$choice" -eq 2 ]; then
    print_warning "Project created but bot files are missing!"
    echo ""
    echo -e "${YELLOW}You need to add these files manually:${NC}"
    echo "• index.js - Main bot file"
    echo "• lib/functions.js - Helper functions"
    echo "• lib/handler.js - Message handler"  
    echo "• commands/basic.js - Basic commands"
    echo "• commands/media.js - Media commands"
    echo "• commands/fun.js - Fun commands"
    echo "• config/config.example.js - Config template"
    echo ""
    echo -e "${CYAN}Or copy from the artifacts provided by Claude AI${NC}"
fi

# Run setup if exists
if [ -f "setup.js" ]; then
    print_status "Running bot setup..."
    node setup.js
elif [ -f "config/config.example.js" ]; then
    print_status "Setting up configuration..."
    cp config/config.example.js config/config.js
    print_success "Configuration template copied"
    print_warning "Please edit config/config.js with your settings"
fi

# Create startup script
print_status "Creating startup scripts..."

cat > start-bot.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting WhatsApp Bot..."
echo "📱 Make sure your phone is ready for pairing!"
echo ""

# Check if config exists
if [ ! -f "config/config.js" ]; then
    echo "❌ Configuration file not found!"
    echo "Please run: cp config/config.example.js config/config.js"
    echo "Then edit config/config.js with your settings"
    exit 1
fi

# Start bot
node index.js
EOF

chmod +x start-bot.sh

# PM2 script
cat > start-pm2.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting bot with PM2..."

# Install PM2 if not exists
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Start bot
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Bot started with PM2"
echo "Use 'pm2 logs wa-bot' to view logs"
echo "Use 'pm2 restart wa-bot' to restart"
EOF

chmod +x start-pm2.sh

print_success "Startup scripts created"

# Create update script
cat > update-bot.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating bot..."

# Pull latest changes if git repo
if [ -d ".git" ]; then
    git pull origin main
    echo "✅ Code updated from repository"
fi

# Update dependencies
npm install
echo "✅ Dependencies updated"

# Restart if running with PM2
if command -v pm2 &> /dev/null && pm2 list | grep -q "wa-bot"; then
    pm2 restart wa-bot
    echo "✅ Bot restarted"
fi

echo "🎉 Update completed!"
EOF

chmod +x update-bot.sh

# Show final instructions
echo ""
print_success "Installation completed successfully!"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Edit configuration: nano config/config.js"
echo "2. Add your media files to media/ folder"
echo "3. Start the bot: ./start-bot.sh"
echo "4. Or use PM2: ./start-pm2.sh"
echo ""
echo -e "${CYAN}📱 Bot Commands:${NC}"
echo "• .ping - Check bot speed"
echo "• .menu - Show all commands"  
echo "• .rvo - Reveal view once messages"
echo "• .sticker - Create sticker from image/video"
echo "• .music - Play bot music"
echo "• .welcome - Send welcome message"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "• Keep Termux running in background"
echo "• Use PM2 for production deployment"
echo "• Regular backup of sessions/ folder"
echo "• Monitor logs: pm2 logs wa-bot"
echo ""
echo -e "${GREEN}🚀 Happy coding!${NC}"

# Show current directory
echo ""
print_status "Bot installed in: $(pwd)"
print_status "Use 'cd simple-wa-bot' to enter project directory"
