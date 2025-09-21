module.exports = {
    // Bot basic configuration
    botName: 'Simple WA Bot',
    prefix: '.',
    
    // Owner phone numbers (without +)
    owner: [
        '6281234567890', // Replace with your number
        // Add more owners if needed
    ],
    
    // Timezone setting
    timezone: 'Asia/Jakarta', // Change to your timezone
    
    // Bot behavior
    autoTyping: false,      // Auto typing when processing commands
    autoRead: false,        // Auto read incoming messages
    
    // File upload limits
    maxFileSize: 100 * 1024 * 1024, // 100MB in bytes
    
    // API configurations (optional)
    apis: {
        // Add your API keys here if needed
        // example: 'your-api-key-here'
    },
    
    // Database configuration (for future use)
    database: {
        type: 'json', // json, mongodb, mysql, etc.
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
        maxMessages: 5,     // Max messages per timeframe
        timeframe: 10000,   // Timeframe in milliseconds (10 seconds)
        punishment: 'warn'  // warn, mute, kick, ban
    }
};
