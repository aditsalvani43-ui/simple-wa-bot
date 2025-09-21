const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(chalk.blue(`
╔═══════════════════════════════════════╗
║        Simple WhatsApp Bot Setup      ║
║              Version 1.0              ║
╚═══════════════════════════════════════╝
`));

async function setupBot() {
    try {
        console.log(chalk.yellow('🚀 Setting up your WhatsApp Bot...\n'));
        
        // Create necessary directories
        console.log(chalk.cyan('📁 Creating directories...'));
        await fs.ensureDir('./sessions/auth');
        await fs.ensureDir('./temp');
        await fs.ensureDir('./media');
        console.log(chalk.green('✅ Directories created successfully!'));
        
        // Setup configuration
        console.log(chalk.cyan('\n⚙️ Setting up configuration...'));
        
        const botName = await askQuestion('🤖 Enter bot name (default: Simple WA Bot): ') || 'Simple WA Bot';
        const prefix = await askQuestion('🎯 Enter command prefix (default: .): ') || '.';
        const ownerNumber = await askQuestion('👤 Enter your WhatsApp number (with country code, e.g., 62812345678): ');
        const timezone = await askQuestion('🕐 Enter your timezone (default: Asia/Jakarta): ') || 'Asia/Jakarta';
        
        if (!ownerNumber) {
            throw new Error('Owner number is required!');
        }
        
        // Create config file
        const configContent = `module.exports = {
    // Bot basic configuration
    botName: '${botName}',
    prefix: '${prefix}',
    
    // Owner phone numbers (without +)
    owner: [
        '${ownerNumber}', // Your number
        // Add more owners if needed
    ],
    
    // Timezone setting
    timezone: '${timezone}',
    
    // Bot behavior
    autoTyping: false,      // Auto typing when processing commands
    autoRead: false,        // Auto read incoming messages
    
    // File upload limits
    maxFileSize: 100 * 1024 * 1024, // 100MB in bytes
    
    // API configurations (optional)
    apis: {
        // Add your API keys here if needed
    },
    
    // Database configuration (for future use)
    database: {
        type: 'json',
        path: './database.json'
    },
    
    // Message settings
    messages: {
        wait: '⏳ Please wait...',
        error: '❌ An error occurred!',
        ownerOnly: '❌ This command is only for owners!',
        groupOnly: '❌ This command can only be used in groups!',
        privateOnly: '❌ This command can only be used in private chat!',
        adminOnly: '❌ This command is only for group admins!',
        botAdminOnly: '❌ Bot must be admin to use this command!'
    },
    
    // Feature toggles
    features: {
        antiSpam: true,
        antiLink: false,
        welcome: false,
        autoSticker: false,
        autoDownload: false
    },
    
    // Spam protection
    spam: {
        maxMessages: 5,
        timeframe: 10000,
        punishment: 'warn'
    }
};`;
        
        await fs.writeFile('./config/config.js', configContent);
        console.log(chalk.green('✅ Configuration file created successfully!'));
        
        // Create thumbnail placeholder
        console.log(chalk.cyan('\n🖼️ Creating media files...'));
        const thumbPlaceholder = 'Add your bot thumbnail image here (thumb.jpg)';
        await fs.writeFile('./media/README.md', thumbPlaceholder);
        
        // Create start script
        const startScript = `#!/bin/bash
echo "🚀 Starting Simple WhatsApp Bot..."
echo "📱 Make sure your phone is ready for pairing!"
echo ""
node index.js`;
        
        await fs.writeFile('./start.sh', startScript);
        await fs.chmod('./start.sh', '755');
        
        // Create PM2 ecosystem
        const pm2Config = `module.exports = {
    apps: [{
        name: 'wa-bot',
        script: 'index.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        },
        error_file: './logs/error.log',
        out_file: './logs/out.log',
        log_file: './logs/combined.log',
        time: true
    }]
};`;
        
        await fs.writeFile('./ecosystem.config.js', pm2Config);
        await fs.ensureDir('./logs');
        
        console.log(chalk.green('✅ Setup completed successfully!\n'));
        
        console.log(chalk.blue('🎉 Your WhatsApp Bot is ready to use!'));
        console.log(chalk.yellow('\n📋 Next steps:'));
        console.log(chalk.cyan('1. Run: npm start'));
        console.log(chalk.cyan('2. Enter your phone number when prompted'));
        console.log(chalk.cyan('3. Use the pairing code in WhatsApp'));
        console.log(chalk.cyan('4. Start using your bot!\n'));
        
        console.log(chalk.blue('📱 Basic commands:'));
        console.log(chalk.white(`${prefix}ping - Check bot speed`));
        console.log(chalk.white(`${prefix}menu - Show all commands`));
        console.log(chalk.white(`${prefix}rvo - Reveal view once messages`));
        console.log(chalk.white(`${prefix}sticker - Create sticker from image/video\n`));
        
        console.log(chalk.green('🚀 Happy coding!'));
        
    } catch (error) {
        console.error(chalk.red('❌ Setup failed:'), error.message);
    } finally {
        rl.close();
    }
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(chalk.yellow(question), (answer) => {
            resolve(answer.trim());
        });
    });
}

// Run setup
setupBot();
