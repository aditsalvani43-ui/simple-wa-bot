const chalk = require('chalk');
const moment = require('moment-timezone');
const fs = require('fs-extra');
const path = require('path');

// Import command modules
const basicCommands = require('../commands/basic');
const mediaCommands = require('../commands/media');
const funCommands = require('../commands/fun');

const handleMessage = async (sock, m, config) => {
    try {
        if (!m.body) return;
        
        const isCmd = m.body.startsWith(config.prefix);
        const command = isCmd ? m.body.slice(config.prefix.length).trim().split(' ')[0].toLowerCase() : '';
        const args = m.body.trim().split(' ').slice(1);
        const text = args.join(' ');
        
        // Log incoming message
        console.log(chalk.cyan('📨 Message:'), {
            from: m.name || m.sender.split('@')[0],
            chat: m.isGroup ? 'Group' : 'Private',
            message: m.body.substring(0, 50) + (m.body.length > 50 ? '...' : ''),
            time: moment().tz(config.timezone).format('HH:mm:ss')
        });
        
        // Auto typing
        if (config.autoTyping && isCmd) {
            await sock.sendPresenceUpdate('composing', m.chat);
        }
        
        // Auto read
        if (config.autoRead) {
            await sock.readMessages([m.key]);
        }
        
        // Command handling
        if (isCmd) {
            // Check if user is owner for restricted commands
            const isOwner = config.owner.includes(m.sender.split('@')[0]);
            
            // Basic commands
            if (basicCommands[command]) {
                await basicCommands[command](sock, m, args, text, isOwner, config);
                return;
            }
            
            // Media commands
            if (mediaCommands[command]) {
                await mediaCommands[command](sock, m, args, text, isOwner, config);
                return;
            }
            
            // Fun commands
            if (funCommands[command]) {
                await funCommands[command](sock, m, args, text, isOwner, config);
                return;
            }
            
            // Command not found
            await sock.sendMessage(m.chat, {
                text: `❌ Command *${command}* not found!\nUse *${config.prefix}menu* to see available commands.`
            }, { quoted: m });
        }
        
    } catch (error) {
        console.error(chalk.red('❌ Handler Error:'), error);
        
        // Send error message to user
        try {
            await sock.sendMessage(m.chat, {
                text: '❌ An error occurred while processing your request.'
            }, { quoted: m });
        } catch (sendError) {
            console.error(chalk.red('❌ Failed to send error message:'), sendError);
        }
    }
};

module.exports = { handleMessage };
