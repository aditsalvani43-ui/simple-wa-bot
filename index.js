const { 
    default: WAConnect, 
    useMultiFileAuthState, 
    DisconnectReason, 
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    proto,
    getContentType 
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');
const { handleMessage } = require('./lib/handler');
const { smsg, getBuffer, fetchJson } = require('./lib/functions');

// Bot configuration
const config = {
    botName: 'Simple WA Bot',
    prefix: '.',
    owner: ['6281234567890'], // Replace with your number
    timezone: 'Asia/Jakarta',
    autoTyping: false,
    autoRead: false,
    maxFileSize: 100 * 1024 * 1024 // 100MB
};

// Create store for message handling
const store = makeInMemoryStore({ 
    logger: pino().child({ level: 'silent', stream: 'store' }) 
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions/auth');
    
    const sock = WAConnect({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ["Simple WA Bot", "Safari", "1.0.0"],
        generateHighQualityLinkPreview: true
    });

    // Bind store to socket
    store.bind(sock.ev);

    // Handle pairing code
    if (!sock.authState.creds.registered) {
        console.log(chalk.yellow('🔗 Generating pairing code...'));
        
        setTimeout(async () => {
            const code = await sock.requestPairingCode('62812345678'); // Replace with target number
            console.log(chalk.green('📱 Pairing Code:'), chalk.bold.white(code));
        }, 3000);
    }

    // Connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red('❌ Connection closed due to'), lastDisconnect?.error);
            
            if (shouldReconnect) {
                console.log(chalk.yellow('🔄 Reconnecting...'));
                startBot();
            }
        } else if (connection === 'open') {
            console.log(chalk.green('✅ Bot connected successfully!'));
            console.log(chalk.blue('📱 Bot Number:'), sock.user.id.split(':')[0]);
        }
    });

    // Save credentials
    sock.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg || msg.key.fromMe || !msg.message) return;
            
            const message = await smsg(sock, msg, store);
            await handleMessage(sock, message, config);
            
        } catch (error) {
            console.error(chalk.red('❌ Error handling message:'), error);
        }
    });

    // Group updates
    sock.ev.on('group-participants.update', async (update) => {
        console.log(chalk.cyan('👥 Group update:'), update);
    });

    return sock;
}

// Start the bot
startBot().catch(error => {
    console.error(chalk.red('❌ Failed to start bot:'), error);
    process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log(chalk.yellow('🛑 Bot stopped'));
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error(chalk.red('❌ Uncaught Exception:'), error);
});

console.log(chalk.blue(`
┌─────────────────────────────────────┐
│        Simple WhatsApp Bot          │
│         Starting up...              │
└─────────────────────────────────────┘
`));
