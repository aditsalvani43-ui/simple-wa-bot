const { runtime, formatSize } = require('../lib/functions');
const os = require('os');

const basicCommands = {
    // Ping command
    ping: async (sock, m, args, text, isOwner, config) => {
        const start = Date.now();
        const msg = await sock.sendMessage(m.chat, {
            text: '⏱️ Calculating ping...'
        }, { quoted: m });
        
        const end = Date.now();
        const ping = end - start;
        
        await sock.sendMessage(m.chat, {
            text: `🏓 *Pong!*\n⚡ Speed: ${ping}ms`,
            edit: msg.key
        });
    },
    
    // Menu command with interactive buttons
    menu: async (sock, m, args, text, isOwner, config) => {
        const uptime = process.uptime();
        const fs = require('fs-extra');
        
        try {
            // Check if media files exist
            const welcomePath = './media/welcome.jpg';
            const musicPath = './media/music.mp3';
            const thumbPath = './media/thumb.jpg';
            
            let welcomeBuffer = null;
            let musicBuffer = null;
            let thumbBuffer = null;
            
            if (await fs.pathExists(welcomePath)) {
                welcomeBuffer = await fs.readFile(welcomePath);
            }
            if (await fs.pathExists(musicPath)) {
                musicBuffer = await fs.readFile(musicPath);
            }
            if (await fs.pathExists(thumbPath)) {
                thumbBuffer = await fs.readFile(thumbPath);
            } else if (welcomeBuffer) {
                thumbBuffer = welcomeBuffer; // Use welcome as thumbnail fallback
            }
            
            const menuText = `
╭─────────────────────╮
│       *${config.botName}*       │  
╰─────────────────────╯

┌─ 📋 *BASIC COMMANDS*
├ ${config.prefix}ping - Check bot speed
├ ${config.prefix}menu - Show this menu
├ ${config.prefix}info - Bot information
└ ${config.prefix}runtime - Bot uptime

┌─ 🎨 *MEDIA COMMANDS*
├ ${config.prefix}rvo - Reveal view once
├ ${config.prefix}sticker - Create sticker
├ ${config.prefix}toimg - Convert sticker to image
├ ${config.prefix}take - Change sticker pack info
├ ${config.prefix}music - Play bot music
├ ${config.prefix}welcome - Send welcome message
├ ${config.prefix}download - Download media
└ ${config.prefix}getimg - Get image from URL

┌─ 🎮 *FUN COMMANDS*
├ ${config.prefix}say <text> - Make bot say something
├ ${config.prefix}reverse <text> - Reverse text
├ ${config.prefix}calculate <math> - Calculator
├ ${config.prefix}qr <text> - Generate QR code
├ ${config.prefix}quote - Random quote
├ ${config.prefix}fact - Random fact
├ ${config.prefix}flip - Flip coin
├ ${config.prefix}dice - Roll dice
└ ${config.prefix}random - Random number

📊 *Bot Status*
⏱️ Runtime: ${runtime(uptime)}
👤 Owner: @${config.owner[0]}
🎯 Prefix: ${config.prefix}

_Use buttons below for quick access!_
            `.trim();
            
            // Create interactive message with buttons and media
            const interactiveMessage = {
                text: menuText,
                contextInfo: {
                    mentionedJid: [`${config.owner[0]}@s.whatsapp.net`],
                    externalAdReply: {
                        title: `🎵 ${config.botName}`,
                        body: `Click buttons for quick actions!`,
                        thumbnailUrl: '',
                        sourceUrl: '',
                        mediaType: 1,
                        showAdAttribution: false,
                        renderLargerThumbnail: true,
                        thumbnail: thumbBuffer || null
                    }
                }
            };
            
            // Send menu with thumbnail
            await sock.sendMessage(m.chat, interactiveMessage, { quoted: m });
            
            // Auto-send welcome image if exists
            if (welcomeBuffer) {
                setTimeout(async () => {
                    const welcomeText = `🎉 *Welcome to ${config.botName}!*\n\n👋 Hello ${m.name || 'User'}!\n🤖 I'm ready to help you with various commands.\n\n_Enjoy using the bot!_ ❤️`;
                    
                    await sock.sendMessage(m.chat, {
                        image: welcomeBuffer,
                        caption: welcomeText
                    });
                }, 1000);
            }
            
            // Auto-send music if exists
            if (musicBuffer) {
                setTimeout(async () => {
                    await sock.sendMessage(m.chat, {
                        audio: musicBuffer,
                        mimetype: 'audio/mpeg',
                        ptt: false,
                        contextInfo: {
                            externalAdReply: {
                                title: '🎵 Bot Theme Music',
                                body: `${config.botName} - Background Music`,
                                thumbnailUrl: '',
                                sourceUrl: '',
                                mediaType: 1,
                                showAdAttribution: false,
                                thumbnail: thumbBuffer || null
                            }
                        }
                    });
                }, 2000);
            }
            
        } catch (error) {
            console.error('Menu Error:', error);
            // Fallback to simple text menu
            const simpleMenuText = `
╭─────────────────────╮
│       *${config.botName}*       │
╰─────────────────────╯

📋 *BASIC COMMANDS*
• ${config.prefix}ping - Check bot speed
• ${config.prefix}menu - Show this menu
• ${config.prefix}info - Bot information
• ${config.prefix}runtime - Bot uptime

🎨 *MEDIA COMMANDS*
• ${config.prefix}rvo - Reveal view once
• ${config.prefix}sticker - Create sticker
• ${config.prefix}toimg - Convert sticker to image
• ${config.prefix}music - Play bot music
• ${config.prefix}welcome - Send welcome message

🎮 *FUN COMMANDS*
• ${config.prefix}calculate - Calculator
• ${config.prefix}qr - Generate QR code
• ${config.prefix}quote - Random quote

📊 *Bot Status*
⏱️ Runtime: ${runtime(uptime)}
👤 Owner: @${config.owner[0]}

_Developed with ❤️ by Simple Bot Team_
            `.trim();
            
            await sock.sendMessage(m.chat, {
                text: simpleMenuText,
                contextInfo: {
                    mentionedJid: [`${config.owner[0]}@s.whatsapp.net`]
                }
            }, { quoted: m });
        }
    },
    
    // Info command
    info: async (sock, m, args, text, isOwner, config) => {
        const used = process.memoryUsage();
        const infoText = `
┌─ 🤖 *BOT INFORMATION*
├ Name: ${config.botName}
├ Version: 1.0.0
├ Platform: ${os.platform()}
├ Node.js: ${process.version}
├ Architecture: ${os.arch()}
└ Owner: @${config.owner[0]}

┌─ 💾 *MEMORY USAGE*
├ RSS: ${formatSize(used.rss)}
├ Heap Total: ${formatSize(used.heapTotal)}
├ Heap Used: ${formatSize(used.heapUsed)}
├ External: ${formatSize(used.external)}
└ Array Buffers: ${formatSize(used.arrayBuffers)}

┌─ 🖥️ *SERVER INFO*
├ CPU: ${os.cpus()[0].model}
├ Cores: ${os.cpus().length}
├ Free RAM: ${formatSize(os.freemem())}
├ Total RAM: ${formatSize(os.totalmem())}
└ Load Average: ${os.loadavg().map(x => x.toFixed(2)).join(', ')}

_Bot is running smoothly! 🚀_
        `.trim();
        
        await sock.sendMessage(m.chat, {
            text: infoText,
            contextInfo: {
                mentionedJid: [`${config.owner[0]}@s.whatsapp.net`]
            }
        }, { quoted: m });
    },
    
    // Runtime command
    runtime: async (sock, m, args, text, isOwner, config) => {
        const uptime = process.uptime();
        
        await sock.sendMessage(m.chat, {
            text: `⏰ *Bot Runtime*\n⏱️ ${runtime(uptime)}`
        }, { quoted: m });
    },
    
    // Owner only restart command
    restart: async (sock, m, args, text, isOwner, config) => {
        if (!isOwner) {
            return await sock.sendMessage(m.chat, {
                text: '❌ This command is only for owners!'
            }, { quoted: m });
        }
        
        await sock.sendMessage(m.chat, {
            text: '🔄 Restarting bot...'
        }, { quoted: m });
        
        process.exit(0);
    }
};

module.exports = basicCommands;
