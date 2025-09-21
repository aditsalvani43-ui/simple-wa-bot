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
    
    // Menu command
    menu: async (sock, m, args, text, isOwner, config) => {
        const uptime = process.uptime();
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
└ ${config.prefix}qr <text> - Generate QR code

📊 *Bot Status*
⏱️ Runtime: ${runtime(uptime)}
👤 Owner: @${config.owner[0]}
🎯 Prefix: ${config.prefix}

_Developed with ❤️ by Simple Bot Team_
        `.trim();
        
        await sock.sendMessage(m.chat, {
            text: menuText,
            contextInfo: {
                mentionedJid: [`${config.owner[0]}@s.whatsapp.net`]
            }
        }, { quoted: m });
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
