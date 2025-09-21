const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');
const { fileTypeFromBuffer } = require('file-type');
const sharp = require('sharp');

// Format message object
const smsg = (conn, m, store) => {
    if (!m) return m;
    
    let M = proto.WebMessageInfo;
    if (m.key) {
        m.id = m.key.id;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = conn.decodeJid(m.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '');
    }
    
    if (m.message) {
        m.mtype = getContentType(m.message);
        m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype]);
        m.body = m.message?.conversation || m.msg?.caption || m.msg?.text || (m.mtype == 'listResponseMessage') && m.msg?.singleSelectReply?.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg?.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg?.caption || m.text;
        
        let quoted = m.quoted = m.msg?.contextInfo ? m.msg.contextInfo.quotedMessage : null;
        m.mentionedJid = m.msg?.contextInfo ? m.msg.contextInfo.mentionedJid : [];
        
        if (m.quoted) {
            let type = getContentType(quoted);
            m.quoted = m.quoted[type];
            if (['productMessage'].includes(type)) {
                type = getContentType(m.quoted);
                m.quoted = m.quoted[type];
            }
            if (typeof m.quoted === 'string') m.quoted = {
                text: m.quoted
            };
            m.quoted.mtype = type;
            m.quoted.id = m.msg.contextInfo.stanzaId;
            m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
            m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false;
            m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant || m.quoted.chat || '');
            m.quoted.fromMe = m.quoted.sender === conn.decodeJid(conn.user.id);
            m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || '';
            m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
        }
    }
    
    m.name = m.pushName || conn.getName(m.sender) || '';
    m.download = () => downloadM(m);
    
    return m;
};

// Download media from message
const downloadM = async (m) => {
    if (!m.quoted && !m.msg) return null;
    let q = m.quoted || m.msg;
    let mtype = (m.quoted || m).mtype;
    
    return await downloadContentFromMessage(q, mtype.replace('Message', '')).catch(() => null);
};

// Get buffer from URL or path
const getBuffer = async (pathOrURL, save) => {
    try {
        if (/^https?:\/\//.test(pathOrURL)) {
            const response = await axios.get(pathOrURL, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const buffer = Buffer.from(response.data);
            if (save) await fs.writeFile(save, buffer);
            return buffer;
        } else {
            return await fs.readFile(pathOrURL);
        }
    } catch (error) {
        console.error('Error getting buffer:', error);
        return null;
    }
};

// Fetch JSON from API
const fetchJson = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Content-Type': 'application/json'
            },
            ...options
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return null;
    }
};

// Format file size
const formatSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

// Get runtime
const runtime = (seconds) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    
    return dDisplay + hDisplay + mDisplay + sDisplay;
};

// Sleep function
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Check if URL is valid
const isUrl = (url) => {
    try {
        return Boolean(new URL(url));
    } catch {
        return false;
    }
};

// Generate random string
const randomId = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Create sticker from buffer
const createSticker = async (buffer, packname = 'Simple Bot', author = 'WhatsApp Bot') => {
    try {
        const { spawn } = require('child_process');
        const tmpFile = path.join(__dirname, '../temp', `sticker_${randomId()}.webp`);
        
        // Ensure temp directory exists
        await fs.ensureDir(path.dirname(tmpFile));
        
        // Resize and convert to WebP
        const processedBuffer = await sharp(buffer)
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp()
            .toBuffer();
            
        await fs.writeFile(tmpFile, processedBuffer);
        
        // Add metadata
        const stickerBuffer = await fs.readFile(tmpFile);
        await fs.remove(tmpFile);
        
        return stickerBuffer;
    } catch (error) {
        console.error('Error creating sticker:', error);
        return null;
    }
};

// Get content type from message
const { getContentType } = require('@whiskeysockets/baileys');

module.exports = {
    smsg,
    downloadM,
    getBuffer,
    fetchJson,
    formatSize,
    runtime,
    sleep,
    isUrl,
    randomId,
    createSticker,
    getContentType
};
