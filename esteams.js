//==---------[ ES TEAMS TELEBOT ]-----------==//
import TelegramBot from 'node-telegram-bot-api';
import chalk from 'chalk';
import fs from 'fs';
import fetch from 'node-fetch';
import yts from 'yt-search';
import FormData from 'form-data';
import * as fileType from 'file-type';
import path from 'path';
import JSConfuser from 'js-confuser';
import axios from 'axios';
import puppeteer from 'puppeteer';
import * as webCrack from 'webcrack';
import googleTTS from 'google-tts-api';
import { execSync } from 'child_process';
import whisper from 'openai-whisper';
import buffer from 'buffer';
import archiver from 'archiver';
import * as Jimp from 'jimp';
import jsQR from 'jsqr';
import fbDownloader from "fb-downloader-scrapper";
import crypto from "crypto";
import db from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import os from "os";
import sharp from "sharp";
import express from "express";
import bodyParser from "body-parser";
import cron from "node-cron";
import ffmpeg from "fluent-ffmpeg";
import { fileURLToPath } from "url";
import { createCanvas, loadImage } from 'canvas';
import ffmpegPath from "ffmpeg-static";
import util from "util";
import { exec as execCallback } from "child_process";
import http from 'http';

ffmpeg.setFfmpegPath(ffmpegPath);
const app = express();
app.use(bodyParser.json());

const ES_TEAMS_API_BASE = "https://esteamstv.devs.surf";
const ES_TEAMS_API_KEY = process.env.ES_TEAMS_API_KEY;

async function esApiGet(endpoint, params = {}) {
    const query = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""))
    ).toString();
    const url = `${ES_TEAMS_API_BASE}${endpoint}${query ? `?${query}` : ""}`;
    const res = await fetch(url, { headers: { "x-api-key": ES_TEAMS_API_KEY } });
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `ES TEAMS API responded ${res.status}`);
        return data;
    }
    if (!res.ok) throw new Error(`ES TEAMS API responded ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
}

async function esApiPost(endpoint, body = {}) {
    const res = await fetch(`${ES_TEAMS_API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": ES_TEAMS_API_KEY },
        body: JSON.stringify(body)
    });
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `ES TEAMS API responded ${res.status}`);
        return data;
    }
    if (!res.ok) throw new Error(`ES TEAMS API responded ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
}

//============= PORT CONFIG ===============//
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ES TEAMS V1 IS ACTIVE\n');
}).listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});

//============== API PING CONFIG =============//
const apiList = [
  'https://itunes.apple.com/search?term=beatles&limit=1&entity=song',
  'https://api.lyrics.ovh/v1/Coldplay/Yellow',
];

let firstPinged = false;

const keepAlive = async () => {
  if (!firstPinged) {
    firstPinged = true;

    console.log('⏳ ES TEAMS V1 API PINGING...');

    let hasError = false;

    try {
      await Promise.all(
        apiList.map(async (url) => {
          try {
            await axios.get(url, { timeout: 5000 });
          } catch {
            hasError = true;
          }
        })
      );
    } catch {
      hasError = true;
    }

    if (!hasError) {
      console.log('✅ ES TEAMS V1 API SUCCESS');
    } else {
      console.warn('⚠️ ES TEAMS V1 API PING FAILED');
    }

    return; 
  }

  for (const url of apiList) {
    try {
      await axios.get(url, { timeout: 5000 });
    } catch {
    }
  }
};

keepAlive();

setInterval(keepAlive, 3 * 60 * 1000);

//============== BOT PING CONFIG ==============//

const SELF_URL = process.env.SELF_URL || `http://localhost:${PORT}`;

setInterval(async () => {
    try {
        await fetch(SELF_URL);
        console.log("✅ ES TEAMS V1 IS PINGING...");
    } catch (err) {
        console.error("❌ ES TEAMS V1 PING FAILED:", err.message);
    }
}, 240000);

//============== WEBHOOK CONFIG ==============//
const BOT_TOKEN = process.env.BOT_TOKEN;
await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`)
  .then(res => res.json())
  .then(json => console.log("Webhook deletion result:", json))
  .catch(err => console.error("Failed to delete webhook:", err));

//================= CONFIG =================//
const CONFIG = {
    OWNER_IDS: [5523737392],
    DEVELOPER_IDS: [5523737392],
    FILES: {
        PREMIUM_USERS: './esteamspro.json',
        BLACKLIST: './blacklist.json'
    },
    CRASH_APIS: {
        CRASHER: 'https://venomweb.site/i/sendcrash',
        GLITCHER: 'http://glitchwatools-apis.online/sendCrash'
    },
    CHANNEL: 'https://t.me/examsolutionteam'
};

//================= BOT SETUP =================//
const tokens = [process.env.BOT_TOKEN];
const exec = util.promisify(execCallback);
const ALLOWED_UPDATES = [
    'message', 'edited_message', 'channel_post', 'edited_channel_post',
    'business_connection', 'business_message', 'edited_business_message', 'deleted_business_messages',
    'message_reaction', 'message_reaction_count',
    'inline_query', 'chosen_inline_result', 'callback_query',
    'shipping_query', 'pre_checkout_query', 'purchased_paid_media',
    'poll', 'poll_answer',
    'my_chat_member', 'chat_member', 'chat_join_request',
    'chat_boost', 'removed_chat_boost',
    'subscription', 'stopped_message_generation'
];

const botClients = tokens.map(token => new TelegramBot(token, {
    polling: {
        params: { allowed_updates: JSON.stringify(ALLOWED_UPDATES) }
    }
}));
const EsTeams = botClients[0];
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const startTime = Date.now();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const adminId = 5523737392;
const channelId = -1003410474720; 
const REACTION_COOLDOWN = 30000; 
const groupId = -1002408064092;
let LOCK_BOT = false;

//============= BOT ERROR HANDLER ==============//
botClients.forEach(bot => {
  bot.on('polling_error', (err) => {
    if (err.code === 'ETELEGRAM' && err.message.includes('409')) {
      setTimeout(() => process.exit(0), 1000);
    } else {
      console.error('❌ [polling_error]', err);
    }
  });
  bot.on('webhook_error', (err) => console.error('❌ [webhook_error]', err));
  bot.on('error', (err) => console.error('❌ [bot_error]', err));
});

//============= GLOBAL CRASH GUARD ==============//
process.on('unhandledRejection', (reason) => {
  console.error('❌ [unhandledRejection]', reason instanceof Error ? reason.message : reason);
});
process.on('uncaughtException', (err) => {
  console.error('❌ [uncaughtException]', err instanceof Error ? err.message : err);
});

//============= NATIVE TELEGRAM COMMAND MENU ==============//
botClients.forEach(bot => {
  const publicCommands = [
    { command: 'start', description: 'Open the ES TEAMS V1 main menu' },
    { command: 'ephemeral', description: 'Send a private group reply' },
    { command: 'rich', description: 'Send a Rich Message' },
    { command: 'draft', description: 'Stream a temporary message draft' },
    { command: 'ping', description: 'Check if the bot is alive' },
    { command: 'wareact', description: 'React to a WhatsApp channel post' },
    { command: 'wapoll', description: 'Vote on a WhatsApp channel poll' },
    { command: 'runtime', description: 'Show bot uptime' },
    { command: 'sysinfo', description: 'Show server/system info' },
    { command: 'support', description: 'Contact support' },
    { command: 'donate', description: 'Support the project' },
    { command: 'gpt', description: 'Ask the AI a question' },
    { command: 'qr', description: 'Generate a QR code' },
    { command: 'scanqr', description: 'Scan a QR code from an image' },
    { command: 'tinyurl', description: 'Shorten a URL' },
    { command: 'weather', description: 'Get weather for a location' },
    { command: 'translate', description: 'Translate text' },
    { command: 'define', description: 'Look up a word definition' },
    { command: 'calc', description: 'Calculate a math expression' },
    { command: 'base64', description: 'Encode/decode base64 text' },
    { command: 'hash', description: 'Generate MD5/SHA1/SHA256 hash' },
    { command: 'genpass', description: 'Generate a secure password' },
    { command: 'uuid', description: 'Generate a random UUID' },
    { command: 'morse', description: 'Encode/decode morse code' },
    { command: 'reverse', description: 'Reverse a piece of text' },
    { command: 'timestamp', description: 'Unix timestamp tools' },
    { command: 'color', description: 'Preview a hex color' },
    { command: 'avatar', description: 'Get a profile photo' },
    { command: 'myid', description: 'Show your Telegram ID' },
    { command: 'chatid', description: 'Show the current chat ID' },
    { command: 'whoami', description: 'Show your account info' },
    { command: 'botinfo', description: 'Show info about this bot' },
    { command: 'groupinfo', description: 'Show info about this group' },
    { command: 'react', description: 'React to a replied message' },
    { command: 'spoiler', description: 'Resend replied media blurred' },
    { command: 'effect', description: 'Send a message with an effect' },
    { command: 'newtopic', description: 'Create a forum topic' },
    { command: 'closetopic', description: 'Close the current forum topic' },
    { command: 'reopentopic', description: 'Reopen the current forum topic' },
    { command: 'renametopic', description: 'Rename the current forum topic' },
    { command: 'bizassistant', description: 'Toggle Business auto-reply' },
    { command: 'bizprofile', description: 'Describe your business for the AI' },
    { command: 'bizstatus', description: 'Check Business connection status' },
    { command: 'joke', description: 'Get a random joke' },
    { command: 'riddle', description: 'Get a random riddle' },
    { command: 'trivia', description: 'Play a trivia question' },
    { command: '8ball', description: 'Ask the magic 8-ball' },
    { command: 'coinflip', description: 'Flip a coin' },
    { command: 'rps', description: 'Rock, paper, scissors vs the bot' },
    { command: 'dice', description: 'Roll an animated dice' },
    { command: 'slot', description: 'Spin the slot machine' },
    { command: 'basketball', description: 'Throw an animated basketball' },
    { command: 'football', description: 'Kick an animated football' },
    { command: 'darts', description: 'Throw an animated dart' },
    { command: 'bowling', description: 'Roll an animated bowling ball' },
    { command: 'truth', description: 'Get a truth question' },
    { command: 'dare', description: 'Get a dare challenge' },
    { command: 'wyr', description: 'Would you rather...' },
    { command: 'tictac', description: 'Play tic-tac-toe' },
    { command: 'igstalk', description: 'Look up an Instagram profile' },
    { command: 'ttstalk', description: 'Look up a TikTok profile' },
    { command: 'gitstalk', description: 'Look up a GitHub profile' },
    { command: 'quran', description: 'Read a Quran verse' },
    { command: 'bible', description: 'Read a Bible verse' },
    { command: 'crypto', description: 'Check crypto prices' },
    { command: 'trend', description: 'See trending crypto coins' },
    { command: 'index', description: 'Crypto fear & greed index' },
    { command: 'balance', description: 'Check your wallet balance' },
    { command: 'fund', description: 'Fund your wallet' },
    { command: 'airtime', description: 'Buy airtime' },
    { command: 'twitter', description: 'Download a Twitter/X video' },
    { command: 'facebook', description: 'Download a Facebook video' },
    { command: 'instagram', description: 'Download Instagram media' },
    { command: 'tiktok', description: 'Download a TikTok video' },
    { command: 'play', description: 'Search and download a song' },
    { command: 'video', description: 'Search and download a video' },
    { command: 'ytdl', description: 'Download a YouTube video by link' },
    { command: 'lyrics', description: 'Get lyrics for a song' },
    { command: 'write', description: 'Write text on a book cover image' },
    { command: 'flux', description: 'Generate an AI image (premium)' },
    { command: 'ssweb', description: 'Screenshot a website' },
    { command: 'removebg', description: 'Remove image background' },
    { command: 'webdl', description: 'Download a file from a direct link' },
    { command: 'apk', description: 'Search for an app APK' },
    { command: 'gdrive', description: 'Get a Google Drive download link' },
    { command: 'imgscan', description: 'Describe what is in an image' },
    { command: 'ocr', description: 'Extract text from an image' },
    { command: 'fakewapp', description: 'Generate a fake WhatsApp chat image' },
    { command: 'tempmail', description: 'Create a temporary email' },
    { command: 'checkmail', description: 'Check your temp mail inbox' },
    { command: 'technews', description: 'Get a random tech news story' },
    { command: 'currency', description: 'Convert between currencies' },
    { command: 'summarize', description: 'Summarize a block of text' },
    { command: 'chart', description: 'Generate a chart image' },
    { command: 'linkpreview', description: 'Preview a link' },
    { command: 'iplookup', description: 'Look up an IP address' },
    { command: 'country', description: 'Get info about a country' },
    { command: 'advice', description: 'Get a random piece of advice' },
    { command: 'catfact', description: 'Get a random cat fact' },
    { command: 'holidays', description: 'List public holidays for a country' },
    { command: 'dogimage', description: 'Get a random dog picture' },
    { command: 'quote', description: 'Get a random quote' },
    { command: 'mcstatus', description: 'Check a Minecraft server status' },
    { command: 'npm', description: 'Look up an npm package' },
    { command: 'ytinfo', description: 'Get info about a YouTube video' },
    { command: 'githubrepo', description: 'Look up a GitHub repository' },
    { command: 'anime', description: 'Search for an anime' },
    { command: 'wiki', description: 'Get a Wikipedia summary' },
    { command: 'sportsteam', description: 'Look up a sports team' },
    { command: 'videogen', description: 'Generate an AI video (premium)' },
    { command: 'wacheck', description: 'Check if a number is on WhatsApp' }
  ];

  const ownerCommands = [
    { command: 'accstats', description: 'Show EmmyHenz account stats' },
    { command: 'claimall', description: 'Claim daily coins on all accounts' },
    { command: 'users', description: 'List bot users' },
    { command: 'broadcast', description: 'Broadcast a message to all users' },
    { command: 'backup', description: 'Backup bot data' },
    { command: 'lockbot', description: 'Lock the bot' },
    { command: 'unlockbot', description: 'Unlock the bot' },
    { command: 'gpin', description: 'Pin a broadcast for all users' },
    { command: 'gunpin', description: 'Unpin a broadcast for all users' },
    { command: 'addowner', description: 'Add a bot owner' },
    { command: 'delowner', description: 'Remove a bot owner' },
    { command: 'listowner', description: 'List bot owners' },
    { command: 'btcstats', description: 'Show BTC stats' },
    ...publicCommands
  ].slice(0, 100); // Telegram allows 100 commands: owner-only ones go first so they are never cut

  bot.setMyCommands(publicCommands.slice(0, 100), { scope: { type: 'default' } })
    .catch(err => console.error('❌ [setMyCommands default]', err.message));

  CONFIG.OWNER_IDS.forEach(ownerId => {
    bot.setMyCommands(ownerCommands, { scope: { type: 'chat', chat_id: ownerId } })
      .catch(() => {}); // owner may not have started the bot yet, ignore silently
  });
});

//================= FILES =================//
const TIMER_FILE = "ES_TEAMS-MEDIA/ctimer.json";
const WELCOME_FILE = 'ES_TEAMS-MEDIA/welcome_settings.json';
const ANTILINK_FILE = './ES_TEAMS-MEDIA/antilink.json';
const START_TIME_FILE = 'ES_TEAMS-MEDIA/start_time.json';
const TTT_FILE = './ES_TEAMS-MEDIA/ttt.json';
const botImageUrl = 'https://files.catbox.moe/3jibot.jpg';
// EmmyHenz V4 site. Override with EMMYHENZ_BASE_URL if the owner moves the domain again.
const SITE_BASE = (process.env.EMMYHENZ_BASE_URL || 'https://host.emmyhenztech.xyz').replace(/\/+$/, '');
const BUILD_ID = '2026-10-20-tokens-2'; // shown at startup and at the bottom of /accstats
console.log(`🚀 ES TEAMS build ${BUILD_ID}`);

// Website accounts come from the env vars EMMYHENZ_TOKEN, EMMYHENZ_TOKEN1, EMMYHENZ_TOKEN2, ...
// (each is the 'eh_tok' value of one Google/GitHub sign-in). See the EMMYHENZ ACCOUNTS section below.
const BOT_USERNAME = "es_teams_bot";
const reactions = ["😘", "❤️", "🤝", "🥰", "👏", "🙏", "😱", "🤯", "👍", "😍", "🤩", "🔥", "👌", "👨‍💻", "😁", "😢", "🎉", "🍾"];
const fruits = ["🍎","🍌","🍓","🍉","🍍","🍊","🥝","🍇","🍐","🥭"];const REPO_PATH = "./"; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const driveLogPath = path.join(__dirname, "drive_links.txt");
const myBtcTemplate = path.join(__dirname, 'ES_TEAMS-MEDIA', 'image', 'btc_template.png');
const KEYS_FOLDER = './ES_TEAMS-KEYS';
if (!fs.existsSync(KEYS_FOLDER)) fs.mkdirSync(KEYS_FOLDER);

if (!fs.existsSync(TTT_FILE)) fs.writeFileSync(TTT_FILE, '{}');

//================= SESSIONS =================//
const areactSessions = {};
const supportSession = {};
let broadcastSession = {};
let lastPrice = null;
let btcFailStart = null;
let cachedToken = null;
let tokenExpiry = null;
let lastFailAlert = 0;
let lastReactionTime = 0;
let reactionIndex = 0;
const userWatchlists = {};
const paymentReceipts = {};
const decoderState = {};
const userCtimerSessions = {};
const activeTimers = {};
const cryptoSessions2 = {};
const pnlSessions = {};
const receiptSteps = {}; 
const tradeSessions = {}; 
const memoryUsed = {}; 
const tttGames = {};
const xoMemory = {};
const tttLobbies = {};
const airtimeSessions = {}; 
const pinLocks = {};
const newFolderSessions = {};
const userConfirming = {};
const userCaptcha = {};
const userInput = {};
const faceSwapSessions = {};
const markdownSessions = new Map();
const lyricsMap = new Map();
const userMenuMessage = new Map();
const sysinfoCaptcha = new Map();
const pollDraft = new Map();
const userLastWareact = new Map();
const userPendingReactions = new Map();
const activePolls = new Map();  
const movieTempMap = new Map();

//================= BUTTON =================//
const waButton = [
  [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary"}]
];

//================= UTILS =================//
const loadJsonFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const saveJsonFile = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

//================= USERS =================//
async function saveUser(chatId) {  
  const userRef = doc(db, "botData", "users");  

  try {  
    await updateDoc(userRef, { ids: arrayUnion(chatId) });  
  } catch (err) {  
    if (err.code === "not-found" || err.message.includes("No document to update")) {  
      await setDoc(userRef, { ids: [chatId] });  
    } else {  
      console.error("Error saving user:", err);  
    }  
  }  
}  

async function readUsers() {  
  const userRef = doc(db, "botData", "users");  
  const snap = await getDoc(userRef);  

  if (snap.exists()) {  
    const data = snap.data();  
    return Array.isArray(data.ids) ? data.ids : [];  
  } else {  
    await setDoc(userRef, { ids: [] });  
    return [];  
  }  
}  

export { saveUser, readUsers };

process.env.DEBUG = '';
process.env.NODE_DEBUG = '';

//============ HELPER FUNCTIONS ==============//
async function validateApiKey(apiKey, apiSecret) {
  try {
    const ts = await getServerTime();
    const query = buildQuery({ timestamp: ts });
    const sig = signQuery(query, apiSecret);
    
    const res = await axios.get(
      `https://fapi.binance.com/fapi/v2/account?${query}&signature=${sig}`,
      { headers: { "X-MBX-APIKEY": apiKey } }
    );
    
    return { valid: true, balance: res.data.totalWalletBalance || "0" };
  } catch (err) {
    console.error("API validation error:", err.response?.data || err.message);
    return { valid: false, error: err.response?.data?.msg || err.message };
  }
}

async function getServerTime() {
  try {
    const res = await axios.get("https://fapi.binance.com/fapi/v1/time");
    return res.data.serverTime;
  } catch (err) {
    console.error("Failed to fetch server time:", err.message);
    return Date.now();
  }
}

function buildQuery(params) {
  return Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

function signQuery(query, secret) {
  return crypto.createHmac("sha256", secret).update(query).digest("hex");
}

function floorToStep(value, step) {
  const precision = Math.ceil(Math.log10(1 / step));
  return Math.floor(value / step) * Number(step.toFixed(precision));
}

function welcomeCaption(mainText) {
  return `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗜𝗡𝗚\n\n${mainText}`;
}

// Secret-free description of an API failure (never includes tokens, passwords or headers).
function describeApiError(err) {
  const r = err?.response;
  if (r?.status === 401) return 'HTTP 401: Unauthorized (API key missing, invalid or revoked - check EMMYHENZ_TOKEN)';
  if (!r) return err?.code ? `${err.code}: ${err.message}` : (err?.message || 'Unknown error');
  const d = r.data;
  if (d && typeof d === 'object' && d.error) return `HTTP ${r.status}: ${d.error}`;
  if (typeof d === 'string' && /<html|<!doctype/i.test(d)) {
    return `HTTP ${r.status}: HTML instead of JSON (endpoint removed or bot-protection page)`;
  }
  return `HTTP ${r.status}`;
}

// Token of the Main account (EMMYHENZ_TOKEN). Used by the /topup command.
async function getToken() {
  const main = emmyAccounts[0];
  if (!main) throw new Error('EMMYHENZ_TOKEN is not set');
  return main.token;
}

// ============ EMMYHENZ ACCOUNTS (EMMYHENZ_TOKEN, EMMYHENZ_TOKEN1, EMMYHENZ_TOKEN2, ...) ============ //
// Each token is one website account. The site lets each account react once per hour, so more
// accounts = more reacts per hour. Tokens are never printed, logged or sent to Telegram.
function cleanSiteToken(v) {
  return String(v || '').trim().replace(/^bearer\s+/i, '').replace(/^["']+|["']+$/g, '').trim();
}

function loadEmmyAccounts(env = process.env) {
  const found = [];
  for (const [key, val] of Object.entries(env)) {
    const m = /^EMMYHENZ_TOKEN(\d*)$/.exec(key);
    const token = m ? cleanSiteToken(val) : '';
    if (token) found.push({ n: m[1] === '' ? 0 : parseInt(m[1], 10), token });
  }
  found.sort((a, b) => a.n - b.n);
  const seen = new Set();
  return found
    .filter(f => !seen.has(f.token) && seen.add(f.token))
    .map(f => makeAccount(f.n, f.token));
}

function makeAccount(n, token) {
  return {
    n,
    label: n === 0 ? 'Main' : `Account ${n}`,
    token,
    balance: null,   // last known coin balance
    premium: false,  // Premium accounts get free daily react / vote uses
    reactFree: 0,    // free channel-react uses left today (Premium)
    voteFree: 0,     // free poll-vote uses left today (Premium)
    rateUntil: 0,    // time (ms) until the site's rate limit (5 requests / 10 s) lets this account call again
    invalid: false,  // true when the site rejected the token (expired / logged out)
    error: '',       // last problem (never contains the token)
    busy: false,     // true while a request is running on this account
    checkedAt: 0,
    okSince: 0,      // when the token was first seen working (to report how long it lasted)
    lifeMs: 0,       // how long the last token worked
    alerted: false   // true after the admin was told this token expired
  };
}

// The site rejected the token (expired / logged out / session reset).
function markInvalid(acc) {
  if (!acc.invalid && acc.okSince) acc.lifeMs = Date.now() - acc.okSince;
  acc.okSince = 0;
  acc.invalid = true;
  acc.error = 'API key invalid or revoked';
}

const emmyAccounts = loadEmmyAccounts();
const STATUS_TTL = 30 * 1000;
const REACT_QUEUE_MSG = "⏳ Service is on queue, please try again later.";
const cleanReason = (s) => String(s || '').replace(/[*_`\[\]]/g, '').slice(0, 160);

function fmtWait(ms) {
  const m = Math.max(1, Math.ceil(ms / 60000));
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
}

// How long something lasted (rounds down).
function fmtAge(ms) {
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'under a minute';
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
}

// Copies what the site says about an account (coins, Premium, today's free uses) onto our record.
function applyAccountInfo(acc, info) {
  if (!info || typeof info !== 'object') return;
  const coins = Number(info.coins);
  if (Number.isFinite(coins)) acc.balance = coins;
  if (typeof info.premium === 'boolean') acc.premium = info.premium;
  const usage = info.dailyUsage || {};
  const reactFree = Number(usage.channelReact?.freeRemaining);
  const voteFree = Number(usage.pollVoting?.freeRemaining);
  if (Number.isFinite(reactFree)) acc.reactFree = reactFree;
  if (Number.isFinite(voteFree)) acc.voteFree = voteFree;
}

// The site allows 5 requests per 10 seconds per account (HTTP 429 + retryAfterSeconds).
function retryMs(data, headers) {
  const s = Number(data?.retryAfterSeconds ?? headers?.['retry-after']);
  return (Number.isFinite(s) && s > 0 ? Math.min(s, 60) : 10) * 1000;
}

// Asks the site for the account (GET /api/v1/account - free): coins, Premium and today's free uses.
async function refreshAccount(acc, force = false) {
  if (!force && acc.checkedAt && Date.now() - acc.checkedAt < STATUS_TTL) return acc;
  try {
    const res = await axios.get(`${SITE_BASE}/api/v1/account`, { headers: { 'x-api-key': acc.token }, timeout: 20000 });
    acc.checkedAt = Date.now();
    if (res.data?.success && res.data.account) {
      acc.invalid = false;
      if (!acc.okSince) acc.okSince = Date.now();
      acc.error = '';
      applyAccountInfo(acc, res.data.account);
    } else {
      acc.error = cleanReason(res.data?.error || 'could not read account');
    }
  } catch (err) {
    acc.checkedAt = Date.now();
    const status = err.response?.status;
    if (status === 401) {
      markInvalid(acc);
    } else if (status === 429) {
      acc.rateUntil = Date.now() + retryMs(err.response.data, err.response.headers);
    } else {
      acc.error = cleanReason(describeApiError(err));
    }
  }
  return acc;
}

async function refreshAllAccounts(force = false) {
  await Promise.all(emmyAccounts.map(a => refreshAccount(a, force)));
}

// An account can serve a request when its key works, it is not rate limited, and it has 1 coin
// (or a free daily use left). Unknown balance counts as "has coins".
const hasCredit = (a, kind = 'react') => {
  const free = kind === 'vote' ? a.voteFree : a.reactFree;
  return free > 0 || !Number.isFinite(a.balance) || a.balance >= 1;
};
const isAccountFree = (a) => !a.invalid && !a.busy && !(a.rateUntil > Date.now()) && hasCredit(a, 'react');

// Accounts in the order to try them: free daily uses first (no coin spent), then the richest.
function accountsByCredit(kind = 'react') {
  const hasFree = (a) => ((kind === 'vote' ? a.voteFree : a.reactFree) > 0 ? 1 : 0);
  return [...emmyAccounts].sort((a, b) => hasFree(b) - hasFree(a) || (Number(b.balance) || 0) - (Number(a.balance) || 0));
}

// Total coins across all usable accounts (last known values).
function sumBalances() {
  return emmyAccounts.reduce((sum, a) => sum + ((!a.invalid && Number.isFinite(a.balance)) ? a.balance : 0), 0);
}

function queueMessage(kind = 'react') {
  const live = emmyAccounts.filter(a => !a.invalid);
  if (live.length && !live.some(a => hasCredit(a, kind))) {
    return `⚠️ The ${kind === 'vote' ? 'poll' : 'reaction'} service is out of coins right now. Please try again later.`;
  }
  const waits = live.filter(a => a.rateUntil > Date.now()).map(a => a.rateUntil - Date.now());
  return waits.length ? `${REACT_QUEUE_MSG} Try again in about ${Math.max(1, Math.ceil(Math.min(...waits) / 1000))}s.` : REACT_QUEUE_MSG;
}

// Used by /wareact BEFORE asking for payment: is any account free right now?
async function getReactAvailability() {
  if (!emmyAccounts.length) return { configured: false, usable: 0, free: 0 };
  await refreshAllAccounts();
  const usable = emmyAccounts.filter(a => !a.invalid);
  return { configured: true, usable: usable.length, free: usable.filter(isAccountFree).length };
}

// Same as above, for poll votes (/wapoll).
const isAccountFreeForVote = (a) => !a.invalid && !a.busy && !(a.rateUntil > Date.now()) && hasCredit(a, 'vote');
async function getVoteAvailability() {
  if (!emmyAccounts.length) return { configured: false, usable: 0, free: 0 };
  await refreshAllAccounts();
  const usable = emmyAccounts.filter(a => !a.invalid);
  return { configured: true, usable: usable.length, free: usable.filter(isAccountFreeForVote).length };
}

// ============ TOKENS SET FROM TELEGRAM (/settoken) - SAVED IN FIRESTORE ============ //
// Env tokens (EMMYHENZ_TOKEN...) are used first. A token saved with /settoken is used for an account
// number that has no env token, or whose env token has expired - so you can renew without redeploying.
function sortAccounts() {
  emmyAccounts.sort((a, b) => a.n - b.n);
}

async function loadSavedTokens() {
  try {
    const snap = await getDoc(doc(db, "emmyTokens", "list"));
    return snap.exists() ? (snap.data().tokens || {}) : {};
  } catch (err) {
    console.error("❌ Error reading saved tokens:", err.message);
    return {};
  }
}

async function applySavedTokens() {
  const saved = await loadSavedTokens();
  for (const [key, raw] of Object.entries(saved)) {
    const n = parseInt(key, 10);
    const token = cleanSiteToken(raw);
    if (!Number.isInteger(n) || n < 0 || !token) continue;
    if (!/^ehk_/i.test(token)) continue; // old website sign-in tokens do not work with the API
    let acc = emmyAccounts.find(a => a.n === n);
    if (acc && !acc.invalid) continue;                                   // the env token works: keep it
    if (emmyAccounts.some(a => a !== acc && a.token === token)) continue; // already used by another account
    if (!acc) { acc = makeAccount(n, token); emmyAccounts.push(acc); }
    else if (acc.token !== token) { acc.token = token; acc.invalid = false; acc.error = ''; acc.alerted = false; }
    await refreshAccount(acc, true);
  }
  sortAccounts();
}

// Accepts the token itself, or a link that contains authToken=...
function extractSiteToken(input) {
  const raw = String(input || '').trim();
  const m = /[?&#]authToken=([^&\s#]+)/.exec(raw);
  return cleanSiteToken(m ? decodeURIComponent(m[1]) : raw);
}

// Checks a new token with the site, then adds/replaces account number n and saves it. Never logs the token.
async function setAccountToken(n, rawToken) {
  const token = extractSiteToken(rawToken);
  if (!Number.isInteger(n) || n < 0 || n > 99) return { ok: false, reason: 'Account number must be 0 (Main) or 1-99.' };
  if (!/^[A-Za-z0-9._~+\/=\-]{16,}$/.test(token)) return { ok: false, reason: 'That does not look like a token.' };
  const other = emmyAccounts.find(a => a.token === token && a.n !== n);
  if (other) return { ok: false, reason: `That token is already used by ${other.label}.` };

  let coins;
  try {
    const res = await axios.get(`${SITE_BASE}/api/v1/account`, { headers: { 'x-api-key': token }, timeout: 20000 });
    coins = Number(res.data?.account?.coins);
    if (!res.data?.success) return { ok: false, reason: 'The site did not accept this API key.' };
  } catch (err) {
    return { ok: false, reason: err.response?.status === 401 ? 'The site rejected this API key (invalid or revoked).' : cleanReason(describeApiError(err)) };
  }

  let acc = emmyAccounts.find(a => a.n === n);
  if (!acc) { acc = makeAccount(n, token); emmyAccounts.push(acc); sortAccounts(); }
  acc.token = token;
  acc.invalid = false;
  acc.error = '';
  acc.alerted = false;
  acc.okSince = Date.now();
  acc.balance = Number.isFinite(coins) ? coins : acc.balance;
  acc.checkedAt = 0; // timers are re-read from the site on the next check

  try {
    await setDoc(doc(db, "emmyTokens", "list"), { tokens: { [String(n)]: token }, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.error("❌ Could not save the token:", err.message);
    return { ok: true, acc, coins, saved: false };
  }
  return { ok: true, acc, coins, saved: true };
}

// Tells the admin(s) once when a token stops working.
async function checkTokensAndAlert() {
  try {
    await refreshAllAccounts(true);
    for (const a of emmyAccounts) {
      if (!a.invalid) { a.alerted = false; continue; }
      if (a.alerted) continue;
      a.alerted = true;
      const worked = a.lifeMs ? ` It worked for about ${fmtAge(a.lifeMs)}.` : '';
      const text = `⚠️ EmmyHenz ${a.label} API key is invalid or revoked.${worked}\n\nCreate a new key in Profile → API keys on the website, then send:\n/settoken ${a.n} <new key>`;
      for (const ownerId of CONFIG.OWNER_IDS) {
        try { await EsTeams.sendMessage(ownerId, text); } catch (e) { /* owner has not started the bot */ }
      }
    }
  } catch (err) {
    console.log('⚠️ Token check failed:', err.message);
  }
}

// Startup check: prints only OK / the reason, never a token. Then re-checks every 30 minutes.
(async () => {
  try {
    await applySavedTokens();
    if (!emmyAccounts.length) {
      console.log('ℹ️ No EmmyHenz token yet - set EMMYHENZ_TOKEN (and EMMYHENZ_TOKEN1, ...) or use /settoken 0 <token> in Telegram.');
    } else {
      await refreshAllAccounts(true);
      for (const a of emmyAccounts) {
        console.log(a.invalid || a.balance === null
          ? `❌ EmmyHenz ${a.label}: ${a.error || 'could not read account'}`
          : `✅ EmmyHenz ${a.label} token accepted (coins: ${a.balance})`);
      }
      if (emmyAccounts.some(a => !a.invalid && a.balance !== null)) await saveTotalCoins(sumBalances());
      await checkTokensAndAlert(); // tell the admin right away about tokens that are already dead
    }
  } catch (err) {
    console.log('⚠️ EmmyHenz startup check failed:', err.message); // never stops the bot from starting
  }
  setInterval(checkTokensAndAlert, 30 * 60 * 1000);
})();

//========== CHANNEL REACT FUNCTION (USES ANY EMMYHENZ API KEY WITH COINS) ==========//
// POST /api/v1/channel-react { link, emoji | random }. No "amount" = as many reactions as possible.
// One request costs 1 coin (Premium accounts use their free daily requests first).
async function sendChannelReact(link, emoji = null) {
  if (!emmyAccounts.length) {
    return { success: false, message: "❌ No EmmyHenz account is set up. Admin: add EMMYHENZ_TOKEN." };
  }

  await refreshAllAccounts();

  if (!emmyAccounts.some(a => !a.invalid)) {
    return { success: false, message: "❌ Could not send reactions: Bot session expired - admin must update the EmmyHenz API key" };
  }

  const payload = emoji ? { link, emoji: Array.isArray(emoji) ? emoji.join(',') : String(emoji) } : { link, random: 1 };

  let lastReason = '';
  let hardFailure = false; // something other than "busy / rate limited / out of coins"

  for (const acc of accountsByCredit('react')) {
    if (!isAccountFree(acc)) continue;
    acc.busy = true; // reserve it so a second request picks a different account
    try {
      const res = await axios.post(`${SITE_BASE}/api/v1/channel-react`, payload, {
        headers: { "Content-Type": "application/json", "x-api-key": acc.token },
        timeout: 30000
      });
      const d = res.data;

      if (!d || typeof d !== 'object' || d.success !== true) {
        hardFailure = true;
        lastReason = cleanReason((d && d.error) || 'React was not accepted by the site');
        continue;
      }

      applyAccountInfo(acc, d.account);
      acc.checkedAt = Date.now();

      const sent = Number(d.result?.reactionsSent) || 0;
      const still = d.result?.status === 'processing' ? ' (still sending, may take a moment)' : '';
      return {
        success: true,
        message: (sent > 0 ? `✅ Done! ${sent.toLocaleString()} reactions sent` : "✅ Done!") + still,
        emojisUsed: Array.isArray(d.request?.emojis) ? d.request.emojis : [],
        coinsLeft: sumBalances(), // total coins across all accounts
        account: acc.label
      };
    } catch (err) {
      const status = err.response?.status;
      const d = err.response?.data;
      if (status === 401) {
        markInvalid(acc);
        hardFailure = true;
        lastReason = 'Bot session expired - admin must update the EmmyHenz API key';
      } else if (status === 429) {
        acc.rateUntil = Date.now() + retryMs(d, err.response.headers); // try the next account
      } else if (status === 403 && /coin/i.test(String(d?.error || ''))) {
        const coins = Number(d?.account?.coins);
        acc.balance = Number.isFinite(coins) ? coins : 0; // this account is empty: try the next one
        acc.reactFree = 0;
      } else if (status === 503) {
        hardFailure = true;
        lastReason = 'The service is busy or under maintenance';
        break; // the whole site is busy, other accounts will not help
      } else {
        hardFailure = true;
        lastReason = cleanReason((d && d.error) || describeApiError(err));
      }
      console.log(`⚠️ ${acc.label}: ${describeApiError(err)}`);
    } finally {
      acc.busy = false;
    }
  }

  if (hardFailure) return { success: false, message: `❌ Could not send reactions: ${lastReason}` };
  return { success: false, queue: true, message: queueMessage() };
}

//========== POLL VOTES (USES ANY EMMYHENZ API KEY WITH COINS) ==========//
// Reads a poll from a channel post link: POST /api/v1/poll-info { link } (free). Options come as { index, text }.
async function fetchPollInfo(link) {
  if (!emmyAccounts.length) return { success: false, error: 'No EmmyHenz account is set up' };
  let limited = false;
  for (const acc of emmyAccounts) {
    if (acc.invalid) continue;
    if (acc.rateUntil > Date.now()) { limited = true; continue; }
    try {
      const res = await axios.post(`${SITE_BASE}/api/v1/poll-info`, { link }, {
        headers: { 'Content-Type': 'application/json', 'x-api-key': acc.token },
        timeout: 30000
      });
      const d = res.data;
      if (!d || typeof d !== 'object') return { success: false, error: 'Unexpected response from the site' };
      if (!d.success) return { success: false, error: cleanReason(d.error || 'Failed') };
      if (!d.isPoll) return { success: true, isPoll: false };
      const options = (Array.isArray(d.options) ? d.options : [])
        .map((o, i) => (o && typeof o === 'object' ? { index: Number.isFinite(Number(o.index)) ? Number(o.index) : i, text: String(o.text ?? '') } : { index: i, text: String(o) }))
        .sort((a, b) => a.index - b.index)
        .map((o, i) => o.text || `Option ${i + 1}`);
      if (!options.length) return { success: false, error: 'This poll has no options' };
      return { success: true, isPoll: true, question: String(d.question || 'Poll'), channelName: String(d.channelName || ''), options };
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) { markInvalid(acc); continue; }
      if (status === 429) { acc.rateUntil = Date.now() + retryMs(err.response.data, err.response.headers); limited = true; continue; }
      const d = err.response?.data;
      return { success: false, error: cleanReason((d && d.error) || describeApiError(err)) };
    }
  }
  if (limited) return { success: false, error: 'The service is busy, please try again in a few seconds' };
  return { success: false, error: 'Bot session expired - admin must update the EmmyHenz API key' };
}

// Sends the votes: POST /api/v1/poll-vote { link, option (0-based number) } from the first account with coins.
// No "amount" = as many votes as possible. One request costs 1 coin (Premium: free daily uses first).
async function sendPollVote(link, optionIndex) {
  if (!emmyAccounts.length) {
    return { success: false, message: "❌ No EmmyHenz account is set up. Admin: add EMMYHENZ_TOKEN." };
  }

  await refreshAllAccounts();

  if (!emmyAccounts.some(a => !a.invalid)) {
    return { success: false, message: "❌ Could not send the vote: Bot session expired - admin must update the EmmyHenz API key" };
  }

  const payload = { link, option: Number(optionIndex) };
  let lastReason = '';
  let hardFailure = false;

  for (const acc of accountsByCredit('vote')) {
    if (!isAccountFreeForVote(acc)) continue;
    acc.busy = true;
    try {
      const res = await axios.post(`${SITE_BASE}/api/v1/poll-vote`, payload, {
        headers: { "Content-Type": "application/json", "x-api-key": acc.token },
        timeout: 30000
      });
      const d = res.data;

      if (!d || typeof d !== 'object' || d.success !== true) {
        hardFailure = true;
        lastReason = cleanReason((d && d.error) || 'The vote was not accepted by the site');
        continue;
      }

      applyAccountInfo(acc, d.account);
      acc.checkedAt = Date.now();

      const sent = Number(d.result?.votesSent) || 0;
      return {
        success: true,
        message: `✅ Done! ${sent.toLocaleString()} vote${sent === 1 ? '' : 's'} sent`,
        votesSent: sent,
        option: String(d.result?.option || '').slice(0, 100),
        coinsLeft: sumBalances(), // total coins across all accounts
        account: acc.label
      };
    } catch (err) {
      const status = err.response?.status;
      const d = err.response?.data;
      if (status === 401) {
        markInvalid(acc);
        hardFailure = true;
        lastReason = 'Bot session expired - admin must update the EmmyHenz API key';
      } else if (status === 429) {
        acc.rateUntil = Date.now() + retryMs(d, err.response.headers);
      } else if (status === 403 && /coin/i.test(String(d?.error || ''))) {
        const coins = Number(d?.account?.coins);
        acc.balance = Number.isFinite(coins) ? coins : 0;
        acc.voteFree = 0;
      } else if (status === 503) {
        hardFailure = true;
        lastReason = 'The service is busy or under maintenance';
        break;
      } else {
        hardFailure = true;
        lastReason = cleanReason((d && d.error) || describeApiError(err));
      }
      console.log(`⚠️ ${acc.label}: ${describeApiError(err)}`);
    } finally {
      acc.busy = false;
    }
  }

  if (hardFailure) return { success: false, message: `❌ Could not send the vote: ${lastReason}` };
  return { success: false, queue: true, message: queueMessage('vote') };
}

//========== TOTAL COINS (ALL ACCOUNTS) - SAVED IN FIRESTORE ==========//
async function loadStoredTotalCoins() {
  try {
    const snapshot = await getDoc(doc(db, "generatedCoins", "stats"));
    return snapshot.exists() ? (Number(snapshot.data().totalCoins) || 0) : 0;
  } catch (err) {
    console.error("❌ Error reading stored total coins:", err.message);
    return 0;
  }
}

async function saveTotalCoins(total) {
  try {
    await setDoc(doc(db, "generatedCoins", "stats"), { totalCoins: Number(total) || 0, updatedAt: Date.now() }, { merge: true });
    return true;
  } catch (err) {
    console.error("❌ Error saving total coins:", err.message);
    return false;
  }
}

// Live total across all accounts (and saves it). Falls back to the saved total if the site can't be reached.
async function getTotalCoins(force = false) {
  await refreshAllAccounts(force);
  if (!emmyAccounts.some(a => !a.invalid && Number.isFinite(a.balance))) {
    return { total: await loadStoredTotalCoins(), stale: true };
  }
  const total = sumBalances();
  await saveTotalCoins(total);
  return { total, stale: false };
}

//========== WAREACT COOLDOWN FUNCTIONS ==========//
const WAREACT_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours
const WAREACT_STARS = 15; // Telegram Stars charged for each extra use inside the 24h window

async function checkWareactCooldown(userId) {
  try {
    const cooldownRef = doc(db, "wareactCooldowns", String(userId));
    const snapshot = await getDoc(cooldownRef);

    if (!snapshot.exists()) {
      return { canUse: true };
    }

    const lastUsed = Number(snapshot.data().lastUsed || 0);
    const elapsed = Date.now() - lastUsed;

    if (elapsed >= WAREACT_COOLDOWN) {
      return { canUse: true };
    }

    return { canUse: false, timeLeft: WAREACT_COOLDOWN - elapsed };
  } catch (err) {
    console.error("❌ Error checking wareact cooldown:", err.message);
    return { canUse: true };
  }
}

async function saveWareactTime(userId) {
  try {
    const cooldownRef = doc(db, "wareactCooldowns", String(userId));
    await setDoc(cooldownRef, { lastUsed: Date.now() });
  } catch (err) {
    console.error("❌ Error saving wareact time:", err.message);
  }
}

// Refunds a Telegram Stars payment (used when a paid react could not be delivered).
async function refundWareactStars(userId, chargeId) {
  if (!userId || !chargeId) return false;
  try {
    const r = await axios.post(
      `https://api.telegram.org/bot${tokens[0]}/refundStarPayment`,
      { user_id: userId, telegram_payment_charge_id: chargeId },
      { timeout: 15000 }
    );
    return !!(r.data && r.data.ok);
  } catch (err) {
    console.error('❌ Stars refund failed:', err.response?.data?.description || err.code || 'request error');
    return false;
  }
}

//========== WAPOLL COOLDOWN FUNCTIONS ==========//
const WAPOLL_COOLDOWN = 24 * 60 * 60 * 1000; // 1 free poll vote per user every 24 hours
const WAPOLL_STARS = 15;                      // Telegram Stars for each extra vote inside the 24h window
const WAPOLL_SESSION_TTL = 10 * 60 * 1000;    // a poll message stays clickable for 10 minutes
const waPollSessions = new Map(); // short id -> { userId, chatId, link, question, channelName, options, messageId, createdAt }
const waPollPending = new Map();  // userId -> chosen option waiting for the Stars payment
const waPollInFlight = new Set(); // users whose vote is being sent right now

async function checkWapollCooldown(userId) {
  try {
    const snapshot = await getDoc(doc(db, "wapollCooldowns", String(userId)));
    if (!snapshot.exists()) return { canUse: true };
    const elapsed = Date.now() - Number(snapshot.data().lastUsed || 0);
    if (elapsed >= WAPOLL_COOLDOWN) return { canUse: true };
    return { canUse: false, timeLeft: WAPOLL_COOLDOWN - elapsed };
  } catch (err) {
    console.error("❌ Error checking wapoll cooldown:", err.message);
    return { canUse: true };
  }
}

async function saveWapollTime(userId) {
  try {
    await setDoc(doc(db, "wapollCooldowns", String(userId)), { lastUsed: Date.now() });
  } catch (err) {
    console.error("❌ Error saving wapoll time:", err.message);
  }
}

// ============ CLAIM DAILY COINS (ALL ACCOUNTS) ========= //
// GET /api/v1/claim-coin (x-api-key): one daily coin per account, resets at midnight UTC.
// Already claimed = HTTP 400 with alreadyClaimed: true and nextClaimAt.
async function claimAllAccounts() {
  const results = [];
  for (const acc of emmyAccounts) {
    try {
      const res = await axios.get(`${SITE_BASE}/api/v1/claim-coin`, {
        headers: { 'x-api-key': acc.token },
        timeout: 30000
      });
      const d = res.data;
      if (d && d.success) {
        applyAccountInfo(acc, d.account);
        results.push({ label: acc.label, success: true, coins: Number(d.claimed ?? 0) || 0 });
      } else {
        results.push({ label: acc.label, success: false, error: cleanReason((d && d.error) || 'Claim failed') });
      }
    } catch (err) {
      const status = err.response?.status;
      const d = err.response?.data;
      if (status === 401) markInvalid(acc);
      if (status === 400 && d && d.alreadyClaimed) {
        applyAccountInfo(acc, d.account);
        const next = d.nextClaimAt ? Date.parse(d.nextClaimAt) : 0;
        results.push({ label: acc.label, success: false, already: true, error: `Already claimed today${next > Date.now() ? ` (next in ${fmtWait(next - Date.now())})` : ''}` });
      } else {
        results.push({
          label: acc.label,
          success: false,
          error: status === 401 ? 'API key invalid or revoked' : status === 429 ? 'Rate limited, try again in a few seconds' : cleanReason((d && d.error) || describeApiError(err))
        });
      }
    }
    await new Promise(r => setTimeout(r, 500));
  }
  const { total, stale } = await getTotalCoins(true);
  return { results, total, stale, claimed: results.reduce((s, r) => s + (r.success ? r.coins : 0), 0) };
}

// ============ ACCT BALANCE FUNCTION ========= //
async function fetchMainBalance() {
  // Throws on failure so callers can tell "0 coins" from "could not read balance".
  {
    const token = await getToken();
    const headers = { 'x-auth-token': token };
    try {
      // Current site: GET /api/me -> { success, user: { coins, ... } }
      const me = await axios.get(`${SITE_BASE}/api/me`, { headers, timeout: 30000 });
      const coins = Number(me.data?.user?.coins);
      if (me.data?.success && Number.isFinite(coins)) return coins;
      throw new Error('Unexpected /api/me response');
    } catch (e) {
      if (e.response?.status !== 404) throw e;
    }
    const res = await axios.get(`${SITE_BASE}/api/balance`, { headers, timeout: 30000 });
    return res.data.balance ?? res.data.coins ?? 0;
  }
}

async function getAccountBalance() {
  try {
    return await fetchMainBalance();
  } catch (err) {
    console.error('❌ Error getting account balance:', describeApiError(err));
    return 0;
  }
}

async function createTopupCode(coinsAmount) {
  try {
    const token = await getToken();
    const res = await axios.post(`${SITE_BASE}/api/topup/create`, {
      amount: coinsAmount
    }, {
      headers: { 'x-auth-token': token },
      timeout: 30000
    });

    return res.data.code || null;
  } catch (err) {
    console.error('❌ Error creating topup code:', err.message);
    return null;
  }
}

async function redeemTopupCode(topupCode) {
  try {
    const token = await getToken();
    const res = await axios.post(`${SITE_BASE}/api/topup/redeem`, {
      code: topupCode
    }, {
      headers: { 'x-auth-token': token },
      timeout: 30000
    });

    if (res.data.success) {
      return res.data.balance ?? res.data.newBalance ?? 0;
    }

    return null;
  } catch (err) {
    console.error('❌ Error redeeming topup code:', err.message);
    return null;
  }
}

async function deleteTopupCode(topupCode) {
  try {
    const token = await getToken();
    await axios.post(`${SITE_BASE}/api/topup/delete`, {
      code: topupCode
    }, {
      headers: { 'x-auth-token': token },
      timeout: 30000
    });
    return true;
  } catch (err) {
    console.error('❌ Error deleting topup code:', err.message);
    return false;
  }
}

// ============ CRON JOB FUNCTION ========= //
// The site's daily coin resets at 00:00 UTC. Runs at 00:05 UTC, then retries at 06:00, 12:00 and 18:00 UTC in case the bot
// was down or redeploying (accounts that already claimed just answer "already claimed", nothing is lost).
cron.schedule('5 0 * * *', async () => { await runDailyClaim(); }, { timezone: 'UTC' });
cron.schedule('0 6,12,18 * * *', async () => { await runDailyClaim(); }, { timezone: 'UTC' });
async function runDailyClaim() {
  console.log('⏰ Daily claim triggered - Claiming coins from all accounts...');
  try {
    if (!emmyAccounts.length) return console.log('ℹ️ No EmmyHenz accounts configured.');
    const { results, total } = await claimAllAccounts();
    for (const r of results) {
      console.log(r.success ? `✅ ${r.label}: +${r.coins} coins` : r.already ? `ℹ️ ${r.label}: ${r.error}` : `⚠️ ${r.label}: ${r.error}`);
    }
    console.log(`💎 Total coins available: ${total}`);
  } catch (err) {
    console.error('❌ Error in daily claim job:', err.message);
  }
}

//============ SERVER HEALTH CHECK =================//
async function checkServerHealth() {
  try {
    // Unauthenticated status route used by the site itself (no credentials sent).
    const res = await axios.get(`${SITE_BASE}/api/pages/status`, {
      timeout: 5000,
      validateStatus: function(status) {
        return status < 500 || status === 503;
      }
    });

    if (res.status === 503) {
      return {
        isHealthy: false,
        reason: "Server unavailable"
      };
    }

    if (res.data && typeof res.data === 'object' && res.data.turnstileSiteKey) {
      console.log('⚠️ Site has Cloudflare Turnstile enabled; channel-react requests from the bot may be rejected.');
    }

    return {
      isHealthy: true,
      reason: "Server healthy"
    };

  } catch (err) {
    return {
      isHealthy: false,
      reason: "Network error"
    };
  }
}

// ------------ SIGN IN GET REQUEST ------- //
function signV5GET(params = {}, secret) {
  const timestamp = params.timestamp ?? Date.now();
  const recv_window = params.recv_window ?? 5000;
  const api_key = params.api_key;
  const kv = { ...params };
  delete kv.timestamp;
  delete kv.recv_window;
  delete kv.api_key;

  const queryKeys = Object.keys(kv).sort();
  const queryString = queryKeys.map(k => `${k}=${encodeURIComponent(kv[k])}`).join("&");
  const plain = `${timestamp}${api_key}${recv_window}${queryString ? queryString : ""}`;
  const signature = crypto.createHmac("sha256", secret).update(plain).digest("hex");
  return { timestamp, recv_window, api_key, sign: signature, queryString };
}

async function bybitGET(path, params = {}) {
  const API_KEY = process.env.BYBIT_API_KEY;
  const API_SECRET = process.env.BYBIT_API_SECRET;
  if (!API_KEY || !API_SECRET) throw new Error("Bybit API credentials missing");

  const fullParams = { ...params, api_key: API_KEY, timestamp: Date.now(), recv_window: 5000 };
  const signed = signV5GET(fullParams, API_SECRET);

  const qs = signed.queryString && signed.queryString.length ? `${signed.queryString}&` : "";
  const url = `https://api.bybit.com${path}?${qs}api_key=${encodeURIComponent(signed.api_key)}&timestamp=${signed.timestamp}&recv_window=${signed.recv_window}&sign=${signed.sign}`;
  
  const res = await fetch(url, { method: "GET" });
  return await res.json();
}

async function getApiKeyInfo() {
  try { return await bybitGET("/v5/user/query-api"); } 
  catch { return null; }
}

async function getWalletBalances() {
  try { return await bybitGET("/v5/account/wallet-balance"); } 
  catch { return null; }
}

async function getActiveOrders(category = "linear") {
  try { return await bybitGET("/v5/order/realtime", { category, openOnly: true }); } 
  catch { return null; }
}

// ---------- COMMAND COUNT HELPER ---------- //
function countCommands() {
  try {
    const file = fs.readFileSync("./esteams.js", "utf8");
    const matches = file.match(/EsTeams\.onText/g) || [];
    return matches.length;
  } catch (err) {
    console.log("COUNT ERROR:", err);
    return 0;
  }
}

const totalCommands = countCommands();

// ---------- RAM BAR FUNCTION ---------- //
function getRamBar(length = 12) {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = Math.round((usedMem / totalMem) * 100);

  const filled = Math.round((memPercent / 100) * length);
  const empty = length - filled;

  const bar = "█".repeat(filled) + "░".repeat(empty);
  return `${bar} ${memPercent}%`;
}

// ----- CRYPTO FEAR AND GREED FUNCTION ------- //
async function sendCryptoIndex(channelId, groupId) {
  try {
    const fngRes = await fetch("https://api.alternative.me/fng/?limit=1", {
      headers: { "Cache-Control": "no-cache" },
    });
    const fngJson = await fngRes.json();
    if (!fngJson?.data?.[0]) throw new Error("Invalid Index Data");

    const indexValue = fngJson.data[0].value;
    const sentiment = fngJson.data[0].value_classification;

    const btcRes = await fetch("https://api.alternative.me/v2/ticker/1/", {
      headers: { "Cache-Control": "no-cache" },
    });
    const btcJson = await btcRes.json();
    if (!btcJson?.data?.["1"]) throw new Error("Invalid BTC Data");

    const btcPrice = parseFloat(btcJson.data["1"].quotes.USD.price).toLocaleString();
    const btcChange = parseFloat(btcJson.data["1"].quotes.USD.percent_change_24h);

    let changeEmoji = "📊";
    let changeText = "0%";
    if (btcChange > 0) {
      changeEmoji = "📈";
      changeText = `+${btcChange.toFixed(2)}%`;
    } else if (btcChange < 0) {
      changeEmoji = "📉";
      changeText = `${btcChange.toFixed(2)}%`;
    }

    const sentMessage = await EsTeams.sendPhoto(channelId, botImageUrl, {
      caption:
        `*📊𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗖𝗥𝗬𝗣𝗧𝗢 𝗙 & 𝗚 𝗜𝗡𝗗𝗘𝗫*\n\n` +
        `*🧭 Index Value:* ${indexValue}\n` +
        `*😱 Sentiment:* ${sentiment}\n` +
        `*💰 BTC Price:* $${btcPrice}\n\n` +
        `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: `${changeEmoji} ${changeText}`, url: "https://t.me/esteams_btc" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }],
        ],
      },
    });

    console.log("✅ Daily Crypto Index sent successfully to channel");

    if (groupId) {
      await EsTeams.forwardMessage(
        groupId,             
        channelId,           
        sentMessage.message_id 
      );
      console.log("✅ Crypto Index forwarded to group successfully");
    }

  } catch (err) {
    console.error("AUTO INDEX ERROR:", err.message);
  }
}

cron.schedule("5 1 * * *", () => {
  sendCryptoIndex(channelId, groupId); 
}, {
  timezone: "Africa/Lagos"
});

//============ BTC PRICE CHECK ===============//
async function reactToMessage(chatId, messageId) {
  const now = Date.now();
  if (now - lastReactionTime < REACTION_COOLDOWN) {
    return;
  }
  lastReactionTime = now;

  const botTokens = [
    process.env.BOT_TOKEN,
    process.env.BOT_TOKEN_1,
    process.env.BOT_TOKEN_2,
    process.env.BOT_TOKEN_3,
    process.env.BOT_TOKEN_4,
    process.env.BOT_TOKEN_5,
    process.env.BOT_TOKEN_6,
    process.env.BOT_TOKEN_7,
    process.env.BOT_TOKEN_8,
    process.env.BOT_TOKEN_9,
    process.env.BOT_TOKEN_10,
    process.env.BOT_TOKEN_11,
    process.env.BOT_TOKEN_12,
    process.env.BOT_TOKEN_13,
    process.env.BOT_TOKEN_14,
    process.env.BOT_TOKEN_15
  ].filter(token => token);

  console.log(`🔄 Adding reactions with ${botTokens.length} bots...`);

  for (const token of botTokens) {
    try {
      const randomEmoji = reactions[Math.floor(Math.random() * reactions.length)];

      await axios.post(
        `https://api.telegram.org/bot${token}/setMessageReaction`,
        {
          chat_id: chatId,
          message_id: messageId,
          reaction: [{ type: "emoji", emoji: randomEmoji }]
        },
        { timeout: 5000 }
      );

      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (err) {
      // Silent
    }
  }
}

async function getBTC() {
  try {
    const res = await fetch("https://openapiv1.coinstats.app/coins?coinIds=bitcoin&currency=USD", {
      headers: {
        "X-API-KEY": process.env.COINSTATS_API_KEY,
      },
    });

    const data = await res.json();
    const price = Number(data?.result?.[0]?.price);

    if (!price || isNaN(price)) {
      return null;
    }

    return price;
  } catch (err) {
    console.log('⚠️ BTC fetch failed:', err.message);
    return null;
  }
}

async function generatePriceImage(priceString) {
  try {
    const image = await loadImage(myBtcTemplate);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, image.width, image.height);

    const fullPriceText = `$ ${priceString}`;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 82px "Impact", "Arial Black", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const centerX = image.width / 2;
    const centerY = 340;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 12;
    ctx.strokeText(fullPriceText, centerX, centerY);

    ctx.fillText(fullPriceText, centerX, centerY);

    return canvas.toBuffer('image/png');
  } catch (error) {
    console.log('⚠️ Image generation failed:', error.message);
    return null;
  }
}

(async function btcAutoAlert() {
  try {
    console.log('🚀 BTC Alert starting...');

    await EsTeams.sendPhoto(adminId, botImageUrl, {
      caption: "📡 𝗕𝗧𝗖 𝗔𝗟𝗘𝗥𝗧\n\nInitializing BTC Price Tracker...",
      reply_markup: { inline_keyboard: waButton },
    });

    console.log('✅ BTC Alert initialized');

    setInterval(async () => {
      try {
        const price = await getBTC();
        if (!price) {
          console.log('⚠️ No price data');
          return;
        }

        global.btcLastPing = Date.now();

        const intervalPrice = Math.floor(price / 500) * 500;

        if (lastPrice === null) {
          lastPrice = intervalPrice;
          console.log(`📌 First price set: $${intervalPrice}`);
          return;
        }

        let arrow = "➡️";
        if (intervalPrice > lastPrice) arrow = "🟢";
        else if (intervalPrice < lastPrice) arrow = "🔴";

        if (intervalPrice !== lastPrice) {
          lastPrice = intervalPrice;

          const formattedPrice = intervalPrice.toLocaleString();

          console.log(`${arrow} Price changed to: $${formattedPrice}`);

          const dynamicImageBuffer = await generatePriceImage(formattedPrice);
          const photoToSend = dynamicImageBuffer || botImageUrl;

          const sentMsg = await EsTeams.sendPhoto(channelId, photoToSend, {
            caption: `${arrow}  $<b>${formattedPrice}</b> @esteams_btc`,
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: waButton },
          });

          await reactToMessage(channelId, sentMsg.message_id);

          reactionIndex++;
        }
      } catch (err) {
        console.log('❌ BTC loop error:', err.message);
      }
    }, 5000);

  } catch (err) {
    console.log('❌ BTC Alert failed to start:', err.message);
  }
})();

//============== PREMIUM USERS =================//
let premiumUsersData;
if (!fs.existsSync(CONFIG.FILES.PREMIUM_USERS)) {
    fs.writeFileSync(CONFIG.FILES.PREMIUM_USERS, JSON.stringify({ premiumUsers: [] }, null, 2));
    premiumUsersData = { premiumUsers: [] };
} else {
    premiumUsersData = loadJsonFile(CONFIG.FILES.PREMIUM_USERS);
    if (!Array.isArray(premiumUsersData.premiumUsers)) {
        premiumUsersData.premiumUsers = [];
    }
}
let premiumUsers = premiumUsersData.premiumUsers;

function savePremiumUser(userId) {
    if (!premiumUsers.includes(userId)) {
        premiumUsers.push(userId);
        fs.writeFileSync(CONFIG.FILES.PREMIUM_USERS, JSON.stringify({ premiumUsers }, null, 2));
        return true;
    }
    return false;
}

//================= TIME/DATE =================//
function getCurrentDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Lagos' };
    return new Intl.DateTimeFormat('en-NG', options).format(date);
}

function getCurrentTime() {
    const date = new Date();
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: 'Africa/Lagos' };
    return new Intl.DateTimeFormat('en-NG', options).format(date);
}

//================= GAMES =================//
function getGames() {
    return JSON.parse(fs.readFileSync(TTT_FILE, 'utf-8'));
}

function saveGames(games) {
    fs.writeFileSync(TTT_FILE, JSON.stringify(games, null, 2));
}

//================= CRYPTO =================//
async function validatePair(pair) {
    const [base, quote] = pair.split("/");
    const symbol = `${base}${quote}`;

    try {
        const spotRes = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        if (spotRes.ok) {
            const data = await spotRes.json();
            if (data.symbol) return true;
        }
    } catch (e) {}

    try {
        const futRes = await fetch(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol}`);
        if (futRes.ok) {
            const data = await futRes.json();
            if (data.symbol) return true;
        }
    } catch (e) {}

    return false;
}

async function getCryptoPrice(pair, market) {
    const [base, quote] = pair.split("/");
    const symbol = `${base}${quote}`;
    let ticker;

    try {
        if (market === "SPOT") {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
            const data = await res.json();
            ticker = data;
        } else {
            const res = await fetch(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol}`);
            const data = await res.json();
            ticker = data;
        }
    } catch (e) {
        ticker = { price: "N/A" };
    }

    return `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗔𝗟𝗘𝗥𝗧\n\n𝗣𝗔𝗜𝗥: *${pair}*\n𝗧𝗬𝗣𝗘: *${market}*\n𝗣𝗥𝗜𝗖𝗘: *${ticker.price || "N/A"}*`;
}

function scheduleReminder(chatId, timer) {
    const delay = timer.end - Date.now();
    if (delay <= 0) return;

    setTimeout(async () => {
        const info = await getCryptoPrice(timer.pair, timer.market);
        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: info,
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
        });

        if (activeTimers[chatId]) {
            activeTimers[chatId] = activeTimers[chatId].filter(t => t.end !== timer.end);
            fs.writeFileSync(TIMER_FILE, JSON.stringify(activeTimers, null, 2));
        }
    }, delay);
}

if (fs.existsSync(TIMER_FILE)) {
    const saved = JSON.parse(fs.readFileSync(TIMER_FILE));
    for (const chatId in saved) {
        activeTimers[chatId] = saved[chatId];
        for (const timer of saved[chatId]) scheduleReminder(chatId, timer);
    }
}

//================= BLACKLIST =================//
let blacklist = loadJsonFile(CONFIG.FILES.BLACKLIST);

//================= OWNERS =================//
const isOwner = (userId) => CONFIG.OWNER_IDS.includes(userId);
const isDeveloper = (userId) => CONFIG.DEVELOPER_IDS.includes(userId);

//============== PREMIUM MANAGER =============//
class PremiumManager {
    static isPremium(userId) {
        const user = premiumUsers.find(u => u.userId === userId);
        return user && new Date(user.expireDate) > new Date();
    }

    static add(userId, duration, unit) {
        const expireDate = new Date();
        const value = parseInt(duration);
        const unitMap = {
            'd': () => expireDate.setDate(expireDate.getDate() + value),
            'm': () => expireDate.setMonth(expireDate.getMonth() + value),
            'y': () => expireDate.setFullYear(expireDate.getFullYear() + value)
        };
        if (!unitMap[unit]) throw new Error('❌ Invalid time unit! Use d/m/y');
        unitMap[unit]();

        const newUser = { userId, expireDate: expireDate.toISOString() };
        premiumUsers.push(newUser);
        saveJsonFile(CONFIG.FILES.PREMIUM_USERS, premiumUsers);
        return newUser;
    }

    static remove(userId) {
        const index = premiumUsers.findIndex(u => u.userId === userId);
        if (index === -1) return false;

        premiumUsers.splice(index, 1);
        saveJsonFile(CONFIG.FILES.PREMIUM_USERS, premiumUsers);
        return true;
    }
}
// Message templates
const getMessages = (currentDate, currentTime) => ({
    mainMenu: `
╭━━━━━❄️【 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 】❄️━━━━━╮
┃ ❁️ Owner : @examsolutionteam
┃ ❁️ Date : ${currentDate}
┃ ❁️ Time : ${currentTime}
┃ ❁️ Commands : ${totalCommands}
┃ ❁️ Prefix : /
┃ ❁️ Ram : ${getRamBar()}
╰━━━━━━━━━━━━━━━━━━━━━╯`,

    ownerMenu: `
╭━━━❄️【 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐧𝐞𝐰 ◁️❄️🕷️
┃ /𝐭𝐢𝐩 ◁️❄️🕷️
┃ /𝐧𝐨𝐝𝐞𝐯 ◁️❄️🕷️
┃ /𝐮𝐬𝐞𝐫𝐬 ◁️❄️🕷️
┃ /𝐛𝐚𝐜𝐤𝐮𝐩 ◁️❄️🕷️️
┃ /𝐩𝐮𝐛𝐥𝐢𝐬𝐡 ◁️❄️🕷️
┃ /𝐛𝐭𝐜𝐬𝐭𝐚𝐭𝐬 ◁️❄️🕷️
┃ /𝐜𝐡𝐞𝐜𝐤𝐢𝐝 ◁️❄️🕷️
┃ /𝐥𝐨𝐜𝐤𝐛𝐨𝐭 ◁️❄️🕷
┃ /𝐚𝐝𝐝𝐨𝐰𝐧𝐞𝐫 ◁️❄️🕷️
┃ /𝐝𝐞𝐥𝐨𝐰𝐧𝐞𝐫 ◁️❄️🕷️
┃ /𝐮𝐧𝐥𝐨𝐜𝐤𝐛𝐨𝐭 ◁️❄️🕷️
┃ /𝐛𝐫𝐨𝐚𝐝𝐜𝐚𝐬𝐭 ◁️❄️🕷️
┃ /𝐠𝐩𝐢𝐧 ◁️❄️🕷️
┃ /𝐠𝐮𝐧𝐩𝐢𝐧 ◁️❄️🕷️
┃ /𝐥𝐢𝐬𝐭𝐨𝐰𝐧𝐞𝐫 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

    userMenu: `
╭━━━❄️【 𝗨𝗦𝗘𝗥 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐩𝐢𝐧𝐠 ◁️❄️🕷️
┃ /𝐝𝐨𝐧𝐚𝐭𝐞 ◁️❄️🕷️
┃ /𝐬𝐮𝐩𝐩𝐨𝐫𝐭 ◁️❄️🕷️
┃ /𝐫𝐮𝐧𝐭𝐢𝐦𝐞 ◁️❄️🕷️
┃ /𝐬𝐮𝐩𝐩𝐨𝐫𝐭 ◁️❄️🕷️
┃ /𝐬𝐲𝐬𝐢𝐧𝐟𝐨 ◁️❄️🕷️
┃ /𝐦𝐲𝐢𝐝 ◁️❄️🕷️
┃ /𝐜𝐡𝐚𝐭𝐢𝐝 ◁️❄️🕷️
┃ /𝐰𝐡𝐨𝐚𝐦𝐢 ◁️❄️🕷️
┃ /𝐛𝐨𝐭𝐢𝐧𝐟𝐨 ◁️❄️🕷️
┃ /𝐠𝐫𝐨𝐮𝐩𝐢𝐧𝐟𝐨 ◁️❄️🕷️
┃ /𝐛𝐢𝐳𝐚𝐬𝐬𝐢𝐬𝐭𝐚𝐧𝐭 ◁️❄️🕷️
┃ /𝐛𝐢𝐳𝐩𝐫𝐨𝐟𝐢𝐥𝐞 ◁️❄️🕷️
┃ /𝐛𝐢𝐳𝐬𝐭𝐚𝐭𝐮𝐬 ◁️❄️🕷️
┃ /𝐞𝐩𝐡𝐞𝐦𝐞𝐫𝐚𝐥 ◁️❄️🕷️
┃ /𝐫𝐢𝐜𝐡 ◁️❄️🕷️
┃ /𝐝𝐫𝐚𝐟𝐭 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

    mediaMenu: `
╭━━━❄️【 𝗠𝗘𝗗𝗜𝗔 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐚𝐩𝐤 ◁️❄️🕷️
┃ /𝐩𝐥𝐚𝐲 ◁️❄️🕷️
┃ /𝐲𝐭𝐝𝐥 ◁️❄️🕷️
┃ /𝐯𝐢𝐝𝐞𝐨 ◁️❄️🕷️
┃ /𝐭𝐢𝐤𝐭𝐨𝐤 ◁️❄️🕷️
┃ /𝐥𝐲𝐫𝐢𝐜𝐬 ◁️❄️🕷️
┃ /𝐬𝐭𝐫𝐞𝐚𝐦 ◁️❄️🕷️
┃ /𝐬𝐩𝐨𝐭𝐢𝐟𝐲 ◁️❄️🕷
┃ /𝐱𝐬𝐞𝐚𝐫𝐜𝐡 ◁️❄️🕷️
┃ /𝐭𝐰𝐢𝐭𝐭𝐞𝐫 ◁️❄️
┃ /𝐟𝐚𝐜𝐞𝐛𝐨𝐨𝐤 ◁️❄️🕷️
┃ /𝐢𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

    toolsMenu: `
╭━━━❄️【 𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐪𝐫 ◁️❄️🕷️
┃ /𝐠𝐩𝐭 ◁️❄️🕷️
┃ /𝐮𝐫𝐥 ◁️❄️🕷️
┃ /𝐣𝐢𝐝 ◁️❄️🕷️️
┃ /𝐜𝐜𝐠𝐞𝐧 ◁️❄️🕷️
┃ /𝐰𝐚𝐛𝐚𝐧 ◁️❄️🕷️
┃ /𝐬𝐬𝐰𝐞𝐛 ◁️❄️🕷️
┃ /𝐟𝐥𝐮𝐱 ◁️❄️🕷️
┃ /𝐰𝐫𝐢𝐭𝐞 ◁️❄️🕷️
┃ /𝐠𝐝𝐫𝐢𝐯𝐞 ◁️❄️🕷️ 
┃ /𝐬𝐡𝐚𝐳𝐚𝐦 ◁️❄️🕷️
┃ /𝐜𝐫𝐲𝐩𝐭𝐨 ◁️❄️🕷️ 
┃ /𝐬𝐜𝐚𝐧𝐪𝐫 ◁️❄️🕷️
┃ /𝐰𝐚𝐫𝐞𝐚𝐜𝐭 ◁️❄️🕷️
┃ /𝐰𝐚𝐩𝐨𝐥𝐥 ◁️❄️🕷️
┃ /𝐰𝐞𝐚𝐭𝐡𝐞𝐫 ◁️❄️🕷️
┃ /𝐜𝐡𝐚𝐭𝐛𝐨𝐭 ◁️❄️🕷️
┃ /𝐬𝐭𝐢𝐜𝐤𝐞𝐫 ◁️❄️🕷️
┃ /𝐭𝐢𝐧𝐲𝐮𝐫𝐥 ◁️❄️🕷️
┃ /𝐢𝐦𝐠𝐬𝐜𝐚𝐧 ◁️❄️🕷️
┃ /𝐟𝐞𝐭𝐜𝐡𝐢𝐝 ◁️❄️🕷️
┃ /𝐭𝐞𝐜𝐡𝐧𝐞𝐰𝐬 ◁️❄️🕷️
┃ /𝐞𝐧𝐜𝐫𝐲𝐩𝐭 ◁️❄️🕷️
┃ /𝐝𝐞𝐜𝐫𝐲𝐩𝐭 ◁️❄️🕷️
┃ /𝐫𝐞𝐦𝐨𝐯𝐞𝐛𝐠 ◁️❄️🕷️
┃ /𝐟𝐚𝐤𝐞𝐰𝐚𝐩𝐩 ◁️❄️🕷️
┃ /𝐥𝐢𝐯𝐞𝐬𝐜𝐨𝐫𝐞 ◁️❄️🕷️
┃ /𝐛𝐚𝐬𝐞𝟔𝟒 ◁️❄️🕷️
┃ /𝐡𝐚𝐬𝐡 ◁️❄️🕷️
┃ /𝐠𝐞𝐧𝐩𝐚𝐬𝐬 ◁️❄️🕷️
┃ /𝐮𝐮𝐢𝐝 ◁️❄️🕷️
┃ /𝐜𝐚𝐥𝐜 ◁️❄️🕷️
┃ /𝐦𝐨𝐫𝐬𝐞 ◁️❄️🕷️
┃ /𝐫𝐞𝐯𝐞𝐫𝐬𝐞 ◁️❄️🕷️
┃ /𝐭𝐫𝐚𝐧𝐬𝐥𝐚𝐭𝐞 ◁️❄️🕷️
┃ /𝐝𝐞𝐟𝐢𝐧𝐞 ◁️❄️🕷️
┃ /𝐚𝐯𝐚𝐭𝐚𝐫 ◁️❄️🕷️
┃ /𝐭𝐢𝐦𝐞𝐬𝐭𝐚𝐦𝐩 ◁️❄️🕷️
┃ /𝐜𝐨𝐥𝐨𝐫 ◁️❄️🕷️
┃ /𝐫𝐞𝐚𝐜𝐭 ◁️❄️🕷️
┃ /𝐬𝐩𝐨𝐢𝐥𝐞𝐫 ◁️❄️🕷️
┃ /𝐞𝐟𝐟𝐞𝐜𝐭 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

    groupMenu: `
╭━━━❄️【 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐛𝐚𝐧 ◁️❄️🕷️
┃ /𝐠𝐜𝐢𝐝 ◁️❄️🕷️
┃ /𝐮𝐧𝐛𝐚𝐧 ◁️❄️🕷️
┃ /𝐢𝐧𝐟𝐨 ◁️❄️🕷️
┃ /𝐰𝐞𝐥𝐜𝐨𝐦𝐞 ◁️❄️🕷️
┃ /𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤 ◁️❄️🕷️
┃ /𝐠𝐜𝐥𝐢𝐧𝐤 ◁️❄️🕷️
┃ /𝐝𝐞𝐥𝐞𝐭𝐞 ◁️❄️🕷️
┃ /𝐩𝐫𝐨𝐦𝐨𝐭𝐞 ◁️❄️🕷️
┃ /𝐝𝐞𝐦𝐨𝐭𝐞 ◁️❄️🕷️
┃ /𝐬𝐞𝐭𝐠𝐫𝐨𝐮𝐩 ◁️❄️🕷️
┃ /𝐬𝐞𝐭𝐠𝐜𝐢𝐧𝐟𝐨 ◁️❄️🕷️
┃ /𝐬𝐞𝐭𝐠𝐜𝐢𝐦𝐚𝐠𝐞 ◁️❄️🕷️
┃ /𝐥𝐨𝐜𝐤𝐠𝐜 ◁️❄️🕷️
┃ /𝐮𝐧𝐥𝐨𝐜𝐤𝐠𝐜 ◁️❄️🕷️
┃ /𝐧𝐞𝐰𝐭𝐨𝐩𝐢𝐜 ◁️❄️🕷️
┃ /𝐜𝐥𝐨𝐬𝐞𝐭𝐨𝐩𝐢𝐜 ◁️❄️🕷️
┃ /𝐫𝐞𝐨𝐩𝐞𝐧𝐭𝐨𝐩𝐢𝐜 ◁️❄️🕷️
┃ /𝐝𝐞𝐥𝐞𝐭𝐞𝐭𝐨𝐩𝐢𝐜 ◁️❄️🕷️
┃ /𝐫𝐞𝐧𝐚𝐦𝐞𝐭𝐨𝐩𝐢𝐜 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

mailMenu: `
╭━━━❄️【 𝗠𝗔𝗜𝗟 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐭𝐞𝐦𝐩𝐦𝐚𝐢𝐥 ◁️❄️🕷️
┃ /𝐜𝐡𝐞𝐜𝐤𝐦𝐚𝐢𝐥 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

gameMenu: `
╭━━━❄️【 𝗚𝗔𝗠𝗘 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐣𝐨𝐤𝐞 ◁️❄️🕷️
┃ /𝐭𝐢𝐜𝐭𝐚𝐜 ◁️❄️🕷️
┃ /𝟖𝐛𝐚𝐥𝐥 ◁️❄️🕷️
┃ /𝐝𝐢𝐜𝐞 ◁️❄️🕷️
┃ /𝐬𝐥𝐨𝐭 ◁️❄️🕷️
┃ /𝐛𝐚𝐬𝐤𝐞𝐭𝐛𝐚𝐥𝐥 ◁️❄️🕷️
┃ /𝐟𝐨𝐨𝐭𝐛𝐚𝐥𝐥 ◁️❄️🕷️
┃ /𝐝𝐚𝐫𝐭𝐬 ◁️❄️🕷️
┃ /𝐛𝐨𝐰𝐥𝐢𝐧𝐠 ◁️❄️🕷️
┃ /𝐜𝐨𝐢𝐧𝐟𝐥𝐢𝐩 ◁️❄️🕷️
┃ /𝐫𝐩𝐬 ◁️❄️🕷️
┃ /𝐫𝐢𝐝𝐝𝐥𝐞 ◁️❄️🕷️
┃ /𝐭𝐫𝐮𝐭𝐡 ◁️❄️🕷️
┃ /𝐝𝐚𝐫𝐞 ◁️❄️🕷️
┃ /𝐰𝐲𝐫 ◁️❄️🕷️
┃ /𝐭𝐫𝐢𝐯𝐢𝐚 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

stalkMenu: `
╭━━━❄️【 𝗦𝗧𝗔𝗟𝗞 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐢𝐠𝐬𝐭𝐚𝐥𝐤 ◁️❄️🕷️
┃ /𝐭𝐭𝐬𝐭𝐚𝐥𝐤 ◁️❄️🕷️
┃ /𝐠𝐢𝐭𝐬𝐭𝐚𝐥𝐤 ◁️❄️🕷️
┃ /𝐰𝐚𝐜𝐡𝐚𝐧𝐧𝐞𝐥 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

canvaMenu: `
╭━━━❄️【 𝗖𝗔𝗡𝗩𝗔 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐥𝐨𝐠𝐨 ◁️❄️🕷️
┃ /𝐥𝐨𝐠𝐨𝟐 ◁️❄️🕷️
┃ /𝐣𝐚𝐢𝐥 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

scrapeMenu: `
╭━━━❄️【 𝗦𝗖𝗥𝗔𝗣𝗘 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐰𝐞𝐛𝐬𝐜𝐫𝐚𝐩𝐞 ◁️❄️🕷️
┃ /𝐰𝐞𝐛𝐝𝐥 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

rentbotMenu: `
╭━━━❄️【 𝗥𝗘𝗡𝗧𝗕𝗢𝗧 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐜𝐡𝐞𝐜𝐤𝐫𝐞𝐧𝐭 ◁️❄️🕷️
┃ /𝐫𝐞𝐧𝐭𝐛𝐨𝐭 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

cryptoMenu: `
╭━━━❄️【 𝗖𝗥𝗬𝗣𝗧𝗢 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐩𝐧𝐥 ◁️❄️🕷️
┃ /𝐢𝐧𝐝𝐞𝐱 ◁️❄️🕷️
┃ /𝐭𝐫𝐞𝐧𝐝 ◁️❄️🕷️
┃ /𝐰𝐚𝐭𝐜𝐡 ◁️❄️🕷️
┃ /𝐭𝐫𝐚𝐝𝐞 ◁️❄️🕷️
┃ /𝐫𝐞𝐠𝐢𝐬𝐭𝐞𝐫 ◁️❄️🕷️
┃ /𝐜𝐫𝐲𝐩𝐭𝐨 ◁️❄️🕷️
┃ /𝐜𝐭𝐢𝐦𝐞𝐫 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,
religionMenu: `
╭━━━❄️【 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐛𝐢𝐛𝐥𝐞 ◁️❄️🕷️
┃ /𝐪𝐮𝐫𝐚𝐧 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

vtuMenu: `
╭━━━❄️【 𝗩𝗧𝗨 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐟𝐮𝐧𝐝 ◁️❄️🕷️ 
┃ /𝐛𝐚𝐥𝐚𝐧𝐜𝐞 ◁️❄️🕷️
┃ /𝐚𝐢𝐫𝐭𝐢𝐦𝐞 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`,

    aiMenu: `
╭━━━❄️【 𝗢𝗧𝗛𝗘𝗥 𝗠𝗘𝗡𝗨 】❄️━━━╮
┃ /𝐜𝐥𝐚𝐢𝐦𝐚𝐥𝐥 ◁️❄️🕷️
┃ /𝐚𝐜𝐜𝐬𝐭𝐚𝐭𝐬 ◁️❄️🕷️
┃ /𝐜𝐫𝐞𝐚𝐭𝐞𝐚𝐜𝐜 ◁️❄️🕷️
╰━━━━━━━━━━━━━━━━━━━━━╯`
});

botClients.forEach((EsTeams, esteams) => {
// Start command
EsTeams.onText(/\/start/, async (msg) => { 
  const chatId = msg.chat.id;

  const users = await readUsers(); 
  if (!users.includes(chatId)) {
    await saveUser(chatId);
  }

    const imageUrl = 'https://files.catbox.moe/3jibot.jpg';
    const currentDate = getCurrentDate();
    const currentTime = getCurrentTime();
    const messages = getMessages(currentDate, currentTime); 
    
    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    // mainMenu is defined once, outside this handler, in the hoisted block
    // below - reused here via closure so /start doesn't need its own copy.
    EsTeams.sendPhoto(chatId, imageUrl, {
        caption: messages.mainMenu + messages.ownerMenu + messages.userMenu,
        parse_mode: 'Markdown',
        reply_markup: mainMenu.reply_markup
    });
});

// Menu keyboards + the menu-navigation callback_query handler are registered
// once here (outer scope), not inside onText("/start") above - registering
// them per /start call was stacking a fresh duplicate listener on every
// /start, so every button tap re-ran once per accumulated listener.
    const mainMenu = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📂 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗠𝗘𝗡𝗨", callback_data: "open_menu", style: "primary" }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }],
                [{ text: "📺 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://YouTube.com/@esteams", style: "primary" }],
                [{ text: "💬 𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://t.me/esteams_btc", style: "primary" }],
                [{ text: "⚙️ 𝗚𝗜𝗧𝗛𝗨𝗕 𝗥𝗘𝗣𝗢", url: "https://GitHub.com/paskito002/ES_TEAMS-V1", style: "primary" }],
                [{ text: "📞  𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗢𝗪𝗡𝗘𝗥", url: "https://t.me/examsolutionteam", style: "primary" }]
            ]
        }
    };

    const expandedMenu = {
  reply_markup: {
    inline_keyboard: [
           [
        { text: "🎞️ 𝗠𝗘𝗗𝗜𝗔 𝗠𝗘𝗡𝗨", callback_data: "media_menu", style: "success" },
        { text: "🛜️ 𝗩𝗧𝗨 𝗠𝗘𝗡𝗨", callback_data: "vtu_menu", style: "success" }
      ],
      
       [
        { text: "🛐 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡 𝗠𝗘𝗡𝗨", callback_data: "religion_menu", style: "success" },
        { text: "🏛️ 𝗟𝗜𝗕𝗥𝗔𝗥𝗬 𝗠𝗘𝗡𝗨", callback_data: "library_menu", style: "success" }
      ],
      
      [
        { text: "👥 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨", callback_data: "group_menu", style: "success" },
        { text: "🏷️ 𝗥𝗘𝗡𝗧𝗕𝗢𝗧 𝗠𝗘𝗡𝗨", callback_data: "rentbot_menu", style: "success" }
      ],

      [
        { text: "📨 𝗠𝗔𝗜𝗟 𝗠𝗘𝗡𝗨", callback_data: "mail_menu", style: "success" },
        { text: "🛠 𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨", callback_data: "tools_menu", style: "success" }
      ],
      
       [
        { text: "🎨 𝗖𝗔𝗡𝗩𝗔 𝗠𝗘𝗡𝗨", callback_data: "canva_menu", style: "success" },
        { text: "🧲 𝗦𝗖𝗥𝗔𝗣𝗘 𝗠𝗘𝗡𝗨", callback_data: "scrape_menu", style: "success" }
      ],

      [
        { text: "🪙 𝗖𝗥𝗬𝗣𝗧𝗢 𝗠𝗘𝗡𝗨", callback_data: "crypto_menu", style: "success" },
        { text: "👀 𝗦𝗧𝗔𝗟𝗞 𝗠𝗘𝗡𝗨", callback_data: "stalk_menu", style: "success" }
      ],
      
      [
        { text: "🌸 𝗚𝗔𝗠𝗘 𝗠𝗘𝗡𝗨", callback_data: "game_menu", style: "success" },
        { text: "🕗 𝗢𝗧𝗛𝗘𝗥 𝗠𝗘𝗡𝗨", callback_data: "other_menu", style: "success" }
      ],

      [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "close_menu", style: "danger" }]
    ]
  }
};

    const downloadMenu = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📂 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗠𝗘𝗡𝗨", callback_data: "open_menu", style: "primary" }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }],
                [{ text: "📺 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://YouTube.com/@esteams", style: "primary" }],
                [{ text: "💬 𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://t.me/esteams_btc", style: "primary" }],
                [{ text: "⚙️ 𝗚𝗜𝗧𝗛𝗨𝗕 𝗥𝗘𝗣𝗢", url: "https://GitHub.com/paskito002/ES_TEAMS-V1", style: "primary" }],
                [{ text: "📞  𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗢𝗪𝗡𝗘𝗥", url: "https://t.me/examsolutionteam", style: "primary" }]
            ]
        }
    };
    
    const toolsMenu = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📂 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗠𝗘𝗡𝗨", callback_data: "open_menu", style: "primary" }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }],
                [{ text: "📺 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://YouTube.com/@esteams", style: "primary" }],
                [{ text: "💬 𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://t.me/esteams_btc", style: "primary" }],
                [{ text: "⚙️ 𝗚𝗜𝗧𝗛𝗨𝗕 𝗥𝗘𝗣𝗢", url: "https://GitHub.com/paskito002/ES_TEAMS-V1", style: "primary" }],
                [{ text: "📞  𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗢𝗪𝗡𝗘𝗥", url: "https://t.me/examsolutionteam", style: "primary" }]
            ]
        }
    };
    
    const groupMenu = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📂 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗠𝗘𝗡𝗨", callback_data: "open_menu", style: "primary" }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }],
                [{ text: "📺 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://YouTube.com/@esteams", style: "primary" }],
                [{ text: "💬 𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://t.me/esteams_btc", style: "primary" }],
                [{ text: "⚙️ 𝗚𝗜𝗧𝗛𝗨𝗕 𝗥𝗘𝗣𝗢", url: "https://GitHub.com/paskito002/ES_TEAMS-V1", style: "primary" }],
                [{ text: "📞  𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗢𝗪𝗡𝗘𝗥", url: "https://t.me/examsolutionteam", style: "primary" }]
            ]
        }
    };
    
    const aiMenu = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📂 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗠𝗘𝗡𝗨", callback_data: "open_menu", style: "primary" }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }],
                [{ text: "📺 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://YouTube.com/@esteams", style: "primary" }],
                [{ text: "💬 𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://t.me/esteams_btc", style: "primary" }],
                [{ text: "⚙️ 𝗚𝗜𝗧𝗛𝗨𝗕 𝗥𝗘𝗣𝗢", url: "https://GitHub.com/paskito002/ES_TEAMS-V1", style: "primary" }],
                [{ text: "📞  𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗢𝗪𝗡𝗘𝗥", url: "https://t.me/examsolutionteam", style: "primary" }]
            ]
        }
    };

    // (the initial /start reply itself lives in the onText("/start") handler
    // above, since it needs a per-request date/time - only the shared menu
    // keyboards and navigation handler are hoisted out to here)

    // Telegram limits photo captions to 1024 characters. Some section menus
    // (e.g. TOOLS, GROUP) build a caption longer than that, which makes
    // editMessageCaption reject silently so the menu appears unresponsive.
    // This helper edits the caption in place when it fits, and otherwise
    // sends the content as a normal text message (4096-char limit) so the
    // section still responds like every other menu.
    const TELEGRAM_CAPTION_LIMIT = 1024;
    const showSectionMenu = (chatId, messageId, caption, replyMarkup) => {
        if (caption.length <= TELEGRAM_CAPTION_LIMIT) {
            return EsTeams.editMessageCaption(caption, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: replyMarkup
            }).catch((err) => {
                // "message is not modified" means the section is already showing
                // (e.g. a duplicate tap on the same button) - there's nothing to
                // fix, so just ignore it instead of sending a duplicate message.
                const desc = err?.response?.body?.description || err?.message || "";
                if (desc.includes("message is not modified")) return;
                return EsTeams.sendMessage(chatId, caption, {
                    parse_mode: "Markdown",
                    reply_markup: replyMarkup
                });
            });
        }
        return EsTeams.sendMessage(chatId, caption, {
            parse_mode: "Markdown",
            reply_markup: replyMarkup
        });
    };

    EsTeams.on("callback_query", (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const userId = query.from.id;

    // This handler now runs outside the per-start scope (see fix below),
    // so it no longer closes over a stale messages object from whenever
    // start last ran - compute a fresh one on every tap instead.
    const messages = getMessages(getCurrentDate(), getCurrentTime());

    // Acknowledge the tap immediately so Telegram clears the button's
    // loading spinner right away. Without this, the tap looks like it did
    // nothing for a moment and people re-tap - each re-tap is a brand new
    // callback_query that re-runs this whole handler, which is what was
    // causing the menu to be sent multiple times.
    EsTeams.answerCallbackQuery(query.id).catch(() => {});

    // Ignore a repeat tap on the exact same button in the exact same chat
    // that arrives within 2s of the last one (double-taps / slow network
    // retries), so it can't trigger a second send/edit.
    const dedupeKey = `${chatId}:${data}`;
    const now = Date.now();
    if (!EsTeams._menuTapAt) EsTeams._menuTapAt = new Map();
    const lastTap = EsTeams._menuTapAt.get(dedupeKey);
    if (lastTap && now - lastTap < 2000) return;
    EsTeams._menuTapAt.set(dedupeKey, now);

        if (data === "open_menu") {
            
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }

            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.userMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: expandedMenu.reply_markup
            });
        } else if (data === "close_menu") {
            
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.userMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
        } else if (data === "canva_menu") {
            
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.canvaMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
      } else if (data === "stalk_menu") {
            
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.stalkMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
     } else if (data === "game_menu") {
            
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            showSectionMenu(chatId, messageId, messages.mainMenu + messages.ownerMenu + messages.gameMenu, mainMenu.reply_markup);
        } else if (data === "scrape_menu") {
            
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.scrapeMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
        } else if (data === "media_menu") {
        
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.mediaMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: downloadMenu.reply_markup
            });
            } else if (data === "vtu_menu") {
        
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.vtuMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: downloadMenu.reply_markup
            });
        } else if (data === "tools_menu") {
        
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            showSectionMenu(chatId, messageId, messages.mainMenu + messages.ownerMenu + messages.toolsMenu, toolsMenu.reply_markup);
         } else if (data === "group_menu") {
             
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            showSectionMenu(chatId, messageId, messages.mainMenu + messages.ownerMenu + messages.groupMenu, groupMenu.reply_markup);
           } else if (data === "religion_menu") {
               
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.religionMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: groupMenu.reply_markup
            });
          } else if (data === "mail_menu") {
              
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.mailMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
            } else if (data === "rentbot_menu") {
            
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.rentbotMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
             } else if (data === "crypto_menu") {
                
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.cryptoMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
         } else if (data === "other_menu") {
             
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.aiMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: groupMenu.reply_markup
            });
        } else if (data === "end_menu") {
         
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(query.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
            EsTeams.sendMessage(query.from.id, { parse_mode: "Markdown" });
        }
    }); 

//COURSE MENU 
EsTeams.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id; 
  const data = callbackQuery.data;

  if (data === "library_menu") {
    await EsTeams.answerCallbackQuery(callbackQuery.id);

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
      return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    const courseKeyboard = {
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: false,
        keyboard: [
          [{ text: "🕹️ 𝗕𝗢𝗧 𝗣𝗔𝗡𝗘𝗟" }],
          [{ text: "⚠️ 𝗙𝗔𝗞𝗘 𝗕𝗔𝗡𝗞 𝗔𝗟𝗘𝗥𝗧" }],
          [{ text: "💭 𝗙𝗔𝗞𝗘 𝗘𝗠𝗔𝗜𝗟" }],
          [{ text: "🎁 𝗚𝗜𝗩𝗘𝗔𝗪𝗔𝗬" }],
          [{ text: "🏢 𝗢𝗡𝗟𝗜𝗡𝗘 𝗝𝗢𝗕" }],
          [{ text: "🐟 𝗣𝗛𝗜𝗦𝗛𝗜𝗡𝗚 𝗟𝗜𝗡𝗞" }],
          [{ text: "🕵️‍♂️ 𝗦𝗣𝗬 𝗔𝗣𝗣" }],
          [{ text: "☣️ 𝗩𝗜𝗥𝗨𝗦 𝗖𝗥𝗔𝗦𝗛 𝗔𝗣𝗣" }],
          [{ text: "🪀 𝗪𝗔 𝗙𝗔𝗞𝗘 𝗖𝗛𝗔𝗧" }],
          [{ text: "📺 𝗬𝗧 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗕𝗬𝗣𝗔𝗦𝗦" }],
          [{ text: "📁 𝗔𝗥𝗖𝗛𝗜𝗩𝗘" }, { text: "🏠 𝗛𝗢𝗠𝗘" }]
        ]
      }
    };

    return EsTeams.sendMessage(chatId, "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗟𝗜𝗕𝗥𝗔𝗥𝗬\n\nChoose a Course category below:", courseKeyboard);
  }
});

EsTeams.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
 
//FAKE EMAIL COURSE
  if (text === "💭 𝗙𝗔𝗞𝗘 𝗘𝗠𝗔𝗜𝗟") {
     
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗢𝗨𝗥𝗦𝗘𝗦\n\n📚 Title: How To Create A Fake Email Address\n\n⚠️ ƭɦเร ϲουяѕє ωιℓℓ gυι∂є γου οи нοω το ϲяєατє α τємροяαяγ ємαιℓ α∂∂яєѕѕ ιи 5 мιиѕ\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔍 𝗩𝗜𝗘𝗪 𝗖𝗢𝗨𝗥𝗦𝗘", url: "https://drive.google.com/file/d/18PWTaMb8z9P2QBFoLI48OP3IBP1LI_PE/view?usp=drivesdk" }
          ],
          [
            { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }
          ]
        ]
      },
      parse_mode: "Markdown"
    };

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      ...buttons
    });
  }
  
// ONLINE JOB COMMAND
if (text === "🏢 𝗢𝗡𝗟𝗜𝗡𝗘 𝗝𝗢𝗕") {
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId,
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }

  const isPremium = fs.readFileSync("esteamspro.json").includes(msg.from.id.toString());
  const status = isPremium ? "Premium" : "Not Premium";

  EsTeams.sendPhoto(chatId, "https://i.ibb.co/RpgD4B2r/ONLINE-JOB.jpg", {
    caption: `*𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗝𝗢𝗕*\n\n*𝗦𝘁𝗮𝘁𝘂𝘀:* ${status}`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎁 𝗚𝗘𝗧 𝗙𝗥𝗘𝗘 𝗡𝗚𝗡 𝟭𝟲,𝟯𝟬𝟬", callback_data: `get_free:${msg.from.id}` }],
        [{ text: "📸 𝗧𝗘𝗦𝗧𝗜𝗠𝗢𝗡𝗜𝗔𝗟𝗦", url: "https://i.ibb.co/XkZZqNLw/PROVE.jpg" }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });
}

EsTeams.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const data = query.data;
    
    EsTeams.answerCallbackQuery(query.id);

    if (data && data.startsWith("get_free")) {
      const userIdFromData = data.split(":")[1];

      await EsTeams.deleteMessage(chatId, msgId);

      const isPremiumUser = fs.readFileSync("esteamspro.json").includes(userIdFromData);

      if (!isPremiumUser) {
        return EsTeams.sendPhoto(chatId, "https://i.ibb.co/RpgD4B2r/ONLINE-JOB.jpg", {
          caption: "❌ *𝗬𝗢𝗨 𝗔𝗥𝗘 𝗡𝗢𝗧 𝗣𝗥𝗘𝗠𝗜𝗨𝗠*\n\nPlease use /pay to subscribe for Premium access.",
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
          }
        });
      }

      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `*𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗢𝗡𝗟𝗜𝗡𝗘 𝗝𝗢𝗕*\n\nBefore proceeding to login, please watch the guide tutorials.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔑 𝗟𝗢𝗚𝗜𝗡", url: "https://www.luno.com/invite/48TJQN" }],
            [{ text: "🎥 𝗛𝗢𝗪 𝗧𝗢 𝗨𝗦𝗘", url: "https://drive.google.com/file/d/1KawO7TSp4q-0aL3oCJw0fdMY1ldVRe2b/view?usp=drivesdk" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }
  } catch (err) {
    console.error("Callback Handler Error:", err);
  }
});

// GIVEAWAY COMMAND
if (text === "🎁 𝗚𝗜𝗩𝗘𝗔𝗪𝗔𝗬") {
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId,
      "❌ 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗\n\nKindly Check back later ...",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }
            ]
          ]
        }
      }
    );
  }

  const caption = `🎉 *𝗚𝗜𝗩𝗘𝗔𝗪𝗔𝗬 𝗔𝗟𝗘𝗥𝗧*\n\n𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗚𝗜𝗩𝗘𝗔𝗪𝗔𝗬\n\n💎 *FREE CANVA PRO ACCESS*\n\n🔰 𝗦𝘁𝗲𝗽𝘀:\n\n1️⃣ 𝗝𝗼𝗶𝗻 𝗼𝘂𝗿 𝗴𝗿𝗼𝘂𝗽\n2️⃣ 𝗧𝗮𝗽 𝗩𝗘𝗥𝗜𝗙𝗬 𝗮𝗳𝘁𝗲𝗿 𝗝𝗼𝗶𝗻𝗶𝗻𝗴\n\nLet's get you started!`;

  const buttons = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔗 𝗝𝗢𝗜𝗡 𝗚𝗥𝗢𝗨𝗣", url: "https://t.me/esteams_btc" }],
        [{ text: "✅ 𝗩𝗘𝗥𝗜𝗙𝗬", callback_data: `verify_${msg.from.id}` }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    },
    parse_mode: "Markdown"
  };

  return EsTeams.sendPhoto(chatId, botImageUrl, {
    caption,
    ...buttons
  });
}

// GIVEAWAY VERIFY HANDLER
EsTeams.on("callback_query", async (query) => {
  const data = query.data;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;

  if (data.startsWith("verify_")) {
    const targetUserId = data.split("_")[1];

    if (userId.toString() !== targetUserId) {
      return EsTeams.answerCallbackQuery(query.id, { text: "This is not for you!", show_alert: true });
    }

    try {
      const member = await EsTeams.getChatMember("-1002408064092", userId);

      if (["member", "creator", "administrator"].includes(member.status)) {
        const canvaCaption = `🎨 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗖𝗔𝗡𝗩𝗔 𝗣𝗥𝗢\n\nYou are now eligible to join the Canva Pro Team!\n\nTap the button below to access the exclusive team.`;

        const canvaButtons = {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🎨 𝗝𝗢𝗜𝗡 𝗧𝗘𝗔𝗠", url: "https://www.canva.com/brand/join?token=FSrpCXVTnGVJjyYPy0naTg&referrer=team-invite" }],
              [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
          },
          parse_mode: "Markdown"
        };

        const canvaImageUrl = "https://files.catbox.moe/r8rv97.jpg";

        await EsTeams.deleteMessage(chatId, messageId);
        return EsTeams.sendPhoto(chatId, canvaImageUrl, {
          caption: canvaCaption,
          ...canvaButtons
        });

      } else {
        await EsTeams.answerCallbackQuery(query.id, { text: "⚠️ Please join the group first.", show_alert: true });
      }

    } catch (err) {
      console.log(err.message);
      await EsTeams.answerCallbackQuery(query.id, { text: "⚠️ Error verifying. Please try again.", show_alert: true });
    }
  }
});

//FREE BOT PANEL
  if (text === "🕹️ 𝗕𝗢𝗧 𝗣𝗔𝗡𝗘𝗟") {
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId,
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }

  const caption = `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗙𝗥𝗘𝗘 𝗣𝗔𝗡𝗘𝗟𝗦\n\nPlease make sure you click on *TUTORIAL GUIDE* before Creating a Panel.`;

  const buttons = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📝 𝗖𝗥𝗘𝗔𝗧𝗘 𝗔 𝗣𝗔𝗡𝗘𝗟", url: "https://dashboard.katabump.com/auth/login#edfb0f" }],
        [{ text: "👤 𝗟𝗢𝗚𝗜𝗡 𝗧𝗢 𝗣𝗔𝗡𝗘𝗟", url: "https://control.katabump.com/" }],
        [{ text: "📚 𝗧𝗨𝗧𝗢𝗥𝗜𝗔𝗟 𝗚𝗨𝗜𝗗𝗘", url: "https://drive.google.com/file/d/1IgWF1ronh0z_YmfVW4b-VHvf1uKB6gaD/view?usp=drivesdk" }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    },
    parse_mode: "Markdown"
  };

  return EsTeams.sendPhoto(chatId, botImageUrl, {
    caption,
    ...buttons
  });
}

//SPY APP  COURSE
  if (text === "🕵️‍♂️ 𝗦𝗣𝗬 𝗔𝗣𝗣") {

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗢𝗨𝗥𝗦𝗘𝗦\n\n📚 Title: How To Create A Phone Spy App\n\n⚠️ ƭɦเร ϲουяѕє αℓℓσωร ყσµ ƭσ ɾεα∂ αℓℓ ɱεรรαɠεร αɳ∂ ɳσƭเƒเcαƭเσɳร ωเƭɦσµƭ αccεรร ƭσ ѵเcƭเɱร ρɦσɳεร\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔍 𝗩𝗜𝗘𝗪 𝗖𝗢𝗨𝗥𝗦𝗘", url: "https://youtube.com/shorts/L9XGX8OsdyE?si=IXMhghVd4IztlZXQ" }
          ],
          [
            { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }
          ]
        ]
      },
      parse_mode: "Markdown"
    };

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      ...buttons
    });
  }

//FAKE BANK TRANSFER COURSE
  if (text === "⚠️ 𝗙𝗔𝗞𝗘 𝗕𝗔𝗡𝗞 𝗔𝗟𝗘𝗥𝗧") {
      
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗢𝗨𝗥𝗦𝗘𝗦\n\n📚 Title: How To Create A Fake Bank Receipt\n\n⚠️ ƭɦเร ѵι∂єο ωιℓℓ яє∂ιяєϲτ γου το ωнєяє γου ωιℓℓ ϐє αϐℓє το gєиєяατє ƒακє ϐαиκ яєϲєιρτѕ ƒοя ƒяєє\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔍 𝗩𝗜𝗘𝗪 𝗖𝗢𝗨𝗥𝗦𝗘", url: "https://sub2unlock.me/fq0MbWz" }
          ],
          [
            { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }
          ]
        ]
      },
      parse_mode: "Markdown"
    };

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      ...buttons
    });
  }
  
  //PHISHING LINK COURSE
  if (text === "🐟 𝗣𝗛𝗜𝗦𝗛𝗜𝗡𝗚 𝗟𝗜𝗡𝗞") {
      
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗢𝗨𝗥𝗦𝗘𝗦\n\n📚 Title: How To Create A Phishing Link\n\n⚠️ ƭɦเร ѵι∂єο ωιℓℓ gυι∂є γου οи нοω το ϲяҽατє α ℓιиκ ωнιϲн ϲαи єϰτяαϲτ νιϲτιмѕ ιиƒο ℓοϲαℓℓγ\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔍 𝗩𝗜𝗘𝗪 𝗖𝗢𝗨𝗥𝗦𝗘", url: "https://youtube.com/shorts/STtcNywjAT4?si=2Kv4JS3iXLxjt69a" }
          ],
          [
            { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }
          ]
        ]
      },
      parse_mode: "Markdown"
    };

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      ...buttons
    });
  }

//WA FAKE CHAT COURSE
  if (text === "🪀 𝗪𝗔 𝗙𝗔𝗞𝗘 𝗖𝗛𝗔𝗧") {
      
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗢𝗨𝗥𝗦𝗘𝗦\n\n📚 Title: How To Create A WhatsApp Fake Time Chat\n\nPin: RATED X ES TEAMS\n\n⚠️ ƭɦเร ƭσσℓ เร σɳℓყ ƒσɾ ε∂µcαƭเσɳαℓ ρµɾρσรε αɳ∂ ∂σ ɳσƭ µรε เƭ ƒσɾ ƒɾαµ∂\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔍 𝗩𝗜𝗘𝗪 𝗖𝗢𝗨𝗥𝗦𝗘", url: "https://drive.google.com/file/d/1y3tJZFjTnvLlXqTAyiK4VfaXOOSiKdZY/view?usp=drivesdk" }
          ],
          [
            { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }
          ]
        ]
      },
      parse_mode: "Markdown"
    };

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      ...buttons
    });
  }
  
  //VIRUS COURSE
  if (text === "☣️ 𝗩𝗜𝗥𝗨𝗦 𝗖𝗥𝗔𝗦𝗛 𝗔𝗣𝗣") {
      
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗢𝗨𝗥𝗦𝗘𝗦\n\n📚 Title: How To Create A Deadly Mod Virus App\n\n⚠️ ƭɦเร ƭσσℓ เร σɳℓყ ƒσɾ ε∂µcαƭเσɳαℓ ρµɾρσรε αɳ∂ ∂σ ɳσƭ µรε เƭ ƒσɾ ƒɾαµ∂\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔍 𝗩𝗜𝗘𝗪 𝗖𝗢𝗨𝗥𝗦𝗘", url: "https://drive.google.com/file/d/1uPRQ-JtNAbN0hNmtwEO1mTO5wS70eR5S/view?usp=drivesdk" }
          ],
          [
            { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }
          ]
        ]
      },
      parse_mode: "Markdown"
    };

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      ...buttons
    });
  }
  
  //YOUTUBE PREMIUM BYPASS COURSE
  if (text === "📺 𝗬𝗧 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗕𝗬𝗣𝗔𝗦𝗦") {
     
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗢𝗨𝗥𝗦𝗘𝗦\n\n📚 Title: How To ByPass YouTube Premium\n\nPin: ESTEAMS00\n\n⚠️ ƭɦเร ϲουяѕє ωιℓℓ gυι∂є γου οи нοω το υѕє τнє οℓ∂ ραγмєиτ αмουиτ ιиѕτєα∂ οƒ τнє иєω ιиϲяєαѕє∂ ρяємιυм αмουиτ\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔍 𝗩𝗜𝗘𝗪 𝗖𝗢𝗨𝗥𝗦𝗘", url: "https://drive.google.com/file/d/1-uDqBk5AQVJ8rAWLvyqX2eEwxGkbKG17/view?usp=drivesdk" }
          ],
          [
            { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }
          ]
        ]
      },
      parse_mode: "Markdown"
    };

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      ...buttons
    });
  }
  
  // Close Menu
  if (text === "📁 𝗔𝗥𝗖𝗛𝗜𝗩𝗘") {
      
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
    return EsTeams.sendMessage(chatId, "Library closed.", {
      reply_markup: {
        remove_keyboard: true
      }
    });
  }

//BACK TO TOP
if (text === "🏠 𝗛𝗢𝗠𝗘") {
    
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, 
      "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", 
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }
  
const topKeyboard = {
reply_markup: {
resize_keyboard: true,
one_time_keyboard: false,
keyboard: [
          [{ text: "🕹️ 𝗕𝗢𝗧 𝗣𝗔𝗡𝗘𝗟" }],
          [{ text: "⚠️ 𝗙𝗔𝗞𝗘 𝗕𝗔𝗡𝗞 𝗔𝗟𝗘𝗥𝗧" }],
          [{ text: "💭 𝗙𝗔𝗞𝗘 𝗘𝗠𝗔𝗜𝗟" }],
          [{ text: "🎁 𝗚𝗜𝗩𝗘𝗔𝗪𝗔𝗬" }],
          [{ text: "🏢 𝗢𝗡𝗟𝗜𝗡𝗘 𝗝𝗢𝗕" }],
          [{ text: "🐟 𝗣𝗛𝗜𝗦𝗛𝗜𝗡𝗚 𝗟𝗜𝗡𝗞" }],
          [{ text: "🕵️‍♂️ 𝗦𝗣𝗬 𝗔𝗣𝗣" }],
          [{ text: "☣️ 𝗩𝗜𝗥𝗨𝗦 𝗖𝗥𝗔𝗦𝗛 𝗔𝗣𝗣" }],
          [{ text: "🪀 𝗪𝗔 𝗙𝗔𝗞𝗘 𝗖𝗛𝗔𝗧" }],
          [{ text: "📺 𝗬𝗧 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗕𝗬𝗣𝗔𝗦𝗦" }],
          [{ text: "📁 𝗔𝗥𝗖𝗛𝗜𝗩𝗘" }, { text: "🏠 𝗛𝗢𝗠𝗘" }]
]
}
};

return EsTeams.sendMessage(chatId, "Returned to Top Shelf...", topKeyboard);

}
});

// Url command
EsTeams.onText(/^\/url$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    if (!msg.reply_to_message || !msg.reply_to_message.photo) {
        return EsTeams.sendMessage(chatId, "*Invalid Input*\n\nPlease reply to an image with `/url`.", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    const fileId = msg.reply_to_message.photo.pop().file_id;
    const waitingMsg = await EsTeams.sendMessage(chatId, "Processing URL. Please hold on...");

    try {
        const fileUrl = await EsTeams.getFileLink(fileId);

        const response = await fetch(fileUrl);
        const buffer = await response.buffer();
        const imagePath = path.join('ES_TEAMS-MEDIA/image', `${userId}.jpg`);
        fs.writeFileSync(imagePath, buffer);

        const formData = new FormData();
        formData.append("fileToUpload", fs.createReadStream(imagePath));
        formData.append("reqtype", "fileupload");

        const uploadRes = await fetch("https://catbox.moe/user/api.php", {
            method: "POST",
            body: formData
        });

        const catboxUrl = await uploadRes.text();

        await EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: `*𝐄𝐒 𝐓𝐄𝐀𝐌𝐒 𝐕𝟏 𝐔𝐑𝐋 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐎𝐑*`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        { 
                            text: "📎 𝗖𝗢𝗣𝗬 𝗨𝗥𝗟", 
                            copy_text: { text: catboxUrl } 
                        }
                    ],
                    [
                        { 
                            text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", 
                            url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", 
                            style: "primary" 
                        }
                    ]
                ]
            }
        });

        fs.unlinkSync(imagePath);

    } catch (error) {
        console.error("URL Generation Error:", error);
        await EsTeams.editMessageText(chatId, waitingMsg.message_id, "⚠️ *An error occurred while generating the URL. Please try again.*", {
            parse_mode: "Markdown"
        });
    }
});

//Shazam Command
EsTeams.onText(/^\/shazam$/, async (msg) => {
    const chatId = msg.chat.id;
    const botImage = "https://files.catbox.moe/3jibot.jpg"; 

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    if (!msg.reply_to_message || (!msg.reply_to_message.audio && !msg.reply_to_message.video)) {
        return EsTeams.sendPhoto(chatId, botImage, {
            caption: "Reply to an audio or video file to analyze it!",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    const file = msg.reply_to_message.audio || msg.reply_to_message.video;
    const fileType = msg.reply_to_message.audio ? "audio" : "video";

    if ((fileType === "audio" && file.file_size > 10 * 1024 * 1024) ||
        (fileType === "video" && file.file_size > 20 * 1024 * 1024)) {
        return EsTeams.sendPhoto(chatId, botImage, {
            caption: `The ${fileType} file must not exceed ${fileType === "audio" ? "10MB" : "20MB"} for analysis.`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    const waitingMessage = await EsTeams.sendPhoto(chatId, botImage, {
        caption: "Please wait, processing your content..."
    });

    try {
        const filePath = await EsTeams.downloadFile(file.file_id, `ES_TEAMS-MEDIA/${fileType}`);

        const formData = new FormData();
        formData.append("audio", fs.createReadStream(filePath));

        const response = await fetch("https://draculazyx-xyzdrac.hf.space/api/Shazam", {
            method: "POST",
            body: formData
        });

        const apiResponse = await response.json();

        if (!apiResponse || apiResponse.STATUS !== 200 || !apiResponse.song) {
            return EsTeams.sendPhoto(chatId, botImage, {
                caption: "No match found for this content.",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const song = apiResponse.song || "Unknown";
        const artist = apiResponse.artist || "Unknown";
        const album = apiResponse.album || "Unknown";
        const releaseDate = apiResponse.release_date || "Unknown";
        const isrc = apiResponse.spotify?.external_ids?.isrc || apiResponse.apple_music?.isrc || "N/A";
        let image = apiResponse.spotify?.album?.images?.[0]?.url || null;

        if (!image && apiResponse.apple_music?.artwork?.url) {
            image = apiResponse.apple_music.artwork.url.replace("{w}", "640").replace("{h}", "640");
        }

        let duration = apiResponse.spotify?.duration_ms || apiResponse.apple_music?.durationInMillis || null;
        if (duration) {
            const minutes = Math.floor(duration / 60000);
            const seconds = ((duration % 60000) / 1000).toFixed(0);
            duration = `${minutes}:${seconds.padStart(2, "0")}`;
        } else {
            duration = "Unknown";
        }

        let songInfo = `🎵 Song: ${song}\n👨‍🎤 Artist: ${artist}\n📀 Album: ${album}\n📅 Release Date: ${releaseDate}\n⏳ Duration: ${duration}\n🔖 ISRC: ${isrc}`;

        if (image) {
            await EsTeams.sendPhoto(chatId, image, {
                caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗔𝗡𝗔𝗟𝗬𝗭𝗘𝗥\n\n${songInfo}`,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        } else {
            await EsTeams.sendPhoto(chatId, botImage, {
                caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗔𝗡𝗔𝗟𝗬𝗭𝗘𝗥\n\n${songInfo}\𝗻\𝗻 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        fs.unlinkSync(filePath);
    } catch (err) {
        console.error("Error in /shazam command:", err);
        EsTeams.sendPhoto(chatId, botImage, {
            caption: "An error occurred while processing your request.",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

//Twitter Command
EsTeams.onText(/^\/twitter (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const videoUrl = match[1];
    
    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}


    const sentMessage = await EsTeams.sendMessage(chatId, "🎥 Fetching Twitter video. Please hold on...", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });

    try {
        const data = await esApiGet("/api/v1/dev/twitter", { url: videoUrl });

        if (!data.download_url) {
            return EsTeams.editMessageText("⚠️ Invalid or unsupported Twitter URL. Please try another.", {
                chat_id: chatId,
                message_id: sentMessage.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗣𝗥𝗢 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                    ]
                }
            });
        }

        const videoPath = `ES_TEAMS-MEDIA/video/${chatId}.mp4`;
        const videoResponse = await fetch(data.download_url);
        const videoBuffer = await videoResponse.arrayBuffer();
        const videoSizeMB = videoBuffer.byteLength / (1024 * 1024);

        if (videoSizeMB > 10) {
            return EsTeams.editMessageText("⚠️ Video file is too large (Limit: 10MB). Try another.", {
                chat_id: chatId,
                message_id: sentMessage.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        fs.writeFileSync(videoPath, Buffer.from(videoBuffer));

        const caption = `*𝐄𝐒 𝐓𝐄𝐀𝐌𝐒 𝐕𝟏 𝐓𝐖𝐈𝐓𝐓𝐄𝐑 𝐃𝐎𝗪𝐍𝐋𝐎𝐀𝐃𝐄𝐑*\n\n📥 Downloading your video...\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`;

        await EsTeams.sendPhoto(chatId, data.thumbnail, {
            caption,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

        await EsTeams.sendVideo(chatId, videoPath, {
            caption: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ",
            parse_mode: "Markdown"
        });

        fs.unlinkSync(videoPath);

        EsTeams.deleteMessage(chatId, sentMessage.message_id);

    } catch (error) {
        console.error("Twitter API Error:", error);
        EsTeams.editMessageText("⚠️ Error fetching Twitter video. Please try again later.", {
            chat_id: chatId,
            message_id: sentMessage.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

//============== /LYRICS COMMAND ==============//
EsTeams.onText(/\/lyrics(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const songQuery = match[1]?.trim();

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
  
  if (!songQuery) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "🎵 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗟𝗬𝗥𝗜𝗖𝗦 𝗦𝗘𝗔𝗥𝗖𝗛*\n\nInvalid Input\n\nPlease use `/lyrics <song name>`.",
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: waButton }
    });
  }

  const waitMsg = await EsTeams.sendMessage(chatId, "🎶 Fetching lyrics. Please hold on...", {
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: waButton }
  });

  try {
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(songQuery)}&limit=1&entity=song`;
    const itRes = await axios.get(itunesUrl, { timeout: 10000 });
    const itData = itRes.data;

    if (!itData.results?.length) {
      await EsTeams.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `⚠️ Could not find a match for "${songQuery}". Try another title.`,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: waButton }
      });
    }

    const best = itData.results[0];
    const artist = best.artistName || "Unknown Artist";
    const title = best.trackName || songQuery;

    const lyricsData = await esApiGet("/api/v1/dev/lyrics", { artist, title }).catch(() => null);

    await EsTeams.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    if (!lyricsData?.lyrics) {
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `⚠️ Lyrics not found\n\nPlease try again!.`,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: waButton }
      });
    }

    const fullLyrics = String(lyricsData.lyrics).trim();
    const filePath = `ES_TEAMS-MEDIA/${chatId}_lyrics.txt`;
    fs.writeFileSync(filePath, fullLyrics, "utf8");

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), `${title.replace(/\s+/g, "_")}.txt`);

    const uploadRes = await axios.post("https://store1.gofile.io/uploadFile", form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity
    });

    let downloadUrl = "";
    if (uploadRes.data.status === "ok" && uploadRes.data.data?.downloadPage) {
      downloadUrl = uploadRes.data.data.downloadPage;
    }

    fs.unlinkSync(filePath);

    const CAP_LIMIT = 900;
    const preview = fullLyrics.length > CAP_LIMIT ? fullLyrics.slice(0, CAP_LIMIT) + "\n\n...(truncated)" : fullLyrics;

    const caption = `🎵 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗟𝗬𝗥𝗜𝗖𝗦 𝗦𝗘𝗔𝗥𝗖𝗛*\n\n🎤 *Artist:* ${artist}\n🎶 *Title:* ${title}\n\n${preview}\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = [
      [{ text: "📄 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗟𝗬𝗥𝗜𝗖𝗦", url: downloadUrl || "https://gofile.io" }],
      [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
    ];

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons }
    });

  } catch (err) {
    console.error("Error in /lyrics command:", err);
    await EsTeams.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "⚠️ An error occurred while fetching lyrics. Please try again later.",
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: waButton }
    });
  }
});

//Write Command
EsTeams.onText(/^\/write(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const inputText = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    if (!inputText) {
        return EsTeams.sendMessage(chatId, "❌ Invalid Input\n\nPlease use `/write <your text>`", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    const savePath = `ES_TEAMS-MEDIA/image/${userId}.jpg`;

    try {
        const sentMessage = await EsTeams.sendMessage(chatId, "⏳ Processing your request...", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

        if (!fs.existsSync("ES_TEAMS-MEDIA/image")) {
            fs.mkdirSync("ES_TEAMS-MEDIA/image", { recursive: true });
        }

        const imageBuffer = await esApiGet("/api/v1/dev/book", { text: inputText });
        fs.writeFileSync(savePath, imageBuffer);

        await EsTeams.sendPhoto(chatId, savePath, {
            caption: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,
            reply_to_message_id: sentMessage.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

        await EsTeams.deleteMessage(chatId, sentMessage.message_id); 
        fs.unlinkSync(savePath);
    } catch (error) {
        console.error("Write command error:", error);
        EsTeams.sendMessage(chatId, "⚠️ Failed to generate your book image. Try again later.", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

// Airtime command
EsTeams.onText(/\/airtime/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const header = "*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝗧𝗨 𝗔𝗜𝗥𝗧𝗜𝗠𝗘*";
    
    if (userId !== adminId) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "❌ *This command is for admin only.*\nYou don't have permission.",
            parse_mode: "Markdown"
        });
    }

    await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: header + "\n\nSelect your network:",
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "𝗔𝗜𝗥𝗧𝗘𝗟", callback_data: "network_airtel" },
                    { text: "𝗠𝗧𝗡", callback_data: "network_mtn" }
                ],
                [
                    { text: "𝗚𝗟𝗢", callback_data: "network_glo" },
                    { text: "9𝗠𝗢𝗕𝗜𝗟𝗘", callback_data: "network_9mobile" }
                ],
                [
                    { 
                        text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                        url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29",
                        style: "primary"
                    }
                ]
            ]
        }
    });
});

EsTeams.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const userId = query.from.id;

    if (query.data.startsWith("network_")) {
        const network = query.data.split("_")[1];
        airtimeSessions[userId] = { network };

        await EsTeams.deleteMessage(chatId, messageId);

        const networkNames = {
            airtel: "𝗔𝗜𝗥𝗧𝗘𝗟",
            mtn: "𝗠𝗧𝗡",
            glo: "𝗚𝗟𝗢",
            "9mobile": "9𝗠𝗢𝗕𝗜𝗟𝗘"
        };

        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `Enter your ${networkNames[network]} number:`,
            parse_mode: "Markdown"
        });
    }

    if (query.data.startsWith("amount_")) {
        const amount = query.data.split("_")[1];
        airtimeSessions[userId].amount = amount;
        const session = airtimeSessions[userId];

        await EsTeams.deleteMessage(chatId, messageId);

        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝗧𝗨 𝗔𝗜𝗥𝗧𝗜𝗠𝗘*\n\nMobile No: ${session.number}\nNetwork: ${session.network.toUpperCase()}\nAmount: ₦${session.amount}`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "✅ 𝗣𝗥𝗢𝗖𝗘𝗘𝗗", callback_data: "proceed_buy" }],
                    [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_buy" }]
                ]
            }
        });
    }

    if (query.data === "proceed_buy") {
        const session = airtimeSessions[userId];
        if (!session || !session.number || !session.amount || !session.network) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "⚠️ Something went wrong. Please try /airtime again.",
                parse_mode: "Markdown"
            });
        }

        await EsTeams.deleteMessage(chatId, messageId);

        const requestId = Date.now().toString(); 

        try {
            const response = await fetch(`https://www.nellobytesystems.com/APIAirtimeV1.asp?UserID=${process.env.NELL_USERID}&APIKey=${process.env.NELL_APIKEY}&MobileNetwork=${getNetworkCode(session.network)}&Amount=${session.amount}&MobileNumber=${session.number}&RequestID=${requestId}&CallBackURL=http://your-callback-url.com`);
            const data = await response.json();

            if (data.statuscode === "100" || data.status === "ORDER_RECEIVED") {
                await EsTeams.sendPhoto(chatId, botImageUrl, {
                    caption: `✅ Airtime purchase request received!\nOrderID: ${data.orderid}\nAmount: ₦${session.amount}\nNetwork: ${session.network.toUpperCase()}\nMobile: ${session.number}`,
                    parse_mode: "Markdown"
                });
            } else {
                await EsTeams.sendPhoto(chatId, botImageUrl, {
                    caption: `❌ Failed to purchase airtime.\nMessage: ${data.status || "Unknown error"}`,
                    parse_mode: "Markdown"
                });
            }
        } catch (err) {
            await EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "⚠️ Error connecting to Nellobyte API. Try again later.",
                parse_mode: "Markdown"
            });
        }
    }

    if (query.data === "cancel_buy") {
        await EsTeams.deleteMessage(chatId, messageId);
        delete airtimeSessions[userId];

        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "❌ Airtime purchase cancelled.",
            parse_mode: "Markdown"
        });
    }
});

EsTeams.on("message", async (msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;

    if (!airtimeSessions[userId] || airtimeSessions[userId].number) return;

    const network = airtimeSessions[userId].network;
    const number = msg.text.trim();

    // Validate locally without non-existent API
    if (!validateNumber(number, network)) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `❌ Invalid ${network.toUpperCase()} number. Please try again.`,
            parse_mode: "Markdown"
        });
    }

    airtimeSessions[userId].number = number;

    await EsTeams.deleteMessage(chatId, msg.message_id);

    await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝗧𝗨 𝗔𝗜𝗥𝗧𝗜𝗠𝗘*\n\nSelect amount:`,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "₦100", callback_data: "amount_100" },
                    { text: "₦200", callback_data: "amount_200" }
                ],
                [
                    { text: "₦500", callback_data: "amount_500" },
                    { text: "₦1000", callback_data: "amount_1000" }
                ],
                [
                    { 
                        text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                        url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29",
                        style: "primary"
                    }
                ]
            ]
        }
    });
});

// Helper functions
function getNetworkCode(network) {
    const codes = { airtel: "04", mtn: "01", glo: "02", "9mobile": "03" };
    return codes[network.toLowerCase()] || "01";
}

function normalizeNumber(input) {
    let cleaned = input.replace(/\D/g, "");
    if (cleaned.startsWith("234")) {
        cleaned = "0" + cleaned.slice(3);
    }
    return cleaned;
}

function validateNumber(number, network) {
    const num = normalizeNumber(number);
    if (num.length !== 11) return false;

    const prefix = num.slice(0, 3);

    const validPrefixes = {
        airtel: ["070","080","081","090","091"],
        mtn: ["070","080","081","090","091"],
        glo: ["070","080","081","090"],
        "9mobile": ["070","080","081","090"]
    };

    return validPrefixes[network]?.includes(prefix);
}

//BALANCE COMMAND
EsTeams.onText(/\/balance/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (userId !== adminId) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "❌ *This command is for admin only.*\nYou don't have permission.",
            parse_mode: "Markdown"
        });
    }

    const NELL_USERID = process.env.NELL_USERID;
    const NELL_APIKEY = process.env.NELL_APIKEY;

    if (!NELL_USERID || !NELL_APIKEY) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "⚠️ API credentials not set. Contact admin.",
            parse_mode: 'Markdown'
        });
    }

    try {
        const response = await fetch(`https://www.nellobytesystems.com/APIWalletBalanceV1.asp?UserID=${NELL_USERID}&APIKey=${NELL_APIKEY}`);
        const data = await response.json();

        if (data.balance) {
            const balanceMsg = 
                "*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗪𝗔𝗟𝗟𝗘𝗧 𝗕𝗔𝗟𝗔𝗡𝗖𝗘*\n\n" +
                `*Balance:* ₦${data.balance}\n\n` +
                `*Phone:* ${data.phoneno || 'N/A'}\n\n` +
                `Date: ${data.date || 'N/A'}\n\n` +
                "𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛";

            await EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: balanceMsg,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ 
                            text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", 
                            url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", 
                            style: "primary" 
                        }]
                    ]
                }
            });
        } else {
            await EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ Failed to fetch balance.\nMessage: " + (data.status || JSON.stringify(data)),
                parse_mode: 'Markdown'
            });
        }
    } catch (error) {
        console.error("Balance fetch error:", error.message);
        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "⚠️ Error connecting to Nellobyte API. Try later.",
            parse_mode: 'Markdown'
        });
    }
});

// FUND COMMAND
EsTeams.onText(/\/fund/, async (msg) => {
    const chatId = msg.chat.id;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ 
                        text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", 
                        url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", 
                        style: "primary" 
                    }]
                ]
            }
        });
    }

    const caption = 
        "*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝗧𝗨 𝗧𝗢𝗣 𝗨𝗣*\n\n" +
        "*Acct Name:* Nellobyte Eti\n\n" +
        "*Acct Bank:* Moniepoint\n\n" +
        "Tap the button below to copy to clipboard";

    const replyMarkup = {
        inline_keyboard: [
            [
                { 
                    text: "𝗖𝗢𝗣𝗬 𝗔𝗖𝗖𝗧 𝗡𝗢", 
                    copy_text: { text: "6968228080" }
                }
            ],
            [
                { 
                    text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", 
                    url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", 
                    style: "primary"
                }
            ]
        ]
    };

    try {
        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: caption,
            parse_mode: 'Markdown',
            reply_markup: replyMarkup
        });
    } catch (error) {
        console.error("Error sending fund photo:", error);
        await EsTeams.sendMessage(chatId, "⚠️ Image couldn't load right now, but here's the top-up info:\n\n" + caption, {
            parse_mode: 'Markdown',
            reply_markup: replyMarkup
        });
    }
});

// TIKTOK COMMAND
EsTeams.onText(/^\/tiktok(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (!url) {
    return EsTeams.sendMessage(chatId, '❌ Invalid input.\nPlease use /tiktok <video link>', {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  let loading = await EsTeams.sendMessage(chatId, "⏳ Processing...\n▰▱▱▱▱▱▱");
  const steps = ["▰▰▱▱▱▱▱","▰▰▰▱▱▱▱","▰▰▰▰▱▱▱","▰▰▰▰▰▱▱","▰▰▰▰▰▰▱","▰▰▰▰▰▰▰"];

  try {

    const data = await esApiGet("/api/v1/dev/tiktok", { url });

    if (!data.download_url)
      throw new Error('Video download link not found.');

    const videoUrl = data.download_url;
    const author = escapeMarkdown(data.author || "Unknown");
    const description = escapeMarkdown(String(data.title || "No description").slice(0, 700));

    for (let step of steps) {
      await new Promise(r => setTimeout(r, 300));
      try {
        await EsTeams.editMessageText(`⏳ Processing...\n${step}`, {
          chat_id: chatId,
          message_id: loading.message_id
        });
      } catch (e) {}
    }

    try {
      await EsTeams.deleteMessage(chatId, loading.message_id);
    } catch (e) {}

    const videoResponse = await axios.get(videoUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.tiktok.com/',
        'Accept': 'video/mp4',
        'Accept-Language': 'en-US,en;q=0.9',
        'Range': 'bytes=0-'
      }
    });

    const videoBuffer = Buffer.from(videoResponse.data);

    // The separate `audio` link from the API is unreliable — it can
    // expire or return an HTML/JSON error page instead of real audio,
    // which ffmpeg then rejects with "Invalid data found when
    // processing input". We validate it, and if it's bad, fall back
    // to extracting the audio track directly from the video we
    // already downloaded successfully. Any failure in this whole
    // audio side-feature is caught below so the video still gets
    // sent instead of the entire command failing.
    const videoPath = `./temp_video_${Date.now()}.mp4`;
    const audioPath = `./temp_audio_${Date.now()}.m4a`;
    const outputPath = `./tiktok_audio_${Date.now()}.mp3`;
    let audioDownloadURL = null;

    try {
      // Extract audio directly from the video we already downloaded.
      fs.writeFileSync(videoPath, videoBuffer);
      const ffmpegSource = videoPath;

      await new Promise((resolve, reject) => {
        ffmpeg(ffmpegSource)
          .toFormat('mp3')
          .audioCodec('libmp3lame')
          .audioBitrate('128k')
          .noVideo()
          .on('end', resolve)
          .on('error', reject)
          .save(outputPath);
      });

      const encodedAudioBuffer = fs.readFileSync(outputPath);

      const form = new FormData();
      form.append('file', encodedAudioBuffer, 'esteams_audio.mp3');

      const uploadRes = await axios.post('https://upload.gofile.io/uploadfile', form, {
        headers: { 
          ...form.getHeaders(), 
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://gofile.io/',
          'Accept': '*/*'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      audioDownloadURL = uploadRes.data.data.downloadPage;
    } catch (audioErr) {
      console.error("TikTok audio extraction failed, sending video only:", audioErr.message);
    } finally {
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }

    const tiktokButtons = [];
    if (audioDownloadURL) {
      tiktokButtons.push([{ text: "🎵 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗔𝗨𝗗𝗜𝗢", url: audioDownloadURL }]);
    }
    tiktokButtons.push([{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]);

    await EsTeams.sendVideo(chatId, videoBuffer, {
      caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗧𝗜𝗞𝗧𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*

👤 *Author:* ${author}

📝 *Description:* ${description}

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: tiktokButtons
      }
    });

  } catch (err) {
    try { await EsTeams.deleteMessage(chatId, loading.message_id); } catch {}

    await EsTeams.sendMessage(chatId, `❌ Failed to process TikTok video.\n\n${err.message}`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//Flux Command
EsTeams.onText(/^\/flux(?:\s+(.*))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!prompt) {
    return EsTeams.sendMessage(chatId, `❌ Invalid Input\n\nPlease use: /flux <your prompt>`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const waiting = await EsTeams.sendMessage(chatId, `⏳ Processing your image...`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  try {
    const imageBuffer = await esApiGet("/api/v1/dev/imagegen", { prompt: prompt.trim() });

    const imagePath = `ES_TEAMS-MEDIA/image/${chatId}_flux.png`;
    fs.writeFileSync(imagePath, imageBuffer);

    await EsTeams.deleteMessage(chatId, waiting.message_id);

    await EsTeams.sendPhoto(chatId, imagePath, {
      caption: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(imagePath);

  } catch (err) {
    await EsTeams.editMessageText(chatId, waiting.message_id, `❌ Failed to generate image. Try again later.`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//Ssweb Command
EsTeams.onText(/^\/ssweb(?:\s+(.*))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];

  if (msg.chat.type !== 'private') return;

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!input || !input.startsWith("http")) {
    return EsTeams.sendMessage(chatId, `❌ Invalid Input\n\nPlease use: /ssweb <valid website URL>`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const processing = await EsTeams.sendMessage(chatId, `🖼️ Processing your screenshot...`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  try {
    const imageBuffer = await esApiGet("/api/v1/dev/screenshot", { url: input });

    const imagePath = `ES_TEAMS-MEDIA/image/${chatId}_ssweb.jpg`;
    fs.writeFileSync(imagePath, imageBuffer);

    await EsTeams.deleteMessage(chatId, processing.message_id);

    await EsTeams.sendPhoto(chatId, imagePath, {
      caption: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(imagePath);
  } catch (err) {
    await EsTeams.editMessageText(chatId, processing.message_id, `❌ Failed to fetch screenshot. Try again with a valid website.`);
  }
});

//Alive Command
EsTeams.on('channel_post', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text && text.startsWith('/test')) {
    const imageUrl = 'https://files.catbox.moe/3jibot.jpg';

    EsTeams.sendPhoto(chatId, imageUrl, {
      caption: `> ᴇꜱ ᴛᴇᴀᴍꜱ ᴠ1 ɪꜱ ᴀʟɪᴠᴇ`,
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//Jid Command
EsTeams.onText(/^\/jid(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!input) {
    return EsTeams.sendMessage(chatId, `❌ Invalid input\n\nPlease use /jid <group or channel link>`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  // Extract JID
  let jid;
  if (input.includes("t.me/")) {
    const username = input.split("t.me/")[1].split(/[?\s]/)[0];
    jid = `@${username}`;
  } else if (input.includes("chat.whatsapp.com/")) {
    const code = input.split("chat.whatsapp.com/")[1].split(/[?\s]/)[0];
    jid = `${code}@g.us`;
  } else if (input.includes("whatsapp.com/channel/")) {
    const channel = input.split("whatsapp.com/channel/")[1].split(/[?\s]/)[0];
    jid = `${channel}@newsletter`;
  } else {
    return EsTeams.sendMessage(chatId, `⚠️ Unsupported or invalid link format.`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  await EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
    caption: `𝐄𝐒 𝐓𝐄𝐀𝐌𝐒 𝐕𝟏 𝐉𝐈𝐃 𝐄𝐗𝐓𝐑𝐀𝐂𝐓𝐎𝐑\n\nExtracted JID:\n\`${jid}\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📎 𝗖𝗢𝗣𝗬 𝗝𝗜𝗗", callback_data: `copy_${jid}` }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });
});

EsTeams.on('callback_query', async (callbackQuery) => {
  const data = callbackQuery.data;

  if (data.startsWith("copy_")) {
    const jid = data.replace("copy_", "");
    await EsTeams.answerCallbackQuery(callbackQuery.id, {
      text: `✅ ᴄᴏᴘɪᴇᴅ ᴊɪᴅ:`,
      show_alert: true
    });
  }
});

//Support Command
EsTeams.onText(/\/support/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}
    
    if (supportSession[chatId]) {
        try {
            await EsTeams.deleteMessage(chatId, supportSession[chatId].messageId);
        } catch (e) {}
    }

    supportSession[chatId] = {
        stage: 'start',
        message: '',
        timer: null,
        messageId: null
    };

    try {
        const supportMessage = await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "✨ 𝗦𝗲𝗹𝗲𝗰𝘁 𝗮𝗻 𝗼𝗽𝘁𝗶𝗼𝗻 𝗯𝗲𝗹𝗼𝘄 𝘁𝗼 𝘀𝗲𝗻𝗱 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛:",
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "✍️ 𝗖𝗢𝗠𝗣𝗢𝗦𝗘 𝗠𝗘𝗦𝗦𝗔𝗚𝗘", callback_data: "support_compose" }],
                    [{ text: "📤 𝗦𝗘𝗡𝗗 𝗠𝗘𝗦𝗦𝗔𝗚𝗘", callback_data: "support_send" }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

        supportSession[chatId].messageId = supportMessage.message_id;
    } catch (err) {
        console.error('Failed to send support message:', err.message);
    }
});

EsTeams.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    await EsTeams.answerCallbackQuery(callbackQuery.id);

    if (!action.startsWith('support_') || !supportSession[chatId]) return;

    const actionType = action.replace('support_', '');

    const updateSupportMessage = async (newCaption, buttons) => {
        try {
            await EsTeams.deleteMessage(chatId, supportSession[chatId].messageId);
        } catch (err) {
            console.error('Failed to delete old support message:', err.message);
        }

        try {
        
            const newSupportMsg = await EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: newCaption,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: buttons || [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });

            supportSession[chatId].messageId = newSupportMsg.message_id;
        } catch (err) {
            console.error('Failed to send updated support message:', err.message);
        }
    };

    if (actionType === 'compose') {
        supportSession[chatId].stage = 'compose';
        await updateSupportMessage(
            "🖋️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝘆𝗽𝗲 𝘆𝗼𝘂𝗿 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘄𝗶𝘁𝗵𝗶𝗻 𝟯 𝗺𝗶𝗻𝘀.\n\n𝗪𝗵𝗲𝗻 𝗱𝗼𝗻𝗲, 𝗰𝗹𝗶𝗰𝗸 '📤 𝗦𝗘𝗡𝗗 𝗠𝗘𝗦𝗦𝗔𝗚𝗘' 𝗯𝗲𝗹𝗼𝘄.",
            [
                [{ text: "📤 𝗦𝗘𝗡𝗗 𝗠𝗘𝗦𝗦𝗔𝗚𝗘", callback_data: "support_send" }],
                [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "support_cancel" }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        );

        supportSession[chatId].timer = setTimeout(() => resetSupportSession(chatId), 180000); 
    }

    else if (actionType === 'send') {
        if (!supportSession[chatId].message) {
            return EsTeams.sendMessage(chatId, "⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝘆𝗽𝗲 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁.");
        }

        const user = callbackQuery.from;
        const usernameLink = user.username ? `https://t.me/${user.username}` : null;
        const senderDetails = `👤 𝗡𝗮𝗺𝗲: ${user.first_name}${user.last_name ? " " + user.last_name : ""}\n🆔 𝗜𝗗: ${user.id}${user.username ? `\n🔗 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: @${user.username}` : ""}`;

        let buttons = [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ];
        if (usernameLink) {
            buttons.unshift([{ text: "👤 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗦𝗘𝗡𝗗𝗘𝗥", url: usernameLink }]);
        }

        await EsTeams.sendPhoto(5523737392, botImageUrl, {
            caption: `📩 𝗡𝗲𝘄 𝗦𝘂𝗽𝗽𝗼𝗿𝘁 𝗠𝗲𝘀𝘀𝗮𝗴𝗲:\n\n${supportSession[chatId].message}\n\n${senderDetails}`,
            reply_markup: { inline_keyboard: buttons },
            parse_mode: 'Markdown'
        });

        await updateSupportMessage("✅ 𝗬𝗼𝘂𝗿 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝘀𝗲𝗻𝘁. 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂!");
        resetSupportSession(chatId);
    }

    else if (actionType === 'cancel') {
        await updateSupportMessage("❌ 𝗬𝗼𝘂𝗿 𝘀𝘂𝗽𝗽𝗼𝗿𝘁 𝘀𝗲𝘀𝘀𝗶𝗼𝗻 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗰𝗮𝗻𝗰𝗲𝗹𝗹𝗲𝗱.");
        resetSupportSession(chatId);
    }
});

EsTeams.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (supportSession[chatId]?.stage === 'compose' && msg.text && !msg.text.startsWith('/')) {
        supportSession[chatId].message = msg.text;
    }
});

function resetSupportSession(chatId) {
    if (supportSession[chatId]) {
        clearTimeout(supportSession[chatId].timer);
        delete supportSession[chatId];
    }
}

//REMOVEBG COMMAND
EsTeams.onText(/^\/removebg$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!msg.reply_to_message || !msg.reply_to_message.photo) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "🖼️ Please reply to a photo with /removebg to remove its background.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

const waitingMsg = await EsTeams.sendMessage(chatId, "Processing Image. Please hold on...");
  try {
    const photo = msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1];
    const fileId = photo.file_id;
    const imagePath = `ES_TEAMS-MEDIA/image/${userId}.jpg`;

    const fileLink = await EsTeams.getFileLink(fileId);
    const response = await axios.get(fileLink, { responseType: "arraybuffer" });
    fs.writeFileSync(imagePath, response.data);

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", fs.createReadStream(imagePath));

    const catboxRes = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    const imageURL = catboxRes.data;
    fs.unlinkSync(imagePath);

    const removed = await esApiPost("/api/v1/dev/bg-remove", { image_url: imageURL });
    const removedRes = await axios.get(removed.image_url, { responseType: "arraybuffer" });

    const outputImagePath = `ES_TEAMS-MEDIA/image/${userId}_nobg.png`;
    fs.writeFileSync(outputImagePath, removedRes.data);

    await EsTeams.sendPhoto(chatId, outputImagePath, {
      caption: "✅ Background Removed Successfully!\n\n𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(outputImagePath);
  } catch (e) {
    console.error("RemoveBG Error:", e.message);
    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ Failed to remove background. Please try again later or use a different image.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//qr Command
EsTeams.onText(/^\/qr(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const input = match[1];

  const imagePath = `ES_TEAMS-MEDIA/image/${userId}_qr.png`;

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!input) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ Please provide a valid URL.\n\nExample: `/qr https://google.com`",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

const waitingMsg = await EsTeams.sendMessage(chatId, "Processing Qr. Please hold on...");

  try {
    const qrBuffer = await esApiGet("/api/v1/dev/qrcode", { text: input });

    fs.writeFileSync(imagePath, qrBuffer);

    await EsTeams.sendPhoto(chatId, imagePath, {
      caption: "✅ QR CODE CREATED\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(imagePath);
  } catch (e) {
    console.error("QR Error:", e.message);
    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ Failed to create QR code. Please try again later.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//Tinyurl Command
EsTeams.onText(/^\/tinyurl(?:\s(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!url) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❗ Please provide a valid URL to shorten.\n\nExample: `/tinyurl https://example.com`",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const waitingMsg = await EsTeams.sendMessage(chatId, "⏳ Processing URL. Please hold on...");

  try {
    const shortened = await esApiPost("/api/v1/dev/shorten", { url });
    const short = shortened.short_url;

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "✅ Shortened URL Ready!\n\n𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛",
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: "𝗖𝗢𝗣𝗬 𝗨𝗥𝗟", 
              copy_text: { text: short }
            }
          ],
          [
            { 
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", 
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", 
              style: "primary"
            }
          ]
        ]
      }
    });

  } catch (err) {
    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);
    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ Failed to shorten URL. Please try again later.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//Weather Command
EsTeams.onText(/^\/weather(?:\s(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!city) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❗ Please provide a city name.\n\nExample: /weather Lagos",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const waitingMsg = await EsTeams.sendMessage(chatId, "⛅ Processing weather data. Please hold on...");

  try {
    const data = await esApiGet("/api/v1/dev/weather", { location: city });

    const weatherReport = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗗𝗜𝗦𝗣𝗟𝗔𝗬

Location: ${data.location}
Condition: ${data.condition}
Temperature: ${data.temperature_c} C
Wind Speed: ${data.windspeed_kmh} km/h
Observed At: ${data.observed_at}

𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛`;

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: weatherReport,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  } catch (err) {
    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);
    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ Failed to fetch weather info. Make sure the city name is correct.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//TemporaryMail Command
EsTeams.onText(/^\/tempmail(?:\s(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(chatId,
            "❌ 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗\n\nKindly Check back later ...",
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                            url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29",
                            style: "primary"
                        }]
                    ]
                }
            }
        );
    }

    const waitingMsg = await EsTeams.sendMessage(
        chatId,
        "📩 Creating temporary email. Please hold on..."
    );

    try {
        const data = await esApiPost("/api/v1/dev/tempmail/create", {});

        const output =
`𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟

📧 Email: ${data.email}

𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛`;

        await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: output,
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "𝗖𝗢𝗣𝗬 𝗘𝗠𝗔𝗜𝗟",
                            copy_text: { text: data.email }
                        }
                    ],
                    [
                        {
                            text: "𝗖𝗢𝗣𝗬 𝗠𝗔𝗜𝗟 𝗞𝗘𝗬",
                            copy_text: { text: data.token }
                        }
                    ],
                    [
                        {
                            text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                            url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29",
                            style: "primary"
                        }
                    ]
                ]
            }
        });

    } catch (e) {
        await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "❌ Failed to create temporary email.",
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                        url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29",
                        style: "primary"
                    }]
                ]
            }
        });
    }
});

// CheckMail Command
EsTeams.onText(/^\/checkmail(?:\s(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const sessionId = match[1];

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, "❌ 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (!sessionId) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❗ Please provide a Mail Key\n\nExample: /checkmail your-mail-key",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const waitingMsg = await EsTeams.sendMessage(chatId, "📨 Checking mail inbox. Please hold on...");

  try {
    const list = await esApiGet("/api/v1/dev/tempmail/inbox", { token: sessionId });

    if (!list.messages || list.messages.length === 0) {
      await EsTeams.deleteMessage(chatId, waitingMsg.message_id);
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗠𝗔𝗜𝗟 𝗜𝗡𝗕𝗢𝗫\n\nInbox is empty or session invalid.\n\n𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    for (let i = 0; i < list.messages.length; i++) {
      const summary = list.messages[i];
      const mail = await esApiGet("/api/v1/dev/tempmail/message", { token: sessionId, id: summary.id }).catch(() => summary);
      const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗠𝗔𝗜𝗟 𝗜𝗡𝗕𝗢𝗫

Mail ${i + 1}:
From: ${mail.from}
Subject: ${mail.subject}
Text: ${mail.text || summary.intro || "(no preview available)"}

𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛`;

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

  } catch (e) {
    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);
    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ Failed to check inbox.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

// Bible Command
EsTeams.onText(/^\/bible(?:\s(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const passage = match[1];

  const isValid = passage && /^[a-zA-Z\s]+\s\d+:\d+$/.test(passage.trim());


if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!isValid) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `⚠️ Please input a full Bible passage in this format:

/bible John 3:16`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const waitingMsg = await EsTeams.sendMessage(chatId, "📖 Processing Bible passage. Please hold on...");

  try {
    const result = await esApiGet("/api/v1/dev/bible", { reference: passage });

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    if (!result.text) {
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `❌ Could not retrieve Bible passage.

Please check the reference and try again.`,
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗜𝗕𝗟𝗘 𝗥𝗘𝗔𝗗𝗘𝗥

𝐏𝐚𝐬𝐬𝐚𝐠𝐞: ${result.reference}

${result.text.trim()}

𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

  } catch (error) {
    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `❌ An error occurred while fetching Bible passage.

Error: ${error.message}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

// Quran Command
EsTeams.onText(/^\/quran(?:\s(\d+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const surahNumber = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!surahNumber) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `⚠️ Please input a Surah number like

/quran 1`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const waitingMsg = await EsTeams.sendMessage(chatId, "📖 Processing Surah. Please hold on...");

  try {
    const result = await esApiGet("/api/v1/dev/quran", { reference: `${surahNumber}:1` });

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    if (!result.text) {
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `❌ Could not retrieve Surah.

Please check the number and try again.`,
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗤𝗨𝗥𝗔𝗡 𝗥𝗘𝗔𝗗𝗘𝗥

𝐒𝐮𝐫𝐚𝐡: ${result.surah || surahNumber}
𝐀𝐲𝐚𝐡: ${result.numberInSurah || 1}

${result.text}

𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

  } catch (error) {
    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `❌ An error occurred while fetching Surah.

Error: ${error.message}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

// Payment command
EsTeams.onText(/^\/pay$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const isPremium = premiumUsers.includes(userId)

    const caption = `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗔𝗬𝗠𝗘𝗡𝗧 𝗠𝗘𝗧𝗛𝗢𝗗\n\n𝗦𝘁𝗮𝘁𝘂𝘀: ${isPremium ? 'Premium' : 'Not Premium'}\n\nPRICE = 5 USDT\n\n𝗪𝗵𝗲𝗻 𝗽𝗮𝘆𝗶𝗻𝗴 𝘁𝗵𝗿𝗼𝘂𝗴𝗵 𝗰𝗿𝘆𝗽𝘁𝗼:\n𝗞𝗶𝗻𝗱𝗹𝘆 𝘀𝗲𝗻𝗱 𝗿𝗲𝗰𝗲𝗶𝗽𝘁 𝘁𝗼 @examsolutionteam`;

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    await EsTeams.sendPhoto(chatId, 'https://files.catbox.moe/3jibot.jpg', {
        caption,
        reply_markup: {
            inline_keyboard: [
                [{ text: '𝗣𝗔𝗬 𝗪𝗜𝗧𝗛 𝗡𝗔𝗜𝗥𝗔', callback_data: 'pay_naira' }],
                [{ text: '𝗣𝗔𝗬 𝗪𝗜𝗧𝗛 𝗖𝗥𝗬𝗣𝗧𝗢', url: 'https://i.ibb.co/XfrNV33W/CRYPTO.jpg' }],
                ...waButton
            ]
        }
    });
});

EsTeams.on('callback_query', async (query) => {
    const { data, from, message } = query;
    const chatId = message.chat.id;
    const messageId = message.message_id;
    const userId = from.id.toString();
    const isPremium = premiumUsers.includes(userId);

    try {
        if (data === 'pay_naira' || data === 'pay_crypto') {
            if (isPremium) return EsTeams.answerCallbackQuery(query.id, { text: '𝗬𝗼𝘂 𝗮𝗿𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.' });

            await EsTeams.deleteMessage(chatId, messageId);
            const isNaira = data === 'pay_naira';
            paymentReceipts[userId] = { stage: 'awaiting_confirmation' };

            const caption = isNaira
                ? `𝗔𝗖𝗖𝗢𝗨𝗡𝗧 𝗗𝗘𝗧𝗔𝗜𝗟𝗦\n\n🏦 𝗕𝗔𝗡𝗞: ÓPAY\n💳 𝗔𝗖𝗖 𝗡𝗢: 9018958092\n👤 𝗡𝗔𝗠𝗘: Paschal Etim\n𝗔𝗺𝗼𝘂𝗻𝘁: 5k Naira\n\n𝗣𝗟𝗘𝗔𝗦𝗘 𝗗𝗢 𝗡𝗢𝗧 𝗣𝗔𝗬 𝗟𝗘𝗦𝗦 𝗢𝗥 𝗠𝗢𝗥𝗘\n\n𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛`
                : `𝗖𝗥𝗬𝗣𝗧𝗢 𝗗𝗘𝗧𝗔𝗜𝗟𝗦\n\n🏦 𝗡𝗔𝗠𝗘: USDT\n💳 𝗡𝗘𝗧𝗪𝗢𝗥𝗞: TRC20\n𝗔𝗺𝗼𝘂𝗻𝘁: 5 USDT\n👤 𝗔𝗗𝗗𝗥𝗘𝗦𝗦: TBWMGYfvYs27uaWYsbm4nCKRm5hQieaKM7\n\n𝗣𝗟𝗘𝗔𝗦𝗘 𝗗𝗢 𝗡𝗢𝗧 𝗣𝗔𝗬 𝗟𝗘𝗦𝗦 𝗢𝗥 𝗠𝗢𝗥𝗘\n\n𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛`;

            const photoUrl = isNaira
                ? 'https://files.catbox.moe/xsjxsd.jpg'
                : 'https://i.ibb.co/XfrNV33W/CRYPTO.jpg';

            await EsTeams.sendPhoto(chatId, photoUrl, {
                caption,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '✅ 𝗖𝗢𝗡𝗙𝗜𝗥𝗠 𝗣𝗔𝗬𝗠𝗘𝗡𝗧', callback_data: 'confirm_payment' }],
                        ...waButton
                    ]
                }
            });
        }

        if (data === 'confirm_payment') {
            if (isPremium) {
                return EsTeams.answerCallbackQuery(query.id, { text: '𝗬𝗼𝘂 𝗮𝗿𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.' });
            }

            await EsTeams.deleteMessage(chatId, messageId);
            paymentReceipts[userId] = { stage: 'awaiting_receipt' };

            await EsTeams.sendMessage(chatId, '✅ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝘆𝗼𝘂𝗿 𝗿𝗲𝗰𝗲𝗶𝗽𝘁 (𝗶𝗺𝗮𝗴𝗲 𝗳𝗼𝗿𝗺𝗮𝘁)', {
                reply_markup: {
                    inline_keyboard: waButton
                }
            });
        }

        // Fixed: decline_payment (user-side cancel)
        if (data === 'decline_payment') {
            if (isPremium) {
                return EsTeams.answerCallbackQuery(query.id, { text: '𝗬𝗼𝘂 𝗮𝗿𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.' });
            }

            await EsTeams.answerCallbackQuery(query.id, { text: '❌ 𝗬𝗼𝘂 𝗰𝗮𝗻𝗰𝗲𝗹𝗹𝗲𝗱 𝘁𝗵𝗲 𝗽𝗮𝘆𝗺𝗲𝗻𝘁.' });
            await EsTeams.sendMessage(adminId, `❌ 𝗨𝘀𝗲𝗿 𝗜𝗗 ${userId} 𝗱𝗲𝗰𝗹𝗶𝗻𝗲𝗱 𝘁𝗵𝗲 𝗽𝗮𝘆𝗺𝗲𝗻𝘁 𝗿𝗲𝗾𝘂𝗲𝘀𝘁.`);
        }

        // Admin confirms payment
        if (data.startsWith('finalize_')) {
            const targetUserId = data.split('_')[1];
            if (savePremiumUser(targetUserId)) {
                await EsTeams.sendPhoto(targetUserId, 'https://i.ibb.co/NgNVB7N0/APPROVE.jpg', {
                    caption: '✅ 𝗣𝗮𝘆𝗺𝗲𝗻𝘁 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹\n\n𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝗰𝗵𝗼𝗼𝘀𝗶𝗻𝗴 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭'
                });
                await EsTeams.sendMessage(adminId, `✅ Payment from user ${targetUserId} successful.`);
            } else {
                await EsTeams.answerCallbackQuery(query.id, { text: '𝗨𝘀𝗲𝗿 𝗶𝘀 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.' });
            }
        }

        // Admin declines payment
        if (data.startsWith('decline_')) {
            const targetUserId = data.split('_')[1];
            await EsTeams.sendPhoto(targetUserId, 'https://i.ibb.co/vxZPVTnw/FAILED.jpg', {
                caption: '❌ 𝗧𝗿𝗮𝗻𝘀𝗮𝗰𝘁𝗶𝗼𝗻 𝗳𝗮𝗶𝗹𝗲𝗱\n𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗼𝗻𝘁𝗮𝗰𝘁 /support 𝗶𝗳 𝘁𝗵𝗶𝘀 𝗶𝘀 𝗮 𝗺𝗶𝘀𝘁𝗮𝗸𝗲.',
                reply_markup: {
                    inline_keyboard: [[{ text: '𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗦𝗨𝗣𝗣𝗢𝗥𝗧', callback_data: 'contact_support' }]]
                }
            });
            await EsTeams.sendMessage(adminId, `❌ 𝗣𝗮𝘆𝗺𝗲𝗻𝘁 𝗳𝗿𝗼𝗺 𝘂𝘀𝗲𝗿 ${targetUserId} 𝘄𝗮𝘀 𝗱𝗲𝗰𝗹𝗶𝗻𝗲𝗱.`);
        }

        if (data === 'contact_support') {
            message.text = '/support';
            EsTeams.emit('text', message);
        }

    } catch (error) {
        console.error('Error processing callback query:', error);
        await EsTeams.sendMessage(adminId, 'An error occurred while processing a transaction.');
    }
});

// Handle receipt upload
EsTeams.on('photo', async (msg) => {
    const userId = msg.from.id.toString();
    const chatId = msg.chat.id;

    if (paymentReceipts[userId]?.stage !== 'awaiting_receipt') return;

    const photoId = msg.photo[msg.photo.length - 1].file_id;

    try {
        const file = await EsTeams.getFile(photoId);
        const fileExtension = file.file_path.split('.').pop().toLowerCase();

        const validImageFormats = ['jpeg', 'jpg', 'png', 'gif'];
        if (!validImageFormats.includes(fileExtension)) {
            return EsTeams.sendMessage(chatId, '⚠️ Invalid receipt format. Please send a valid receipt');
        }

        paymentReceipts[userId] = { stage: 'awaiting_name', receiptFileId: photoId };
        await EsTeams.sendMessage(chatId, '✅ 𝗡𝗼𝘄 𝘀𝗲𝗻𝗱 𝘁𝗵𝗲 𝗦𝗘𝗡𝗗𝗘𝗥’𝗦 𝗡𝗔𝗠𝗘 (name on transaction).');

    } catch (error) {
        console.error('Error processing receipt:', error);
        await EsTeams.sendMessage(chatId, '❌ There was an issue processing your receipt. Please try again.');
    }
});

// Handle name input
EsTeams.on('text', async (msg) => {
    const userId = msg.from.id.toString();
    const chatId = msg.chat.id;

    if (paymentReceipts[userId]?.stage !== 'awaiting_name') return;

    const name = msg.text;
    const { receiptFileId } = paymentReceipts[userId];

    await EsTeams.sendPhoto(adminId, receiptFileId, {
        caption: `🧾 𝗡𝗘𝗪 𝗣𝗔𝗬𝗠𝗘𝗡𝗧 𝗥𝗘𝗖𝗘𝗜𝗩𝗘𝗗\n\n𝗨𝘀𝗲𝗿: ${userId}\n𝗡𝗮𝗺𝗲: ${name}`,
        reply_markup: {
            inline_keyboard: [
                [{ text: '✅ 𝗔𝗣𝗣𝗥𝗢𝗩𝗘', callback_data: `finalize_${userId}` }],
                [{ text: '❌ 𝗗𝗘𝗖𝗟𝗜𝗡𝗘', callback_data: `decline_${userId}` }],
                [{ text: '📩 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗕𝗨𝗬𝗘𝗥', url: `https://t.me/${msg.from.username || ''}` }]
            ]
        }
    });

    await EsTeams.sendMessage(chatId, '✅ 𝗬𝗼𝘂𝗿 𝗽𝗮𝘆𝗺𝗲𝗻𝘁 𝗿𝗲𝗰𝗲𝗶𝗽𝘁 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝘀𝘂𝗯𝗺𝗶𝘁𝘁𝗲𝗱 𝗳𝗼𝗿 𝗿𝗲𝘃𝗶𝗲𝘄.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });

    delete paymentReceipts[userId];
});

const BROADCAST_PINS_FILE = './ES_TEAMS-MEDIA/broadcast_pins.json';
if (!fs.existsSync(BROADCAST_PINS_FILE)) fs.writeFileSync(BROADCAST_PINS_FILE, '[]');
let broadcastPinRecords = loadJsonFile(BROADCAST_PINS_FILE);

//BROADCAST COMMAND
EsTeams.onText(/\/broadcast(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, '🚫 *Access Denied!*', { parse_mode: 'Markdown' });
  }

  const originalText = match[1]?.trim() || '';
  let media = null;
  let mediaType = null;
  if (msg.reply_to_message) {
    const replied = msg.reply_to_message;
    if (replied.photo) {
      media = replied.photo[replied.photo.length - 1].file_id;
      mediaType = 'photo';
    } else if (replied.video) {
      media = replied.video.file_id;
      mediaType = 'video';
    } else if (replied.document) {
      media = replied.document.file_id;
      mediaType = 'document';
    } else if (replied.audio) {
      media = replied.audio.file_id;
      mediaType = 'audio';
    }
  }

  if (!originalText && !media) {
    return EsTeams.sendMessage(chatId,
      '📚 *Broadcast Usage Guide*\n\n' +
      '➤ Reply to a media message (photo, video, document, audio) with the command:\n' +
      '`/broadcast Your caption here`\n\n' +
      '➤ Or just send a text message with the command:\n' +
      '`/broadcast Your announcement here`',
      { parse_mode: 'Markdown' }
    );
  }

  const formattedText = originalText ? originalText.replace(/\\n/g, '\n') : '';

  let processingMsg = await EsTeams.sendMessage(chatId,
    '📡 *Broadcast Initialized!*\n\n' +
    '🔄 Preparing to deliver...\n' +
    '⏳ Stay tuned!',
    { parse_mode: 'Markdown' }
  );

  const userRef = doc(db, "botData", "users");
  const snap = await getDoc(userRef);
  const targets = snap.exists() ? snap.data().ids || [] : [];

  if (targets.length === 0) {
    return EsTeams.sendMessage(chatId, '📭 *No users found to broadcast!*', { parse_mode: 'Markdown' });
  }

  let successCount = 0;
  let failureCount = 0;
  const broadcastMessages = {};
  const totalTargets = targets.length;
  let lastUpdate = Date.now();
  const startTime = Date.now();

  const footerText = '\n\n𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1';

  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '👤 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗢𝗪𝗡𝗘𝗥', url: "https://t.me/examsolutionteam", style: "success" }],
        [{ text: '📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟', url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  };

  for (const [index, targetId] of targets.entries()) {
    try {
      let sentMessage;
      if (media) {
        switch (mediaType) {
          case 'photo':
            sentMessage = await EsTeams.sendPhoto(targetId, media, {
              caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\n${formattedText || ''}${footerText}`,
              parse_mode: 'Markdown',
              ...inlineKeyboard,
            });
            break;
          case 'video':
            sentMessage = await EsTeams.sendVideo(targetId, media, {
              caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\n${formattedText || ''}${footerText}`,
              parse_mode: 'Markdown',
              ...inlineKeyboard,
            });
            break;
          case 'document':
            sentMessage = await EsTeams.sendDocument(targetId, media, {
              caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\n${formattedText || ''}${footerText}`,
              parse_mode: 'Markdown',
              ...inlineKeyboard,
            });
            break;
          case 'audio':
            sentMessage = await EsTeams.sendAudio(targetId, media, {
              caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\n${formattedText || ''}${footerText}`,
              parse_mode: 'Markdown',
              ...inlineKeyboard,
            });
            break;
          default:
            sentMessage = await EsTeams.sendPhoto(targetId, botImageUrl, {
              caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\nText: ${formattedText || 'N/A'}${footerText}`,
              parse_mode: 'Markdown',
              ...inlineKeyboard,
            });
        }
      } else {
        sentMessage = await EsTeams.sendPhoto(targetId, botImageUrl, {
          caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\nText: ${formattedText || 'N/A'}${footerText}`,
          parse_mode: 'Markdown',
          ...inlineKeyboard,
        });
      }
      successCount++;
      if (sentMessage?.message_id) broadcastMessages[String(targetId)] = sentMessage.message_id;
    } catch (error) {
      console.error(`❌ Failed to send to ${targetId}:`, error.message);
      failureCount++;
    }

    const now = Date.now();
    const progress = Math.floor(((index + 1) / totalTargets) * 100);

    if (now - lastUpdate > 5000 || index === totalTargets - 1) {
      lastUpdate = now;
      try {
        await EsTeams.deleteMessage(chatId, processingMsg.message_id);
        processingMsg = await EsTeams.sendMessage(chatId,
          `📡 *Broadcast Progress*\n\n` +
          `👥 *Targets:* ${totalTargets}\n` +
          `✅ *Delivered:* ${successCount}\n` +
          `❌ *Failed:* ${failureCount}\n\n` +
          `Progress: ${progress}%\n` +
          `🕒 *Elapsed:* ${Math.floor((now - startTime) / 1000)}s`,
          { parse_mode: 'Markdown' }
        );
      } catch (e) {}
    }
  }

  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  try {
    await EsTeams.deleteMessage(chatId, processingMsg.message_id);
    await EsTeams.sendMessage(chatId,
      `🎯 *Broadcast Complete!*\n\n` +
      `👥 *Targets:* ${totalTargets}\n` +
      `✅ *Successfully Sent:* ${successCount}\n` +
      `❌ *Failures:* ${failureCount}\n` +
      `🕒 *Total Time:* ${totalTime} seconds\n\n` +
      (failureCount > 0 ? '⚠ _Some targets could not be reached._' : '✨ _Broadcast was perfect!_'),
      { parse_mode: 'Markdown' }
    );
  } catch (e) {}

  console.log(`✅ Broadcast complete: ${successCount}/${totalTargets} delivered successfully.`);
  const ownerMessageId = broadcastMessages[String(userId)];
  if (ownerMessageId) {
    broadcastPinRecords.push({
      sourceMessageId: ownerMessageId,
      createdAt: new Date().toISOString(),
      messages: broadcastMessages
    });
    broadcastPinRecords = broadcastPinRecords.slice(-20);
    saveJsonFile(BROADCAST_PINS_FILE, broadcastPinRecords);
  } else {
    console.warn('Broadcast completed without an owner copy; /gpin and /gunpin cannot identify this broadcast.');
  }
});

// =============== POLL COMMAND =============//
EsTeams.onText(/\/poll(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, '🚫 *Access Denied!*', { parse_mode: 'Markdown' });
  }

  pollDraft.set(userId, { stage: 'awaiting_data' });

  await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption:
      `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗣𝗢𝗟𝗟 𝗖𝗥𝗘𝗔𝗧𝗢𝗥*\n\n` +
      `Send poll in this format:\n\n` +
      `Question | Option1, Option2, Option3\n\n` +
      `_Example:_ Will BTC hit 100k? | Yes, No\n\n` +
      `𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1`,
    parse_mode: 'Markdown'
  });
});

EsTeams.on('message', async (msg) => {
  if (!msg.text) return;

  const userId = msg.from.id;
  if (!pollDraft.has(userId)) return;

  const draft = pollDraft.get(userId);
  if (draft.stage !== 'awaiting_data') return;

  const parts = msg.text.split('|');
  if (parts.length !== 2) {
    return EsTeams.sendMessage(msg.chat.id, '⚠️ Invalid format. Use:\nQuestion | Option1, Option2');
  }

  const question = parts[0].trim();
  const options = parts[1].split(',').map(o => o.trim()).filter(Boolean);

  if (options.length < 2) {
    return EsTeams.sendMessage(msg.chat.id, '⚠️ Minimum of 2 options required.');
  }

  const pollId = Date.now().toString();
  activePolls.set(pollId, { question, options, votes: {}, messages: [] });
  pollDraft.delete(userId);

  const userRef = doc(db, 'botData', 'users');
  const snap = await getDoc(userRef);
  const targets = snap.exists() ? snap.data().ids || [] : [];

  for (const targetId of targets) {
    const buttons = options.map((opt, i) => [{ text: `${opt} 0`, callback_data: `vote_${pollId}_${i}` }]);
    buttons.push([{ text: '📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟', url: 'https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29', style: "primary" }]);

    const pollMsg = await EsTeams.sendPhoto(targetId, botImageUrl, {
      caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗣𝗢𝗟𝗟*\n\n📊 *${question}*\n\n_Tap a button to vote_\n\n𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });

    activePolls.get(pollId).messages.push({ chatId: targetId, messageId: pollMsg.message_id });
  }

  await EsTeams.sendMessage(msg.chat.id, '✅ Poll sent to all users! Voting is live.', { parse_mode: 'Markdown' });
});

EsTeams.on('callback_query', async (cb) => {
  if (!cb.data.startsWith('vote_')) return;

  const [, pollId, optionIndex] = cb.data.split('_');
  const poll = activePolls.get(pollId);
  if (!poll) return;

  const userId = cb.from.id;
  if (poll.votes[userId] !== undefined) {
    return EsTeams.answerCallbackQuery(cb.id, { text: '⚠️ You have already voted!', show_alert: true });
  }

  poll.votes[userId] = parseInt(optionIndex);

  // Count votes
  const counts = poll.options.map((_, i) => Object.values(poll.votes).filter(v => v === i).length);

  const updatedButtons = poll.options.map((opt, i) => [{ text: `${opt} ${counts[i]}`, callback_data: `vote_${pollId}_${i}` }]);
  updatedButtons.push([{ text: '📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟', url: 'https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29', style: "primary" }]);

  for (const msgInfo of poll.messages) {
    try {
      await EsTeams.editMessageReplyMarkup(msgInfo.chatId, msgInfo.messageId, { inline_keyboard: updatedButtons });
    } catch (e) {}
  }

  await EsTeams.answerCallbackQuery(cb.id, { text: '✅ Vote recorded!' });
});

//PUBLISH COMMAND
EsTeams.onText(/\/publish(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, '🚫 *Access Denied!*', { parse_mode: 'Markdown' });
  }

  const originalText = match[1]?.trim();
  let media = null;
  let mediaType = null;
  if (msg.reply_to_message) {
    const replied = msg.reply_to_message;
    if (replied.photo) {
      media = replied.photo[replied.photo.length - 1].file_id;
      mediaType = 'photo';
    } else if (replied.video) {
      media = replied.video.file_id;
      mediaType = 'video';
    } else if (replied.document) {
      media = replied.document.file_id;
      mediaType = 'document';
    } else if (replied.audio) {
      media = replied.audio.file_id;
      mediaType = 'audio';
    }
  }

  if (!originalText && !media) {
    return EsTeams.sendMessage(chatId,
      '📚 *Broadcast Usage Guide*\n\n' +
      '➤ Reply to a media message (photo, video, document, audio) with the command:\n' +
      '`/broadcast Your caption here`\n\n' +
      '➤ Or just send a text message with the command:\n' +
      '`/broadcast Your announcement here`',
      { parse_mode: 'Markdown' }
    );
  }

  const formattedText = originalText ? originalText.replace(/\\n/g, '\n') : '';

  let processingMsg = await EsTeams.sendMessage(chatId,
    '📡 *Broadcast Initialized!*\n\n' +
    '🔄 Preparing to deliver...\n' +
    '⏳ Stay tuned!',
    { parse_mode: 'Markdown' }
  );

  const userRef = doc(db, "botData", "users");
  const snap = await getDoc(userRef);
  const targets = snap.exists() ? snap.data().ids || [] : [];

  if (targets.length === 0) {
    return EsTeams.sendMessage(chatId, '📭 *No users found to broadcast!*', { parse_mode: 'Markdown' });
  }

  let successCount = 0;
  let failureCount = 0;
  const totalTargets = targets.length;
  let lastUpdate = Date.now();
  const startTime = Date.now();

  const footerText = '\n\n𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1';

  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗚𝗥𝗢𝗨𝗣', url: "https://chat.whatsapp.com/LudULrgRbs8El8TGJXYJ8L", style: "success" }],
         [{ text: '👤 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗢𝗪𝗡𝗘𝗥', url: "https://t.me/examsolutionteam", style: "success" }],
        [{ text: '📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟', url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  };

  for (const [index, targetId] of targets.entries()) {
    try {
      if (media) {
        switch (mediaType) {
          case 'photo':
            await EsTeams.sendPhoto(targetId, media, {
              caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\n${formattedText || ''}${footerText}`,
              parse_mode: 'Markdown',
              ...inlineKeyboard,
            });
            break;
          case 'video':
            await EsTeams.sendVideo(targetId, media, {
              caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\n${formattedText || ''}${footerText}`,
              parse_mode: 'Markdown',
              ...inlineKeyboard,
            });
            break;
          case 'document':
            await EsTeams.sendDocument(targetId, media, {
              caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\n${formattedText || ''}${footerText}`,
              parse_mode: 'Markdown',
              ...inlineKeyboard,
            });
            break;
          case 'audio':
            await EsTeams.sendAudio(targetId, media, {
              caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\n${formattedText || ''}${footerText}`,
              parse_mode: 'Markdown',
              ...inlineKeyboard,
            });
            break;
          default:
            await EsTeams.sendPhoto(targetId, botImageUrl, {
              caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\nText: ${formattedText || 'N/A'}${footerText}`,
              parse_mode: 'Markdown',
              ...inlineKeyboard,
            });
        }
      } else {
        await EsTeams.sendPhoto(targetId, botImageUrl, {
          caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧*\n\nText: ${formattedText || 'N/A'}${footerText}`,
          parse_mode: 'Markdown',
          ...inlineKeyboard,
        });
      }
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to send to ${targetId}:`, error.message);
      failureCount++;
    }

    const now = Date.now();
    const progress = Math.floor(((index + 1) / totalTargets) * 100);

    if (now - lastUpdate > 5000 || index === totalTargets - 1) {
      lastUpdate = now;
      try {
        await EsTeams.deleteMessage(chatId, processingMsg.message_id);
        processingMsg = await EsTeams.sendMessage(chatId,
          `📡 *Broadcast Progress*\n\n` +
          `👥 *Targets:* ${totalTargets}\n` +
          `✅ *Delivered:* ${successCount}\n` +
          `❌ *Failed:* ${failureCount}\n\n` +
          `Progress: ${progress}%\n` +
          `🕒 *Elapsed:* ${Math.floor((now - startTime) / 1000)}s`,
          { parse_mode: 'Markdown' }
        );
      } catch (e) {}
    }
  }

  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  try {
    await EsTeams.deleteMessage(chatId, processingMsg.message_id);
    await EsTeams.sendMessage(chatId,
      `🎯 *Broadcast Complete!*\n\n` +
      `👥 *Targets:* ${totalTargets}\n` +
      `✅ *Successfully Sent:* ${successCount}\n` +
      `❌ *Failures:* ${failureCount}\n` +
      `🕒 *Total Time:* ${totalTime} seconds\n\n` +
      (failureCount > 0 ? '⚠ _Some targets could not be reached._' : '✨ _Broadcast was perfect!_'),
      { parse_mode: 'Markdown' }
    );
  } catch (e) {}

  console.log(`✅ Broadcast complete: ${successCount}/${totalTargets} delivered successfully.`);
});

//======= AI IDENTITY GUARD =================//
const AI_IDENTITY_ANSWER = "I am a virtual business Ai created by ES TEAMS TECH";

const AI_IDENTITY_PATTERNS = [
    /\bwho\s+(?:made|created|built|designed|developed|programmed|coded|trained|invented|founded|owns|own|runs|manages|powers|wrote)\s+(?:you|u|this|thee?\s*bot|ya)\b/i,
    /\bwho(?:'?s| is| are)\s+(?:your|ur|thy)\s+(?:owner|creator|maker|developer|dev|father|mother|boss|master|founder|author|programmer|coder|designer|builder|company|manufacturer|provider|source|parent)\b/i,
    /\bwho\s+do\s+you\s+(?:belong|work)\s+(?:to|for)\b/i,
    /\bwhose\s+(?:bot|ai|assistant|creation|product|property)\s+(?:are\s+)?(?:you|u)\b/i,
    /\bwhose\s+(?:are\s+)?(?:you|u)\b/i,
    /\bwhat\s+(?:company|organisation|organization|team|brand)\s+(?:made|created|built|owns|developed)\s+(?:you|u)\b/i,
    /\b(?:what|which)\s+(?:ai|model|llm|language\s+model|gpt|version|engine|system|technology|tech)\s+(?:are\s+you|you\s+are|is\s+this|do\s+you\s+use|powers?\s+you|are\s+you\s+(?:based\s+on|running\s+on|built\s+on))\b/i,
    /\bare\s+you\s+(?:chat\s*)?(?:gpt|gpt-?\d|openai|claude|anthropic|gemini|bard|google|llama|meta|mistral|deepseek|grok|copilot|siri|alexa|perplexity|qwen|a\s+bot|a\s+robot|an?\s+ai|human|real|a\s+person|a\s+machine|a\s+language\s+model|an?\s+llm)\b/i,
    /\byou\s+are\s+(?:chat\s*)?(?:gpt|openai|claude|anthropic|gemini|bard|llama|mistral|deepseek|grok)\b/i,
    /\b(?:tell|say)\s+me\s+(?:about\s+)?(?:who|what)\s+(?:you\s+are|made\s+you|created\s+you)\b/i,
    /\b(?:introduce|describe)\s+your\s*self\b/i,
    /\bwho\s+(?:are|r)\s+(?:you|u)\b/i,
    /\bwhat\s+(?:are|r)\s+(?:you|u)\b/i,
    /\bwhat(?:'?s| is)\s+your\s+(?:name|identity|origin|model|source|version|maker|creator|owner|developer|company|brand)\b/i,
    /\bwhere\s+(?:were\s+you|did\s+you\s+(?:come|get))\s+(?:made|created|built|developed|trained|trained\s+from|from)\b/i,
    /\bwhere\s+(?:are|r)\s+(?:you|u)\s+from\b/i,
    /\bwho\s+(?:is|are)\s+behind\s+(?:you|this\s+bot|this\s+ai)\b/i,
    /\bwho\s+(?:programmed|deployed|hosted|launched|maintains)\s+(?:you|this)\b/i,
    /\bwho\s+(?:gave|taught)\s+you\b/i,
    /\bwhat\s+(?:powers|drives|runs)\s+(?:you|this\s+bot)\b/i,
    /\bare\s+you\s+(?:made|created|built|developed|powered|trained|owned)\s+by\b/i,
    /\bwho\s+(?:is|'?s|are)\s+(?:the\s+)?(?:brain|genius|mind|person|people|guy|man|woman|team|company)\s+behind\s+(?:you|this|it)\b/i,
    /\bare\s+you\s+(?:based|built|running|trained)\s+on\b/i,
    /\bwhat\s+(?:kind|type|sort)\s+of\s+(?:ai|bot|assistant|model)\s+(?:are\s+)?(?:you|u)\b/i,
    /\bdo\s+you\s+(?:have|work\s+for)\s+(?:an?\s+)?(?:owner|creator|company|boss)\b/i,
    /\bwho\s+sponsors?\s+(?:you|this)\b/i,
    /\bwhat\s+is\s+this\s+bot\b/i,
    /\bwho\s+trained\s+you\s+on\b/i,
    /\byour\s+(?:creator|maker|owner|developer|founder|author)\s*\?/i,
];

function identityGuardAnswer(text) {
    if (!text) return null;
    const clean = String(text).trim();
    if (!clean) return null;
    return AI_IDENTITY_PATTERNS.some(re => re.test(clean)) ? AI_IDENTITY_ANSWER : null;
}

// Scans an AI-generated REPLY (not the customer's question) for any
// self-identifying leak — e.g. the model breaking character and admitting
// "I'm Claude, made by Anthropic" instead of roleplaying the business. If any
// of these appear anywhere in the reply, the whole reply is discarded and
// replaced, since a partially-redacted refusal still reads as broken/leaked.
const AI_LEAK_KEYWORDS = [
    'claude', 'anthropic', 'chatgpt', 'chat gpt', 'openai', 'open ai',
    'gpt-3', 'gpt-4', 'gpt-5', 'gpt3', 'gpt4', 'gpt5', 'davidcyril',
    'gemini', 'bard', 'google ai', 'llama', 'meta ai', 'mistral', 'deepseek',
    'grok', 'copilot', 'perplexity', 'qwen', 'huggingface',
    'language model', 'large language model', 'an llm', 'i am an ai',
    "i'm an ai", 'as an ai', 'as an artificial intelligence',
    'i cannot roleplay', "i can't roleplay", 'i cannot pretend', "i can't pretend",
    'i am not able to pretend', 'i am not able to roleplay',
    'made by anthropic', 'created by anthropic', 'trained by anthropic',
    'made by openai', 'created by openai', 'trained by openai'
];

function containsAiLeak(text) {
    if (!text) return false;
    const lower = String(text).toLowerCase();
    return AI_LEAK_KEYWORDS.some(kw => lower.includes(kw));
}

function sanitizeAiReply(reply) {
    if (!reply) return reply;
    return (identityGuardAnswer(reply) || containsAiLeak(reply)) ? AI_IDENTITY_ANSWER : reply;
}

//======= SHARED FREE AI HELPER =================//
async function askFreeAI(prompt, timeoutMs = 15000) {
    const providers = [
        async () => {
            const data = await esApiPost("/api/v1/dev/ai", { prompt });
            if (!data.response) throw new Error('empty response');
            return String(data.response).trim();
        },
        async () => {
            const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`, { signal: AbortSignal.timeout(timeoutMs) });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const textReply = (await res.text()).trim();
            if (!textReply) throw new Error('empty response');
            return textReply;
        },
        async () => {
            const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=mistral`, { signal: AbortSignal.timeout(timeoutMs) });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const textReply = (await res.text()).trim();
            if (!textReply) throw new Error('empty response');
            return textReply;
        }
    ];

    for (let i = 0; i < providers.length; i++) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                return await providers[i]();
            } catch (err) {
                console.error(`askFreeAI provider ${i + 1}/${providers.length} attempt ${attempt} ERROR:`, err.message);
                if (attempt === 1) await new Promise(r => setTimeout(r, 700));
            }
        }
    }
    return null;
}

// AI Command
EsTeams.onText(/\/gpt(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1] ? match[1].trim() : null;

    const whatsappButton = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    };

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: whatsappButton.reply_markup
        });
    }

    if (!query) {
        return EsTeams.sendMessage(chatId, "*Invalid Input*\n\nPlease use `/gpt <text>`", {
            parse_mode: "Markdown",
            reply_markup: whatsappButton.reply_markup
        });
    }

    try {
        // Show typing animation
        await EsTeams.sendChatAction(chatId, 'typing');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const aiResponse = identityGuardAnswer(query) || sanitizeAiReply(await askFreeAI(query));
        if (!aiResponse) {
            throw new Error("All AI providers failed");
        }

        const caption = `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗔𝗜*\n\n*Response:*\n${aiResponse}\n\n*𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦*`;

        await EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption,
            parse_mode: "Markdown",
            reply_markup: whatsappButton.reply_markup
        });

    } catch (error) {
        console.error("AI Error:", error);
        await EsTeams.sendMessage(chatId, "⚠️ *An error occurred.* Please try again later.", {
            parse_mode: "Markdown",
            reply_markup: whatsappButton.reply_markup
        });
    }
});

//rentbot Command
EsTeams.onText(/^\/rentbot(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const token = match[1] ? match[1].trim() : null;

    const whatsappButton = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    };
    
    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}


    if (!token) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "*Invalid Input*\n\nPlease use `/rentbot <TELEGRAM_BOT_TOKEN>`",
            parse_mode: "Markdown",
            ...whatsappButton
        });
    }

    let isValid = false;
    let botUsername = '';

    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
        const json = await res.json();
        if (json.ok && json.result) {
            isValid = true;
            botUsername = json.result.username;
        }
    } catch {}

    if (!isValid) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "*❌ Invalid Telegram Bot Token*",
            parse_mode: "Markdown",
            ...whatsappButton
        });
    }

    await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `*✅ Bot Deployed Successfully!*\n\nWait for approval. This may take 3–4 hours from ES Teams.`,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🤖 𝗖𝗛𝗔𝗧 𝗬𝗢𝗨𝗥 𝗕𝗢𝗧", url: `https://t.me/${botUsername}` }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });

    EsTeams.sendPhoto(adminId, botImageUrl, {
        caption: `*🔐 Clone Bot Approval*\n\nBot: [@${botUsername}](https://t.me/${botUsername})\nUser ID: [${userId}](tg://user?id=${userId})`,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "👤 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗖𝗟𝗢𝗡𝗘𝗥", url: `tg://user?id=${userId}` }],
                [
                    { text: "☑️ 𝗖𝗢𝗡𝗙𝗶𝗥𝗠 𝗖𝗟𝗢𝗡𝗘", callback_data: `approve_rentbot_${userId}_${botUsername}` },
                    { text: "❌ 𝗗𝗘𝗖𝗟𝗜𝗡𝗘 𝗖𝗟𝗢𝗡𝗘", callback_data: `xrentbot_${userId}` }
                ],
                [{ text: "📋 𝗖𝗢𝗣𝗬 𝗧𝗢𝗞𝗘𝗡", callback_data: `copytoken_rentbot_${token}` }]
            ]
        }
    });
});

// Callback handler
EsTeams.on('callback_query', async (query) => {
    const data = query.data;
    const msg = query.message;

    try {
        if (data.startsWith('approve_rentbot_')) {
            const [userId, botUsername] = data.split('_').slice(2);
            await EsTeams.sendMessage(userId, `✅ Your request has been approved.\nYour bot [@${botUsername}](https://t.me/${botUsername}) is now active.`, {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });

            await EsTeams.sendMessage(adminId, `✅ Bot [@${botUsername}](https://t.me/${botUsername}) has been approved and user notified.`, {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });

            return EsTeams.answerCallbackQuery(query.id, { text: "User has been notified." });
        }

        if (data.startsWith('xrentbot_')) {
            const userId = data.replace('xrentbot_', '');
            await EsTeams.sendMessage(userId, `❌ Your bot did not meet our requirements.\nPlease try again later.`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });

            await EsTeams.sendMessage(adminId, `☑️ Declined bot request for user ID: ${userId}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });

            return EsTeams.answerCallbackQuery(query.id, { text: "User has been notified." });
        }

        if (data.startsWith('copytoken_rentbot_')) {
            const token = data.replace('copytoken_rentbot_', '');
            await EsTeams.sendMessage(adminId, `*TOKEN:*\n\`${token}\``, {
                parse_mode: "Markdown"
            });

            return EsTeams.answerCallbackQuery(query.id, { text: "Token sent in chat." });
        }
    } catch (err) {
        console.error("Callback error:", err.message);
        try {
            return EsTeams.answerCallbackQuery(query.id, { text: "❌ Callback failed or expired.", show_alert: true });
        } catch {}
    }
});

//Check Rent Command
EsTeams.onText(/^\/checkrent$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const isOwner = CONFIG.OWNER_IDS.includes(userId);

    if (!isOwner) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "*❌ Access Denied*\n\nOnly ES TEAMS can use this command.",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    const fileContent = fs.readFileSync('esteams.js', 'utf-8');
    const tokenMatches = fileContent.match(/'(\d+:[\w-]+)'/g) || [];
    const tokens = tokenMatches.map(t => t.replace(/'/g, ''));

    if (tokens.length === 0) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "*No bot tokens found in esteams.js*",
            parse_mode: "Markdown"
        });
    }

    const bots = [];
    for (let token of tokens) {
        try {
            const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
            const json = await res.json();
            bots.push({
                token,
                username: json.ok ? json.result.username : 'Unknown',
                name: json.ok ? json.result.first_name : 'Unknown Bot'
            });
        } catch {
            bots.push({
                token,
                username: 'Unknown',
                name: 'Unknown Bot'
            });
        }
    }

    const botButtons = bots.map(b => ([{
        text: `🤖 ${b.name}`,
        callback_data: `viewbot_${b.token}`
    }]));

    return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗢𝗧 𝗟𝗜𝗦𝗧",
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [...botButtons, [
                { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }
            ]]
        }
    });
});

// Callback Query Handler
EsTeams.on('callback_query', async (query) => {
    const data = query.data;
    const msg = query.message;
    const chatId = msg.chat.id;

    if (data.startsWith('viewbot_')) {
        const token = data.replace('viewbot_', '');
        let username = 'Unknown';
        let name = 'Unknown Bot';
        let adminId = 5523737392;

        try {
            const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
            const json = await res.json();
            if (json.ok) {
                username = json.result.username || 'Unknown';
                name = json.result.first_name || 'Unknown Bot';
            }
        } catch {}

        await EsTeams.deleteMessage(chatId, msg.message_id);

        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "𝗨𝗦𝗘𝗥 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "✅ 𝗖𝗢𝗡𝗙𝗜𝗥𝗠 𝗧𝗢𝗞𝗘𝗡", callback_data: `confirmtoken_${token}` }],
                    [{ text: "👤 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗢𝗪𝗡𝗘𝗥", url: `tg://user?id=${adminId}` }],
                    [{ text: "🤖 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗕𝗢𝗧", url: username === 'Unknown' ? 'https://t.me/esteams_btc' : `https://t.me/${username}` }],
                    [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "back_to_list" }]
                ]
            }
        });
    }

    if (data.startsWith('confirmtoken_')) {
        const token = data.replace('confirmtoken_', '');
        let status;

        try {
            const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
            const json = await res.json();
            status = json.ok
                ? "✅ Token is still *active*"
                : "❌ Token is *not active*";
        } catch {
            status = "❌ Error checking token";
        }

        await EsTeams.deleteMessage(chatId, msg.message_id);

        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `𝗧𝗢𝗞𝗘𝗡 𝗦𝗧𝗔𝗧𝗨𝗦\n\n${status}`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }],
                    [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "back_to_list" }]
                ]
            }
        });
    }

    if (data === 'back_to_list') {
        const fileContent = fs.readFileSync('esteams.js', 'utf-8');
        const tokenMatches = fileContent.match(/'(\d+:[\w-]+)'/g) || [];
        const tokens = tokenMatches.map(t => t.replace(/'/g, ''));

        const bots = [];
        for (let token of tokens) {
            try {
                const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
                const json = await res.json();
                bots.push({
                    token,
                    username: json.ok ? json.result.username : 'Unknown',
                    name: json.ok ? json.result.first_name : 'Unknown Bot'
                });
            } catch {
                bots.push({
                    token,
                    username: 'Unknown',
                    name: 'Unknown Bot'
                });
            }
        }

        const botButtons = bots.map(b => ([{
            text: `🤖 ${b.name}`,
            callback_data: `viewbot_${b.token}`
        }]));

        await EsTeams.deleteMessage(chatId, msg.message_id);

        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗢𝗧 𝗟𝗜𝗦𝗧",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [...botButtons, [
                    { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }
                ]]
            }
        });
    }
});

// FACEBOOK COMMAND
EsTeams.onText(/\/facebook(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1]?.trim();

  if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

  if (!url) {
    return EsTeams.sendMessage(chatId, "⚠️ Invalid Input\n\nPlease use `/facebook <video link>`", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const waiting = await EsTeams.sendMessage(chatId, "📽️ Fetching your Facebook video. Please hold on...", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  try {
    const json = await esApiGet("/api/v1/dev/facebook", { url });

    const videoUrl = json.hd_download_url || json.sd_download_url;
    if (!videoUrl) {
      return EsTeams.editMessageText("⚠️ Could not fetch video link. Try another URL.", {
        chat_id: chatId,
        message_id: waiting.message_id,
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    const filePath = `ES_TEAMS-MEDIA/video/${chatId}.mp4`;
    const response = await fetch(videoUrl);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    const stats = fs.statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB <= 50) {
      await EsTeams.sendVideo(chatId, filePath, {
        caption: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    } else {
      const form = new FormData();
      form.append("file", fs.createReadStream(filePath));

      const gofileRes = await fetch("https://apiv2.gofile.io/uploadFile", { method: "POST", body: form });
      const gofileJson = await gofileRes.json();

      if (gofileJson.status !== "ok") {
        throw new Error("GoFile upload failed");
      }

      const downloadLink = gofileJson.data.downloadPage;

      await EsTeams.sendMessage(chatId, `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗙𝗕 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n\n⚠️ Video is too large\n\nClick the Button below for Direct Download:`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗩𝗜𝗗𝗘𝗢", url: downloadLink }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Facebook Download Error:", err);
    await EsTeams.editMessageText("❌ Error downloading the Facebook video. Please try again later.", {
      chat_id: chatId,
      message_id: waiting.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//INSTAGRAM DOWNLOADER
EsTeams.onText(/^\/instagram(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (!url) {
    return EsTeams.sendMessage(chatId, '❌ Invalid input.\nPlease use /instagram <reel link>', {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const wait = await EsTeams.sendMessage(chatId, '🔄 Processing your Instagram reel...', {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  async function downloadInstagramVideo(videoUrl, filePath) {
    const writer = fs.createWriteStream(filePath);

    const response = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.instagram.com/',
        'Accept': '*/*',
      },
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  try {

    const data = await esApiGet("/api/v1/dev/instagram", { url });

    const videoUrl = data.download_url;

    if (!videoUrl)
      throw new Error('No downloadable link found.');

    const filePath = `ES_TEAMS-MEDIA/video/${chatId}.mp4`;

    await downloadInstagramVideo(videoUrl, filePath);

    await EsTeams.sendVideo(chatId, filePath, {
      caption: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(filePath);

    await EsTeams.deleteMessage(chatId, wait.message_id);

  } catch (err) {

    await EsTeams.deleteMessage(chatId, wait.message_id).catch(() => {});

    await EsTeams.sendMessage(chatId, `❌ Failed to download reel.\n\n${err.message}`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//========== USERS COMMAND =================//
const USERS_PAGE_SIZE = 10;

function escapeMarkdown(text) {
  return String(text).replace(/([_*`\[])/g, '\\$1');
}

async function resolveUserLabel(userId) {
  try {
    const chat = await EsTeams.getChat(userId);
    const name = chat.username
      ? `@${chat.username}`
      : [chat.first_name, chat.last_name].filter(Boolean).join(' ') || null;
    if (!name) return null;
    const trimmed = name.length > 30 ? name.slice(0, 27) + '...' : name;
    return escapeMarkdown(trimmed);
  } catch {
    return null;
  }
}

async function buildUsersStatsView(totalUsers, refreshed) {
  const caption = `
📊 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗨𝗦𝗘𝗥 𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘*

👥 Total Registered Users: *${totalUsers}*

✅ Database ${refreshed ? 'refreshed' : 'synced'} successfully.

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ
`;
  return {
    caption,
    keyboard: {
      inline_keyboard: [
        [{ text: "👥 𝗩𝗜𝗘𝗪 𝗨𝗦𝗘𝗥𝗦", callback_data: "users_page_1" }],
        [{ text: "🔁 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "users_refresh" }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }],
      ],
    },
  };
}

async function buildUsersPageView(users, page) {
  const totalUsers = users.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / USERS_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * USERS_PAGE_SIZE;
  const pageIds = users.slice(start, start + USERS_PAGE_SIZE);

  const labels = await Promise.allSettled(pageIds.map(id => resolveUserLabel(id)));
  const lines = pageIds.map((id, i) => {
    const resolved = labels[i].status === 'fulfilled' ? labels[i].value : null;
    return `${start + i + 1}. ${resolved || `ID: ${id}`}`;
  });

  const caption =
    `👥 *𝗨𝗦𝗘𝗥 𝗟𝗜𝗦𝗧* — Page ${safePage}/${totalPages}\n\n` +
    (lines.length ? lines.join('\n') : '_No users on this page._') +
    `\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

  const navRow = [];
  if (safePage > 1) navRow.push({ text: "⬅️ 𝗕𝗔𝗖𝗞", callback_data: `users_page_${safePage - 1}` });
  navRow.push({ text: "🏠 𝗛𝗢𝗠𝗘", callback_data: "users_home" });
  if (safePage < totalPages) navRow.push({ text: "𝗡𝗘𝗫𝗧 ➡️", callback_data: `users_page_${safePage + 1}` });

  return {
    caption,
    keyboard: {
      inline_keyboard: [
        navRow,
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }],
      ],
    },
  };
}

EsTeams.onText(/\/users/, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== adminId) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `❌ You are not authorized to use this command.`,
      reply_markup: { inline_keyboard: waButton },
    });
  }

  async function sendUserStats() {
    try {
      const users = await readUsers();
      const { caption, keyboard } = await buildUsersStatsView(users.length, false);

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    } catch (err) {
      console.error("Users command error:", err.message);
      await EsTeams.sendMessage(chatId, "⚠️ Error fetching user data.");
    }
  }

  await sendUserStats();
});

//======= CALLBACK REFRESH =================//
EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "users_refresh") {
    try {
      await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
      const users = await readUsers();
      const { caption, keyboard } = await buildUsersStatsView(users.length, true);

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    } catch (err) {
      console.error("Users refresh error:", err.message);
    }
  } else if (data && (data.startsWith("users_page_") || data === "users_home")) {
    if (query.from.id !== adminId) {
      return EsTeams.answerCallbackQuery(query.id, { text: "Not authorized." }).catch(() => {});
    }
    try {
      const users = await readUsers();
      let view;
      if (data === "users_home") {
        view = await buildUsersStatsView(users.length, false);
      } else {
        const page = parseInt(data.replace("users_page_", ""), 10) || 1;
        view = await buildUsersPageView(users, page);
      }

      await EsTeams.editMessageCaption(view.caption, {
        chat_id: chatId,
        message_id: query.message.message_id,
        parse_mode: "Markdown",
        reply_markup: view.keyboard,
      });
      await EsTeams.answerCallbackQuery(query.id).catch(() => {});
    } catch (err) {
      console.error("Users page error:", err.message);
      await EsTeams.answerCallbackQuery(query.id, { text: "⚠️ Could not load that page." }).catch(() => {});
    }
  } else {
    await EsTeams.answerCallbackQuery(query.id, { text: "OK" }).catch(() => {});
  }
});

//========= BTC STATUS COMMAND =================//
EsTeams.onText(/\/btcstats/, async (msg) => {
  const chatId = msg.chat.id;

if (msg.from.id !== adminId) {
    return EsTeams.sendMessage(chatId, 'This command is for the admin only.', {
      reply_markup: {
        inline_keyboard: [[
          { text: '📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟', url: 'https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29', style: "primary" }
        ]]
      }
    });
  }
  
  async function sendBTCStatus() {
    try {
      let status = "⚪ 𝗜𝗡𝗔𝗖𝗧𝗜𝗩𝗘";
      let runtime = "N/A";

      if (global.btcLastPing) {
        const diff = Date.now() - global.btcLastPing;
        const seconds = Math.floor(diff / 1000);

        status = diff < 15000 ? "🟢 𝗔𝗖𝗧𝗜𝗩𝗘" : "⚪ 𝗜𝗡𝗔𝗖𝗧𝗜𝗩𝗘";
        runtime = `${seconds}s ago`;
      }

      const caption = `
📡 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗕𝗧𝗖 𝗦𝗬𝗦𝗧𝗘𝗠 𝗖𝗛𝗘𝗖𝗞*

━━━━━━━━━━━━━━━
⚙️ 𝗦𝗧𝗔𝗧𝗨𝗦 : *${status}*
⏱ 𝗟𝗔𝗦𝗧 𝗣𝗜𝗡𝗚 : *${runtime}*
━━━━━━━━━━━━━━━

✅ 𝗜𝗡𝗧𝗘𝗥𝗩𝗔𝗟 𝗠𝗢𝗡𝗜𝗧𝗢𝗥𝗜𝗡𝗚 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ
`;

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔁 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "btc_refresh" }],
            [
              {
                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29",
              },
            ],
          ],
        },
      });
    } catch (err) {
      console.error("BTC status error:", err.message);
      await EsTeams.sendMessage(chatId, "⚠️ Error checking BTC status.");
    }
  }

  await sendBTCStatus();
});


//======= BTC CALLBACK REFRESH =================//
EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "btc_refresh") {
    try {
      await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});

      let status = "⚪ 𝗜𝗡𝗔𝗖𝗧𝗜𝗩𝗘";
      let runtime = "N/A";

      if (global.btcLastPing) {
        const diff = Date.now() - global.btcLastPing;
        const seconds = Math.floor(diff / 1000);

        status = diff < 15000 ? "🟢 𝗔𝗖𝗧𝗜𝗩𝗘" : "⚪ 𝗜𝗡𝗔𝗖𝗧𝗜𝗩𝗘";
        runtime = `${seconds}s ago`;
      }

      const caption = `
📡 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗕𝗧𝗖 𝗦𝗬𝗦𝗧𝗘𝗠 𝗖𝗛𝗘𝗖𝗞*

━━━━━━━━━━━━━━━
⚙️ 𝗦𝗧𝗔𝗧𝗨𝗦 : *${status}*
⏱ 𝗟𝗔𝗦𝗧 𝗣𝗜𝗡𝗚 : *${runtime}*
━━━━━━━━━━━━━━━

♻️ 𝗦𝗧𝗔𝗧𝗨𝗦 𝗥𝗘𝗙𝗥𝗘𝗦𝗛𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ
`;

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔁 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "btc_refresh" }],
            [
              {
                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29",
              },
            ],
          ],
        },
      });

    } catch (err) {
      console.error("BTC refresh error:", err.message);
    }
  }
});

// BACKUP COMMAND
EsTeams.onText(/\/backup/, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== adminId) {
    return EsTeams.sendMessage(chatId, 'This command is for the admin only.', {
      reply_markup: {
        inline_keyboard: [[
          { text: '📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟', url: 'https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29', style: "primary" }
        ]]
      }
    });
  }

  const waitingMsg = await EsTeams.sendMessage(chatId, 'Processing backup. Please hold on...');

  const zipFilePath = './backup.zip';
  const output = fs.createWriteStream(zipFilePath);

  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', async () => {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(zipFilePath), '𝗘𝗦_𝗧𝗘𝗔𝗠𝗦-𝗕𝗔𝗖𝗞𝗨𝗣.zip');

      const uploadRes = await axios.post('https://upload.gofile.io/uploadfile', form, {
        headers: { 
          ...form.getHeaders(), 
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://gofile.io/',
          'Accept': '*/*'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const downloadURL = uploadRes.data.data.downloadPage;

      await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: '𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗔𝗖𝗞𝗨𝗣',
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { 
                text: '𝗖𝗢𝗣𝗬 𝗨𝗥𝗟', 
                copy_text: { text: downloadURL } 
              }
            ],
            [
              { 
                text: '📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟', 
                url: 'https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29', 
                style: "primary" 
              }
            ]
          ]
        }
      });

      fs.unlinkSync(zipFilePath);
    } catch (error) {
      console.error('Upload error:', error);
      await EsTeams.sendMessage(chatId, 'An error occurred during the backup upload.', {
        reply_markup: {
          inline_keyboard: [[
            { text: '📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟', url: 'https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29', style: "primary" }
          ]]
        }
      });
    }
  });

  archive.on('error', (err) => {
    console.error('Archive error:', err);
    EsTeams.sendMessage(chatId, 'An error occurred during the backup process.', {
      reply_markup: {
        inline_keyboard: [[
          { text: '📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟', url: 'https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29', style: "primary" }
        ]]
      }
    });
  });

  archive.pipe(output);

  archive.append(fs.createReadStream('esteams.js'), { name: 'esteams.js' });
  archive.append(fs.createReadStream('package.json'), { name: 'package.json' });
  archive.append(fs.createReadStream('esteamspro.json'), { name: 'esteamspro.json' });
  archive.append(fs.createReadStream('blacklist.json'), { name: 'blacklist.json' });
  archive.append(fs.createReadStream('firebase.js'), { name: 'firebase.js' });
  archive.append(fs.createReadStream('auto_push.py'), { name: 'auto_push.py' });
  archive.append(fs.createReadStream('ES_TEAMS.md'), { name: 'ES_TEAMS.md' });

  archive.directory('ES_TEAMS-MEDIA', 'ES_TEAMS-MEDIA');
  archive.directory('ES_TEAMS-KEYS', 'ES_TEAMS-KEYS');

  await archive.finalize();
});

//SCAN QR COMMAND
EsTeams.onText(/^\/scanqr$/, async (msg) => {
  const chatId = msg.chat.id;
  const reply = msg.reply_to_message;
 
 if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
  
  if (!reply || !reply.photo) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: '❌ Please reply to an image containing a QR code.',
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const waitingMsg = await EsTeams.sendMessage(chatId, '🔄 Processing image. Please hold on...');

  try {
    const photoArray = reply.photo;
    const highestResPhoto = photoArray[photoArray.length - 1];
    const fileId = highestResPhoto.file_id;
    const file = await EsTeams.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

    // Use QR Server API to decode
    const apiUrl = `https://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURIComponent(fileUrl)}`;
    const response = await axios.get(apiUrl);
    const qrData = response.data[0].symbol[0].data;

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    if (!qrData) {
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: '❌ The image does not contain a valid QR code.',
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗤𝗥𝗥 𝗗𝗔𝗧𝗔\n\n\`${qrData}\`\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    } catch (err) {
    console.error("QR scan error:", err.message);
    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: '❌ An error occurred while processing the QR code. Please try again later.',
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

// GROUP ID COMMAND
EsTeams.onText(/^\/gcid$/, async (msg) => {
  const chatId = msg.chat.id;

  if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

  if (msg.chat.type === "private") {
    return EsTeams.sendMessage(chatId, "❌ *Command only used in group*", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  try {
    const botMember = await EsTeams.getChatMember(chatId, (await EsTeams.getMe()).id);
    if (botMember.status !== "administrator" && botMember.status !== "creator") {
      return EsTeams.sendMessage(chatId, "❌ *Bot must be admin*", {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    const userMember = await EsTeams.getChatMember(chatId, msg.from.id);
    if (userMember.status !== "administrator" && userMember.status !== "creator") {
      return EsTeams.sendMessage(chatId, "❌ *You are not admin*", {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }
    return EsTeams.sendMessage(chatId, `✅ *Group ID:* \`${chatId}\``, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

  } catch (err) {
    console.log(err.message);
    return EsTeams.sendMessage(chatId, "⚠️ *An error occurred. Please try again.*", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//TECHNEWS COMMAND
EsTeams.onText(/^\/technews$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
      return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    const techMessage = await EsTeams.sendMessage(chatId, "🔄 *Searching for available News. Please Wait...*", { parse_mode: "Markdown" });

    const data = await esApiGet("/api/v1/dev/technews", { limit: 5 });

    if (!data.stories || !data.stories.length) {
      await EsTeams.deleteMessage(chatId, techMessage.message_id);

      return EsTeams.sendMessage(chatId, "❌ Failed to fetch Tech News. Please try again later.", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    const story = data.stories[Math.floor(Math.random() * data.stories.length)];

    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗧𝗘𝗖𝗛 𝗡𝗘𝗪𝗦\n\n𝗧𝗶𝘁𝗹𝗲:*${story.title}*\n\n👤 By: ${story.author || "Unknown"}\n⭐ Score: ${story.score}\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🌐 𝗩𝗜𝗘𝗪 𝗔𝗥𝗧𝗜𝗖𝗟𝗘", url: story.url }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      },
      parse_mode: "Markdown"
    };

    await EsTeams.deleteMessage(chatId, techMessage.message_id);

    return EsTeams.sendMessage(chatId, caption, buttons);

  } catch (err) {
    console.error(err.message);

    return EsTeams.sendMessage(chatId, "❌ Failed to fetch Tech News. Please try again later.", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});



//FAKEWAPP COMMAND
EsTeams.onText(/^\/fakewapp(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!input || !input.includes(",") || input.split(",").length < 3) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "*Invalid Input*\n\nPlease use:\n`/fakewapp NAME, NUMBER IN INTERNATIONAL FORMAT, STATUS NAME`",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const [name, numberRaw, ...statusParts] = input.split(",");
  const number = numberRaw.trim().replace(/[^+\d]/g, "");
  const status = statusParts.join(",").trim();
  const filePath = `ES_TEAMS-MEDIA/image/${chatId}.jpg`;

  const wait = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: "🖼️ *Processing fake WhatsApp profile image...*",
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  try {
    const imageBuffer = await esApiGet("/api/v1/dev/fakewa", { name: name.trim(), number, status });
    fs.writeFileSync(filePath, imageBuffer);

    await EsTeams.deleteMessage(chatId, wait.message_id);

    await EsTeams.sendPhoto(chatId, filePath, {
      caption: "*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ*",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(filePath);
  } catch (e) {
    await EsTeams.deleteMessage(chatId, wait.message_id);
    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ *Failed to generate image. Please try again later.*",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

// Waban command
EsTeams.onText(/^\/waban$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const isPremium = premiumUsers.includes(userId);

    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗕𝗔𝗡\n\n𝗦𝘁𝗮𝘁𝘀: ${isPremium ? 'Premium' : 'Not Premium'}`;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    await EsTeams.sendPhoto(chatId, 'https://files.catbox.moe/044a0v.jpg', {
        caption,
        reply_markup: {
            inline_keyboard: [
                [{ text: '𝗝𝗢𝗜𝗡 𝗣𝗥𝗘𝗠𝗜𝗨𝗠', callback_data: 'pay_5000' }],
                ...waButton
            ]
        }
    });
});


//========== PAYMENT HANDLER ================//

EsTeams.on("callback_query", async (query) => {

    const data = query.data;

    if (data !== "pay_5000") return;

    try {

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: `user${query.from.id}@es-teams.bot`,
                amount: 5000 * 100,
                currency: "NGN"
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const paymentUrl = response.data.data.authorization_url;

        await EsTeams.sendMessage(
            query.message.chat.id,
            `💳 *𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘 𝗣𝗔𝗬𝗠𝗘𝗡𝗧*\n\nClick below to pay ₦5000.`,
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "💰 𝗣𝗔𝗬 𝗡𝗢𝗪",
                                url: paymentUrl
                            }
                        ]
                    ]
                }
            }
        );

        await EsTeams.answerCallbackQuery(query.id);

    } catch (err) {

        console.log(err.response?.data || err.message);

        await EsTeams.sendMessage(
            query.message.chat.id,
            "❌ Payment link generation failed."
        );

    }

});

//WEBSCRAPE COMMAND
EsTeams.onText(/\/webscrape(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const isPremium = premiumUsers.includes(userId);
  const url = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  // PREMIUM CHECK
  if (!isPremium) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `💎 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗥𝗘𝗠𝗜𝗨𝗠*\n\nThis command is only available for premium users.\n\n💰 Price: ₦5000`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: '𝗝𝗢𝗜𝗡 𝗣𝗥𝗘𝗠𝗜𝗨𝗠', callback_data: 'pay_5000' }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
        ]
      }
    });
  }

  if (!url || !url.startsWith("http")) {
    return EsTeams.sendMessage(chatId, "❌ *Invalid input*\n\nPlease use `/webscrape <link>`", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  let waitMsg = await EsTeams.sendMessage(chatId, "🧲 Scraping your web page please hold on...", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch content");

    const content = await response.text();

    let extension = url.split(".").pop().split(/[?#]/)[0];
    if (!extension || extension.length > 5 || extension.includes("/")) extension = "txt";

    const fileName = `ES_TEAMS-${chatId}.${extension}`;
    const filePath = `ES_TEAMS-MEDIA/${fileName}`;

    fs.writeFileSync(filePath, content);

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const goFileRes = await axios.post('https://store1.gofile.io/uploadFile', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    const gofileUrl = goFileRes?.data?.data?.downloadPage || "https://gofile.io";

    await EsTeams.deleteMessage(chatId, waitMsg.message_id);

    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗪𝗘𝗕𝗦𝗖𝗥𝗔𝗣𝗘𝗥*\n\n*Status:* Success\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ*`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬇️ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗙𝗜𝗟𝗘", url: gofileUrl }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("WebScrape Error:", err.message || err);

    try { await EsTeams.deleteMessage(chatId, waitMsg.message_id); } catch {}

    EsTeams.sendMessage(chatId, "❌ *Failed to scrape the web page.*\nPlease ensure the link is valid and try again.", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//WEBSCRAPE PDF
EsTeams.onText(/\/topdf(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!url || !url.startsWith("http")) {
    return EsTeams.sendMessage(chatId, "❌ *Invalid input*\n\nPlease use `/topdf <valid website link>`", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  let waitMsg = await EsTeams.sendMessage(chatId, "📄 Generating your PDF from webpage, please hold on...", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  const filePath = `ES_TEAMS-MEDIA/ES_TEAMS-${chatId}.pdf`;

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.pdf({ path: filePath, format: "A4" });

    await browser.close();

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const gofileRes = await axios.post("https://store1.gofile.io/uploadFile", form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    const gofileUrl = gofileRes?.data?.data?.downloadPage || "https://gofile.io";

    await EsTeams.deleteMessage(chatId, waitMsg.message_id);

    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗪𝗘𝗕 𝗧𝗢 𝗣𝗗𝗙*\n\n*Status:* PDF ready 📄\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ*`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬇️ DOWNLOAD PDF", url: gofileUrl }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("ToPDF Render Error:", err.message || err);
    try { await EsTeams.deleteMessage(chatId, waitMsg.message_id); } catch {}

    EsTeams.sendMessage(chatId, "❌ *Failed to render the PDF.*\nEnsure the site is reachable and not blocking automated access.", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

// WEBSITE DOWNLOADER
EsTeams.onText(/^\/webdl(?:\s+(.*))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const isPremium = premiumUsers.includes(userId);
  const url = match[1];

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]
      }
    });
  }

  // PREMIUM CHECK
  if (!isPremium) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `💎 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗥𝗘𝗠𝗜𝗨𝗠*\n\nThis command is only available for premium users.\n\n💰 Price: ₦5000`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: '𝗝𝗢𝗜𝗡 𝗣𝗥𝗘𝗠𝗜𝗨𝗠', callback_data: 'pay_5000' }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
        ]
      }
    });
  }

  if (!url || !url.startsWith("http")) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗖𝗼𝗺𝗺𝗮𝗻𝗱\n\nPlease use:\n`/webdl WEBSITE_URL`",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]
      }
    });
  }

  const waitMsg = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: "🔄 Processing your Webpage, please hold on...",
    reply_markup: {
      inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]
    }
  });

  try {
    const data = await esApiGet("/api/v1/dev/downloadweb", { url });

    if (data.finalUrl) {
      await EsTeams.deleteMessage(chatId, waitMsg.message_id);

      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗪𝗘𝗕𝗦𝗜𝗧𝗘 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n\nStatus: Success\nType: ${data.contentType}\nSize: ${data.size}\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗨𝗥𝗟", url: data.finalUrl }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });

    } else {
      throw new Error("No valid download URL in the response.");
    }
  } catch (err) {
    console.error("WEB DL Error:", err.message || err);

    try { await EsTeams.deleteMessage(chatId, waitMsg.message_id); } catch {}

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ Failed to download the webpage. Please check the link and try again.",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]
      }
    });
  }
});

// CRYPTO COMMAND
EsTeams.onText(/^\/crypto$/, async (msg) => {
    const chatId = msg.chat.id;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "❌ 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗\n\nKindly Check back later ...",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    cryptoSessions2[chatId] = { step: 1 };
    return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗦𝗧𝗔𝗧𝗦\n\nPlease type in the crypto pair you want to view in this format:\n\n*BTC/USDT*`,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "crypto_cancel" }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
});

EsTeams.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const session = cryptoSessions2[chatId];
    if (!session || session.step !== 1 || !msg.text) return;

    const input = msg.text.trim().toUpperCase();

    if (!input.includes("/")) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `❌ Invalid format.\n\nPlease use this format:\n*BTC/USDT*, *ETH/USDC*, *DOGE/ETH*, etc.`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "crypto_cancel" }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    session.coin = input;
    session.step = 2;
    return showSelection(chatId, session.coin);
});

async function showSelection(chatId, coin) {
    await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗦𝗧𝗔𝗧𝗦\n\nPlease select the following:`,
        reply_markup: {
            inline_keyboard: [
                [{ text: "💸 𝗦𝗣𝗢𝗧", callback_data: `spot2_${coin}` }],
                [{ text: "📈 𝗙𝗨𝗧𝗨𝗥𝗘𝗦", callback_data: `futures2_${coin}` }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

async function getBybitPrice(coin) {
    const symbol = coin.replace("/", "").toUpperCase();
    try {
        const resp = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`);
        const data = await resp.json();
        if (data.retCode !== 0 || !data.result?.list?.[0]) return null;
        return data.result.list[0].lastPrice;
    } catch {
        return null;
    }
}

async function getBybitFuturesPrice(coin) {
    const symbol = coin.replace("/", "").toUpperCase();
    try {
        const resp = await fetch(`https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`);
        const data = await resp.json();
        if (data.retCode !== 0 || !data.result?.list?.[0]) return null;
        return data.result.list[0].lastPrice;
    } catch {
        return null;
    }
}

EsTeams.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const data = query.data;
    const session = cryptoSessions2[chatId];

    if (!session && !data.startsWith("refresh_")) return;

    if (data === "crypto_cancel") {
        delete cryptoSessions2[chatId];
        await EsTeams.deleteMessage(chatId, messageId).catch(() => {});
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "❌ Session cancelled." });
    }

    if (data.startsWith("spot2_")) {
        const coin = data.replace("spot2_", "");
        await EsTeams.deleteMessage(chatId, messageId).catch(() => {});
        const price = await getBybitPrice(coin);
        return sendPrice(chatId, coin, price, "spot2");
    }

    if (data.startsWith("futures2_")) {
        const coin = data.replace("futures2_", "");
        await EsTeams.deleteMessage(chatId, messageId).catch(() => {});
        const price = await getBybitFuturesPrice(coin);
        return sendPrice(chatId, coin, price, "futures2");
    }

    if (data.startsWith("refresh_spot2_")) {
        const coin = data.replace("refresh_spot2_", "");
        await EsTeams.answerCallbackQuery(query.id, { text: `🔄 REFRESHING ${coin} SPOT PRICE...` });
        await EsTeams.deleteMessage(chatId, messageId).catch(() => {});
        const price = await getBybitPrice(coin);
        return sendPrice(chatId, coin, price, "spot2");
    }

    if (data.startsWith("refresh_futures2_")) {
        const coin = data.replace("refresh_futures2_", "");
        await EsTeams.answerCallbackQuery(query.id, { text: `🔄 REFRESHING ${coin} FUTURES PRICE...` });
        await EsTeams.deleteMessage(chatId, messageId).catch(() => {});
        const price = await getBybitFuturesPrice(coin);
        return sendPrice(chatId, coin, price, "futures2");
    }
});

// ASSUMPTION: coin symbols map to Bybit-listed pairs (matches getBybitPrice/getBybitFuturesPrice below).
function buildTradingViewPreviewUrl(coin, type) {
  const symbol = `${String(coin).toUpperCase()}USDT`;
  const suffix = type === "spot2" ? "" : ".P";
  return `https://www.tradingview.com/symbols/BYBIT-${symbol}${suffix}/`;
}

async function sendPrice(chatId, coin, price, type) {
    if (!price) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "❌ Could not find this coin. Check the pair and try again.",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗦𝗧𝗔𝗧𝗦\n\n𝗧𝗬𝗣𝗘: ${type === "spot2" ? "SPOT" : "FUTURES"}\n𝗖𝗢𝗜𝗡: ${coin}\n𝗣𝗥𝗜𝗖𝗘: ${price}\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇ𝗮𝗺ꜱ ᴛᴇᴄʜ`,
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "🔄 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: `refresh_${type}_${coin}` },
                    { text: "📊 𝗣𝗥𝗘𝗩𝗜𝗘𝗪", url: buildTradingViewPreviewUrl(coin, type) }
                ],
                [
                    {
                        text: type === "spot2" ? "📈 𝗙𝗨𝗧𝗨𝗥𝗘𝗦" : "💸 𝗦𝗣𝗢𝗧",
                        callback_data: type === "spot2" ? `futures2_${coin}` : `spot2_${coin}`
                    }
                ],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

//FOLDER CREATION COMMAND
EsTeams.onText(/^\/new$/, async (msg) => {
  const chatId = msg.chat.id;

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ You do not have permission to use this command.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  newFolderSessions[chatId] = { awaitingName: true };
  return EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗙𝗢𝗟𝗗𝗘𝗥 𝗖𝗥𝗘𝗔𝗧𝗜𝗢𝗡\n\nPlease type the *name of the folder* you want to create:\n\nExample:\n\`\`\`ES_TEAMS-PASSKEYS\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "new_cancel" }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });
});

EsTeams.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const session = newFolderSessions[chatId];

  if (session && session.awaitingName && msg.text && !msg.text.startsWith("/")) {
    const folderName = msg.text.trim();

    await EsTeams.deleteMessage(chatId, msg.message_id - 1).catch(() => {});

    try {
      if (!fs.existsSync(`./${folderName}`)) {
        fs.mkdirSync(`./${folderName}`, { recursive: true });
        delete newFolderSessions[chatId];

        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: `✅ Folder *${folderName}* successfully created!`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
          }
        });
      } else {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: `⚠️ Folder *${folderName}* already exists.\n\nPlease choose a different name or tap ❌ to cancel.`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "new_cancel" }],
              [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
          }
        });
      }
    } catch (error) {
      delete newFolderSessions[chatId];
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `❌ Failed to create folder:\n\`\`\`${error.message}\`\`\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }
  }
});

EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  if (query.data === "new_cancel") {
    delete newFolderSessions[chatId];
    await EsTeams.deleteMessage(chatId, messageId).catch(() => {});
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ Folder creation cancelled.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//============= TRADE COMMAND =================//
EsTeams.onText(/\/trade/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const userFile = `${KEYS_FOLDER}/KEYS-${userId}.json`;

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
  
  if (!fs.existsSync(userFile)) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: welcomeCaption(`❌ You are not permitted to use this function.\nPlease type /register to continue.`),
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: waButton } 
    });
  }

  const { apiKey, apiSecret } = JSON.parse(fs.readFileSync(userFile, "utf8"));
  let accountInfo;

  try {
    const ts = await getServerTime();
    const query = buildQuery({ timestamp: ts });
    const sig = signQuery(query, apiSecret);
    const res = await axios.get(`https://fapi.binance.com/fapi/v2/account?${query}&signature=${sig}`, {
      headers: { "X-MBX-APIKEY": apiKey }
    });
    accountInfo = res.data;
  } catch (err) {
    console.error("Account fetch error:", err.response?.data || err.message);
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: welcomeCaption(`❌ Unable to fetch account info.\nPlease check your API keys or ensure Futures trading is enabled.`),
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: waButton }
    });
  }

  const validation = await validateApiKey(apiKey, apiSecret);
if (!validation.valid) {
  return EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: welcomeCaption(`❌ Trade Failed\nError: ${validation.error}\n\nPlease check your API key, enable Futures trading, and try again.`),
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: waButton }
  });
}

const balance = validation.balance;
await EsTeams.sendPhoto(chatId, botImageUrl, {
  caption: welcomeCaption(`💰 Balance: ${balance} USDT\n\nPlease type the coin you wish to trade (e.g., *BTC/USDT*).`),
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [{ text: "❌ CANCEL", callback_data: `CANCEL_TRADE_${userId}` }],
      ...waButton
    ]
  }
});

  if (tradeSessions[userId]?.listener) {
    try { EsTeams.removeListener("message", tradeSessions[userId].listener); } catch {}
  }

  tradeSessions[userId] = { step: "COIN", apiKey, apiSecret, listener: null };

  const tradeListener = async (response) => {
    try {
      if (!response?.from || response.from.id.toString() !== userId) return;
      const s = tradeSessions[userId];
      if (!s) return;
      const textRaw = (response.text || "").trim();
      if (!textRaw) return;
      const text = textRaw.toUpperCase();

      if (text === "CANCEL") {
        try { EsTeams.removeListener("message", s.listener); } catch {}
        delete tradeSessions[userId];
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: welcomeCaption(`❌ Trade canceled.\nType /trade to start again.`),
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: waButton }
        });
      }

      // ===== COIN STEP ===== //
      if (s.step === "COIN") {
        if (!textRaw.includes("/")) {
          return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: welcomeCaption(`❌ Invalid format.\nUse format *BTC/USDT*`),
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
          });
        }

        const coinPair = textRaw.replace(/\s+/g, "").toUpperCase();
        const [base, quote] = coinPair.split("/");
        const symbol = `${base}${quote}`;
        s.coin = symbol;

        try {
          const marketRes = await axios.get("https://fapi.binance.com/fapi/v1/exchangeInfo");
          const marketData = marketRes.data.symbols.find(x => x.symbol === symbol);
          if (!marketData) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
              caption: welcomeCaption(`❌ Invalid pair: ${coinPair}\nUse valid futures pair (e.g., BTC/USDT).`),
              parse_mode: "Markdown",
              reply_markup: { inline_keyboard: waButton }
            });
          }

          s.tickSize = parseFloat(marketData.filters.find(f => f.filterType === "PRICE_FILTER").tickSize);
          s.stepSize = parseFloat(marketData.filters.find(f => f.filterType === "LOT_SIZE").stepSize);

          const ts = await getServerTime();
          const q = buildQuery({ timestamp: ts });
          const sig = signQuery(q, s.apiSecret);
          const posRes = await axios.get(`https://fapi.binance.com/fapi/v2/positionRisk?${q}&signature=${sig}`, {
            headers: { "X-MBX-APIKEY": s.apiKey }
          });
          const active = posRes.data.find(p => p.symbol === symbol && parseFloat(p.positionAmt) !== 0);
          if (active) {
            try { EsTeams.removeListener("message", s.listener); } catch {}
            delete tradeSessions[userId];
            return EsTeams.sendPhoto(chatId, botImageUrl, {
              caption: welcomeCaption(`⚠️ Active position exists for ${coinPair}. Close it before opening a new one.`),
              parse_mode: "Markdown",
              reply_markup: { inline_keyboard: waButton }
            });
          }
        } catch {
          return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: welcomeCaption(`❌ Could not verify pair validity. Try again.`),
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
          });
        }

        s.step = "DIRECTION";
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: welcomeCaption(`Coin: ${coinPair}\nPlease input trade direction: *LONG* or *SHORT*`),
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: waButton }
        });
      }

      // ===== DIRECTION ===== //
      if (s.step === "DIRECTION") {
        if (!["LONG", "SHORT"].includes(text)) {
          return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: welcomeCaption(`❌ Invalid direction. Type LONG or SHORT.`),
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
          });
        }
        s.direction = text;
        s.step = "TPSL";
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: welcomeCaption(`Direction: ${text}\nPlease input TP/SL in format *TP/SL* (e.g., 0.13/0.5).`),
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: waButton }
        });
      }

      // ===== TP / SL ===== //
      if (s.step === "TPSL") {
        const match = textRaw.match(/^(\d+(\.\d+)?)[\/](\d+(\.\d+)?)$/);
        if (!match) {
          return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: welcomeCaption(`❌ Invalid TP/SL format.\nUse format *TP/SL* (e.g., 0.13/0.5)`),
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
          });
        }
        s.tp = parseFloat(match[1]);
        s.sl = parseFloat(match[3]);

        if (s.direction === "LONG" && s.tp <= s.sl) {
          return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: welcomeCaption(`❌ For LONG, TP must be greater than SL.`),
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
          });
        }
        if (s.direction === "SHORT" && s.tp >= s.sl) {
          return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: welcomeCaption(`❌ For SHORT, TP must be less than SL.`),
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
          });
        }

        s.step = "ORDER_TYPE";
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: welcomeCaption(`TP/SL set: TP=${s.tp}, SL=${s.sl}\nPlease select order type: *MARKET* or *LIMIT*`),
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: waButton }
        });
      }

      // ===== ORDER TYPE ===== //
      if (s.step === "ORDER_TYPE") {
        if (!["MARKET", "LIMIT"].includes(text)) {
          return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: welcomeCaption(`❌ Invalid order type. Type MARKET or LIMIT.`),
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
          });
        }
        s.mode = text;
        s.step = text === "LIMIT" ? "PRICE" : "MARGIN";
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: welcomeCaption(`You chose *${text}*.\nNow input ${text === "LIMIT" ? "the limit price" : "margin in USDT"}.`),
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: waButton }
        });
      }

      // ===== PRICE ===== //
      if (s.step === "PRICE") {
        const price = parseFloat(textRaw);
        if (isNaN(price) || price <= 0)
          return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: welcomeCaption(`❌ Invalid price.`),
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
          });
        s.price = floorToStep(price, s.tickSize);
        s.step = "MARGIN";
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: welcomeCaption(`Limit Price set: ${s.price}\nEnter margin in USDT.`),
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: waButton }
        });
      }

      // ===== MARGIN ===== //
      if (s.step === "MARGIN") {
        const margin = parseFloat(textRaw);
        if (isNaN(margin) || margin <= 0)
          return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: welcomeCaption(`❌ Invalid margin.`),
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
          });
        s.margin = margin;
        s.step = "LEVERAGE";
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: welcomeCaption(`Margin: ${margin} USDT\nInput leverage (e.g. 10).`),
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: waButton }
        });
      }

      // ===== LEVERAGE ===== //
      if (s.step === "LEVERAGE") {
        const lev = parseInt(textRaw);
        if (isNaN(lev) || lev <= 0)
          return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: welcomeCaption(`❌ Invalid leverage.`),
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: waButton }
          });
        s.leverage = lev;
        s.step = "CONFIRM";
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: welcomeCaption(
            `📋 *Preview Trade*\n\nCoin: ${s.coin}\nDirection: ${s.direction}\nType: ${s.mode}\nLeverage: ${s.leverage}x\nMargin: ${s.margin} USDT\n${s.price ? `Price: ${s.price}\n` : ""}TP: ${s.tp}, SL: ${s.sl}\n\nPress PLACE ORDER to execute or CANCEL.`
          ),
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📥 PLACE ORDER", callback_data: `CONFIRM_ORDER_${userId}` }],
              [{ text: "❌ CANCEL ORDER", callback_data: `CANCEL_TRADE_${userId}` }],
              ...waButton
            ]
          }
        });
      }

    } catch (err) {
      console.error("tradeListener error:", err);
    }
  };

  tradeSessions[userId].listener = tradeListener;
  EsTeams.on("message", tradeListener);
});

// ===== CALLBACK QUERY ===== //
EsTeams.on("callback_query", async (callbackQuery) => {
  try {
    const data = callbackQuery.data || "";
    const fromId = callbackQuery.from.id.toString();
    const chatId = callbackQuery.message.chat.id;
    const userId = fromId;
    const s = tradeSessions[userId];
    if (!s) return EsTeams.answerCallbackQuery(callbackQuery.id, { text: "Session expired." });

    if (data === `CANCEL_TRADE_${userId}`) {
      try { EsTeams.removeListener("message", s.listener); } catch {}
      delete tradeSessions[userId];
      await EsTeams.answerCallbackQuery(callbackQuery.id, { text: "Trade canceled ✅" });
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: welcomeCaption(`❌ Trade canceled.`),
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: waButton }
      });
    }

    if (data === `CONFIRM_ORDER_${userId}`) {
      await EsTeams.answerCallbackQuery(callbackQuery.id, { text: "Placing trade..." });
      try {
        const ts = await getServerTime();
        const levQ = buildQuery({ symbol: s.coin, leverage: s.leverage, timestamp: ts });
        const levSig = signQuery(levQ, s.apiSecret);
        await axios.post(`https://fapi.binance.com/fapi/v1/leverage?${levQ}&signature=${levSig}`, {}, {
          headers: { "X-MBX-APIKEY": s.apiKey }
        });

        const priceData = await axios.get(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${s.coin}`);
        const entryPrice = s.price || parseFloat(priceData.data.price);

        const qtyRaw = (s.margin * s.leverage) / entryPrice;
        const qty = floorToStep(qtyRaw, s.stepSize);

        const orderParams = {
          symbol: s.coin,
          side: s.direction === "LONG" ? "BUY" : "SELL",
          type: s.mode,
          quantity: qty.toString(),
          ...(s.mode === "LIMIT" ? { price: s.price.toString(), timeInForce: "GTC" } : {}),
          timestamp: await getServerTime()
        };
        const orderSig = signQuery(buildQuery(orderParams), s.apiSecret);
        await axios.post(`https://fapi.binance.com/fapi/v1/order?${buildQuery(orderParams)}&signature=${orderSig}`, {}, {
          headers: { "X-MBX-APIKEY": s.apiKey }
        });

        const tpSide = s.direction === "LONG" ? "SELL" : "BUY";
        const slSide = s.direction === "LONG" ? "SELL" : "BUY";

        await axios.post(`https://fapi.binance.com/fapi/v1/order?${buildQuery({
          symbol: s.coin,
          side: tpSide,
          type: "TAKE_PROFIT_MARKET",
          stopPrice: s.tp.toString(),
          closePosition: true,
          timestamp: await getServerTime()
        })}&signature=${signQuery(buildQuery({
          symbol: s.coin,
          side: tpSide,
          type: "TAKE_PROFIT_MARKET",
          stopPrice: s.tp.toString(),
          closePosition: true,
          timestamp: await getServerTime()
        }), s.apiSecret)}`, {}, { headers: { "X-MBX-APIKEY": s.apiKey } });

        await axios.post(`https://fapi.binance.com/fapi/v1/order?${buildQuery({
          symbol: s.coin,
          side: slSide,
          type: "STOP_MARKET",
          stopPrice: s.sl.toString(),
          closePosition: true,
          timestamp: await getServerTime()
        })}&signature=${signQuery(buildQuery({
          symbol: s.coin,
          side: slSide,
          type: "STOP_MARKET",
          stopPrice: s.sl.toString(),
          closePosition: true,
          timestamp: await getServerTime()
        }), s.apiSecret)}`, {}, { headers: { "X-MBX-APIKEY": s.apiKey } });

        try { EsTeams.removeListener("message", s.listener); } catch {}
        delete tradeSessions[userId];
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: welcomeCaption(`✅ *Trade Successfully Placed!*\n\nCoin: ${s.coin}\nDirection: ${s.direction}\nLeverage: ${s.leverage}x\nMargin: ${s.margin} USDT\nTP: ${s.tp}\nSL: ${s.sl}\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`),
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: waButton }
        });

      } catch (err) {
        console.error("Order error:", err.response?.data || err.message);
        try { EsTeams.removeListener("message", s.listener); } catch {}
        delete tradeSessions[userId];
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: welcomeCaption(`❌ *Trade Failed*\nError: ${err.response?.data?.msg || err.message}`),
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: waButton }
        });
      }
    }
  } catch (err) {
    console.error("callback_query error:", err);
  }
});

//Trade Register
EsTeams.onText(/\/register/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const userFile = `${KEYS_FOLDER}/KEYS-${userId}.json`;

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(
      chatId,
      "𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗜𝗡𝗚\n\n❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly check back later ...",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
              }
            ]
          ]
        }
      }
    );
  }

  if (fs.existsSync(userFile)) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption:
        `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗜𝗡𝗚\n\n✅ You are already registered!\nType /trade to continue.`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });
  }

  await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption:
      `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗜𝗡𝗚\n\nStep 1️⃣: Please input your Binance API key:`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
            url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
          }
        ]
      ]
    }
  });

  const apiKeyListener = (response) => {
    if (response.from.id.toString() !== userId) return;
    const apiKey = response.text.trim();
    EsTeams.removeListener("message", apiKeyListener);

    EsTeams.sendPhoto(chatId, botImageUrl, {
      caption:
        `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗜𝗡𝗚\n\nStep 2️⃣: Please input your Binance API Secret key:`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });

    const secretKeyListener = async (response2) => {
      if (response2.from.id.toString() !== userId) return;
      const apiSecret = response2.text.trim();
      EsTeams.removeListener("message", secretKeyListener);

      try {
        const timestamp = Date.now();
        const query = `timestamp=${timestamp}`;
        const signature = crypto
          .createHmac("sha256", apiSecret)
          .update(query)
          .digest("hex");

        const res = await axios.get(
          `https://api.binance.com/api/v3/account?${query}&signature=${signature}`,
          { headers: { "X-MBX-APIKEY": apiKey } }
        );

        if (!res.data) throw new Error("No account data");

        fs.writeFileSync(userFile, JSON.stringify({ apiKey, apiSecret }, null, 2));

        EsTeams.sendPhoto(chatId, botImageUrl, {
          caption:
            `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗜𝗡𝗚\n\n✅ Registration successful!\nPlease type /trade to continue.`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                  url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
                }
              ]
            ]
          }
        });
      } catch (err) {
        console.error("Binance validation error:", err.response?.data || err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, {
          caption:
            `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗔𝗨𝗧𝗢 𝗧𝗥𝗔𝗗𝗜𝗡𝗚\n\n❌ *Invalid API key or Secret key*\n\nPlease disable IP restrictions and type /register to try again.`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                  url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
                }
              ]
            ]
          }
        });
      }
    };

    EsTeams.on("message", secretKeyListener);
  };

  EsTeams.on("message", apiKeyListener);
});

//CRYPTO WATCH COMMAND
EsTeams.onText(/^\/watch$/, async (msg) => {
  const chatId = msg.chat.id;

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });
  }

  userWatchlists[chatId] = { step: 1 };
  return showWatchMenu(chatId);
});

async function showWatchMenu(chatId) {
  await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗪𝗔𝗧𝗖𝗛𝗟𝗜𝗦𝗧\n\nPlease select an option below:`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "➕ 𝗔𝗗𝗗 𝗖𝗢𝗜𝗡", callback_data: "watch_add" }],
        [{ text: "📄 𝗩𝗜𝗘𝗪 𝗪𝗔𝗧𝗖𝗛𝗟𝗜𝗦𝗧", callback_data: "watch_view" }],
        [{ text: "❌ 𝗥𝗘𝗠𝗢𝗩𝗘 𝗖𝗢𝗜𝗡", callback_data: "watch_remove" }],
        [
          {
            text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
            url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
          }
        ]
      ]
    }
  });
}

EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  if (!data.startsWith("watch_")) return;

  await EsTeams.deleteMessage(chatId, messageId).catch(() => {});

  if (data === "watch_add") {
    userWatchlists[chatId] = { step: 2 };
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "Please type the coin pair you want to add\n\n(e.g., *BTC/USDT*):",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "watch_back" }],
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "watch_cancel" }],
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });
  }

  if (data === "watch_view") {
    const file = `ES_TEAMS-WATCHLISTS/${chatId}.json`;
    let watchlist = [];
    if (fs.existsSync(file)) {
      watchlist = JSON.parse(fs.readFileSync(file));
    }
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: watchlist.length
        ? `Your watchlist:\n\n${watchlist.join("\n")}`
        : "Your watchlist is empty.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "watch_back" }],
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "watch_cancel" }],
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });
  }

  if (data === "watch_remove") {
    userWatchlists[chatId] = { step: 3 };
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "Please type the coin pair you want to remove\n\n(e.g., *BTC/USDT*):",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "watch_back" }],
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "watch_cancel" }],
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });
  }

  if (data === "watch_back") {
    return showWatchMenu(chatId);
  }

  if (data === "watch_cancel") {
    delete userWatchlists[chatId];
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "✅ *Your watchlist operation has been cancelled.*",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });
  }
});

EsTeams.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const session = userWatchlists[chatId];
  if (!session || !msg.text) return;

  const input = msg.text.trim().toUpperCase();
  const file = `ES_TEAMS-WATCHLISTS/${chatId}.json`;
  let watchlist = [];

  if (!/^[A-Z0-9]+\/[A-Z0-9]+$/.test(input)) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ Invalid format.\n\nPlease use this format:\n*BTC/USDT*, *ETH/USDC*, etc.",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "watch_back" }],
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "watch_cancel" }],
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });
  }

  if (fs.existsSync(file)) {
    watchlist = JSON.parse(fs.readFileSync(file));
  }

  if (session.step === 2) {
    if (watchlist.includes(input)) {
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "This pair is already in your watchlist.",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "watch_back" }],
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "watch_cancel" }],
            [
              {
                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
              }
            ]
          ]
        }
      });
    }
    watchlist.push(input);
    fs.writeFileSync(file, JSON.stringify(watchlist, null, 2));
    delete userWatchlists[chatId];
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `✅ Added *${input}* to your watchlist.`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "watch_back" }],
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });
  }

  if (session.step === 3) {
    if (!watchlist.includes(input)) {
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "This pair is not in your watchlist.",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "watch_back" }],
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "watch_cancel" }],
            [
              {
                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
              }
            ]
          ]
        }
      });
    }
    watchlist = watchlist.filter((c) => c !== input);
    fs.writeFileSync(file, JSON.stringify(watchlist, null, 2));
    delete userWatchlists[chatId];
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `✅ Removed *${input}* from your watchlist.`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "watch_back" }],
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });
  }
});

//CTIMER COMMAND
EsTeams.onText(/^\/ctimer$/, async (msg) => {
  const chatId = msg.chat.id;
  
  const activeTimers = fs.existsSync(TIMER_FILE) ? JSON.parse(fs.readFileSync(TIMER_FILE)) : {};

  for (const id in activeTimers) {
    for (const timer of activeTimers[id]) {
      scheduleReminder(id, timer);
    }
  }

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
              url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
            }
          ]
        ]
      }
    });
  }

  userCtimerSessions[chatId] = { step: 1 };

  const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗧𝗜𝗠𝗘𝗥\n\nPlease type the coin pair:\n\n*BTC/USDT*",
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
            url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
          }
        ]
      ]
    }
  });

  userCtimerSessions[chatId].lastMessageId = sent.message_id;

  EsTeams.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text?.trim();
    const ctimerSession = userCtimerSessions[chatId];
    if (!ctimerSession) return;

    if (ctimerSession.step === 1) {
      if (!/^[A-Z0-9]+\/[A-Z0-9]+$/i.test(text)) {
        await EsTeams.deleteMessage(chatId, ctimerSession.lastMessageId).catch(() => {});
        const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: "❌ Invalid format.\n\nUse *BTC/USDT*",
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_ctimer" }],
              [
                {
                  text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                  url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
                }
              ]
            ]
          }
        });
        userCtimerSessions[chatId].lastMessageId = sent.message_id;
        return;
      }

      const isValid = await validatePair(text.toUpperCase());
      if (!isValid) {
        await EsTeams.deleteMessage(chatId, ctimerSession.lastMessageId).catch(() => {});
        const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗧𝗜𝗠𝗘𝗥\n\n❌ Invalid pair.\n\nPlease enter a valid Bybit pair.",
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_ctimer" }],
              [
                {
                  text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                  url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
                }
              ]
            ]
          }
        });
        userCtimerSessions[chatId].lastMessageId = sent.message_id;
        return;
      }

      await EsTeams.deleteMessage(chatId, ctimerSession.lastMessageId).catch(() => {});
      userCtimerSessions[chatId] = { step: 2, pair: text.toUpperCase() };

      const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "Please select the market type:",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🟢 𝗦𝗣𝗢𝗧", callback_data: "market_spot" },
              { text: "🔴 𝗙𝗨𝗧𝗨𝗥𝗘𝗦", callback_data: "market_futures" }
            ],
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_ctimer" }],
            [
              {
                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
              }
            ]
          ]
        }
      });
      userCtimerSessions[chatId].lastMessageId = sent.message_id;
      return;
    }

    if (ctimerSession.step === 3) {
      const timeMatch = text.match(/^(\d+)\/(\d+)$/);
      if (!timeMatch) {
        await EsTeams.deleteMessage(chatId, ctimerSession.lastMessageId).catch(() => {});
        const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: "❌ Invalid time format.\n\nUse *1/30* for 1 hour 30 minutes.",
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "back_to_market" }],
              [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_ctimer" }],
              [
                {
                  text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                  url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
                }
              ]
            ]
          }
        });
        userCtimerSessions[chatId].lastMessageId = sent.message_id;
        return;
      }

      const hours = parseInt(timeMatch[1]);
      const mins = parseInt(timeMatch[2]);
      const millis = (hours * 60 * 60 + mins * 60) * 1000;

      await EsTeams.deleteMessage(chatId, ctimerSession.lastMessageId).catch(() => {});
      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗧𝗜𝗠𝗘𝗥\n\n𝗦𝗧𝗔𝗧𝗨𝗦: ACTIVE\n\n𝗣𝗔𝗜𝗥: *${ctimerSession.pair}*\n𝗧𝗬𝗣𝗘: *${ctimerSession.market}*\n𝗧𝗜𝗠𝗘: *${hours}h ${mins}m*`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
              }
            ]
          ]
        }
      });

      const timerData = {
        pair: ctimerSession.pair,
        market: ctimerSession.market,
        end: Date.now() + millis
      };

      if (!activeTimers[chatId]) activeTimers[chatId] = [];
      activeTimers[chatId].push(timerData);
      fs.writeFileSync(TIMER_FILE, JSON.stringify(activeTimers, null, 2));

      scheduleReminder(chatId, timerData);
      delete userCtimerSessions[chatId];
    }
  });

  EsTeams.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const ctimerSession = userCtimerSessions[chatId];
    const data = query.data;
    if (!ctimerSession) return;

    if (data === "cancel_ctimer") {
      await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
      delete userCtimerSessions[chatId];
      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "❌ Timer cancelled.",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
              }
            ]
          ]
        }
      });
      return;
    }

    if (data === "back_to_market" && ctimerSession.step === 3) {
      userCtimerSessions[chatId] = { ...ctimerSession, step: 2 };
      await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
      const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "Please select the market type:",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🟢 𝗦𝗣𝗢𝗧", callback_data: "market_spot" },
              { text: "🔴 𝗙𝗨𝗧𝗨𝗥𝗘𝗦", callback_data: "market_futures" }
            ],
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_ctimer" }]
          ]
        }
      });
      userCtimerSessions[chatId].lastMessageId = sent.message_id;
      return;
    }

    if (data === "market_spot" || data === "market_futures") {
      const market = data === "market_spot" ? "SPOT" : "FUTURES";
      userCtimerSessions[chatId] = { ...ctimerSession, step: 3, market };
      await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
      const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "Please send a time format:\n\n*HR/MINS* (e.g., 0/30)",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔙 𝗕𝗔𝗖𝗞", callback_data: "back_to_market" }],
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_ctimer" }]
          ]
        }
      });
      userCtimerSessions[chatId].lastMessageId = sent.message_id;
    }
  });

  async function validatePair(pair) {
    const [base, quote] = pair.split("/");
    const symbol = `${base}${quote}`;
    let url = `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`;
    let res = await fetch(url);
    let data = await res.json();
    if (data.result?.list?.length > 0) return true;

    url = `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`;
    res = await fetch(url);
    data = await res.json();
    return data.result?.list?.length > 0;
  }

  async function getCryptoPrice(pair, market) {
    const [base, quote] = pair.split("/");
    const symbol = `${base}${quote}`;
    const url = market === "SPOT"
      ? `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`
      : `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`;
    const res = await fetch(url);
    const data = await res.json();
    const ticker = data.result?.list?.[0];
    return `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗔𝗟𝗘𝗥𝗧\n\n𝗣𝗔𝗜𝗥: *${pair}*\n𝗧𝗬𝗣𝗘: *${market}*\n𝗣𝗥𝗜𝗖𝗘: *${ticker?.lastPrice || "N/A"}*`;
  }

  function scheduleReminder(chatId, timer) {
    const delay = timer.end - Date.now();
    if (delay <= 0) return;

    setTimeout(async () => {
      const info = await getCryptoPrice(timer.pair, timer.market);
      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: info,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
              }
            ]
          ]
        }
      });

      if (activeTimers[chatId]) {
        activeTimers[chatId] = activeTimers[chatId].filter(t => t.end !== timer.end);
        fs.writeFileSync(TIMER_FILE, JSON.stringify(activeTimers, null, 2));
      }
    }, delay);
  }
});

//CRYPTO PNL COMMAND
EsTeams.onText(/^\/pnl$/, async (msg) => {
  const chatId = msg.chat.id;

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗\n\nKindly Check back later...",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  pnlSessions[chatId] = { step: 1 };

  const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\nPlease type in the crypto pair you want to track in this format:\n\n*BTC/USDT*`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "pnl_cancel" }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });
  pnlSessions[chatId].lastMsgId = sent.message_id;
});

EsTeams.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const session = pnlSessions[chatId];
  if (!session || !msg.text) return;

  const input = msg.text.trim().toUpperCase();

  if (session.lastMsgId) {
    await EsTeams.deleteMessage(chatId, session.lastMsgId).catch(() => {});
  }

  if (session.step === 1) {
  if (!input.includes("/")) {
    const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\n❌ Invalid format.\n\nUse: *BTC/USDT*, *ETH/USDC*, etc.`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "pnl_cancel" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
    session.lastMsgId = sent.message_id;
    return;
  }

  const symbol = input.replace("/", "");
  const spotPrice = await getSpot(symbol);
  const futuresPrice = await getFutures(symbol);

  if (!spotPrice && !futuresPrice) {
    const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\n❌ Invalid Bybit pair.\n\nPlease use available coins from Bybit.`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "pnl_cancel" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
    session.lastMsgId = sent.message_id;
    return;
  }

  if (session.lastMsgId) {
    await EsTeams.deleteMessage(chatId, session.lastMsgId).catch(() => {});
  }

  session.coin = symbol;
  session.step = 2;
  const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\nPlease select market type for *${input}*`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🟢 𝗦𝗣𝗢𝗧", callback_data: `pnl_spot_${session.coin}` },
          { text: "🔴 𝗙𝗨𝗧𝗨𝗥𝗘𝗦", callback_data: `pnl_futures_${session.coin}` }
        ],
        [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "pnl_cancel" }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });
  session.lastMsgId = sent.message_id;
  return;
}

  if (session.step === 3) {
    const price = parseFloat(input);
    if (isNaN(price) || price <= 0) {
      const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\n❌ Invalid entry price. Please enter a valid number.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "pnl_cancel" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
      session.lastMsgId = sent.message_id;
      return;
    }

    session.entryPrice = price;
    session.step = 4;
    const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\nPlease enter mode and leverage:\n\n*LONG/10* or *SHORT/5*`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "pnl_cancel" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
    session.lastMsgId = sent.message_id;
    return;
  }

  if (session.step === 4) {
    if (!input.includes("/")) {
      const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\n❌ Invalid format.\n\nUse: *LONG/10* or *SHORT/5*`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "pnl_cancel" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
      session.lastMsgId = sent.message_id;
      return;
    }

    const [modeRaw, leverageRaw] = input.split("/");
    const mode = modeRaw.trim().toUpperCase();
    const leverage = parseInt(leverageRaw.trim());

    if (!["LONG", "SHORT"].includes(mode) || isNaN(leverage) || leverage < 1 || leverage > 100) {
      const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\n❌ Invalid input.\n\nLeverage must be 1–100.\nUse: *LONG/10* or *SHORT/5*`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "pnl_cancel" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
      session.lastMsgId = sent.message_id;
      return;
    }

    const currentPrice = session.market === "spot"
      ? await getSpot(session.coin)
      : await getFutures(session.coin);

    if (!currentPrice) {
      delete pnlSessions[chatId];
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\n❌ Failed to fetch current price\n\nPlease use /pnl to try again.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    let pnlRaw =
      mode === "LONG"
        ? ((currentPrice - session.entryPrice) / session.entryPrice) * 100 * leverage
        : ((session.entryPrice - currentPrice) / session.entryPrice) * 100 * leverage;

    const pnlPercent = (pnlRaw >= 0 ? "+" : "") + pnlRaw.toFixed(2);
    const emoji = pnlRaw > 0 ? "📈" : pnlRaw < 0 ? "📉" : "📊";

    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟*\n\n*𝗖𝗢𝗜𝗡:* ${session.coin}\n*𝗧𝗬𝗣𝗘:* ${session.market.toUpperCase()}\n*𝗠𝗢𝗗𝗘:* ${mode} (${leverage}x)\n*𝗣𝗡𝗟:* ${emoji} ${pnlPercent}%`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: `pnl_refresh_${session.market}_${session.coin}_${mode}_${leverage}_${session.entryPrice}` }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    delete pnlSessions[chatId];
  }
});

EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "pnl_cancel") {
    delete pnlSessions[chatId];
    return EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
  }

  if (data.startsWith("pnl_spot_") || data.startsWith("pnl_futures_")) {
    const market = data.startsWith("pnl_spot_") ? "spot" : "futures";
    const coin = data.split("_")[2];
    pnlSessions[chatId] = {
      ...pnlSessions[chatId],
      coin,
      market,
      step: 3
    };
    await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
    const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\nPlease enter your entry price:`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "pnl_cancel" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
    pnlSessions[chatId].lastMsgId = sent.message_id;
  }

  if (data.startsWith("pnl_refresh_")) {
    const parts = data.split("_");
    const market = parts[2];
    const coin = parts[3];
    const mode = parts[4];
    const leverage = parts[5];
    const entryPrice = parts[6];

    const currentPrice = market === "spot"
      ? await getSpot(coin)
      : await getFutures(coin);

    if (!currentPrice) {
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗘𝗌 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟\n\n❌ Failed to fetch current price.\n\nPlease use /pnl to try again.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    let pnlRaw =
      mode === "LONG"
        ? ((currentPrice - parseFloat(entryPrice)) / parseFloat(entryPrice)) * 100 * parseInt(leverage)
        : ((parseFloat(entryPrice) - currentPrice) / parseFloat(entryPrice)) * 100 * parseInt(leverage);

    const pnlPercent = (pnlRaw >= 0 ? "+" : "") + pnlRaw.toFixed(2);
    const emoji = pnlRaw > 0 ? "📈" : pnlRaw < 0 ? "📉" : "📊";

    await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗥𝗬𝗣𝗧𝗢 𝗣𝗡𝗟*\n\n*𝗖𝗢𝗜𝗡:* ${coin}\n*𝗧𝗬𝗣𝗘:* ${market.toUpperCase()}\n*𝗠𝗢𝗗𝗘:* ${mode} (${leverage}x)\n*𝗣𝗡𝗟:* ${emoji} ${pnlPercent}%`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: `pnl_refresh_${market}_${coin}_${mode}_${leverage}_${entryPrice}` }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

async function getSpot(pair) {
  const res = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${pair}`);
  if (!res.ok) return null;
  const json = await res.json();
  if (json.retCode !== 0 || !json.result?.list?.[0]) return null;
  return parseFloat(json.result.list[0].lastPrice);
}

async function getFutures(pair) {
  const res = await fetch(`https://api.bybit.com/v5/market/tickers?category=linear&symbol=${pair}`);
  if (!res.ok) return null;
  const json = await res.json();
  if (json.retCode !== 0 || !json.result?.list?.[0]) return null;
  return parseFloat(json.result.list[0].lastPrice);
}

// TIKTOK STALK COMMAND
EsTeams.onText(/^\/ttstalk(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const rawInput = msg.text.split(" ").slice(1).join(" ");
  const username = rawInput ? rawInput.replace(/\s+/g, "") : null;

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly check back later...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (!username) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ *𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗙𝗼𝗿𝗺𝗮𝘁*\n\nPlease use `/ttstalk username`.",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const wait = await EsTeams.sendMessage(chatId, "🔄 *𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴...*", {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  try {
    const user = await esApiGet("/api/v1/dev/tiktokstalk", { username });

    await EsTeams.deleteMessage(chatId, wait.message_id);

    const caption = `👀 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗧𝗜𝗞𝗧𝗢𝗞 𝗦𝗧𝗔𝗟𝗞𝗘𝗥*\n\n` +
      `*Username:* ${user.uniqueId}\n` +
      `*Nickname:* ${user.nickname}\n` +
      `*Verified:* ${user.verified ? "Yes ✅" : "No ❌"}\n` +
      (user.bio ? `*Bio:* ${user.bio}\n` : "") +
      `*Followers:* ${Number(user.followers || 0).toLocaleString()}\n` +
      `*Following:* ${user.following}\n` +
      `*Likes:* ${Number(user.likes || 0).toLocaleString()}\n` +
      `*Videos:* ${user.videos}\n` +
      `\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`;

    await EsTeams.sendPhoto(chatId, user.avatar, {
      caption,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

  } catch (err) {
    await EsTeams.deleteMessage(chatId, wait.message_id);
    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `❌ *𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝗱𝗮𝘁𝗮.*\n\n${err.message}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

// INSTAGRAM STALK COMMAND
EsTeams.onText(/^\/igstalk(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const rawInput = msg.text.split(" ").slice(1).join(" ");
  const username = rawInput ? rawInput.replace(/\s+/g, "") : null;

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly check back later...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (!username) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ *𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗙𝗼𝗿𝗺𝗮𝘁*\n\nPlease use `/igstalk username`.",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  let waitMessage;
  try {
    waitMessage = await EsTeams.sendMessage(chatId, "🔄 *𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴...*", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  } catch (err) {
    console.error("Error sending wait message:", err);
  }

  try {
    const data = await esApiGet("/api/v1/dev/igstalk", { username });

    if (waitMessage) {
      try {
        await EsTeams.deleteMessage(chatId, waitMessage.message_id);
      } catch (deleteErr) {
      }
    }

    const caption = `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠 𝗦𝗧𝗔𝗟𝗞𝗘𝗥*\n\n` +
      `*Username:* ${data.username}\n` +
      `*Name:* ${data.name}\n` +
      `*Bio:* ${data.bio || "(none)"}\n\n` +
      `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`;

    await EsTeams.sendPhoto(chatId, data.avatar || botImageUrl, {
      caption,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

  } catch (err) {
    if (waitMessage) {
      try {
        await EsTeams.deleteMessage(chatId, waitMessage.message_id);
      } catch (deleteErr) {
      }
    }
    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `❌ *𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝗱𝗮𝘁𝗮.*\n\n${err.message}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//ID CHECKER
EsTeams.onText(/^\/checkid(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const targetId = match[1];

  const onlyOwner = 5523737392;

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

  if (fromId !== onlyOwner) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "🚫 *𝗔𝗖𝗖𝗘𝗦𝗦 𝗗𝗘𝗡𝗜𝗘𝗗*\n\n_This command is restricted to the developer only._",
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (!targetId) {
    return EsTeams.sendMessage(chatId, "❌ *𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗖𝗢𝗠𝗠𝗔𝗡𝗗*\n\n📌 _Use:_ `/checkid <telegram_id>`", {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  try {
    const member = await EsTeams.getChatMember(chatId, targetId);
    const userInfo = member.user;

    const name = userInfo.first_name + (userInfo.last_name ? ` ${userInfo.last_name}` : "");

    let premium = "❌ 𝗡𝗢";
    if (userInfo.is_premium === true) {
      premium = "✅ 𝗬𝗘𝗦";
    }

    const caption =
      `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗧𝗔𝗥𝗚𝗘𝗧 𝗜𝗡𝗙𝗢*\n\n` +
      `🆔 *ID:* \`${targetId}\`\n` +
      `👥 *Name:* _${name}_\n` +
      `💎 *Telegram Premium:* ${premium}\n\n` +
      `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`;

    EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📩 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗧𝗔𝗥𝗚𝗘𝗧", url: `tg://user?id=${targetId}` }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  } catch (e) {
    EsTeams.sendMessage(chatId, "⚠️ *𝗨𝗡𝗔𝗕𝗟𝗘 𝗧𝗢 𝗙𝗘𝗧𝗖𝗛 𝗜𝗡𝗙𝗢*\n\n_The ID might be invalid or user not found._", {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//==---------[ CHATBOT COMMAND ]-----------==//
const CHATBOT_SETTINGS_DOC = doc(db, "botData", "chatbotSettings");
const CHATBOT_MEMORY_DOC = doc(db, "botData", "chatbotMemory");

async function loadChatbotSettings() {
    try {
        const snap = await getDoc(CHATBOT_SETTINGS_DOC);
        if (snap.exists()) return snap.data().users || {};
        await setDoc(CHATBOT_SETTINGS_DOC, { users: {} });
    } catch (err) {
        console.error("CHATBOT SETTINGS LOAD ERROR:", err.message);
    }
    return {};
}

async function saveChatbotSettings(data) {
    try {
        await setDoc(CHATBOT_SETTINGS_DOC, { users: data });
    } catch (err) {
        console.error("CHATBOT SETTINGS SAVE ERROR:", err.message);
    }
}

async function loadChatbotMemory() {
    try {
        const snap = await getDoc(CHATBOT_MEMORY_DOC);
        if (snap.exists()) return snap.data().users || {};
        await setDoc(CHATBOT_MEMORY_DOC, { users: {} });
    } catch (err) {
        console.error("CHATBOT MEMORY LOAD ERROR:", err.message);
    }
    return {};
}

async function saveChatbotMemory(data) {
    try {
        await setDoc(CHATBOT_MEMORY_DOC, { users: data });
    } catch (err) {
        console.error("CHATBOT MEMORY SAVE ERROR:", err.message);
    }
}

EsTeams.onText(/^\/chatbot$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    if (msg.chat.type !== "private") {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "❌ *This command can only be used in private chat.*",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    const chatbotSettings = await loadChatbotSettings();
    const chatbotStatus = chatbotSettings[userId] || "off";

    EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗛𝗔𝗧𝗕𝗢𝗧 𝗠𝗢𝗗𝗘*\n\nYour chatbot is currently: *${chatbotStatus.toUpperCase()}*.\n\nToggle below:`,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: `${chatbotStatus === "on" ? "✅ " : ""}𝗢𝗡`, callback_data: `chatbot:on:${userId}` }],
                [{ text: `${chatbotStatus === "off" ? "✅ " : ""}𝗢𝗙𝗙`, callback_data: `chatbot:off:${userId}` }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
});

EsTeams.on("callback_query", async (callbackQuery) => {
    const [action, mode, userId] = callbackQuery.data.split(":");
    if (action !== "chatbot") return;

    const chatbotSettings = await loadChatbotSettings();

    if (chatbotSettings[userId] === mode) {
        return EsTeams.answerCallbackQuery(callbackQuery.id, { text: `⚠️ Chatbot is already ${mode.toUpperCase()}!` });
    }

    chatbotSettings[userId] = mode;
    await saveChatbotSettings(chatbotSettings);

    EsTeams.answerCallbackQuery(callbackQuery.id, { text: `✅ Chatbot has been set to ${mode.toUpperCase()}!` });

    return EsTeams.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [{ text: `${mode === "on" ? "✅ " : ""}𝗢𝗡`, callback_data: `chatbot:on:${userId}` }],
                [{ text: `${mode === "off" ? "✅ " : ""}𝗢𝗙𝗙`, callback_data: `chatbot:off:${userId}` }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        },
        {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id
        }
    );
});

EsTeams.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!text || msg.chat.type !== "private") return;

    const chatbotSettings = await loadChatbotSettings();
    if (chatbotSettings[userId] !== "on") return;

    const chatbotMemory = await loadChatbotMemory();
    if (!chatbotMemory[userId]) chatbotMemory[userId] = [];

    chatbotMemory[userId].push({ role: "user", content: text });

    // Keep last 15 messages for better memory
    if (chatbotMemory[userId].length > 15) {
        chatbotMemory[userId] = chatbotMemory[userId].slice(-15);
    }

    await saveChatbotMemory(chatbotMemory);

    await EsTeams.sendChatAction(chatId, "typing");

    try {
        const conversation = chatbotMemory[userId].map(m => `${m.role}: ${m.content}`).join("\n");

        const aiResponse = identityGuardAnswer(text) || sanitizeAiReply(await askFreeAI(conversation)) || "⚠️ Sorry, I couldn't reach any AI provider right now. Please try again shortly.";

        chatbotMemory[userId].push({ role: "bot", content: aiResponse });
        await saveChatbotMemory(chatbotMemory);

        await EsTeams.sendMessage(chatId,
            `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗛𝗔𝗧𝗕𝗢𝗧*\n\n${aiResponse}\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇ𝗮𝗺ꜱ ᴛᴇ𝗰ʜ*`,
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            }
        );

    } catch (error) {
        console.error("Chatbot Error:", error);
        EsTeams.sendMessage(chatId, "⚠️ *AI Chatbot Error. Please try again later.*", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

//Antilink Command
EsTeams.onText(/^\/antilink$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const botImageUrl = "https://files.catbox.moe/3jibot.jpg";

    let antilinkSettings = {};
    if (fs.existsSync(ANTILINK_FILE)) {
        antilinkSettings = JSON.parse(fs.readFileSync(ANTILINK_FILE));
    }

    try {
        if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

        if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *This command can only be used in groups.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const chatAdmins = await EsTeams.getChatAdministrators(chatId);
        const isAdmin = chatAdmins.some(admin => admin.user.id === userId);
        const botId = (await EsTeams.getMe()).id;
        const isBotAdmin = chatAdmins.some(admin => admin.user.id === botId);

        if (!isBotAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "⚠️ *I need to be an admin to manage AntiLink!*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        if (!isAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *Only group admins can manage AntiLink!*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const currentMode = antilinkSettings[chatId] || "off";

        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "**🔗 AntiLink Settings**\n\nChoose a mode below:",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: `${currentMode === "kick" ? "✅ " : ""}𝗞𝗜𝗖𝗞`, callback_data: `antilink:kick:${chatId}` }],
                    [{ text: `${currentMode === "warn" ? "✅ " : ""}𝗪𝗔𝗥𝗡`, callback_data: `antilink:warn:${chatId}` }],
                    [{ text: `${currentMode === "off" ? "✅ " : ""}𝗢𝗙𝗙`, callback_data: `antilink:off:${chatId}` }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    } catch (error) {
        console.error("AntiLink Error:", error);
    }
});

EsTeams.on("callback_query", async (callbackQuery) => {
    const data = callbackQuery.data;
    if (!data.startsWith("antilink:")) return;

    const [, mode, chatId] = data.split(":");
    const userId = callbackQuery.from.id;

    try {
        const chatAdmins = await EsTeams.getChatAdministrators(chatId);
        const isAdmin = chatAdmins.some(admin => admin.user.id === userId);

        if (!isAdmin) {
            return EsTeams.answerCallbackQuery(callbackQuery.id, { text: "❌ You are not an admin!" });
        }

        let antilinkSettings = {};
        if (fs.existsSync(ANTILINK_FILE)) {
            antilinkSettings = JSON.parse(fs.readFileSync(ANTILINK_FILE));
        }

        if (antilinkSettings[chatId] === mode) {
            return EsTeams.answerCallbackQuery(callbackQuery.id, { text: `⚠️ AntiLink is already set to ${mode}!` });
        }

        antilinkSettings[chatId] = mode;
        fs.writeFileSync(ANTILINK_FILE, JSON.stringify(antilinkSettings, null, 2));

        EsTeams.answerCallbackQuery(callbackQuery.id, { text: `✅ AntiLink has been set to ${mode}!` });

        return EsTeams.editMessageReplyMarkup(
            {
                inline_keyboard: [
                    [{ text: `${mode === "kick" ? "✅ " : ""}𝗞𝗜𝗖𝗞`, callback_data: `antilink:kick:${chatId}` }],
                    [{ text: `${mode === "warn" ? "✅ " : ""}𝗪𝗔𝗥𝗡`, callback_data: `antilink:warn:${chatId}` }],
                    [{ text: `${mode === "off" ? "✅ " : ""}𝗢𝗙𝗙`, callback_data: `antilink:off:${chatId}` }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            },
            {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id
            }
        );
    } catch (error) {
        console.error("AntiLink Button Error:", error);
    }
});

EsTeams.on("message", async (msg) => {
    if (!msg.text && !msg.forward_from_chat) return;

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const botImageUrl = "https://files.catbox.moe/3jibot.jpg";

    let antilinkSettings = {};
    if (fs.existsSync(ANTILINK_FILE)) {
        antilinkSettings = JSON.parse(fs.readFileSync(ANTILINK_FILE));
    }

    const mode = antilinkSettings[chatId] || "off";
    if (mode === "off") return;

    const chatAdmins = await EsTeams.getChatAdministrators(chatId);
    const isAdmin = chatAdmins.some(admin => admin.user.id === userId);
    if (isAdmin) return;

    if (/https?:\/\/\S+/i.test(msg.text)) {
        if (mode === "kick") {
            await EsTeams.deleteMessage(chatId, msg.message_id);
            await EsTeams.banChatMember(chatId, userId);
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: `🚨 *User @${msg.from.username || msg.from.first_name} has been kicked for sending links!*`,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        } else if (mode === "warn") {
            await EsTeams.deleteMessage(chatId, msg.message_id);
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: `⚠️ *Warning! @${msg.from.username || msg.from.first_name}, sending links is not allowed!*`,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }
    }

    if (msg.forward_from_chat && msg.forward_from_chat.type === "channel") {
        if (mode === "kick") {
            await EsTeams.deleteMessage(chatId, msg.message_id);
            await EsTeams.banChatMember(chatId, userId);
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: `🚨 *User @${msg.from.username || msg.from.first_name} has been kicked for forwarding messages from a channel!*`,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        } else if (mode === "warn") {
            await EsTeams.deleteMessage(chatId, msg.message_id);
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: `⚠️ *Warning! @${msg.from.username || msg.from.first_name}, forwarding messages from channels is not allowed!*`,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }
    }
});

//Info Comnand 
EsTeams.onText(/\/info/, async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    const reply = msg.reply_to_message;
    const botImage = "https://files.catbox.moe/3jibot.jpg";

    if (isLockedFor(senderId)) return newCmdLocked(chatId);

    if (msg.chat.type === "private") {
        return EsTeams.sendPhoto(chatId, botImage, {
            caption: "❌ *This command can only be used in groups.*",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    try {
        const admins = await EsTeams.getChatAdministrators(chatId);
        const isAdmin = admins.some(admin => admin.user.id === senderId);

        if (!isAdmin) {
            return EsTeams.sendPhoto(chatId, botImage, {
                caption: "❌ *You must be a group admin to use this command.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        if (!reply || !reply.from) {
            return EsTeams.sendPhoto(chatId, botImage, {
                caption: "⚠️ *Invalid Usage*\n\n📌 Reply to a user's message and then type `/info` to fetch their details.",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const user = reply.from;
        const profilePhotos = await EsTeams.getUserProfilePhotos(user.id);
        const totalPhotos = profilePhotos.total_count || 0;
        const profilePhoto = totalPhotos > 0 ? profilePhotos.photos[0][0].file_id : botImage;
        const profileLink = `tg://user?id=${user.id}`;

        let bio = "No bio available";
        try {
            const userInfo = await EsTeams.getChat(user.id);
            if (userInfo && userInfo.bio) bio = userInfo.bio;
        } catch (e) {
            console.log("Bio fetch error:", e.message);
        }

        let accountCreated = "Unknown";
        if (user.hasOwnProperty("id")) {
            const firstUserID = parseInt(user.id.toString().slice(0, 10)); 
            if (firstUserID > 0) {
                const date = new Date(firstUserID * 1000);
                accountCreated = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
            }
        }

        let groupsInCommon = "Unknown";
        try {
            const commonGroups = await EsTeams.getCommonGroups(user.id);
            groupsInCommon = commonGroups.length || 0;
        } catch (e) {
            console.log("Common groups fetch error:", e.message);
        }

        const caption = `📌 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢*\n\n` +
            `👤 *𝗡𝗮𝗺𝗲:* ${user.first_name} ${user.last_name || ""}\n` +
            `🔹 *𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲:* ${user.username ? "@" + user.username : "None"}\n` +
            `🆔 *𝗨𝘀𝗲𝗿 𝗜𝗗:* \`${user.id}\`\n` +
            `🔗 *𝗣𝗿𝗼𝗳𝗶𝗹𝗲:* [𝗖𝗹𝗶𝗰𝗸 𝗛𝗲𝗿𝗲](${profileLink})\n` +
            `📝 *𝗕𝗶𝗼:* ${bio}\n` +
            `📆 *𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱:* ${accountCreated}\n` +
            `📸 *𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗣𝗵𝗼𝘁𝗼𝘀:* ${totalPhotos}\n` +
            `👥 *𝗚𝗿𝗼𝘂𝗽𝘀 𝗶𝗻 𝗖𝗼𝗺𝗺𝗼𝗻:* ${groupsInCommon}\n\n` +
            `🔹 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 🔹`;

        EsTeams.sendPhoto(chatId, profilePhoto, {
            caption: caption,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

    } catch (err) {
        console.error("Error in /info command:", err);
        EsTeams.sendPhoto(chatId, botImage, {
            caption: "⚠️ *An error occurred while processing your request. Please try again later.*",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

//Welcome Command
EsTeams.onText(/^\/welcome$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const botImageUrl = "https://files.catbox.moe/3jibot.jpg";

    try {
        if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

        if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *This command can only be used in groups.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        const chatAdmins = await EsTeams.getChatAdministrators(chatId);
        const botId = (await EsTeams.getMe()).id;
        const isBotAdmin = chatAdmins.some(admin => admin.user.id === botId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);

        if (!isBotAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "⚠️ *I need to be an admin to manage welcome messages!*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "⚠️ *Only admins can enable or disable the welcome message!*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        let welcomeSettings = fs.existsSync(WELCOME_FILE) ? JSON.parse(fs.readFileSync(WELCOME_FILE, "utf8")) : {};
        const isEnabled = welcomeSettings[chatId] || false;

        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "🔧 *Welcome Message Settings*\n\nChoose an option below:",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: isEnabled ? "✅ 𝗢𝗡" : "⚪ 𝗢𝗡", callback_data: `welcome_on_${chatId}` }],
                    [{ text: !isEnabled ? "✅ 𝗢𝗙𝗙" : "⚪ 𝗢𝗙𝗙", callback_data: `welcome_off_${chatId}` }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

    } catch (error) {
        console.error("Welcome Command Error:", error);
    }
});

EsTeams.on("callback_query", async (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const botImageUrl = "https://files.catbox.moe/3jibot.jpg";

    if (!data.startsWith("welcome_")) return;

    try {
        let welcomeSettings = fs.existsSync(WELCOME_FILE) ? JSON.parse(fs.readFileSync(WELCOME_FILE, "utf8")) : {};

        if (data === `welcome_on_${chatId}`) {
            if (welcomeSettings[chatId]) {
                return EsTeams.answerCallbackQuery(callbackQuery.id, { text: "⚠️ Welcome Message is already enabled!" });
            }
            welcomeSettings[chatId] = true;
            EsTeams.answerCallbackQuery(callbackQuery.id, { text: "✅ Welcome Message has been Enabled!" });

        } else if (data === `welcome_off_${chatId}`) {
            if (!welcomeSettings[chatId]) {
                return EsTeams.answerCallbackQuery(callbackQuery.id, { text: "⚠️ Welcome Message is already disabled!" });
            }
            delete welcomeSettings[chatId];
            EsTeams.answerCallbackQuery(callbackQuery.id, { text: "✅ Welcome Message has been Disabled!" });
        }

        fs.writeFileSync(WELCOME_FILE, JSON.stringify(welcomeSettings, null, 2));

        const isEnabled = welcomeSettings[chatId] || false;

        return EsTeams.editMessageCaption(chatId, callbackQuery.message.message_id, {
            caption: "🔧 *Welcome Message Settings*\n\nChoose an option below:",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: isEnabled ? "✅ 𝗢𝗡" : "⚪ 𝗢𝗡", callback_data: `welcome_on_${chatId}` }],
                    [{ text: !isEnabled ? "✅ 𝗢𝗙𝗙" : "⚪ 𝗢𝗙𝗙", callback_data: `welcome_off_${chatId}` }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

    } catch (error) {
        console.error("Callback Query Error:", error);
    }
});

EsTeams.on("new_chat_members", async (msg) => {
    const chatId = msg.chat.id;
    const botImageUrl = "https://files.catbox.moe/3jibot.jpg";

    try {
        let welcomeSettings = fs.existsSync(WELCOME_FILE) ? JSON.parse(fs.readFileSync(WELCOME_FILE, "utf8")) : {};
        if (!welcomeSettings[chatId]) return;

        const newUser = msg.new_chat_members[0];
        const groupInfo = await EsTeams.getChat(chatId);
        const chatAdmins = await EsTeams.getChatAdministrators(chatId);
        const adminList = chatAdmins.map(admin => `👤 ${admin.user.first_name}`).join("\n") || "No Admins Found.";

        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `👋 Hi @${newUser.username || newUser.first_name},\n\nWelcome to *${groupInfo.title}*!\n\n📜 *Description:* ${groupInfo.description || "No Description"}\n\n👑 *Admins:*\n${adminList}`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

    } catch (error) {
        console.error("Welcome Message Error:", error);
    }
});

//Unban Command 
EsTeams.onText(/^\/unban$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const botImageUrl = "https://files.catbox.moe/3jibot.jpg";

    try {
        if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

        if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *This command can only be used in groups.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const chatAdmins = await EsTeams.getChatAdministrators(chatId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);
        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *Only group admins can use this command.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        if (!msg.reply_to_message || !msg.reply_to_message.from) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *Please reply to a banned user's message to unban them.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const unbanUserId = msg.reply_to_message.from.id;

        try {
            const chatMember = await EsTeams.getChatMember(chatId, unbanUserId);
            if (chatMember.status !== "kicked") {
                return EsTeams.sendPhoto(chatId, botImageUrl, {
                    caption: "⚠️ *This user is not banned.*",
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                        ]
                    }
                });
            }
        } catch (error) {
            console.warn("User might be banned but not found in chat members list.");
        }

        await EsTeams.unbanChatMember(chatId, unbanUserId);

        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `✅ *User has been unbanned and can now rejoin the group.*`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

    } catch (error) {
        console.error("Unban Error:", error);
        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "⚠️ *Failed to unban the user. Please check my permissions and try again.*",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

//Group Link 
EsTeams.onText(/^\/gclink$/, async (msg) => {
    const chatId = msg.chat.id;
    const botImageUrl = "https://files.catbox.moe/3jibot.jpg";

    try {
        if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
            return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly check back later...", {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *This command can only be used in groups.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const botId = (await EsTeams.getMe()).id;
        const chatAdmins = await EsTeams.getChatAdministrators(chatId);
        const isBotAdmin = chatAdmins.some(admin => admin.user.id === botId);

        if (!isBotAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "⚠️ *I need to be an admin to generate a group link!*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const inviteLink = await EsTeams.exportChatInviteLink(chatId);

        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ*",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📌 𝗝𝗢𝗜𝗡 𝗚𝗥𝗢𝗨𝗣", url: inviteLink }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

    } catch (error) {
        console.error("GC Link Error:", error);
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "⚠️ *Error generating the group link. Make sure I have permission!*",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

//Ban command 
EsTeams.onText(/^\/ban(?:\s@(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const mentionedUsername = match ? match[1] : null;
    const botImageUrl = "https://files.catbox.moe/3jibot.jpg";

    try {
        if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

        if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *This command can only be used in groups.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const chatAdmins = await EsTeams.getChatAdministrators(chatId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);
        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *Only group admins can use this command.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        let bannedUserId;
        if (msg.reply_to_message && msg.reply_to_message.from) {
            bannedUserId = msg.reply_to_message.from.id;
        } else if (mentionedUsername) {
            try {
                const chatMember = await EsTeams.getChatMember(chatId, mentionedUsername);
                if (chatMember && chatMember.user) {
                    bannedUserId = chatMember.user.id;
                }
            } catch (err) {
                return EsTeams.sendPhoto(chatId, botImageUrl, {
                    caption: "⚠️ *Could not find the mentioned user in this group.*",
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                        ]
                    }
                });
            }
        }

        if (!bannedUserId) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *Please reply to a user or mention a username to ban.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const isTargetAdmin = chatAdmins.some(admin => admin.user.id === bannedUserId);
        if (isTargetAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "⚠️ *You cannot ban another admin.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        try {
            const chatMember = await EsTeams.getChatMember(chatId, bannedUserId);
            if (chatMember.status === "kicked") {
                return EsTeams.sendPhoto(chatId, botImageUrl, {
                    caption: "⚠️ *This user is already banned.*",
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                        ]
                    }
                });
            }
        } catch (error) {
            console.warn("User might not be found in chat but will still be banned.");
        }

        await EsTeams.banChatMember(chatId, bannedUserId);

        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `✅ *User has been banned from the group.*`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

    } catch (error) {
        console.error("Ban Error:", error);
        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "⚠️ *Failed to ban the user. Please check my permissions and try again.*",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

// Promote Command
EsTeams.onText(/^\/promote(?:\s@(\w+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const botImageUrl = "https://files.catbox.moe/3jibot.jpg";
    const mentionedUsername = match[1];

    try {
        if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

        if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *This command can only be used in groups.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const chatAdmins = await EsTeams.getChatAdministrators(chatId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);
        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *Only group admins can use this command.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const botId = (await EsTeams.getMe()).id;
        const isBotAdmin = chatAdmins.some(admin => admin.user.id === botId);
        if (!isBotAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "⚠️ *I need to be an admin to promote members.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        let promotedUserId, promotedUsername;

        if (mentionedUsername) {
            const chatMembers = await EsTeams.getChatMember(chatId, mentionedUsername);
            if (!chatMembers || chatMembers.status === "left") {
                return EsTeams.sendPhoto(chatId, botImageUrl, {
                    caption: "❌ *User is not in this group.*",
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                        ]
                    }
                });
            }
            promotedUserId = chatMembers.user.id;
            promotedUsername = `@${mentionedUsername}`;
        } else if (msg.reply_to_message && msg.reply_to_message.from) {
            promotedUserId = msg.reply_to_message.from.id;
            promotedUsername = msg.reply_to_message.from.username
                ? `@${msg.reply_to_message.from.username}`
                : `[${msg.reply_to_message.from.first_name}](tg://user?id=${promotedUserId})`;
        } else {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *Please reply to a user message to promote them.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const isAlreadyAdmin = chatAdmins.some(admin => admin.user.id === promotedUserId);
        if (isAlreadyAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: `⚠️ *${promotedUsername} is already an admin.*`,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                    ]
                }
            });
        }

        await EsTeams.promoteChatMember(chatId, promotedUserId, {
            can_manage_chat: true,
            can_change_info: true,
            can_delete_messages: true,
            can_invite_users: true,
            can_pin_messages: true
        });

        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `✅ *${promotedUsername} has been promoted to admin.*`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

    } catch (error) {
        console.error("Promote Error:", error);
        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "⚠️ *Failed to promote the user. Please check my permissions and try again.*",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

// Demote Command
EsTeams.onText(/^\/demote(?:\s@(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const mentionedUsername = match ? match[1] : null;
    const botImageUrl = "https://files.catbox.moe/3jibot.jpg";

    try {
        if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}
        if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *This command can only be used in groups.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const chatAdmins = await EsTeams.getChatAdministrators(chatId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);
        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *Only group admins can use this command.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        let demotedUserId;
        if (msg.reply_to_message && msg.reply_to_message.from) {
            demotedUserId = msg.reply_to_message.from.id;
        } else if (mentionedUsername) {
            try {
                const chatMember = await EsTeams.getChatMember(chatId, mentionedUsername);
                if (chatMember && chatMember.user) {
                    demotedUserId = chatMember.user.id;
                }
            } catch (err) {
                return EsTeams.sendPhoto(chatId, botImageUrl, {
                    caption: "⚠️ *Could not find the mentioned user in this group.*",
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                        ]
                    }
                });
            }
        }

        if (!demotedUserId) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "❌ *Please reply to an admin message to demote.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        const isAlreadyAdmin = chatAdmins.some(admin => admin.user.id === demotedUserId);
        if (!isAlreadyAdmin) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "⚠️ *This user is not an admin.*",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });
        }

        await EsTeams.promoteChatMember(chatId, demotedUserId, {
            can_manage_chat: false,
            can_change_info: false,
            can_delete_messages: false,
            can_invite_users: false,
            can_pin_messages: false
        });

        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `✅ *User has been demoted from admin.*`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

    } catch (error) {
        console.error("Demote Error:", error);
        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "⚠️ *Failed to demote the user. Please check my permissions and try again.*",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

//Lock group command
EsTeams.onText(/^\/lockgc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *This command can only be used in groups.*",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    }

    try {
        const botInfo = await EsTeams.getMe();
        const botId = botInfo.id;
        const chatAdmins = await EsTeams.getChatAdministrators(chatId);

        const isBotAdmin = chatAdmins.some(admin => admin.user.id === botId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);

        if (!isBotAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *I need to be an admin to manage group permissions.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *Only group admins can use this command.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        const chatInfo = await EsTeams.getChat(chatId);
        if (chatInfo.permissions && chatInfo.permissions.can_send_messages === false) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *The group is already locked.*\n\nOnly admins can send messages.",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        await EsTeams.setChatPermissions(chatId, {
            can_send_messages: false,
            can_send_audios: false,
            can_send_documents: false,
            can_send_photos: false,
            can_send_videos: false,
            can_send_video_notes: false,
            can_send_voice_notes: false,
            can_send_polls: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false
        });

        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "✅ *Group has been locked.*\n\nOnly admins can send messages now.",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });

    } catch (error) {
        console.error("Unexpected Error:", error);
    }
});

//Unlock Group Command
EsTeams.onText(/^\/unlockgc$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *This command can only be used in groups.*",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    }

    try {
        const botInfo = await EsTeams.getMe();
        const botId = botInfo.id;
        const chatAdmins = await EsTeams.getChatAdministrators(chatId);

        const isBotAdmin = chatAdmins.some(admin => admin.user.id === botId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);

        if (!isBotAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *I need to be an admin to manage group permissions.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *Only group admins can use this command.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        const chatInfo = await EsTeams.getChat(chatId);
        if (chatInfo.permissions && chatInfo.permissions.can_send_messages === true) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *The group is already unlocked.*\n\nEveryone can send messages.",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        await EsTeams.setChatPermissions(chatId, {
            can_send_messages: true,
            can_send_audios: true,
            can_send_documents: true,
            can_send_photos: true,
            can_send_videos: true,
            can_send_video_notes: true,
            can_send_voice_notes: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true
        });

        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "✅ *Group has been unlocked.*\n\nEveryone can send messages now.",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });

    } catch (error) {
        console.error("Unexpected Error:", error);
    }
});

//Set gcname 
EsTeams.onText(/^\/setgroup(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const newTitle = match[1];

   if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *This command can only be used in groups.*",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    }

    if (!newTitle) {
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *Invalid Input*\n\nUsage: `/setgroup <new name>`",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    }

    try {
        const botInfo = await EsTeams.getMe();
        const botId = botInfo.id;
        const chatAdmins = await EsTeams.getChatAdministrators(chatId);

        const isBotAdmin = chatAdmins.some(admin => admin.user.id === botId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);

        if (!isBotAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *I need to be an admin to change the group name.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *Only group admins can use this command.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        await EsTeams.setChatTitle(chatId, newTitle);
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: `✅ *Group name changed to:* ${newTitle}`,
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });

    } catch (error) {
        console.error("Unexpected Error:", error);
    }
});

//Set group image 
EsTeams.onText(/^\/setgcimage$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *This command can only be used in groups.*",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    }

    if (!msg.reply_to_message || !msg.reply_to_message.photo) {
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *Invalid Input*\n\nPlease reply to an image with `/setgcimage` to change the group picture.",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗣𝗔𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]] }
        });
    }

    try {
        const botInfo = await EsTeams.getMe();
        const botId = botInfo.id;
        const chatAdmins = await EsTeams.getChatAdministrators(chatId);

        const isBotAdmin = chatAdmins.some(admin => admin.user.id === botId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);

        if (!isBotAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *I need to be an admin to change the group picture.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *Only group admins can use this command.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        const photoArray = msg.reply_to_message.photo;
        const highestQualityPhoto = photoArray[photoArray.length - 1].file_id;

        const fileUrl = await EsTeams.getFileLink(highestQualityPhoto);

        const imagePath = path.join("ES_TEAMS-MEDIA/image", `${userId}.jpg`);

        const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imagePath, response.data);

        await EsTeams.setChatPhoto(chatId, imagePath);

        fs.unlinkSync(imagePath);

        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "✅ *Group picture has been updated successfully.*",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });

    } catch (error) {
        console.error("Unexpected Error:", error);
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *An error occurred while changing the group picture. Please try again.*",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    }
});

//Set Group description
EsTeams.onText(/^\/setgcinfo(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const newDescription = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *This command can only be used in groups.*",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    }

    if (!newDescription) {
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *Invalid Input*\n\nUsage: `/setgcinfo <new description>`",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    }

    try {
        const botInfo = await EsTeams.getMe();
        const botId = botInfo.id;
        const chatAdmins = await EsTeams.getChatAdministrators(chatId);

        const isBotAdmin = chatAdmins.some(admin => admin.user.id === botId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);

        if (!isBotAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *I need to be an admin to change the group description.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *Only group admins can use this command.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        await EsTeams.setChatDescription(chatId, newDescription);
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: `✅ *Group description updated.*\n\n📝 *New Description:* ${newDescription}`,
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });

    } catch (error) {
        console.error("Unexpected Error:", error);
    }
});

//Delete command 
EsTeams.onText(/^\/delete$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (isLockedFor(userId)) return newCmdLocked(chatId);

    if (msg.chat.type !== "supergroup" && msg.chat.type !== "group") {
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *This command can only be used in groups.*",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    }

    if (!msg.reply_to_message) {
        return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "⚠️ *Invalid Input*\n\nPlease reply to a message with `/delete` to delete it.",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    }

    try {
        const botInfo = await EsTeams.getMe();
        const botId = botInfo.id;
        const chatAdmins = await EsTeams.getChatAdministrators(chatId);

        const isBotAdmin = chatAdmins.some(admin => admin.user.id === botId);
        const isUserAdmin = chatAdmins.some(admin => admin.user.id === userId);

        if (!isBotAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *I need to be an admin to delete messages.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        if (!isUserAdmin) {
            return EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
                caption: "⚠️ *Only group admins can use this command.*",
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
            });
        }

        await EsTeams.deleteMessage(chatId, msg.reply_to_message.message_id);

        EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: "✅ *Message deleted successfully.*",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]] }
        });
    } catch (error) {
        console.error("Unexpected Error:", error);
    }
});

//Image Scan
EsTeams.onText(/^\/imgscan$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    if (!msg.reply_to_message || !msg.reply_to_message.photo) {
        return EsTeams.sendMessage(chatId, "*Invalid Input*\n\nPlease reply to an image with `/imgscan`.", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    const fileId = msg.reply_to_message.photo.pop().file_id;
    const waitingMsg = await EsTeams.sendMessage(chatId, "🔍 *Analyzing your Image. Please hold on...*", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });

    try {
        const fileUrl = await EsTeams.getFileLink(fileId);
        
        const response = await fetch(fileUrl);
        const buffer = await response.buffer();
        const imagePath = path.join('ES_TEAMS-MEDIA/image', `${userId}.jpg`);
        fs.writeFileSync(imagePath, buffer);

        const formData = new FormData();
        formData.append("fileToUpload", fs.createReadStream(imagePath));
        formData.append("reqtype", "fileupload");

        const uploadRes = await fetch("https://catbox.moe/user/api.php", {
            method: "POST",
            body: formData
        });

        const catboxUrl = await uploadRes.text();

        const data = await esApiGet("/api/v1/dev/imgscan", { url: catboxUrl });

        if (!data.description) throw new Error("Image scan failed");

        const caption = `*𝐄𝐒 𝐓𝐄𝐀𝐌𝐒 𝐕𝟏 𝐀𝐍𝐀𝐋𝐘𝐙𝐄𝐑*\n\n*Result:*\n${data.description}\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ*`;

        await EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

        fs.unlinkSync(imagePath);

    } catch (error) {
        console.error("Image Scan Error:", error);
        await EsTeams.editMessageText(chatId, waitingMsg.message_id, "⚠️ *An error occurred while scanning the image. Please try again.*", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
});

// ================= DECRYPT COMMAND ================= //
EsTeams.onText(/\/decrypt/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    const isPremium = premiumUsers.includes(userId);
    const isOwner = CONFIG.OWNER_IDS.includes(msg.from.id);

    // ---------- LOCK BOT ----------
    if (LOCK_BOT && !isOwner) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                ]
            }
        });
    }

    // ---------- PREMIUM CHECK ----------
    if (!isPremium) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `💎 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗥𝗘𝗠𝗜𝗨𝗠*\n\nThis command is only available for premium users.\n\n💰 Price: ₦5000`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "𝗝𝗢𝗜𝗡 𝗣𝗥𝗘𝗠𝗜𝗨𝗠", callback_data: "pay_5000" }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                ]
            }
        });
    }

    // ---------- OWNER CHECK ----------
    if (!isOwner) {
        return EsTeams.sendMessage(chatId, "❌ *You are not Authorized to Use this Command*", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                ]
            }
        });
    }

    // ---------- INPUT HANDLING ----------
    let text;

    if (msg.text.split(" ").length > 1) {
        text = msg.text.split(" ").slice(1).join(" ");
    } else if (msg.reply_to_message?.text) {
        text = msg.reply_to_message.text;
    } else if (msg.reply_to_message?.document) {
        const fileId = msg.reply_to_message.document.file_id;

        try {
            const fileLink = await EsTeams.getFileLink(fileId);
            const fileResponse = await axios.get(fileLink, { responseType: "arraybuffer" });
            text = Buffer.from(fileResponse.data).toString("utf-8");
        } catch (err) {
            return EsTeams.sendMessage(chatId, "⚠️ *Failed to download the file.*", {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                    ]
                }
            });
        }
    } else {
        return EsTeams.sendMessage(chatId, "⚠️ *Invalid Input*\n\nUsage: /decrypt (reply to file or text)", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                ]
            }
        });
    }

    // ---------- DECRYPT ----------
    try {
        const decryptedCode = await webcrack(text);

        if (!decryptedCode || !decryptedCode.code) {
            return EsTeams.sendMessage(chatId, "⚠️ *Failed to decrypt the file.*", {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                    ]
                }
            });
        }

        const filePath = `./ES_TEAMS-MEDIA/decrypted_${chatId}.js`;
        fs.writeFileSync(filePath, decryptedCode.code);

        await EsTeams.sendDocument(chatId, filePath, {
            caption: "🔥 *𝗗𝗘𝗖𝗥𝗬𝗣𝗧𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛*",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                ]
            }
        });

        fs.unlinkSync(filePath);

    } catch (error) {
        console.error("Decryption error:", error);
        EsTeams.sendMessage(chatId, "⚠️ *An error occurred while decrypting.*", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                ]
            }
        });
    }
});

//Encrypt Command
EsTeams.onText(/\/encrypt/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    const isPremium = premiumUsers.includes(userId);

    const usage = `*Usage Example:*\n\n\`/encrypt (Reply to a File to Encrypt)\``;

    // ---------- LOCK BOT ----------
    if (LOCK_BOT) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                ]
            }
        });
    }

    // ---------- PREMIUM CHECK ----------
    if (!isPremium) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `💎 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗥𝗘𝗠𝗜𝗨𝗠*\n\nThis command is only available for premium users.\n\n💰 Price: ₦5000`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "𝗝𝗢𝗜𝗡 𝗣𝗥𝗘𝗠𝗜𝗨𝗠", callback_data: "pay_5000" }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                ]
            }
        });
    }

    let code;

    // ---------- TEXT INPUT ----------
    if (msg.text.split(" ").length > 1) {
        code = msg.text.split(" ").slice(1).join(" ");

    } else if (msg.reply_to_message?.text) {
        code = msg.reply_to_message.text;

    } else if (msg.reply_to_message?.document) {

        const fileSize = msg.reply_to_message.document.file_size;

        if (fileSize > 20 * 1024 * 1024) {
            return EsTeams.sendMessage(chatId, "⚠️ *File Size Limit Exceeded*\n\n_Maximum Limit: 20MB_", {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                    ]
                }
            });
        }

        const processingMessage = await EsTeams.sendMessage(
            chatId,
            "🔄 *Downloading and encrypting your file...*",
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                    ]
                }
            }
        );

        try {
            const fileId = msg.reply_to_message.document.file_id;
            const fileName = msg.reply_to_message.document.file_name || "unknown.js";

            if (!fileName.endsWith(".js")) {
                return EsTeams.sendMessage(chatId, "⚠️ *Invalid File Type*\n\n_Only JavaScript (.js) files can be encrypted._", {
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                    ]
                }
            });
            }

            const fileLink = await EsTeams.getFileLink(fileId);
            const response = await axios.get(fileLink, { responseType: "arraybuffer" });

            code = response.data.toString("utf-8");

        } catch (error) {
            console.error("File download error:", error);
            return EsTeams.sendMessage(chatId, "⚠️ *Failed to download the file.*", {
                parse_mode: "Markdown"
            });
        }

    } else {
        return EsTeams.sendMessage(chatId, `⚠️ *Invalid Input*\n\n${usage}`, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                ]
            }
        });
    }

    // ---------- ORIGINAL ENCRYPT LOGIC (UNCHANGED CORE) ----------
    try {
        function identifierGenerator() {
            const baseString = "素晴座ES TEAMS素晴難";
            function randomString(length) {
                let result = "";
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                for (let i = 0; i < length; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
            }
            return baseString + randomString(2);
        }

        const options = {
            target: "node",
            preset: "high",
            compact: true,
            minify: true,
            flatten: true,
            identifierGenerator,
            renameVariables: true,
            renameGlobals: true,
            stringEncoding: true,
            stringSplitting: 0.0,
            stringConcealing: true,
            stringCompression: true,
            controlFlowFlattening: 1.0,
            opaquePredicates: 0.9,
            deadCode: 0.0,
            dispatcher: true,
            calculator: true,
            hexadecimalNumbers: true,
            movedDeclarations: true,
            objectExtraction: true,
            globalConcealing: true
        };

        const obfuscatedCode = await JSConfuser.obfuscate(code, options);

        const filePath = `./ES_TEAMS-MEDIA/encrypted_${chatId}.js`;
        fs.writeFileSync(filePath, obfuscatedCode.code || obfuscatedCode);

        const form = new FormData();
        form.append("file", fs.createReadStream(filePath));

        const uploadRes = await axios.post("https://upload.gofile.io/uploadfile", form, {
            headers: form.getHeaders()
        });

        const downloadURL = uploadRes.data.data.downloadPage;

        await EsTeams.sendPhoto(chatId, "https://files.catbox.moe/3jibot.jpg", {
            caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗘𝗡𝗖𝗥𝗬𝗣𝗧𝗢𝗥`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📎 𝗖𝗢𝗣𝗬 𝗨𝗥𝗟", callback_data: `copyurl_${downloadURL}` }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
                ]
            }
        });

        fs.unlinkSync(filePath);

    } catch (error) {
        console.error("Encryption error:", error);
        EsTeams.sendMessage(chatId, "⚠️ *Encryption failed.*", {
            parse_mode: "Markdown"
        });
    }
});

//APK DOWNLOADER
EsTeams.onText(/\/apk(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1]?.trim();

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

  if (!query) {
    return EsTeams.sendMessage(chatId, "📲 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗔𝗣𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n\n🔍 _Use:_ `/apk <app name>`", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const waitingMsg = await EsTeams.sendMessage(chatId, "🔄 *Processing your request. Please hold on...*", {
    parse_mode: "Markdown"
  });

  try {
    const data = await esApiGet("/api/v1/dev/apk", { query });

    if (!data.infoPage) {
      await EsTeams.deleteMessage(chatId, waitingMsg.message_id);
      return EsTeams.sendMessage(chatId, "🚫 *APK not found.* Please try another name.", { parse_mode: "Markdown" });
    }

    const { name: apk_name, icon: thumbnail, infoPage } = data;

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    return EsTeams.sendPhoto(chatId, thumbnail || botImageUrl, {
      caption: `📦App Name: ${apk_name}\n\nPlease click the button below to open the download page.`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬇️ 𝗢𝗣𝗘𝗡 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗣𝗔𝗚𝗘", url: infoPage }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

  } catch (error) {
    console.error("Error in /apk command:", error);
    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `❌ An error occurred while processing your request.\n\nError: ${error.message}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

// ------ STICKER COMMAND -------------- //
EsTeams.onText(/\/sticker(?: (.+))?/, async (msg, match) => {

    try {

        const chatId = msg.chat.id;
       
       if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
  
        if (!msg.reply_to_message || !msg.reply_to_message.sticker) {

            return EsTeams.sendPhoto(chatId, botImageUrl, {

                caption:
`*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥*

Reply to a sticker with:
/sticker 😊

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,

                parse_mode: "Markdown",

                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary"
                            }
                        ]
                    ]
                }

            });

        }

        const stickerFileId = msg.reply_to_message.sticker.file_id;

        const emoji = match && match[1] ? match[1] : "🔥";

        const botUsername = (await EsTeams.getMe()).username;

        const userId = msg.from.id;

        const userName =
            msg.from.first_name ||
            msg.from.username ||
            "User";

        const uniqueId = Date.now();

        const packName = `esteams_${userId}_${uniqueId}_by_${botUsername}`;

        const packTitle = `${userName} @${botUsername}`;

        try {

            await EsTeams.createNewStickerSet(
                userId,
                packName,
                packTitle,
                stickerFileId,
                emoji
            );

            return EsTeams.sendPhoto(chatId, botImageUrl, {

                caption:
`*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗣𝗔𝗖𝗞*

𝗡𝗮𝗺𝗲: *${userName}*
𝗔𝘂𝘁𝗵𝗼𝗿: *@${botUsername}*

Tap below to add your sticker pack.`,

                parse_mode: "Markdown",

                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "➕ 𝗔𝗗𝗗 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗣𝗔𝗖𝗞",
                                url: `https://t.me/addstickers/${packName}`
                            }
                        ],
                        [
                            {
                                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary"
                            }
                        ]
                    ]
                }

            });

        } catch (err) {

            console.log(err);

            return EsTeams.sendPhoto(chatId, botImageUrl, {

                caption:
`⚠️ *𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗖𝗥𝗘𝗔𝗧𝗜𝗢𝗡 𝗙𝗔𝗜𝗟𝗘𝗗*

Please try again.`,

                parse_mode: "Markdown"

            });

        }

    } catch (error) {

        console.log(error);

        const chatId = msg.chat.id;

        EsTeams.sendPhoto(chatId, botImageUrl, {

            caption:
`⚠️ *𝗘𝗥𝗥𝗢𝗥 𝗢𝗖𝗖𝗨𝗥𝗥𝗘𝗗*

Please try again.`,

            parse_mode: "Markdown"

        });

    }

});

// G DRIVE LINK
EsTeams.onText(/^\/gdrive(?:\s(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const inputUrl = match[1];

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
  
  // ❌ No link provided
  if (!inputUrl) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ *Invalid Usage*\n\nUse:\n`/gdrive Google Drive link>`",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const waitingMsg = await EsTeams.sendMessage(chatId, "⏳ Processing Google Drive link...");

  try {
    const data = await esApiGet("/api/v1/dev/gdrive", { url: inputUrl });

    if (!data.downloadLink) {
      throw new Error("API returned failure");
    }

    // 📁 Save to file (UNCHANGED as you wanted)
    const logEntry = `
Name: ${data.name}
Size: ${data.size}
Link: ${data.downloadLink}
Date: ${new Date().toLocaleString()}
-----------------------------`;
    fs.appendFileSync(driveLogPath, logEntry);

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    const mime = data.mimeType || "";
    const fileName = data.name || "Unknown";
    const fileSize = data.size || "Unknown";
    const link = data.downloadLink;

    const thumbnail = data.thumbnail || botImageUrl;

    // 🖼 IMAGE
    if (mime.startsWith("image/")) {
      return EsTeams.sendPhoto(chatId, link, {
        caption:
`🖼️ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗚 𝗗𝗥𝗜𝗩𝗘 𝗙𝗜𝗟𝗘*

*Name:* ${fileName}
*Size:* ${fileSize}`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📋 𝗖𝗢𝗣𝗬 𝗟𝗜𝗡𝗞", copy_text: { text: link } }],
            [{ text: "⬇️ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗", url: link }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    // 🎥 VIDEO
    if (mime.startsWith("video/")) {
      return EsTeams.sendPhoto(chatId, thumbnail, {
        caption:
`🎥 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗚 𝗗𝗥𝗜𝗩𝗘 𝗙𝗜𝗟𝗘*

*Name:* ${fileName}
*Size:* ${fileSize}

▶️ Tap below to watch/download`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "▶️ 𝗪𝗔𝗧𝗖𝗛 𝗩𝗜𝗗𝗘𝗢", url: link }],
            [{ text: "📋 𝗖𝗢𝗣𝗬 𝗟𝗜𝗡𝗞", copy_text: { text: link } }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    // 📦 DEFAULT FILE
    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption:
`📁 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗚 𝗗𝗥𝗜𝗩𝗘 𝗙𝗜𝗟𝗘*

*Name:* ${fileName}
*Size:* ${fileSize}
*Type:* ${mime}

⬇️ Use button below to download`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬇️ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗙𝗜𝗟𝗘", url: link }],
          [{ text: "📋 𝗖𝗢𝗣𝗬 𝗟𝗜𝗡𝗞", copy_text: { text: link } }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

  } catch (err) {
    console.error("Drive Error:", err.message);

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ Failed to fetch Google Drive file.\nMake sure the link is valid.",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//================ TIP COMMAND ================//
EsTeams.onText(/\/tip/, async (msg) => {

    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // OWNER ONLY
    if (!CONFIG.OWNER_IDS.includes(userId)) {
        return EsTeams.sendMessage(
            chatId,
            "🚫 *Access Denied!*",
            { parse_mode: "Markdown" }
        );
    }

    // FETCH USERS
    const userRef = doc(db, "botData", "users");
    const snap = await getDoc(userRef);

    const targets = snap.exists()
        ? snap.data().ids || []
        : [];

    if (targets.length === 0) {
        return EsTeams.sendMessage(
            chatId,
            "❌ No users found.",
            { parse_mode: "Markdown" }
        );
    }

    let successCount = 0;
    let failedCount = 0;

    const processing = await EsTeams.sendMessage(
        chatId,
        "📡 *Starting Tip Broadcast...*",
        { parse_mode: "Markdown" }
    );

    for (const targetId of targets) {

        try {

            const sent = await EsTeams.sendPhoto(
                targetId,
                botImageUrl,
                {
                    caption:
`*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗔𝗡𝗡𝗢𝗨𝗡𝗖𝗘𝗠𝗘𝗡𝗧*

Hello,
It's a new day don't forget to drop a Tip as appreciation for our services

More Tips = More Unlock Features

*THANK YOU AS YOU DO SO*

~ Admin`,

                    parse_mode: "Markdown",

                    reply_markup: {
                        inline_keyboard: [

                            // ⭐ STARS GATEWAY
                            [
                                { text: "⭐ 𝗧𝗜𝗣 𝗪𝗜𝗧𝗛 𝗦𝗧𝗔𝗥𝗦", callback_data: "tip_gateway_stars", style: "primary" }
                            ],

                            // 💳 PAYSTACK OPTIONS
                            [
                                { text: "⭐ ₦100", callback_data: "tip_100" },
                                { text: "⭐ ₦500", callback_data: "tip_500" }
                            ],
                            [
                                { text: "⭐ ₦1000", callback_data: "tip_1000" },
                                { text: "⭐ ₦2000", callback_data: "tip_2000" }
                            ],
                            [
                                { text: "⭐ ₦5000", callback_data: "tip_5000", style: "primary" }
                            ]
                        ]
                    }
                }
            );

            userMenuMessage.set(targetId, sent.message_id);

            successCount++;

        } catch (err) {
            console.log(`Failed sending to ${targetId}:`, err.message);
            failedCount++;
        }
    }

    await EsTeams.deleteMessage(chatId, processing.message_id);

    return EsTeams.sendMessage(
        chatId,
        `✅ *Tip Broadcast Complete*

👥 Total Users: ${targets.length}
✅ Success: ${successCount}
❌ Failed: ${failedCount}`,
        { parse_mode: "Markdown" }
    );
});


//================ TIP CALLBACK ROUTER ================//
EsTeams.on("callback_query", async (query) => {

    const data = query.data;
    if (!data) return;

    const chatId = query.message.chat.id;


    //================ STARS MENU =================//
    if (data === "tip_gateway_stars") {

        const sent = await EsTeams.sendPhoto(
            chatId,
            botImageUrl,
            {
                caption:
`⭐ *𝗧𝗜𝗣 𝗪𝗜𝗧𝗛 𝗦𝗧𝗔𝗥𝗦*

Choose amount:`,

                parse_mode: "Markdown",

                reply_markup: {
                    inline_keyboard: [

                        [
                            { text: "⭐ 10", callback_data: "tipstar_10" },
                            { text: "⭐ 20", callback_data: "tipstar_20" }
                        ],
                        [
                            { text: "⭐ 30", callback_data: "tipstar_30" },
                            { text: "⭐ 40", callback_data: "tipstar_40" }
                        ],
                        [
                            { text: "⭐ 50", callback_data: "tipstar_50" }
                        ]
                    ]
                }
            }
        );

        userMenuMessage.set(chatId, sent.message_id);
        return;
    }


    //================ TELEGRAM STARS PAYMENT =================//
    if (data.startsWith("tipstar_")) {

        const amount = Number(data.split("_")[1]);

        if (!amount) return EsTeams.answerCallbackQuery(query.id);

        try {

            await EsTeams.sendInvoice(
                chatId,
                "⭐ 𝗧𝗜𝗣 𝗪𝗜𝗧𝗛 𝗦𝗧𝗔𝗥𝗦",
                "Support ES TEAMS using Telegram Stars.",
                `tipstars_${query.from.id}_${Date.now()}`,
                "",
                "XTR",
                [
                    {
                        label: "ES TEAMS TIP STARS",
                        amount: amount
                    }
                ]
            );

            return EsTeams.answerCallbackQuery(query.id);

        } catch (err) {

            console.log(err.message);

            return EsTeams.sendMessage(
                chatId,
                "❌ Failed to create Stars payment."
            );
        }
    }


    //================ PAYSTACK TIP PAYMENT =================//
    if (data.startsWith("tip_")) {

        const amount = Number(data.split("_")[1]);

        if (!amount) return;

        try {

            const response = await axios.post(
                "https://api.paystack.co/transaction/initialize",
                {
                    email: `user${query.from.id}@es-teams.bot`,
                    amount: amount * 100,
                    currency: "NGN",
                    metadata: {
                        telegram_id: query.from.id,
                        username: query.from.username || "no_username",
                        chat_id: chatId,
                        payment_type: "tip"
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const paymentUrl = response.data?.data?.authorization_url;

            if (!paymentUrl) {
                return EsTeams.sendMessage(chatId, "❌ Failed to generate payment link.");
            }

            const sent = await EsTeams.sendPhoto(
                chatId,
                botImageUrl,
                {
                    caption:
`💖 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗜𝗣*

Amount: ₦${amount}

Click below to continue payment.`,

                    parse_mode: "Markdown",

                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "💰 𝗣𝗔𝗬 𝗡𝗢𝗪", url: paymentUrl }]
                        ]
                    }
                }
            );

            userMenuMessage.set(chatId, sent.message_id);

            return EsTeams.answerCallbackQuery(query.id);

        } catch (err) {

            console.log(err.response?.data || err.message);

            return EsTeams.sendMessage(chatId, "❌ Paystack payment failed.");
        }
    }
});

//================ DONATE COMMAND ================//
EsTeams.onText(/\/donate/, async (msg) => {

    const chatId = msg.chat.id;

    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const sent = await EsTeams.sendPhoto(
        chatId,
        botImageUrl,
        {
            caption:
`💖 *𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦*

Choose your preferred option below:`,

            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [

                    [{ text: "⭐ 𝗣𝗔𝗬 𝗪𝗜𝗧𝗛 𝗦𝗧𝗔𝗥𝗦", callback_data: "gateway_stars", style: "success" }],

                    [{ text: "💳 𝗣𝗔𝗬 𝗪𝗜𝗧𝗛 𝗣𝗔𝗬𝗦𝗧𝗔𝗖𝗞", callback_data: "gateway_paystack", style: "success" }],

                    [{ text: "❓𝗛𝗔𝗩𝗜𝗡𝗚 𝗔𝗡 𝗜𝗦𝗦𝗨𝗘", url: "https://t.me/examsolutionteam", style: "danger" }]
                ]
            }
        }
    );

    userMenuMessage.set(chatId, sent.message_id);
});



//================ CALLBACK ROUTER ================//
EsTeams.on("callback_query", async (query) => {

    const data = query.data;
    if (!data) return;

    const chatId = query.message.chat.id;

    // delete old menu safely
    const oldMsgId = userMenuMessage.get(chatId);

    if (oldMsgId) {
        try {
            await EsTeams.deleteMessage(chatId, oldMsgId);
        } catch (e) {}
    }



    //================ STARS MENU =================//
    if (data === "gateway_stars") {

        const sent = await EsTeams.sendPhoto(
            chatId,
            botImageUrl,
            {
                caption:
`⭐ *𝗧𝗚 𝗦𝗧𝗔𝗥𝗦 𝗗𝗢𝗡𝗔𝗧𝗜𝗢𝗡*

Choose an amount:`,

                parse_mode: "Markdown",

                reply_markup: {
                    inline_keyboard: [

                        [
                            { text: "⭐ 10", callback_data: "star_10" },
                            { text: "⭐ 20", callback_data: "star_20" }
                        ],

                        [
                            { text: "⭐ 30", callback_data: "star_30" },
                            { text: "⭐ 40", callback_data: "star_40" }
                        ],

                        [
                            { text: "⭐ 50", callback_data: "star_50" }
                        ]
                    ]
                }
            }
        );

        userMenuMessage.set(chatId, sent.message_id);

        return;
    }



    //================ TELEGRAM STARS PAYMENT =================//
    if (data.startsWith("star_")) {

        const amount = Number(data.split("_")[1]);

        if (!amount) {
            return EsTeams.answerCallbackQuery(query.id);
        }

        try {

            await EsTeams.sendInvoice(
                chatId,

                "⭐𝗧𝗚 𝗦𝗧𝗔𝗥𝗦 𝗗𝗢𝗡𝗔𝗧𝗜𝗢𝗡",

                "Click the button below to continue Payment.",

                `stars_${query.from.id}_${Date.now()}`,

                "", // provider token EMPTY for stars

                "XTR",

                [
                    {
                        label: "ES TEAMS STARS",
                        amount: amount
                    }
                ]
            );

            return EsTeams.answerCallbackQuery(query.id);

        } catch (err) {

            console.log(err.message);

            return EsTeams.sendMessage(
                chatId,
                "❌ Failed to create Stars payment."
            );
        }
    }



    //================ PAYSTACK MENU =================//
    if (data === "gateway_paystack") {

        const sent = await EsTeams.sendPhoto(
            chatId,
            botImageUrl,
            {
                caption:
`💳 *𝗣𝗔𝗬𝗦𝗧𝗔𝗖𝗞 𝗗𝗢𝗡𝗔𝗧𝗜𝗢𝗡*

Choose an amount:`,

                parse_mode: "Markdown",

                reply_markup: {
                    inline_keyboard: [

                        [
                            { text: "⭐ ₦100", callback_data: "ipay_100" },
                            { text: "⭐ ₦500", callback_data: "ipay_500" }
                        ],

                        [
                            { text: "⭐ ₦1000", callback_data: "ipay_1000" },
                            { text: "⭐ ₦2000", callback_data: "ipay_2000" }
                        ],

                        [
                            { text: "⭐ ₦5000", callback_data: "ipay_5000" }
                        ]
                    ]
                }
            }
        );

        userMenuMessage.set(chatId, sent.message_id);

        return;
    }



    //================ PAYSTACK PAYMENT =================//
    if (data.startsWith("ipay_")) {

        const amount = Number(data.split("_")[1]);

        if (!amount) return;

        try {

            const response = await axios.post(
                "https://api.paystack.co/transaction/initialize",
                {
                    email: `user${query.from.id}@es-teams.bot`,
                    amount: amount * 100,
                    currency: "NGN",

                    metadata: {
                        telegram_id: query.from.id,
                        username: query.from.username || "no_username",
                        chat_id: chatId
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const paymentUrl = response.data.data.authorization_url;

            const sent = await EsTeams.sendPhoto(
                chatId,
                botImageUrl,
                {
                    caption:
`💳 *𝗣𝗔𝗬𝗦𝗧𝗔𝗖𝗞 𝗣𝗔𝗬𝗠𝗘𝗡𝗧*

Amount: ₦${amount}`,

                    parse_mode: "Markdown",

                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "💰 𝗣𝗔𝗬 𝗡𝗢𝗪", url: paymentUrl }]
                        ]
                    }
                }
            );

            userMenuMessage.set(chatId, sent.message_id);

            return EsTeams.answerCallbackQuery(query.id);

        } catch (err) {

            console.log(err.response?.data || err.message);

            return EsTeams.sendMessage(
                chatId,
                "❌ Paystack payment failed."
            );
        }
    }

});



//================ PRE CHECKOUT =================//
EsTeams.on("pre_checkout_query", async (query) => {

    try {

        await EsTeams.answerPreCheckoutQuery(
            query.id,
            true
        );

    } catch (err) {

        console.log(err.message);
    }
});



//================ SUCCESSFUL PAYMENT =================//
EsTeams.on("message", async (msg) => {

    if (msg.successful_payment) {

        await EsTeams.sendMessage(
            msg.chat.id,
            `✅ *Payment Successful!*

Thank you for supporting *ES TEAMS* with Telegram Stars ⭐`,
            {
                parse_mode: "Markdown"
            }
        );

        console.log(msg.successful_payment);
    }
});

//================= TOPUP COMMAND =================//
EsTeams.onText(/^\/topup(?:\s+(\d+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const coinsAmount = match[1];

  if (userId !== adminId) {
    return EsTeams.sendMessage(chatId, "❌ Admin only");
  }

  if (!coinsAmount) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗢𝗣𝗨𝗣 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦*

💎 Input how many coins to add

Example: /topup 300`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }
        ]]
      }
    });
  }

  const currentBalance = await getAccountBalance();

  let msg1 = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗢𝗣𝗨𝗣 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦*

💎 *Current Balance:* ${currentBalance}`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "▶️ 𝗣𝗥𝗢𝗖𝗘𝗘𝗗", callback_data: `topup_proceed_${coinsAmount}_${currentBalance}` }
      ]]
    }
  });
});

EsTeams.on("callback_query", async (query) => {
  const data = query.data;

  if (data.startsWith("topup_proceed_")) {
    const [_, coinsAmount, currentBalance] = data.split('_');
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {
      await EsTeams.deleteMessage(chatId, messageId).catch(() => {});

      const topupCode = await createTopupCode(parseInt(coinsAmount));

      if (!topupCode) {
        return EsTeams.sendMessage(chatId, "❌ Failed to create topup code");
      }

      let msg2 = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗢𝗣𝗨𝗣 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦*

🔐 *Topup Code:* \`${topupCode}\`

Click Proceed to Continue`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[
            { text: "▶️ 𝗣𝗥𝗢𝗖𝗘𝗘𝗗", callback_data: `topup_redeem_${topupCode}_${coinsAmount}_${currentBalance}` }
          ]]
        }
      });

    } catch (err) {
      EsTeams.sendMessage(chatId, `❌ Error: ${err.message}`);
    }
  }

  if (data.startsWith("topup_redeem_")) {
    const parts = data.split('_');
    const topupCode = parts[2];
    const coinsAmount = parts[3];
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {
      await EsTeams.deleteMessage(chatId, messageId).catch(() => {});

      const newBalance = await redeemTopupCode(topupCode);

      if (newBalance === null || newBalance === 0) {
        return EsTeams.sendMessage(chatId, "❌ Failed to redeem code");
      }

      await deleteTopupCode(topupCode);

      let msg3 = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗢𝗣𝗨𝗣 𝗦𝗨𝗖𝗖𝗘𝗦𝗦*

💎 *Balance:* ${newBalance}

✅ Coins successfully added!`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[
            { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }
          ]]
        }
      });

    } catch (err) {
      EsTeams.sendMessage(chatId, `❌ Error: ${err.message}`);
    }
  }
});

//================= WAREACT COMMAND =================//
EsTeams.onText(/^\/wareact(?:\s+(.+))?$/, async (msg, match) => {  
  const chatId = msg.chat.id;  
  const userId = msg.from.id;  
  const channelLink = match[1] ? match[1].trim() : match[1];  
    
  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {  
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly check back later...", {  
      parse_mode: "Markdown",  
      reply_markup: {  
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]  
      }  
    });  
  }  
  
  if (!channelLink) {  
    return EsTeams.sendPhoto(chatId, botImageUrl, {  
      caption: "❌ *Invalid Input*\n\nUsage: `/wareact <channel_link>`\n\nExample:\n`/wareact https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29/5696`",  
      parse_mode: "Markdown",  
      reply_markup: {  
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]  
      }  
    });  
  }  
  
  // Must be a link to a specific channel post (same format the website asks for).
  if (!/whatsapp\.com\/channel\/[A-Za-z0-9_-]+\/\d+/i.test(channelLink)) {
    return EsTeams.sendMessage(chatId, "❌ *Invalid channel post link*\n\nSend the link of a specific post, e.g.\n`/wareact https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29/5696`", { parse_mode: "Markdown" });
  }

  // Check the EmmyHenz accounts first: is any key valid, with a coin (or free daily use) and not rate limited?
  const availability = await getReactAvailability();
  if (!availability.configured || availability.usable === 0) {
    console.log('⚠️ No active EmmyHenz account (check the EMMYHENZ_TOKEN values).');
    return EsTeams.sendMessage(chatId, "⚠️ Reaction service is temporarily unavailable. Please try again later.");
  }
  if (availability.free === 0) {
    return EsTeams.sendMessage(chatId, queueMessage());
  }

  if (!CONFIG.OWNER_IDS.includes(userId)) {  
    const cooldown = await checkWareactCooldown(userId);  
  
    if (!cooldown.canUse) {  
      const timeLeft = cooldown.timeLeft;  
      const hours = Math.floor(timeLeft / (60 * 60 * 1000));  
      const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));  
  
      const paymentMsg = await EsTeams.sendPhoto(chatId, botImageUrl, {  
        caption: `*𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦*  
  
Your daily free limit has been used.  
  
Pay *${WAREACT_STARS}* Stars to continue the service.  
  
⏰ *Next Free Use In:* ${hours}h ${minutes}m  
  
Tap the button below`,  
        parse_mode: "Markdown",  
        reply_markup: {  
          inline_keyboard: [  
            [{ text: "⭐ 𝗣𝗔𝗬 𝗡𝗢𝗪", callback_data: `wareact_pay_${userId}` }],  
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]  
          ]  
        }  
      });  
  
      userPendingReactions.set(userId, {  
        channelLink: channelLink,  
        chatId: chatId,  
        paymentMsgId: paymentMsg.message_id  
      });  
  
      return;  
    }  
  }  
  
  await processWareact(chatId, channelLink, userId);  
});  
  
const wareactInFlight = new Set();
async function processWareact(chatId, channelLink, userId, paidChargeId = null) {
  if (userId && wareactInFlight.has(userId)) {
    let note = "";
    if (paidChargeId) {
      note = (await refundWareactStars(userId, paidChargeId))
        ? ` Your ${WAREACT_STARS} Stars were refunded.`
        : " Please contact the admin about your Stars.";
    }
    return EsTeams.sendMessage(chatId, `⏳ Your previous reaction request is still processing. Please wait for it to finish.${note}`).catch(() => {});
  }
  if (userId) wareactInFlight.add(userId);
  try {
    return await processWareactInner(chatId, channelLink, userId, paidChargeId);
  } finally {
    if (userId) wareactInFlight.delete(userId);
  }
}

async function processWareactInner(chatId, channelLink, userId, paidChargeId = null) {  
  let loading = await EsTeams.sendMessage(chatId, "⏳ Processing...\n▰▱▱▱▱▱▱");  
  
  const health = await checkServerHealth();  
  
  if (!health.isHealthy) {  
    let healthRefundNote = "";
    if (paidChargeId) {
      healthRefundNote = (await refundWareactStars(userId, paidChargeId))
        ? `\n\n⭐ Your ${WAREACT_STARS} Stars have been refunded.`
        : `\n\n⚠️ Could not auto-refund your Stars. Please contact the admin.`;
    }
    try {  
      await EsTeams.deleteMessage(chatId, loading.message_id);  
    } catch (e) {}  
  
    await EsTeams.sendPhoto(chatId, botImageUrl, {  
      caption: `⚠️ *𝗦𝗘𝗥𝗩𝗘𝗥 𝗨𝗡𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘*\n\n${health.reason}\n\nPlease try again later.${healthRefundNote}`,  
      parse_mode: "Markdown",  
      reply_markup: {  
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]  
      }  
    });  
    return;  
  }  
  
  const steps = [  
    "▰▰▱▱▱▱▱ Connecting...",  
    "▰▰▰▱▱▱▱ Checking account...",  
    "▰▰▰▰▱▱▱ Preparing request...",  
    "▰▰▰▰▰▱▱ Sending request...",  
    "▰▰▰▰▰▰▱ Processing reactions...",  
    "▰▰▰▰▰▰▰ Completing..."  
  ];  
  
  try {  
    for (let i = 0; i < steps.length; i++) {  
      await new Promise(r => setTimeout(r, 500));  
        
      if (i < steps.length - 1) {  
        try {  
          await EsTeams.editMessageText(`⏳ Processing...\n${steps[i]}`, {  
            chat_id: chatId,  
            message_id: loading.message_id  
          });  
        } catch (e) {  
        }  
      }  
    }  
  
    const result = await sendChannelReact(channelLink);  
  
    try {  
      await EsTeams.deleteMessage(chatId, loading.message_id);  
    } catch (e) {}  
  
    if (result.success) {  
      if (userId && !paidChargeId) { // a paid use must not restart the free 24h window  
        await saveWareactTime(userId);  
      }  
  
      const emoji = result.emojisUsed?.length  
        ? result.emojisUsed.join(" ")  
        : "🎲 Random";  
  
      const totalCoinsAvailable = result.coinsLeft || 0; // total across all accounts  
  
      await EsTeams.sendPhoto(chatId, botImageUrl, {  
        caption: `*✅ 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗥𝗘𝗔𝗖𝗧 𝗦𝗨𝗖𝗖𝗘𝗦𝗦*  
  
😊 *Reactions Used:*  
${emoji}  
  
💎 *Coins Left:* 
${totalCoinsAvailable}  
  
📌 *Status:*  
${result.message}  
  
_𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛_`,  
        parse_mode: "Markdown",  
        reply_markup: {  
          inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]  
        }  
      });  
    } else {  
      let refundNote = "";
      if (paidChargeId) {
        refundNote = (await refundWareactStars(userId, paidChargeId))
          ? `\n\n⭐ Your ${WAREACT_STARS} Stars have been refunded.`
          : `\n\n⚠️ Could not auto-refund your Stars. Please contact the admin.`;
      }
      await EsTeams.sendPhoto(chatId, botImageUrl, {  
        caption: `${result.queue ? '⏳ *𝗦𝗘𝗥𝗩𝗜𝗖𝗘 𝗕𝗨𝗦𝗬*' : '❌ *𝗥𝗘𝗔𝗖𝗧 𝗙𝗔𝗜𝗟𝗘𝗗*'}\n\n${result.message}${refundNote}`,  
        parse_mode: "Markdown",  
        reply_markup: {  
          inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]  
        }  
      });  
    }  
  } catch (err) {  
    console.error('Command error:', err.message);  
    let errRefundNote = "";
    if (paidChargeId) {
      errRefundNote = (await refundWareactStars(userId, paidChargeId))
        ? `\n\n⭐ Your ${WAREACT_STARS} Stars have been refunded.`
        : `\n\n⚠️ Could not auto-refund your Stars. Please contact the admin.`;
    }
      
    try {  
      await EsTeams.deleteMessage(chatId, loading.message_id);  
    } catch (e) {}  
  
    await EsTeams.sendPhoto(chatId, botImageUrl, {  
      caption: `❌ *𝗘𝗥𝗥𝗢𝗥*\n\n\`${err.message}\`${errRefundNote}`,  
      parse_mode: "Markdown",  
      reply_markup: {  
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]  
      }  
    });  
  }  
}  
  
EsTeams.on("callback_query", async (query) => {  
  const data = query.data;  
  if (!data.startsWith("wareact_pay_")) return;

  // No saved request (e.g. bot restarted): do not take payment for nothing.
  if (!userPendingReactions.has(query.from.id)) {
    return EsTeams.answerCallbackQuery(query.id, { text: "Session expired. Send /wareact <link> again.", show_alert: true }).catch(() => {});
  }  
  
  const userId = query.from.id;  
  const chatId = query.message.chat.id;  
  
  try {  
    await EsTeams.sendInvoice(  
      chatId,  
      "⭐ 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦",  
      "Unlock ES TEAMS Reactions using Telegram Stars.",  
      `wareact_${userId}_${Date.now()}`,  
      "",  
      "XTR",  
      [  
        {  
          label: "ES TEAMS REACTIONS",  
          amount: WAREACT_STARS  
        }  
      ]  
    );  
  
    EsTeams.answerCallbackQuery(query.id);  
  } catch (err) {  
    console.log(err.message);  
    EsTeams.sendMessage(chatId, "❌ Failed to create Stars payment.");  
  }  
});  
  
EsTeams.on("successful_payment", async (msg) => {
  const sp = msg.successful_payment;
  // Only handle wareact invoices here (payload is "wareact_<userId>_<time>").
  if (!sp || !String(sp.invoice_payload || "").startsWith("wareact_")) return;

  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const chargeId = sp.telegram_payment_charge_id;

  const pending = userPendingReactions.get(userId);

  if (!pending) {
    const ok = await refundWareactStars(userId, chargeId);
    return EsTeams.sendMessage(
      chatId,
      ok
        ? "⚠️ Your session expired, so your Stars were refunded. Please send /wareact <link> again."
        : "⚠️ Your session expired. Please contact the admin for a refund."
    ).catch(() => {});
  }

  try {
    await EsTeams.deleteMessage(chatId, pending.paymentMsgId);
  } catch (e) {}

  userPendingReactions.delete(userId);
  await processWareact(chatId, pending.channelLink, userId, chargeId);
});

//================= WAPOLL COMMAND (POLL VOTES) =================//
const waPlain = (s, n = 100) => String(s || '').slice(0, n);                      // for plain-text messages
const waMd = (s, n = 100) => String(s || '').slice(0, n).replace(/([*_`\[])/g, '\\$1'); // for Markdown captions
const waNewId = () => Math.random().toString(36).slice(2, 8).padEnd(6, '0');
const WA_KEYBOARD_LINK = [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]];

function waPurgeExpired() {
  const now = Date.now();
  for (const [sid, sess] of waPollSessions) if (now - sess.createdAt > WAPOLL_SESSION_TTL) waPollSessions.delete(sid);
  for (const [uid, p] of waPollPending) if (now - p.createdAt > 15 * 60 * 1000) waPollPending.delete(uid);
}

EsTeams.onText(/^\/wapoll(?:@\w+)?(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const link = match[1] ? match[1].trim() : '';

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly check back later...", {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: WA_KEYBOARD_LINK }
    });
  }

  if (!link) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ *Invalid Input*\n\nUsage: `/wapoll <poll_post_link>`\n\nExample:\n`/wapoll https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29/5696`",
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: WA_KEYBOARD_LINK }
    });
  }

  if (!/whatsapp\.com\/channel\/[A-Za-z0-9_-]+\/\d+/i.test(link)) {
    return EsTeams.sendMessage(chatId, "❌ *Invalid channel post link*\n\nSend the link of the specific poll post, e.g.\n`/wapoll https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29/5696`", { parse_mode: "Markdown" });
  }

  if (waPollInFlight.has(userId)) {
    return EsTeams.sendMessage(chatId, "⏳ Your previous poll vote is still processing. Please wait for it to finish.");
  }

  // Is any EmmyHenz account able to vote right now? (valid key, a coin or free daily use, not rate limited)
  const availability = await getVoteAvailability();
  if (!availability.configured || availability.usable === 0) {
    console.log('⚠️ No active EmmyHenz account (check the EMMYHENZ_TOKEN values).');
    return EsTeams.sendMessage(chatId, "⚠️ Poll service is temporarily unavailable. Please try again later.");
  }
  if (availability.free === 0) {
    return EsTeams.sendMessage(chatId, queueMessage('vote'));
  }

  const checking = await EsTeams.sendMessage(chatId, "🔎 Checking the poll...");
  const info = await fetchPollInfo(link);
  try { await EsTeams.deleteMessage(chatId, checking.message_id); } catch (e) {}

  if (!info.success) {
    return EsTeams.sendMessage(chatId, `❌ Could not read the poll: ${info.error}`);
  }
  if (!info.isPoll) {
    return EsTeams.sendMessage(chatId, "❌ This post is not a poll.\n\nTo react to a post use /wareact <link>.");
  }

  // One open poll per user: a new /wapoll replaces the old poll message.
  waPurgeExpired();
  for (const [sid, sess] of waPollSessions) {
    if (sess.userId === userId) {
      waPollSessions.delete(sid);
      try { await EsTeams.deleteMessage(sess.chatId, sess.messageId); } catch (e) {}
    }
  }

  const sid = waNewId();
  const options = info.options.slice(0, 12);
  const keyboard = options.map((opt, i) => [{ text: `${i + 1}. ${opt}`.slice(0, 60), callback_data: `wapollo_${sid}_${i}` }]);
  keyboard.push([{ text: "✖️ Cancel", callback_data: `wapollx_${sid}` }]);

  const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗢𝗟𝗟 𝗩𝗢𝗧𝗘𝗦*\n\n📊 ${waMd(info.question, 300)}${info.channelName ? `\n📢 ${waMd(info.channelName)}` : ''}\n\nChoose the option to vote for 👇`,
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: [...keyboard, ...WA_KEYBOARD_LINK] }
  });

  waPollSessions.set(sid, {
    userId, chatId, link,
    question: info.question, channelName: info.channelName, options,
    messageId: sent.message_id, createdAt: Date.now()
  });
});

// Sends the vote (free use, or after Stars payment) and shows the result.
async function processWapoll(chatId, userId, sel, paidChargeId = null) {
  if (waPollInFlight.has(userId)) {
    let note = "";
    if (paidChargeId) {
      note = (await refundWareactStars(userId, paidChargeId))
        ? ` Your ${WAPOLL_STARS} Stars were refunded.`
        : " Please contact the admin about your Stars.";
    }
    return EsTeams.sendMessage(chatId, `⏳ Your previous poll vote is still processing. Please wait for it to finish.${note}`).catch(() => {});
  }

  waPollInFlight.add(userId);
  try {
    const loading = await EsTeams.sendMessage(chatId, `⏳ Sending your vote...\n🗳️ ${waPlain(sel.optionText)}`);

    let result;
    try {
      result = await sendPollVote(sel.link, sel.optionIndex);
    } catch (err) {
      console.error('Wapoll error:', err.message);
      result = { success: false, message: `❌ Could not send the vote: ${waPlain(err.message, 120)}` };
    }

    try { await EsTeams.deleteMessage(chatId, loading.message_id); } catch (e) {}

    if (result.success) {
      if (!paidChargeId && !CONFIG.OWNER_IDS.includes(userId)) {
        await saveWapollTime(userId); // a paid vote must not restart the free 24h window
      }

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `*✅ 𝗣𝗢𝗟𝗟 𝗩𝗢𝗧𝗘 𝗦𝗨𝗖𝗖𝗘𝗦𝗦*

🗳️ *Option:*
${waMd(result.option || sel.optionText)}

💎 *Coins Left:*
${result.coinsLeft || 0}

📌 *Status:*
${result.message}

_𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛_`,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: WA_KEYBOARD_LINK }
      });
    } else {
      let refundNote = "";
      if (paidChargeId) {
        refundNote = (await refundWareactStars(userId, paidChargeId))
          ? `\n\n⭐ Your ${WAPOLL_STARS} Stars have been refunded.`
          : `\n\n⚠️ Could not auto-refund your Stars. Please contact the admin.`;
      }
      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `${result.queue ? '⏳ *𝗦𝗘𝗥𝗩𝗜𝗖𝗘 𝗕𝗨𝗦𝗬*' : '❌ *𝗩𝗢𝗧𝗘 𝗙𝗔𝗜𝗟𝗘𝗗*'}\n\n${result.message}${refundNote}`,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: WA_KEYBOARD_LINK }
      });
    }
  } catch (err) {
    console.error('Wapoll command error:', err.message);
    if (paidChargeId) {
      const ok = await refundWareactStars(userId, paidChargeId);
      EsTeams.sendMessage(chatId, ok ? `❌ Something went wrong. Your ${WAPOLL_STARS} Stars have been refunded.` : "❌ Something went wrong. Please contact the admin about your Stars.").catch(() => {});
    } else {
      EsTeams.sendMessage(chatId, "❌ Something went wrong. Please try again.").catch(() => {});
    }
  } finally {
    waPollInFlight.delete(userId);
  }
}

// A poll option was tapped (or the poll was cancelled).
EsTeams.on("callback_query", async (query) => {
  const data = query.data || '';
  const pick = /^wapollo_([a-z0-9]{6})_(\d{1,2})$/.exec(data);
  const cancel = /^wapollx_([a-z0-9]{6})$/.exec(data);
  if (!pick && !cancel) return;

  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const answer = (text, alert = true) => EsTeams.answerCallbackQuery(query.id, text ? { text, show_alert: alert } : undefined).catch(() => {});

  const sid = (pick || cancel)[1];
  const sess = waPollSessions.get(sid);

  if (!sess || Date.now() - sess.createdAt > WAPOLL_SESSION_TTL) {
    waPollSessions.delete(sid);
    try { await EsTeams.deleteMessage(chatId, query.message.message_id); } catch (e) {}
    return answer("This poll expired. Send /wapoll <link> again.");
  }
  if (sess.userId !== userId) return answer("This poll belongs to another user.");

  if (cancel) {
    waPollSessions.delete(sid);
    try { await EsTeams.deleteMessage(chatId, query.message.message_id); } catch (e) {}
    return answer();
  }

  const optionIndex = Number(pick[2]);
  if (!(optionIndex >= 0 && optionIndex < sess.options.length)) return answer("Invalid option.");
  if (waPollInFlight.has(userId)) return answer("Your previous vote is still processing. Please wait.");

  // Check the accounts again: nobody pays (or uses their free vote) while the service is busy.
  const availability = await getVoteAvailability();
  if (!availability.configured || availability.usable === 0) return answer("Poll service is temporarily unavailable. Please try again later.");
  if (availability.free === 0) return answer(queueMessage('vote'));

  await answer(null);

  // Delete the poll message, then continue with a new message.
  waPollSessions.delete(sid);
  try { await EsTeams.deleteMessage(chatId, query.message.message_id); } catch (e) {}

  const sel = { link: sess.link, optionIndex, optionText: sess.options[optionIndex], question: sess.question };

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    const cooldown = await checkWapollCooldown(userId);
    if (!cooldown.canUse) {
      const hours = Math.floor(cooldown.timeLeft / (60 * 60 * 1000));
      const minutes = Math.floor((cooldown.timeLeft % (60 * 60 * 1000)) / (60 * 1000));

      const paymentMsg = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗢𝗟𝗟 𝗩𝗢𝗧𝗘𝗦*

Your daily free poll vote has been used.

🗳️ *Option:* ${waMd(sel.optionText)}
⏳ Next free vote in: *${hours}h ${minutes}m*

Pay *${WAPOLL_STARS}* Stars to send this vote now.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: `⭐ Pay ${WAPOLL_STARS} Stars`, callback_data: `wapollpay_${userId}` }],
            ...WA_KEYBOARD_LINK
          ]
        }
      });

      waPollPending.set(userId, { ...sel, chatId, paymentMsgId: paymentMsg.message_id, createdAt: Date.now() });
      return;
    }
  }

  await processWapoll(chatId, userId, sel, null);
});

// "Pay Stars" button.
EsTeams.on("callback_query", async (query) => {
  const data = query.data || '';
  if (!data.startsWith("wapollpay_")) return;

  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const answer = (text) => EsTeams.answerCallbackQuery(query.id, text ? { text, show_alert: true } : undefined).catch(() => {});

  if (data !== `wapollpay_${userId}`) return answer("This payment button belongs to another user.");

  // No saved vote (e.g. the bot restarted): do not take payment for nothing.
  if (!waPollPending.has(userId)) return answer("Session expired. Send /wapoll <link> again.");

  // Do not take money while every account is busy.
  const availability = await getVoteAvailability();
  if (availability.configured && availability.usable > 0 && availability.free === 0) return answer(queueMessage('vote'));

  try {
    await EsTeams.sendInvoice(
      chatId,
      "⭐ 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗢𝗟𝗟 𝗩𝗢𝗧𝗘𝗦",
      "Send a poll vote using Telegram Stars.",
      `wapoll_${userId}_${Date.now()}`,
      "",
      "XTR",
      [{ label: "ES TEAMS POLL VOTE", amount: WAPOLL_STARS }]
    );
    await answer();
  } catch (err) {
    console.log(err.message);
    EsTeams.sendMessage(chatId, "❌ Failed to create Stars payment.").catch(() => {});
  }
});

// Stars payment received: send the vote (refund if it cannot be delivered).
EsTeams.on("successful_payment", async (msg) => {
  const sp = msg.successful_payment;
  if (!sp || !String(sp.invoice_payload || "").startsWith("wapoll_")) return;

  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const chargeId = sp.telegram_payment_charge_id;
  const pending = waPollPending.get(userId);

  if (!pending) {
    const ok = await refundWareactStars(userId, chargeId);
    return EsTeams.sendMessage(
      chatId,
      ok
        ? "⚠️ Your session expired, so your Stars were refunded. Please send /wapoll <link> again."
        : "⚠️ Your session expired. Please contact the admin for a refund."
    ).catch(() => {});
  }

  waPollPending.delete(userId);
  try { await EsTeams.deleteMessage(chatId, pending.paymentMsgId); } catch (e) {}
  await processWapoll(chatId, userId, pending, chargeId);
});

// ============ SET TOKEN COMMAND (renew an EmmyHenz account without redeploying) ========= //
EsTeams.onText(/^\/settoken(?:@\w+)?(?:\s+([\s\S]*))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ Admin command only!");
  }

  const args = (match[1] || '').trim();
  // The message contains a token: remove it from the chat right away.
  const wipe = async () => { try { await EsTeams.deleteMessage(chatId, msg.message_id); } catch (e) {} };

  if (msg.chat.type !== 'private') {
    await wipe();
    return EsTeams.sendMessage(chatId, "🔒 Use /settoken in a private chat with me, not in a group. I deleted that message.");
  }

  const parts = args.split(/\s+/).filter(Boolean);
  if (parts.length < 2 || !/^\d{1,2}$/.test(parts[0])) {
    if (args) await wipe();
    return EsTeams.sendMessage(
      chatId,
      "🔑 *Renew an EmmyHenz token*\n\nUsage: `/settoken <number> <token>`\n\n`0` = Main, `1` = Account 1, `2` = Account 2 ...\nExample: `/settoken 3 <your new token>`\n\nUse a private chat. I delete your message after reading it.",
      { parse_mode: "Markdown" }
    );
  }

  await wipe();

  try {
    const result = await setAccountToken(parseInt(parts[0], 10), parts.slice(1).join(''));
    if (!result.ok) {
      return EsTeams.sendMessage(chatId, `❌ ${result.reason}`);
    }
    const coinsText = Number.isFinite(result.coins) ? `${result.coins} coins` : "coins unknown";
    await EsTeams.sendMessage(
      chatId,
      `✅ ${result.acc.label} updated (${coinsText}).\n\nI deleted your message so the token is not left in the chat.${result.saved ? "" : "\n\n⚠️ Could not save it, so it will be lost when the bot restarts."}`
    );
  } catch (err) {
    console.error("Settoken error:", err.message);
    await EsTeams.sendMessage(chatId, "❌ Something went wrong. Please try again.");
  }
});

// Admin card: bot image + caption (bold title) + the primary WhatsApp channel button.
// A photo caption is limited to 1024 characters, so a longer card is sent as plain text instead.
async function sendAdminCard(chatId, caption) {
  const opts = { parse_mode: "Markdown", reply_markup: { inline_keyboard: WA_KEYBOARD_LINK } };
  if (caption.length <= 1000) return EsTeams.sendPhoto(chatId, botImageUrl, { caption, ...opts });
  return EsTeams.sendMessage(chatId, caption, opts);
}

// ============ ACC STATS COMMAND ========= //
EsTeams.onText(/^\/accstats$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ Admin command only!");
  }

  try {
    if (!emmyAccounts.length) {
      return EsTeams.sendMessage(chatId, "ℹ️ No EmmyHenz account is set up. Add EMMYHENZ_TOKEN (and EMMYHENZ_TOKEN1, EMMYHENZ_TOKEN2, ... for more) with your API keys.");
    }

    const { total, stale } = await getTotalCoins(true);

    let text = `*📊 𝗖𝗢𝗜𝗡𝗦 𝗔𝗖𝗖𝗢𝗨𝗡𝗧𝗦*\n\n`;
    for (const a of emmyAccounts.slice(0, 25)) {
      const icon = a.n === 0 ? "🏦" : "👤";
      if (a.invalid) {
        text += `${icon} ${a.label} — ❌ API key invalid or revoked\n`;
        continue;
      }
      const coins = Number.isFinite(a.balance) ? `\`${a.balance}\` coins` : "coins unknown";
      const state = a.rateUntil > Date.now() ? "⏳ rate limited" : hasCredit(a, 'react') ? "🟢 ready" : "🔴 no coins";
      const premium = a.premium ? ` ⭐ free today: ${a.reactFree} react / ${a.voteFree} vote` : "";
      text += `${icon} ${a.label} — ${coins} — ${state}${premium}\n`;
    }
    text += stale ? `\n💎 *Total Coins:* unknown (no working key)` : `\n💎 *Total Coins:* \`${total}\``;
    if (emmyAccounts.some((a) => a.invalid)) text += `\n\n🔑 Renew a key: /settoken <number> <new key>`;
    text += `\n\n🛠 Build: \`${BUILD_ID}\``;
    text += `\n\n_𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛_`;

    await sendAdminCard(chatId, text);
  } catch (err) {
    console.error("Accstats error:", err.message);
    await EsTeams.sendMessage(chatId, `❌ Error: \`${cleanReason(err.message)}\``, { parse_mode: "Markdown" });
  }
});

// ============ CLAIM ALL COMMAND ========= //
EsTeams.onText(/^\/claimall$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ Admin command only!");
  }

  if (!emmyAccounts.length) {
    return EsTeams.sendMessage(chatId, "ℹ️ No EmmyHenz account is set up. Add EMMYHENZ_TOKEN (and EMMYHENZ_TOKEN1, EMMYHENZ_TOKEN2, ... for more) with your API keys.");
  }

  const loading = await EsTeams.sendMessage(chatId, "⏳ Claiming coins from all accounts...");

  try {
    const { results, total, stale, claimed } = await claimAllAccounts();

    const lines = results.slice(0, 20).map((r) =>
      r.success ? `✅ ${r.label}: +${r.coins} coins` : r.already ? `ℹ️ ${r.label}: ${r.error}` : `❌ ${r.label}: ${r.error}`
    ).join("\n");
    const anyBadKey = results.some((r) => !r.success && !r.already && /invalid|revoked/i.test(r.error));

    try { await EsTeams.deleteMessage(chatId, loading.message_id); } catch (e) {}

    await sendAdminCard(
      chatId,
`*✅ 𝗖𝗢𝗜𝗡 𝗖𝗟𝗔𝗜𝗠𝗜𝗡𝗚 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘*

${lines}

💰 *Coins Claimed This Run:* ${claimed}

💎 *Total Coins:* ${stale ? "unknown (no working key)" : total}${anyBadKey ? "\n\n🔑 Renew a key: /settoken <number> <new key>" : ""}

_𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛_`
    );
  } catch (err) {
    console.error("Claimall error:", err);

    const errText = `❌ Error: ${cleanReason(err.message)}`;
    await EsTeams.editMessageText(errText, {
      chat_id: chatId,
      message_id: loading.message_id,
    }).catch(() => EsTeams.sendMessage(chatId, errText).catch(() => {}));
  }
});

//================= CRON RUN COMMAND =================//
EsTeams.onText(/^\/nextcron$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ Admin command only!");
  }

  const now = new Date();

  // next daily claim: 00:05 UTC (retries at 06:00, 12:00 and 18:00 UTC)
  const next24 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 5, 0));
  if (next24 <= now) next24.setUTCDate(next24.getUTCDate() + 1);

  await EsTeams.sendMessage(
    chatId,
    `🕒 *𝗖𝗥𝗢𝗡 𝗦𝗖𝗛𝗘𝗗𝗨𝗟𝗘*

💎 Claim Coins (daily, UTC):
\`${next24.toUTCString()}\``,
    {
      parse_mode: "Markdown"
    }
  );
});

// -------------- STREAM COMMAND -------------- //
EsTeams.onText(/^\/stream$/, async (msg) => {
  const chatId = msg.chat.id;

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly check back later...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]
      }
    });
  }

  await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: `*𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗩*

Click the *LIVE TV* button below to get started!`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "▶️ 𝗟𝗜𝗩𝗘 𝗧𝗩", web_app: { url: "https://esteamstv.devs.surf/" } }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });
});

// ------ PLAY COMMAND -------------- //
EsTeams.onText(/\/play(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const query = match[1]?.trim();
  const CHANNEL_ID = "@esteams_btc";

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (!query) {
    return EsTeams.sendMessage(chatId,
      "❄️ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗠𝗨𝗦𝗜𝗖 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\n📥 _Use:_ `/play Let It Go`",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      }
    );
  }

  try {
    const member = await EsTeams.getChatMember(CHANNEL_ID, userId).catch(() => null);

    if (!member || ["left", "kicked"].includes(member.status)) {
      const waitingMsg = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗦𝗢𝗡𝗚 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\nJoin our Channel to Continue !\n\nClick the *✅ Approve* button below",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ 𝗔𝗣𝗣𝗥𝗢𝗩𝗘", url: `https://t.me/${CHANNEL_ID.replace("@", "")}`, style: "success" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });

      const interval = setInterval(async () => {
        const checkMember = await EsTeams.getChatMember(CHANNEL_ID, userId).catch(() => null);
        if (checkMember && !["left", "kicked"].includes(checkMember.status)) {
          clearInterval(interval);
          await EsTeams.deleteMessage(chatId, waitingMsg.message_id); 
          playSong(); 
        }
      }, 5000);

      return; 
    } else {
      playSong();
    }

    async function playSong() {
      let typingInterval;
      try {

      // ----- Loading bar animation only -----
      let loadingMsg = await EsTeams.sendMessage(chatId, "⏳ Fetching your song...\n▰▱▱▱▱▱▱");
      const steps = ["▰▰▱▱▱▱▱","▰▰▰▱▱▱▱","▰▰▰▰▱▱▱","▰▰▰▰▰▱▱","▰▰▰▰▰▰▱","▰▰▰▰▰▰▰"];

      for (let step of steps) {
        await new Promise(r => setTimeout(r, 300));
        await EsTeams.editMessageText(`⏳ Fetching your song...\n${step}`, {
          chat_id: chatId,
          message_id: loadingMsg.message_id
        });
      }

      // After animation, delete it
      await EsTeams.deleteMessage(chatId, loadingMsg.message_id);

      typingInterval = setInterval(() => EsTeams.sendChatAction(chatId, "upload_audio"), 2000);

      const data = await esApiGet("/api/v1/dev/mp3", { query });

      clearInterval(typingInterval);

      if (!data?.download_url)
    throw new Error("Unable to fetch song.");

      const { title, thumbnail } = data;
      const download = data.download_url;
      const lyricsId = Math.random().toString(36).substring(2, 10);
      lyricsMap.set(lyricsId, title);

      await EsTeams.sendPhoto(chatId, thumbnail, {
        caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗦𝗢𝗡𝗚 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\n🎶 *Title:* _${title}_\n📥 *Downloading your song...*\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🗒️ 𝗚𝗘𝗧 𝗟𝗬𝗥𝗜𝗖𝗦", callback_data: `lyrics_${lyricsId}`, style: "primary" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });

      const filePath = `./ES_TEAMS-MEDIA/audio/${userId}.mp3`;
      const audioResponse = await axios({
    url: download,
    method: "GET",
    responseType: "stream",
    timeout: 180000,
    maxRedirects: 10,
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Referer": "https://youtube.com/"
    }
});
      const writer = fs.createWriteStream(filePath);
      audioResponse.data.pipe(writer);
      await new Promise((resolve, reject) => { writer.on("finish", resolve); writer.on("error", reject); })
      
      const stats = fs.statSync(filePath);

if (stats.size < 50000) {
    throw new Error("Downloaded file is invalid.");
};

      await EsTeams.sendAudio(chatId, filePath, {
        caption: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ",
        title: title,
        performer: "єѕ τєαмѕ τєϲн",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });

      fs.unlinkSync(filePath);
      } catch (err) {
        if (typingInterval) clearInterval(typingInterval);
        console.error("playSong error:", err.message);
        EsTeams.sendMessage(chatId, "⚠️ *Unable to fetch this song right now. Please try again.*", {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
          }
        });
      }
    }

  } catch (err) {
    console.error("play command error:", err.message);
    EsTeams.sendMessage(chatId, "⚠️ *Unable to fetch this song right now. Please try again.*", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  if (data.startsWith("lyrics_")) {
    const id = data.split("_")[1];
    const songTitle = lyricsMap.get(id);

    if (!songTitle) {
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "⚠️ Lyrics session expired. Please play the song again.",
        parse_mode: "Markdown"
      });
    }

    await EsTeams.deleteMessage(chatId, messageId).catch(() => {});

    const waitMsg = await EsTeams.sendMessage(chatId, "🎶 Fetching lyrics...", {
      parse_mode: "Markdown"
    });

    try {
      let artist = "";
      let title = songTitle;

      if (songTitle.includes("-")) {
        const parts = songTitle.split("-");
        artist = parts[0].trim();
        title = parts.slice(1).join("-").trim();
      }

      const lyricsData = await esApiGet("/api/v1/dev/lyrics", { artist, title });

      await EsTeams.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

      if (!lyricsData?.lyrics) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: "⚠️ Lyrics not found.",
          parse_mode: "Markdown"
        });
      }

      const fullLyrics = lyricsData.lyrics.trim();

      const preview = fullLyrics.length > 900
        ? fullLyrics.slice(0, 900) + "\n\n...(truncated)"
        : fullLyrics;

      const caption =
`🎵 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗟𝗬𝗥𝗜𝗖𝗦*

🎤 *Artist:* ${res.data.artist || artist || "Unknown"}
🎶 *Title:* ${res.data.title || title}

${preview}

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`;

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });

    } catch (err) {
      await EsTeams.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "⚠️ Failed to fetch lyrics.",
        parse_mode: "Markdown"
      });
    }
  }
});

/// ======= VIDEO COMMAND ======= //
EsTeams.onText(/\/video(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const query = match[1]?.trim();
    const CHANNEL_ID = "@esteams_btc"; 

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡Ｅ𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    if (!query) {
        return EsTeams.sendMessage(chatId, "🎥 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\n📥 _Use:_ `/video Despacito`", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡Ｅ𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    try {
        const member = await EsTeams.getChatMember(CHANNEL_ID, userId).catch(() => null);

        if (!member || ["left", "kicked"].includes(member.status)) {
            const waitingMsg = await EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: "*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\nJoin our Channel to Continue !\n\nClick the *✅ Approve* button below",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "✅ 𝗔𝗣𝗣𝗥𝗢𝗩𝗘", url: `https://t.me/${CHANNEL_ID.replace("@", "")}` }],
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡Ｅ𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });

            const interval = setInterval(async () => {
                const checkMember = await EsTeams.getChatMember(CHANNEL_ID, userId).catch(() => null);
                if (checkMember && !["left", "kicked"].includes(checkMember.status)) {
                    clearInterval(interval);
                    await EsTeams.deleteMessage(chatId, waitingMsg.message_id).catch(() => null); 
                    downloadVideo(); 
                }
            }, 5000);

            return; 
        } else {
            downloadVideo(); 
        }

        async function downloadVideo() {
            const searchMessage = await EsTeams.sendMessage(chatId, "🔄 *Searching for your video. Please Wait...*", { parse_mode: "Markdown" });

            const data = await esApiGet("/api/v1/dev/mp4", { query }).catch(() => null);

            if (!data || !data.download_url) {
                return EsTeams.sendMessage(chatId, "🚫 *Error fetching video details from API.* Please try again later.", { parse_mode: "Markdown" });
            }

            const { title, thumbnail } = data;
            const download_url = data.download_url;

            // Make sure file system directory path exists cleanly
            if (!fs.existsSync("./ES_TEAMS-MEDIA/video")) {
                fs.mkdirSync("./ES_TEAMS-MEDIA/video", { recursive: true });
            }

            // Generate unique filename using execution timestamp to prevent clashing assets
            const uniqueId = `${chatId}-${Date.now()}`;
            const filePath = `./ES_TEAMS-MEDIA/video/${uniqueId}.mp4`;

            try {
                // Fetch download source directly into ArrayBuffer format
                const videoRes = await axios.get(download_url, {
                    responseType: 'arraybuffer',
                    timeout: 240000, // Boosted to 4 minutes to support bigger files safely
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                        "Accept": "*/*"
                    }
                });

                // Write video bytes down securely to storage
                fs.writeFileSync(filePath, Buffer.from(videoRes.data));

                const stats = fs.statSync(filePath);
                if (stats.size < 50000) { // If asset size is abnormally small, abort operation
                    throw new Error("File output size too small. File likely corrupted.");
                }

                // Update original placeholder context message layout safely
                await EsTeams.editMessageMedia({
                    type: "photo",
                    media: thumbnail,
                    caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\n🎬 *Title:* _${title}_\n💼 *Status:* _Premium_\n\n📥 *Uploading video to Telegram...*\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ*`,
                    parse_mode: "Markdown"
                }, {
                    chat_id: chatId,
                    message_id: searchMessage.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                        ]
                    }
                }).catch(() => null);

                // Send the completely verified video asset payload downstream
                await EsTeams.sendVideo(chatId, filePath, { caption: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ" });

            } catch (dlError) {
                const status = dlError.response ? dlError.response.status : null;
                console.error("Download Stream Error Details:", status, dlError.message);
                const reason = status === 403 ? "The download link expired. Try again."
                    : status === 429 ? "Too many downloads right now. Wait a moment and try again."
                    : status ? `The download server returned an error (status ${status}).`
                    : "The download server did not respond in time.";
                await EsTeams.sendMessage(chatId, `❌ *Failed to stream video.* ${reason}`, { parse_mode: "Markdown" });
            } finally {
                // Always scrub file assets out of local container directory when finished
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

    } catch (error) {
        console.error("General error handling in video layout execution block:", error.message);
        EsTeams.sendMessage(chatId, "⚠️ *An unexpected processing error occurred.* Please try again later.", { parse_mode: "Markdown" });
    }
});
// ======= TREND COMMAND ======= //
EsTeams.onText(/\/trend/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const botImageUrl = "./ES_TEAMS-MEDIA/theme/ES_TEAMS.jpg";

  async function sendTrendingCoins() {
    try {
      const trendingRes = await axios.get("https://api.coingecko.com/api/v3/search/trending", { timeout: 10000 });
      const trending = trendingRes.data?.coins || [];

      if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
          }
        });
      }

      if (!trending.length) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 - 𝗖𝗥𝗬𝗣𝗧𝗢 𝗧𝗥𝗘𝗡𝗗𝗦\n\n❌ No trending coins found right now.\n\nPlease try again later.`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔁 𝗥𝗘𝗧𝗥𝗬", callback_data: "trend_refresh", style: "success" }],
              [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
          }
        });
      }

      const items = trending.slice(0, 7).map(c => c.item);
      const ids = items.map(i => i.id).filter(Boolean).join(",");
      let priceMap = {};

      if (ids) {
        try {
          const priceRes = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd&include_24hr_change=true`,
            { timeout: 10000 }
          );
          priceMap = priceRes.data || {};
        } catch {}
      }

      let caption = `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 — 𝗖𝗥𝗬𝗣𝗧𝗢 𝗧𝗥𝗘𝗡𝗗𝗦*\n\nTop trending coins (24h):\n\n`;

      items.forEach((it, idx) => {
        const rank = idx + 1;
        const name = it.name || it.symbol || "Unknown";
        const symbol = (it.symbol || "").toUpperCase();
        const priceInfo = priceMap[it.id];
        const priceUsd = priceInfo?.usd ? `$${Number(priceInfo.usd).toLocaleString(undefined, { maximumFractionDigits: 8 })}` : "N/A";
        const change24 = priceInfo?.usd_24h_change ? `${Number(priceInfo.usd_24h_change).toFixed(2)}%` : "N/A";
        const marketRank = it.market_cap_rank ? `#${it.market_cap_rank}` : "—";

        caption += `*${rank}. ${name} (${symbol})*\n💰 *Price:* ${priceUsd}\n📊 *24h:* ${change24}\n🏅 *Rank:* ${marketRank}\n\n`;
      });

      caption += `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`;

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔁 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "trend_refresh", style: "success" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    } catch (err) {
      console.error("Trend command error:", err.message);
      EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `⚠️ Failed to fetch trending coins.\nPlease try again later.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔁 𝗥𝗘𝗧𝗥𝗬", callback_data: "trend_refresh", style: "success" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }
  }

  await sendTrendingCoins();
});

EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "trend_refresh") {
    try {
      await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});

      await (async function sendTrendingCoins() {
        try {
          const botImageUrl = "./ES_TEAMS-MEDIA/theme/ES_TEAMS.jpg";
          const trendingRes = await axios.get("https://api.coingecko.com/api/v3/search/trending", { timeout: 10000 });
          const trending = trendingRes.data?.coins || [];

          if (!trending.length) {
            return EsTeams.sendPhoto(chatId, botImageUrl, {
              caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 - 𝗖𝗥𝗬𝗣𝗧𝗢 𝗧𝗥𝗘𝗡𝗗𝗦\n\n❌ No trending coins found right now.\n\nPlease try again later.`,
              parse_mode: "Markdown",
              reply_markup: {
                inline_keyboard: [
                  [{ text: "🔁 𝗥𝗘𝗧𝗥𝗬", callback_data: "trend_refresh", style: "success" }],
                  [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
              }
            });
          }

          const items = trending.slice(0, 7).map(c => c.item);
          const ids = items.map(i => i.id).filter(Boolean).join(",");
          let priceMap = {};

          if (ids) {
            try {
              const priceRes = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd&include_24hr_change=true`,
                { timeout: 10000 }
              );
              priceMap = priceRes.data || {};
            } catch {}
          }

          let caption = `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 — 𝗖𝗥𝗬𝗣𝗧𝗢 𝗧𝗥𝗘𝗡𝗗𝗦*\n\nTop trending coins (24h):\n\n`;

          items.forEach((it, idx) => {
            const rank = idx + 1;
            const name = it.name || it.symbol || "Unknown";
            const symbol = (it.symbol || "").toUpperCase();
            const priceInfo = priceMap[it.id];
            const priceUsd = priceInfo?.usd ? `$${Number(priceInfo.usd).toLocaleString(undefined, { maximumFractionDigits: 8 })}` : "N/A";
            const change24 = priceInfo?.usd_24h_change ? `${Number(priceInfo.usd_24h_change).toFixed(2)}%` : "N/A";
            const marketRank = it.market_cap_rank ? `#${it.market_cap_rank}` : "—";

            caption += `*${rank}. ${name} (${symbol})*\n💰 *Price:* ${priceUsd}\n📊 *24h:* ${change24}\n🏅 *Rank:* ${marketRank}\n\n`;
          });

          caption += `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`;

          await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🔁 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "trend_refresh", style: "success" }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
              ]
            }
          });
        } catch (err) {
          console.error("Trend refresh error:", err.message);
        }
      })();
    } catch (err) {
      console.error("Trend refresh outer error:", err.message);
    }
  } else {
    await EsTeams.answerCallbackQuery(query.id, { text: "OK" }).catch(() => {});
  }
});

// --------- DECODER COMMAND ------------ //
EsTeams.onText(/\/decoder/, async (msg) => {
    const chatId = msg.chat.id;
    decoderState[chatId] = { step: "choose_platform" };

   if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

    await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `📺 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗦𝗘𝗥𝗜𝗘𝗦 𝗗𝗘𝗖𝗢𝗗𝗘𝗥\n\nChoose your platform:`,
        reply_markup: {
            inline_keyboard: [
                [{ text: "📺 𝗗𝗦𝗧𝗩", callback_data: "decoder_platform_dstv" }],
                [{ text: "📺 𝗚𝗢𝗧𝗩", callback_data: "decoder_platform_gotv" }]
            ]
        }
    });
});

EsTeams.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const data = query.data;

    if (!decoderState[chatId]) return;

    if (data === "decoder_cancel") {
        decoderState[chatId] = null;
        await EsTeams.deleteMessage(chatId, msgId).catch(() => {});
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `❌ 𝗖𝗔𝗡𝗖𝗘𝗟𝗟𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬`,
            reply_markup: { inline_keyboard: waButton }
        });
    }

    if (data === "decoder_back") {
        decoderState[chatId] = { step: "choose_platform" };
        await EsTeams.deleteMessage(chatId, msgId).catch(() => {});
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `📺 𝗕𝗔𝗖𝗞\n\nChoose your platform again:`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📺 𝗗𝗦𝗧𝗩", callback_data: "decoder_platform_dstv" }],
                    [{ text: "📺 𝗚𝗢𝗧𝗩", callback_data: "decoder_platform_gotv" }],
                    [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "decoder_cancel" }]
                ]
            }
        });
    }

    if (data.startsWith("decoder_platform_")) {
        const platform = data.split("_")[2];
        decoderState[chatId] = { step: "ask_channel", platform };

        await EsTeams.deleteMessage(chatId, msgId).catch(() => {});
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `📺 You chose *${platform.toUpperCase()}*.\n\nPlease type your channel name:`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "⬅️ 𝗕𝗔𝗖𝗞", callback_data: "decoder_back" }],
                    [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "decoder_cancel" }]
                ]
            }
        });
    }

    await EsTeams.answerCallbackQuery(query.id);
});

EsTeams.onText(/.+/, async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text?.trim();

    if (!decoderState[chatId]) return;

    const state = decoderState[chatId];

    if (state.step === "ask_channel") {
        const channelName = text;

        decoderState[chatId] = { ...state, step: "ask_series", channel: channelName };
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `📺 Channel *${channelName}* selected.\n\nPlease type your series name:`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "⬅️ 𝗕𝗔𝗖𝗞", callback_data: "decoder_back" }],
                    [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "decoder_cancel" }],
                    ...waButton
                ]
            }
        });
    }

    if (state.step === "ask_series") {
        const seriesName = text;
        decoderState[chatId] = { ...state, step: "fetching", series: seriesName };

        const waitMsg = await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `🔍 Searching for latest recap of *"${seriesName}"* on *${state.channel}*...`,
            parse_mode: "Markdown"
        });

        try {
            const res = await axios.get(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(seriesName)}&embed=episodes`);
            const show = res.data;
            const episodes = show._embedded?.episodes;

            if (!episodes || episodes.length === 0) {
                await EsTeams.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
                return EsTeams.sendPhoto(chatId, botImageUrl, {
                    caption: `⚠️ Could not find any episodes for *"${seriesName}"*`,
                    parse_mode: "Markdown",
                    reply_markup: { inline_keyboard: waButton }
                });
            }

            const latestEp = episodes.reduce((prev, curr) => {
                const prevDate = new Date(prev.airdate);
                const currDate = new Date(curr.airdate);
                return currDate > prevDate ? curr : prev;
            });

            const recapMsg = `
📺 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗩 𝗦𝗘𝗥𝗜𝗘𝗦

Series: *${show.name}*
🎬 Episode: S${latestEp.season}E${latestEp.number} - ${latestEp.name}
🗓 Airdate: ${latestEp.airdate}

📖 Recap:
${latestEp.summary ? latestEp.summary.replace(/<[^>]+>/g, "") : "No recap available."}
            `;

            await EsTeams.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
            await EsTeams.sendPhoto(chatId, show.image?.original || botImageUrl, {
                caption: recapMsg,
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: waButton }
            });

            decoderState[chatId] = null;
        } catch (err) {
            console.error(err.message);
            await EsTeams.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
            await EsTeams.sendPhoto(chatId, botImageUrl, {
                caption: `❌ Failed to fetch recap for *"${seriesName}"*`,
                parse_mode: "Markdown",
                reply_markup: { inline_keyboard: waButton }
            });
        }
    }
});

// --------- NODE COMMAND -------------- //
EsTeams.onText(/\/nodev/, async (msg) => {
    const chatId = msg.chat.id;

    if (msg.from.id !== adminId) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `❌ This command can only be used by the bot admin.`,
            reply_markup: {
                inline_keyboard: waButton
            }
        });
    }

    await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗢𝗧\n\n🟢 Node Version: ${process.version}`,
        reply_markup: {
            inline_keyboard: waButton
        }
    });
});

// ----------BY BIT COMMAND ----------------//
EsTeams.onText(/\/bybit/, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== adminId) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗘𝗥𝗥𝗢𝗥 : ❌\n\nYou are not authorized to use this command.`,
      reply_markup: { inline_keyboard: waButton },
    });
  }

  try {
    const apiInfo = await getApiKeyInfo();
    const wallet = await getWalletBalances();

    let username = apiInfo?.result?.apiKeyName ?? "𝗨𝗻𝗸𝗻𝗼𝘄𝗻";

    let totalBalance = 0;
    try {
      const lists = wallet?.result?.list ?? [];
      lists.forEach(w => {
        if (w.coin === "USDT") totalBalance += Number(w.availableBalance ?? w.walletBalance ?? 0);
      });
    } catch { totalBalance = 0; }

    let acctStatus = ["VIP","𝗩𝗜𝗣"].includes(apiInfo?.result?.userType) ? "𝗩𝗜𝗣" : "𝗥𝗲𝗴𝘂𝗹𝗮𝗿";

    const caption = 
`𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗘𝗫𝗖𝗛𝗔𝗡𝗚𝗘

𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 : ${username}
𝗕𝗮𝗹𝗮𝗻𝗰𝗲 : ${totalBalance.toLocaleString()} 𝗨𝗦𝗗𝗧
𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗦𝘁𝗮𝘁𝘂𝘀 : ${acctStatus}`;

    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝗔𝗖𝗧𝗜𝗩𝗘 𝗢𝗥𝗗𝗘𝗥", callback_data: "BYBIT_ACTIVE" }],
          ...waButton
        ]
      }
    });

  } catch (err) {
    console.error("Bybit command error:", err);
    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗘𝗥𝗥𝗢𝗥 : ❌\n\nUnable to fetch Bybit data.`,
      reply_markup: { inline_keyboard: waButton }
    });
  }
});

EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  if (query.from?.id !== adminId) {
    await EsTeams.answerCallbackQuery(query.id, { text: "Unauthorized" }).catch(()=>{});
    return;
  }

  if (data === "BYBIT_ACTIVE") {
    await EsTeams.deleteMessage(chatId, messageId).catch(()=>{});
    const ordersRes = await getActiveOrders("linear");
    const orders = ordersRes?.result?.list ?? [];
    if (!orders.length) return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "𝗡𝗢 𝗔𝗖𝗧𝗜𝗩𝗘 𝗢𝗥𝗗𝗘𝗥𝗦", reply_markup: { inline_keyboard: waButton }});

    global.__BYBIT_ORDERS = orders;
    const keyboard = orders.map((o, idx) => [{ text: `𝗖𝗼𝗶𝗻 𝗡𝗮𝗺𝗲 : ${o.symbol}`, callback_data: `ORDER_${idx}` }]);
    keyboard.push(...waButton);

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗔𝗖𝗧𝗜𝗩𝗘 𝗢𝗥𝗗𝗘𝗥𝗦 (${orders.length})`,
      reply_markup: { inline_keyboard: keyboard }
    });
  }

  if (data.startsWith("ORDER_")) {
    const idx = Number(data.split("_")[1]);
    await EsTeams.deleteMessage(chatId, messageId).catch(()=>{});
    let orders = global.__BYBIT_ORDERS;
    if (!orders) { const rr = await getActiveOrders("linear"); orders = rr?.result?.list ?? []; global.__BYBIT_ORDERS = orders; }
    const order = orders[idx];
    if (!order) return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "𝗘𝗥𝗥𝗢𝗥 : ❌\n\n𝗠𝗶𝘀𝘀𝗶𝗻𝗴 𝗢𝗿𝗱𝗲𝗿", reply_markup: { inline_keyboard: waButton } });

    const caption = 
`𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗘𝗫𝗖𝗛𝗔𝗡𝗚𝗘

𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 : ${process.env.BYBIT_ACCOUNT_NAME ?? "𝗬𝗢𝗨𝗥 𝗔𝗖𝗖𝗢𝗨𝗡𝗧"}
𝗕𝗮𝗹𝗮𝗻𝗰𝗲 : ${totalBalance.toLocaleString()} 𝗨𝗦𝗗𝗧
𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗦𝘁𝗮𝘁𝘂𝘀 : ${acctStatus}

𝗖𝗼𝗶𝗻 𝗡𝗮𝗺𝗲 : ${order.symbol}
𝗟𝗲𝘃𝗲𝗿𝗮𝗴𝗲 : ${order.leverage ?? order.leverageRate ?? 1}
𝗣𝗼𝘀𝗶𝘁𝗶𝗼𝗻 𝗦𝗶𝘇𝗲 : ${order.size ?? order.qty ?? order.positionAmt ?? 0}
𝗣𝗡𝗟 : ${order.unrealisedPnl ?? order.pnl ?? 0}`;

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: `REFRESH_${idx}` }],
          [{ text: "𝗕𝗔𝗖𝗞", callback_data: "BYBIT_ACTIVE" }],
          ...waButton
        ]
      }
    });
  }

  if (data.startsWith("REFRESH_")) {
    const idx = Number(data.split("_")[1]);
    await EsTeams.deleteMessage(chatId, messageId).catch(()=>{});
    const rr = await getActiveOrders("linear");
    const orders = rr?.result?.list ?? [];
    global.__BYBIT_ORDERS = orders;
    const order = orders[idx];
    if (!order) return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "𝗢𝗿𝗱𝗲𝗿 𝗻𝗼 𝗹𝗼𝗻𝗴𝗲𝗿 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲.", reply_markup: { inline_keyboard: waButton }});

    const caption = 
`𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗘𝗫𝗖𝗛𝗔𝗡𝗚𝗘

𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 : ${process.env.BYBIT_ACCOUNT_NAME ?? "𝗬𝗢𝗨𝗥 𝗔𝗖𝗖𝗢𝗨𝗡𝗧"}
𝗕𝗮𝗹𝗮𝗻𝗰𝗲 : ${totalBalance.toLocaleString()} 𝗨𝗦𝗗𝗧
𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗦𝘁𝗮𝘁𝘂𝘀 : ${acctStatus}

𝗖𝗼𝗶𝗻 𝗡𝗮𝗺𝗲 : ${order.symbol}
𝗟𝗲𝘃𝗲𝗿𝗮𝗴𝗲 : ${order.leverage ?? order.leverageRate ?? 1}
𝗣𝗼𝘀𝗶𝘁𝗶𝗼𝗻 𝗦𝗶𝘇𝗲 : ${order.size ?? order.qty ?? order.positionAmt ?? 0}
𝗣𝗡𝗟 : ${order.unrealisedPnl ?? order.pnl ?? 0}`;

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption,
      reply_markup: {
        inline_keyboard: [
          [{ text: "𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: `REFRESH_${idx}` }],
          [{ text: "𝗕𝗔𝗖𝗞", callback_data: "BYBIT_ACTIVE" }],
          ...waButton
        ]
      }
    });
  }

  await EsTeams.answerCallbackQuery(query.id, { text: "𝗢𝗞" }).catch(()=>{});
});


// ---------- RECEIPT GEN ---------- //
EsTeams.onText(/^\/receipt$/, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== adminId) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `❌ You are not authorized to use this command.`,
      reply_markup: { inline_keyboard: waButton },
    });
  }

  // Initialize step
  receiptSteps[chatId] = { step: 1 };

  const caption = `
𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗥𝗘𝗖𝗘𝗜𝗣𝗧 𝗚𝗘𝗡

Please type the sender's account number and name in this format:

9018958092,EsTeams
`;

  const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "receipt_cancel" }],
        ...waButton
      ]
    }
  });

  receiptSteps[chatId].messageId = sent.message_id;
});

// ------ MESSAGE HANDLER FOR RECEIPT ----------
EsTeams.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (!receiptSteps[chatId]) return;

  const stepData = receiptSteps[chatId];

  try {
    // Step 1: Sender
    if (stepData.step === 1) {
      if (!msg.text.includes(",")) return;
      stepData.sender = msg.text.trim();
      await EsTeams.deleteMessage(chatId, stepData.messageId).catch(() => {});

      const caption = `
𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗥𝗘𝗖𝗘𝗜𝗣𝗧 𝗚𝗘𝗡

Please type the beneficiary account number and name in this format:

1234567890,John Doe
`;

      const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        reply_markup: {
          inline_keyboard: [
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "receipt_cancel" }],
            ...waButton
          ]
        }
      });

      stepData.messageId = sent.message_id;
      stepData.step = 2;
      return;
    }

    // Step 2: Beneficiary
    if (stepData.step === 2) {
      if (!msg.text.includes(",")) return;
      stepData.beneficiary = msg.text.trim();
      await EsTeams.deleteMessage(chatId, stepData.messageId).catch(() => {});

      const caption = `
𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗥𝗘𝗖𝗘𝗜𝗣𝗧 𝗚𝗘𝗡

Please type the amount to be transferred:
`;

      const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        reply_markup: {
          inline_keyboard: [
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "receipt_cancel" }],
            ...waButton
          ]
        }
      });

      stepData.messageId = sent.message_id;
      stepData.step = 3;
      return;
    }

    // Step 3: Amount
    if (stepData.step === 3) {
      const amount = parseFloat(msg.text.trim());
      if (isNaN(amount)) return;
      stepData.amount = amount;
      await EsTeams.deleteMessage(chatId, stepData.messageId).catch(() => {});

      try {
        // Hardcoded bank list
        const banks = [
          "Zenith Bank",
          "Access Bank",
          "Kuda Bank",
          "Opay Bank",
          "Palmpay Bank",
          "United Bank of Africa"
        ];

        stepData.banks = banks;

        // Map banks to buttons with bold font
        const keyboard = banks.map(b => [{ text: `𝗕𝗔𝗡𝗞: ${b}`, callback_data: `receipt_bank_${b}` }]);

        const caption = `
𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗥𝗘𝗖𝗘𝗜𝗣𝗧 𝗚𝗘𝗡

Select the Bank:
`;

        const sent = await EsTeams.sendPhoto(chatId, botImageUrl, {
          caption,
          reply_markup: { 
            inline_keyboard: [
              [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "receipt_cancel" }],
              ...keyboard,
              ...waButton
            ] 
          }
        });

        stepData.messageId = sent.message_id;
        stepData.step = 4;

      } catch (err) {
        console.log("Bank setup error:", err);
        await EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: `❌ Failed to setup bank list.`,
          reply_markup: { inline_keyboard: waButton }
        });
      }
    }

  } catch (err) {
    console.log("Receipt step error:", err);
  }
});

// ---------- CALLBACK QUERY HANDLER ----------
EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Cancel button
  if (data === "receipt_cancel") {
    await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
    delete receiptSteps[chatId];
    return;
  }

  // Bank selection
  if (data.startsWith("receipt_bank_")) {
    let bank = data.replace("receipt_bank_", "");
    const stepData = receiptSteps[chatId];
    if (!stepData) return;

    await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});

    bank = `𝗕𝗔𝗡𝗞: ${bank}`;

    const payload = {
      sender: stepData.sender,
      beneficiary: stepData.beneficiary,
      amount: stepData.amount,
      bank: bank
    };

    const caption = `
𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗡𝗚 𝗕𝗔𝗡𝗞 𝗥𝗘𝗖𝗘𝗜𝗣𝗧...
`;

    const sent = await EsTeams.sendPhoto(chatId, botImageUrl, { caption });

    try {
      const formData = new URLSearchParams(payload);
      const res = await fetch("https://paste-aza.vercel.app/form/generate", {
        method: "POST",
        body: formData
      });

      const blob = await res.arrayBuffer();
      const filePath = `./ES_TEAMS-MEDIA/receipt_${chatId}.png`;
      await fs.promises.writeFile(filePath, Buffer.from(blob));

      await EsTeams.deleteMessage(chatId, sent.message_id).catch(() => {});

      await EsTeams.sendPhoto(chatId, filePath, {
        caption: "𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1",
        reply_markup: { inline_keyboard: waButton }
      });

      delete receiptSteps[chatId];

    } catch (err) {
      console.log("Receipt generation error:", err);
      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `❌ Failed to generate receipt.`,
        reply_markup: { inline_keyboard: waButton }
      });
    }
  }

  await EsTeams.answerCallbackQuery(query.id, { text: "OK" }).catch(() => {});
});

// --------- OS COMMAND -------------- //
EsTeams.onText(/\/sysinfo/, async (msg) => {
  const chatId = msg.chat.id;

  if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

  // ---------- CAPTCHA ----------
  const correctFruit = fruits[Math.floor(Math.random() * fruits.length)];
  sysinfoCaptcha.set(chatId, correctFruit);

  const shuffled = [...fruits].sort(() => 0.5 - Math.random()).slice(0, 9);

  const keyboard = [
    shuffled.slice(0, 3).map(f => ({ text: f, callback_data: `syscap_${f}` })),
    shuffled.slice(3, 6).map(f => ({ text: f, callback_data: `syscap_${f}` })),
    shuffled.slice(6, 9).map(f => ({ text: f, callback_data: `syscap_${f}` })),
  ];

  await EsTeams.sendMessage(
    chatId,
    `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗖𝗔𝗣𝗧𝗖𝗛𝗔*\n\nTap the correct fruit:\n\n➡️ ${correctFruit}`,
    {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard }
    }
  );
});


// --------- CALLBACK HANDLER -------------- //
EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const userId = query.from.id.toString();
  const isPremium = premiumUsers.includes(userId);

  // ---------- CAPTCHA LOGIC ----------
  if (data.startsWith("syscap_")) {
    const chosen = data.replace("syscap_", "");
    const correct = sysinfoCaptcha.get(chatId);

    await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});

    if (!correct || chosen !== correct) {
      sysinfoCaptcha.delete(chatId);
      return EsTeams.sendMessage(chatId, "❌ Captcha Failed. Please use /sysinfo to try again.");
    }

    sysinfoCaptcha.delete(chatId);

    // ---------- PREMIUM CHECK ----------
    if (!isPremium) {
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `💎 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗥𝗘𝗠𝗜𝗨𝗠*\n\nThis command is only available for premium users.\n\n💰 Price: ₦5000`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝗝𝗢𝗜𝗡 𝗣𝗥𝗘𝗠𝗜𝗨𝗠", callback_data: "pay_5000" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]
          ]
        }
      });
    }

    // ---------- SYSINFO ----------
    try {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memPercent = Math.round((usedMem / totalMem) * 100);

      const cpuLoad = os.loadavg()[0];
      const cpuPercent = Math.min(Math.round((cpuLoad / os.cpus().length) * 100), 100);

      const bar = (p, len = 12) => {
        const filled = Math.round((p / 100) * len);
        return "█".repeat(filled) + "░".repeat(len - filled);
      };

      const caption = `
𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢

💾 RAM: ${bar(memPercent)} ${memPercent}%

⚡ CPU: ${bar(cpuPercent)} ${cpuPercent}%

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ
`;

      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔁 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "sysinfo_refresh", style: "success" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });

    } catch (err) {
      console.error("Sysinfo error:", err.message);
    }
  }

  // ---------- REFRESH ----------
  if (data === "sysinfo_refresh") {
    try {
      await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});

      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memPercent = Math.round((usedMem / totalMem) * 100);

      const cpuLoad = os.loadavg()[0];
      const cpuPercent = Math.min(Math.round((cpuLoad / os.cpus().length) * 100), 100);

      const bar = (p, len = 12) => {
        const filled = Math.round((p / 100) * len);
        return "█".repeat(filled) + "░".repeat(len - filled);
      };

      const caption = `
𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢

💾 RAM: ${bar(memPercent)} ${memPercent}%

⚡ CPU: ${bar(cpuPercent)} ${cpuPercent}%

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ
`;

      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔁 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "sysinfo_refresh", style: "success" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });

    } catch (err) {
      console.error("Sysinfo refresh error:", err.message);
    }
  }

  // fallback
  else {
    await EsTeams.answerCallbackQuery(query.id).catch(() => {});
  }
});

EsTeams.onText(/\/moviedebug(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const movieQuery = match[1]?.trim();

  if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

  if (!movieQuery)
    return EsTeams.sendMessage(chatId, "⚠️ Please use `/moviedebug <movie name>`");

  try {
    const res = await axios.get(`https://movieapi.giftedtech.co.ke/api/search/${encodeURIComponent(movieQuery)}`);
    console.log("Raw data from API:", res.data); 

    return EsTeams.sendMessage(chatId, `✅ Response logged to console.\n\nType: ${typeof res.data}`);
  } catch (err) {
    console.error("Debug Error:", err);
    return EsTeams.sendMessage(chatId, "⚠️ Error occurred, check logs.");
  }
});

// --------- LIVESCORE COMMAND -------------- //
EsTeams.onText(/\/livescore/, async (msg) => {
  const chatId = msg.chat.id;

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
  
  const waitingMsg = await EsTeams.sendMessage(chatId, "⚽ Fetching live scores. Please hold on...", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }],
      ],
    },
  });

  try {
    const res = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY,
      },
    });
    const data = await res.json();

    if (!data.response || data.response.length === 0) {
      return EsTeams.editMessageText("⚠️ No live matches at the moment.", {
        chat_id: chatId,
        message_id: waitingMsg.message_id,
      });
    }

    const liveMatches = data.response
      .slice(0, 5)
      .map((m) => {
        const home = m.teams.home.name;
        const away = m.teams.away.name;
        const score = `${m.goals.home} - ${m.goals.away}`;
        const league = m.league.name;
        const minute = m.fixture.status.elapsed || "–";
        return `🏆 *${league}*\n${home} ${score} ${away}  (${minute}')`;
      })
      .join("\n\n");

    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `🏟️ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗟𝗜𝗩𝗘𝗦𝗖𝗢𝗥𝗘*\n\n${liveMatches}\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }],
        ],
      },
    });

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id).catch(() => {});
  } catch (err) {
    console.error("LiveScore error:", err);
    EsTeams.editMessageText("⚠️ Failed to fetch live scores. Try again later.", {
      chat_id: chatId,
      message_id: waitingMsg.message_id,
    });
  }
});

// ============ YTDL COMMAND ============ //
EsTeams.onText(/\/ytdl(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const link = match[1]?.trim();

if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }
    
    if (!link) {
        return EsTeams.sendMessage(chatId, "🎥 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗬𝗧 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\n📥 _Use:_ `/ytdl <LINK>`", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    try {
        const searchMessage = await EsTeams.sendMessage(chatId, "🔄 *Fetching your video info...*", { parse_mode: "Markdown" });

        const data = await esApiGet("/api/v1/dev/mp4", { query: link });

        if (!data || typeof data.download_url !== "string") {
            return EsTeams.sendMessage(chatId, "🚫 *Error fetching video.* Please try again later.", { parse_mode: "Markdown" });
        }

        const { download_url, title, thumbnail } = data;
        const quality = "audio+video";
        const filePath = `./ES_TEAMS-MEDIA/video/${chatId}.mp4`;

        const videoStream = await fetch(download_url);
        if (!videoStream.ok) {
            throw new Error(`Video download failed with status ${videoStream.status}`);
        }
        const fileStream = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
            videoStream.body.pipe(fileStream);
            fileStream.on("finish", resolve);
            fileStream.on("error", reject);
        });

        await EsTeams.editMessageMedia({
            type: "photo",
            media: thumbnail,
            caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗬𝗧 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\n🎬 *Title:* _${title}_\n🎞 *Quality:* _${quality}_\n\n📥 *Downloading your video...*\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ*`,
            parse_mode: "Markdown"
        }, {
            chat_id: chatId,
            message_id: searchMessage.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

        await EsTeams.sendVideo(chatId, filePath);

        fs.unlinkSync(filePath);

    } catch (error) {
        console.error("Error in /ytdl command:", error.message);
        EsTeams.sendMessage(chatId, "⚠️ *An error occurred.* Please try again later.", { parse_mode: "Markdown" });
    }
});

    //Addowner Command
    EsTeams.onText(/\/addowner(?:\s+(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    
    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    if (!CONFIG.OWNER_IDS.includes(senderId)) {
        return EsTeams.sendMessage(chatId, "❌ *You are not authorized to use this command.*", { parse_mode: "Markdown",
        reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    if (!match[1]) {
        return EsTeams.sendMessage(chatId, "⚠️ *Incorrect format!*\n\nUsage: `/addowner ID`", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    const newadminId = parseInt(match[1]); 

    if (CONFIG.OWNER_IDS.includes(newadminId)) {
        return EsTeams.sendMessage(chatId, `⚠️ *User ${newadminId} is already an owner.*`, { parse_mode: "Markdown" });
    }

    CONFIG.OWNER_IDS.push(newadminId);

    EsTeams.sendMessage(chatId, `✅ *User ${newadminId} has been added as an owner.*`, { parse_mode: "Markdown" });
});

// Delowner Command
EsTeams.onText(/\/delowner(?:\s+(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    if (!CONFIG.OWNER_IDS.includes(senderId)) {
        return EsTeams.sendMessage(chatId, "❌ *You are not authorized to use this command.*", { 
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    if (!match[1]) {
        return EsTeams.sendMessage(chatId, "⚠️ *Incorrect format!*\n\nUsage: `/delowner ID`", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    const removeadminId = parseInt(match[1]);

    if (!CONFIG.OWNER_IDS.includes(removeadminId)) {
        return EsTeams.sendMessage(chatId, `⚠️ *User ${removeadminId} is not an owner.*`, { parse_mode: "Markdown" });
    }

    if (CONFIG.OWNER_IDS.length === 1) {
        return EsTeams.sendMessage(chatId, "⚠️ *You cannot remove the last owner!*", { parse_mode: "Markdown" });
    }

    CONFIG.OWNER_IDS = CONFIG.OWNER_IDS.filter(id => id !== removeadminId);

    EsTeams.sendMessage(chatId, `✅ *User ${removeadminId} has been removed as an owner.*`, { parse_mode: "Markdown" });
});
    
EsTeams.onText(/\/lockbot/, (msg) => {
    if (!CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(msg.chat.id, "❌ You cannot use this command!", { parse_mode: "Markdown" });
    }

    if (LOCK_BOT) {
        return EsTeams.sendMessage(msg.chat.id, "⚠️ *ES TEAMS V1 is already LOCKED!*", { parse_mode: "Markdown" });
    }

    LOCK_BOT = true;
    EsTeams.sendMessage(msg.chat.id, "✅ ES TEAMS V1 is now 🔒 *LOCKED*", { parse_mode: "Markdown" });
});

// List Owners Command
EsTeams.onText(/\/listowner/, async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    if (!CONFIG.OWNER_IDS.includes(senderId)) {
        return EsTeams.sendMessage(chatId, "❌ *You are not authorized to use this command.*", { 
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    if (CONFIG.OWNER_IDS.length === 0) {
        return EsTeams.sendMessage(chatId, "⚠️ *There are no owners set in the bot.*", { parse_mode: "Markdown" });
    }
    
    let ownerList = [];
    for (const adminId of CONFIG.OWNER_IDS) {
        try {
            const userInfo = await EsTeams.getChat(adminId);
            const username = userInfo.username ? `@${userInfo.username}` : `\`${adminId}\``;
            ownerList.push(`- ${username}`);
        } catch (error) {
            ownerList.push(`- \`${adminId}\``); 
        }
    }

    const messageText = `👑 *List of Owners:*\n\n${ownerList.join("\n")}`;

    EsTeams.sendMessage(chatId, messageText, { parse_mode: "Markdown" });
});

//Unlock Command
EsTeams.onText(/\/unlockbot/, (msg) => {
    if (!CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(msg.chat.id, "❌ You cannot use this command!", { parse_mode: "Markdown" });
    }

    if (!LOCK_BOT) {
        return EsTeams.sendMessage(msg.chat.id, "⚠️ *ES TEAMS V1 is already UNLOCKED!*", { parse_mode: "Markdown" });
    }

    LOCK_BOT = false; 
    EsTeams.sendMessage(msg.chat.id, "✅ ES TEAMS V1 is now 🔓 *UNLOCKED*", { parse_mode: "Markdown" });
});
    
    //Speed Command
    EsTeams.onText(/\/ping/, async (msg) => {
    const chatId = msg.chat.id;
    const start = Date.now(); 

    const sentMessage = await EsTeams.sendMessage(chatId, '🏓 Checking bot speed...');
    const end = Date.now(); 

    const ping = end - start; 
    
    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(msg.chat.id, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
    });
}

    EsTeams.editMessageText(`*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗦𝗣𝗘𝗘𝗗 :*  \`${ping}ms\` ⚡`, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: 'Markdown',
        reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
    });
});

// ============== XO COMMAND =================
EsTeams.onText(/\/tictac/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const isGroup = msg.chat.type !== "private";

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(senderId)) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly check back later …",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption:
`𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗜𝗖 𝗧𝗔𝗖 𝗧𝗢𝗘

Please select a mode :`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎯 𝗦𝗜𝗡𝗚𝗟𝗘 𝗣𝗟𝗔𝗬𝗘𝗥 𝗠𝗢𝗗𝗘", callback_data: "ttt_single" }],
        [{ text: "👥 𝗠𝗨𝗟𝗧𝗜 𝗣𝗟𝗔𝗬𝗘𝗥 𝗠𝗢𝗗𝗘", callback_data: "ttt_multi" }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });
});

// ================= CALLBACK HANDLER =================
EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const user = query.from;
  const data = query.data;
  const isGroup = query.message.chat.type !== "private";

  // ---------- SINGLE PLAYER ----------
  if (data === "ttt_single") {
    if (isGroup) {
      return EsTeams.answerCallbackQuery(query.id, {
        text: "❌ Single Player works only in DM",
        show_alert: true
      });
    }

    await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
    return startSinglePlayer(chatId);
  }

  // ---------- MULTI PLAYER ----------
  if (data === "ttt_multi") {
    if (!isGroup) {
      return EsTeams.editMessageCaption(
        `𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗜𝗖 𝗧𝗔𝗖 𝗧𝗢𝗘

❌ Error : Bot must be in a group`,
        {
          chat_id: chatId,
          message_id: query.message.message_id,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "➕ 𝗔𝗗𝗗 𝗕𝗢𝗧 𝗧𝗢 𝗚𝗥𝗢𝗨𝗣", url: `https://t.me/${BOT_USERNAME}?startgroup=true` }],
              [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
          }
        }
      );
    }

    await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
    tttLobbies[chatId] = { players: [user], board: Array(9).fill(""), turn: 0 };

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption:
`𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗜𝗖 𝗧𝗔𝗖 𝗧𝗢𝗘

Waiting for second player…`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ 𝗝𝗢𝗜𝗡 𝗚𝗔𝗠𝗘", callback_data: "ttt_join" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  // ---------- JOIN GAME ----------
  if (data === "ttt_join") {
    const lobby = tttLobbies[chatId];
    if (!lobby) return;

    if (lobby.players.length >= 2) {
      return EsTeams.answerCallbackQuery(query.id, {
        text: "⛔ Game already in progress",
        show_alert: true
      });
    }

    if (lobby.players.find(p => p.id === user.id)) {
      return EsTeams.answerCallbackQuery(query.id, { text: "You already joined" });
    }

    lobby.players.push(user);
    await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
    return startMultiplayer(chatId);
  }

  if (data.startsWith("ttt_")) return handleTicTacMove(query);
});

// ================= SINGLE PLAYER =================
function startSinglePlayer(chatId) {
  const playerStarts = Math.random() < 0.5;

  tttGames[chatId] = {
    board: Array(9).fill(""),
    gameOver: false,
    movesCount: 0
  };

  let text = `🎮 𝗧𝗜𝗖-𝗧𝗔𝗖-𝗧𝗢𝗘\n`;

  if (playerStarts) {
    text += "You are X, bot is O.\nYour turn!";
  } else {
    const botIdx = botMove(tttGames[chatId].board, 0, false);
    tttGames[chatId].board[botIdx] = "O";
    tttGames[chatId].movesCount++;
    text += "Bot goes first!";
  }

  return EsTeams.sendMessage(chatId, text, {
    reply_markup: tttKeyboard(tttGames[chatId].board)
  });
}

// ============ MULTI PLAYER START =================
function startMultiplayer(chatId) {
  const lobby = tttLobbies[chatId];
  const shuffled = lobby.players.sort(() => 0.5 - Math.random());

  lobby.symbols = {
    [shuffled[0].id]: "X",
    [shuffled[1].id]: "O"
  };

  return EsTeams.sendMessage(
    chatId,
`𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗜𝗖 𝗧𝗔𝗖 𝗧𝗢𝗘

STATUS : Connected

${shuffled[0].first_name} : X
${shuffled[1].first_name} : O`,
    { reply_markup: tttKeyboard(lobby.board) }
  );
}

// ================= MOVE HANDLER =================
function handleTicTacMove(query) {
  const chatId = query.message.chat.id;
  const idx = parseInt(query.data.split("_")[1]);

  if (tttGames[chatId]) return singlePlayerMove(query);

  const lobby = tttLobbies[chatId];
  if (!lobby) return;

  const current = lobby.players[lobby.turn % 2];
  if (query.from.id !== current.id) {
    return EsTeams.answerCallbackQuery(query.id, {
      text: "⏳ Not your turn",
      show_alert: true
    });
  }

  if (lobby.board[idx]) return;

  lobby.board[idx] = lobby.symbols[current.id];
  lobby.turn++;

  const winner = checkWinner(lobby.board);
  if (winner) {
    delete tttLobbies[chatId];
    return EsTeams.editMessageText(
      `🎮 𝗧𝗜𝗖-𝗧𝗔𝗖-𝗧𝗢𝗘\n🏆 ${winner === "draw" ? "Draw" : winner + " wins!"}`,
      { chat_id: chatId, message_id: query.message.message_id }
    );
  }

  return EsTeams.editMessageReplyMarkup(
    tttKeyboard(lobby.board),
    { chat_id: chatId, message_id: query.message.message_id }
  );
}

// ================= SINGLE PLAYER MOVE =================
function singlePlayerMove(query) {
  const chatId = query.message.chat.id;
  const idx = parseInt(query.data.split("_")[1]);
  const game = tttGames[chatId];
  if (!game || game.gameOver) return;

  if (game.board[idx]) {
    return EsTeams.answerCallbackQuery(query.id, { text: "❌ Taken" });
  }

  game.board[idx] = "X";
  game.movesCount++;

  let winner = checkWinner(game.board);
  if (winner) return endSinglePlayer(query, winner);

  const botIdx = botMove(game.board, game.movesCount, true);
  game.board[botIdx] = "O";
  game.movesCount++;

  winner = checkWinner(game.board);
  if (winner) return endSinglePlayer(query, winner);

  return EsTeams.editMessageReplyMarkup(
    tttKeyboard(game.board),
    { chat_id: chatId, message_id: query.message.message_id }
  );
}

// ================= END SINGLE PLAYER =================
function endSinglePlayer(query, winner) {
  const chatId = query.message.chat.id;

  const text =
    winner === "draw" ? "🤝 DRAW!" :
    winner === "X" ? "🏆 YOU WIN!" :
    "🤖 BOT WINS!";

  EsTeams.editMessageText(
    `🎮 𝗧𝗜𝗖-𝗧𝗔𝗖-𝗧𝗢𝗘\n\n${text}`,
    {
      chat_id: chatId,
      message_id: query.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 𝗣𝗟𝗔𝗬 𝗔𝗚𝗔𝗜𝗡", callback_data: "ttt_single" }]
        ]
      }
    }
  );

  delete tttGames[chatId];
}

// ================= BOT AI =================
function botMove(board, movesCount, playerStarted) {
  const hash = boardHash(board);
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);

  if (playerStarted && movesCount === 1) {
    const xIdx = board.findIndex(v => v === "X");
    if ([0,2,6,8].includes(xIdx) && board[4] === "") return 4;
  }

  if (xoMemory[hash]?.bestMove !== undefined) {
    return xoMemory[hash].bestMove;
  }

  function minimax(b, depth, isMax) {
    const res = checkWinner(b);
    if (res === "O") return 1000;
    if (res === "X") return -1000;
    if (res === "draw" || depth === 0) return 0;

    const free = b.map((v,i)=>v===""?i:null).filter(v=>v!==null);

    if (isMax) {
      let best = -Infinity;
      for (const i of free) {
        b[i] = "O";
        best = Math.max(best, minimax(b, depth-1, false));
        b[i] = "";
      }
      return best;
    } else {
      let best = Infinity;
      for (const i of free) {
        b[i] = "X";
        best = Math.min(best, minimax(b, depth-1, true));
        b[i] = "";
      }
      return best;
    }
  }

  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (const i of empty) {
    board[i] = "O";
    const score = minimax(board, 7, false);
    board[i] = "";
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  xoMemory[hash] = { bestMove };
  return bestMove;
}

// ================= HELPERS =================
function tttKeyboard(board) {
  const rows = [];
  for (let i = 0; i < 9; i += 3) {
    rows.push([
      { text: board[i] || " ", callback_data: `ttt_${i}` },
      { text: board[i+1] || " ", callback_data: `ttt_${i+1}` },
      { text: board[i+2] || " ", callback_data: `ttt_${i+2}` }
    ]);
  }
  return { inline_keyboard: rows };
}

function checkWinner(board) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (const [a,b,c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes("") ? null : "draw";
}

function boardHash(board) {
  return board.map(v => v || "_").join("");
}

// ========== START PIN LOCK =================
EsTeams.onText(/\/pinlock/, async (msg) => {
  const chatId = msg.chat.id;

  if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

  pinLocks[chatId] = {
    entered: "",
    expected: "2006"
  };

  await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: `
🔐 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗜𝗡 𝗟𝗢𝗖𝗞

Please enter your 4-digit PIN:
● ● ● ●
`,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "1️⃣", callback_data: "pin_1" },
          { text: "2️⃣", callback_data: "pin_2" },
          { text: "3️⃣", callback_data: "pin_3" }
        ],
        [
          { text: "4️⃣", callback_data: "pin_4" },
          { text: "5️⃣", callback_data: "pin_5" },
          { text: "6️⃣", callback_data: "pin_6" }
        ],
        [
          { text: "7️⃣", callback_data: "pin_7" },
          { text: "8️⃣", callback_data: "pin_8" },
          { text: "9️⃣", callback_data: "pin_9" }
        ],
        [
          { text: "0️⃣", callback_data: "pin_0" }
        ],
        [
          { text: "⤺ 𝗕𝗔𝗖𝗞", callback_data: "pin_back" },
          { text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "pin_cancel" }
        ],
        ...waButton
      ]
    }
  });
});

EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (!pinLocks[chatId]) return;

  if (data === "pin_cancel") {
    delete pinLocks[chatId];
    await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});
    return;
  }

  if (data === "pin_back") {
    const pinData = pinLocks[chatId];
    if (!pinData || pinData.entered.length === 0) return;
    pinData.entered = pinData.entered.slice(0, -1);

    const masked = "● ".repeat(pinData.entered.length).trim();
    await EsTeams.editMessageCaption(
      `
🔐 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗜𝗡 𝗟𝗢𝗖𝗞

Please enter your 4-digit PIN:
${masked}
`,
      {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: query.message.reply_markup
      }
    );
    return;
  }

  if (data.startsWith("pin_")) {
    const digit = data.split("_")[1];
    const pinData = pinLocks[chatId];
    if (!pinData || pinData.entered.length >= 4) return;

    pinData.entered += digit;
    const masked = "● ".repeat(pinData.entered.length).trim();

    if (pinData.entered.length === 4) {
      await EsTeams.deleteMessage(chatId, query.message.message_id).catch(() => {});

      if (pinData.entered === pinData.expected) {
        await EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: `
✅ 𝗔𝗖𝗖𝗘𝗦𝗦 𝗚𝗥𝗔𝗡𝗧𝗘𝗗

𝗣𝗜𝗡 𝗩𝗘𝗥𝗜𝗙𝗜𝗘𝗗 ✔
`,
          reply_markup: { inline_keyboard: waButton }
        });
      } else {
        await EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: `
❌ 𝗪𝗥𝗢𝗡𝗚 𝗣𝗜𝗡

Access denied.
`,
          reply_markup: { inline_keyboard: waButton }
        });
      }

      delete pinLocks[chatId];
      return;
    }

    await EsTeams.editMessageCaption(
      `
🔐 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗜𝗡 𝗟𝗢𝗖𝗞

Please enter your 4-digit PIN:
${masked}
`,
      {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: query.message.reply_markup
      }
    );
  }

  await EsTeams.answerCallbackQuery(query.id).catch(() => {});
});

// ---------- CHANNEL ID COMMAND ------- ///
EsTeams.on("channel_post", async (msg) => {
  const chatId = msg.chat.id; 
  const text = msg.text || "";

  if (text.startsWith("/getid")) {
    await EsTeams.sendMessage(chatId, `𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗜𝗗:\n${chatId}`, {
      reply_markup: { inline_keyboard: waButton }
    });

    console.log(`[CHANNEL GET ID] Channel username: ${msg.chat.username || "No username"}, ID: ${chatId}`);
  }
});

// Crypto Index
EsTeams.onText(/\/index/, async (msg) => {
    const chatId = msg.chat.id;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(
            chatId,
            "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...",
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
                            }
                        ]
                    ]
                }
            }
        );
    }

    try {
        // Fetch Fear & Greed Index
        const fngRes = await fetch("https://api.alternative.me/fng/?limit=1", {
            headers: { "Cache-Control": "no-cache" }
        });
        const fngJson = await fngRes.json();

        if (!fngJson?.data?.[0]) throw new Error("Invalid Index Data");

        const indexValue = fngJson.data[0].value;
        const sentiment = fngJson.data[0].value_classification;

        // Fetch Bitcoin price & 24h change
        const btcRes = await fetch("https://api.alternative.me/v2/ticker/1/", {
            headers: { "Cache-Control": "no-cache" }
        });
        const btcJson = await btcRes.json();
        if (!btcJson?.data?.["1"]) throw new Error("Invalid BTC Data");

        const btcPrice = parseFloat(btcJson.data["1"].quotes.USD.price).toLocaleString();
        const btcChange = parseFloat(btcJson.data["1"].quotes.USD.percent_change_24h);

        // Determine emoji for 24h change
        let changeEmoji = "📊";
        let changeText = "+0%";

        if (btcChange > 0) {
            changeEmoji = "📈";
            changeText = `+${btcChange.toFixed(2)}%`;
        } else if (btcChange < 0) {
            changeEmoji = "📉";
            changeText = `${btcChange.toFixed(2)}%`;
        }

        EsTeams.sendPhoto(chatId, botImageUrl, {
            caption:
                `*📊𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗖𝗥𝗬𝗣𝗧𝗢 𝗙 & 𝗚 𝗜𝗡𝗗𝗘𝗫*\n\n` +
                `*🧭Index Value:* ${indexValue}\n` +
                `*😱Sentiment:* ${sentiment}\n` +
                `*💰BTC Price:* $${btcPrice}`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `${changeEmoji} ${changeText}`,
                            url: "https://t.me/esteams_btc"
                        }
                    ],
                    [
                        {
                            text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                            url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
                        }
                    ]
                ]
            }
        });
    } catch (err) {
        console.error("INDEX ERROR:", err.message);
        EsTeams.sendMessage(chatId, "⚠️ Failed to fetch crypto index or BTC price. Try again later.");
    }
});

//==== JOKE COMMAND ===========//
EsTeams.onText(/\/joke/, async (msg) => {
    const chatId = msg.chat.id;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(chatId,
            "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...",
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            }
        );
    }

    try {
        const res = await fetch("https://official-joke-api.appspot.com/jokes/random");
        const joke = await res.json();

        const caption =
            `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗨𝗡𝗖𝗛𝗟𝗜𝗡𝗘\n\n` +
            `😂 *${joke.setup}*\n\n` +
            `👉 _${joke.punchline}_`;

        await EsTeams.sendMessage(chatId, caption, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🔄 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "refresh_joke" }],
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });

    } catch (err) {
        console.error("JOKE ERROR:", err.message);
        EsTeams.sendMessage(chatId,
            "⚠️ *Unable to fetch joke right now. Try again later.*",
            { parse_mode: "Markdown" }
        );
    }
});


//======== REFRESH HANDLER =================//

EsTeams.on("callback_query", async (query) => {

    if (query.data === "refresh_joke") {

        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;

        try {
            await EsTeams.answerCallbackQuery(query.id);
            await EsTeams.deleteMessage(chatId, messageId);

            const res = await fetch("https://official-joke-api.appspot.com/jokes/random");
            const joke = await res.json();

            const caption =
                `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗨𝗡𝗖𝗛𝗟𝗜𝗡𝗘\n\n` +
                `😂 *${joke.setup}*\n\n` +
                `👉 _${joke.punchline}_`;

            await EsTeams.sendMessage(chatId, caption, {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🔄 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "refresh_joke" }],
                        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                    ]
                }
            });

        } catch (err) {
            console.error("REFRESH ERROR:", err.message);
        }
    }
});

// Runtime Command
EsTeams.onText(/\/runtime/, async (msg) => {
    const chatId = msg.chat.id;

    function loadStartTime() {
        try {
            if (fs.existsSync(START_TIME_FILE)) {
                const data = JSON.parse(fs.readFileSync(START_TIME_FILE, "utf8"));
                if (data.startTime) return data.startTime;
            }
        } catch (e) {
            console.error("Start time load error:", e);
        }

        const now = Date.now();
        fs.writeFileSync(START_TIME_FILE, JSON.stringify({ startTime: now }));
        return now;
    }

    const startTime = loadStartTime();
    const now = Date.now();

    const diffMs = now - startTime;

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const years = Math.floor(totalDays / 365);
    let remainingDays = totalDays % 365;

    const months = Math.floor(remainingDays / 30);
    remainingDays = remainingDays % 30;

    const weeks = Math.floor(remainingDays / 7);
    const days = remainingDays % 7;

    const uptimeText = `⏳ ${years}y ${months}m ${weeks}w ${days}d`;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return EsTeams.sendMessage(
            chatId,
            "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...",
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                                url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29"
                            }
                        ]
                    ]
                }
            }
        );
    }

    return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗛𝗔𝗦 𝗕𝗘𝗘𝗡 𝗥𝗨𝗡𝗡𝗜𝗡𝗚 𝗙𝗢𝗥...",
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: uptimeText, url: "https://t.me/examsolutionteam", style: "success"  }],
                [{ text: "🗑️ 𝗗𝗘𝗟𝗘𝗧𝗘", callback_data: `delete_runtime_${chatId}`, style: "danger" }],
                [
                    {
                        text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟",
                        url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" 
                    }
                ]
            ]
        }
    });
});

EsTeams.on("callback_query", async (query) => {
    const data = query.data;

    if (data.startsWith("delete_runtime_")) {
        try {
            await EsTeams.deleteMessage(
                query.message.chat.id,
                query.message.message_id
            );
        } catch (e) {
            console.error("Failed to delete message:", e);
        }
    }
});

// FetchId Command
EsTeams.onText(/\/fetchid(?:\s*@(\S+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    let isAllowed = false;

    if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(senderId)) {
        return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    if (msg.chat.type === "private") {
        isAllowed = true;
    } 
    else if (msg.chat.type.includes("group")) {
        try {
            const chatMember = await EsTeams.getChatMember(chatId, senderId);
            if (chatMember.status === "administrator" || chatMember.status === "creator" || CONFIG.OWNER_IDS.includes(senderId)) {
                isAllowed = true;
            }
        } catch (error) {
            return EsTeams.sendMessage(chatId, "❌ Error checking admin status!", { parse_mode: "Markdown" });
        }
    }

    if (!isAllowed) {
        return EsTeams.sendMessage(chatId, "❌ Cannot Run Command! You must be an *admin* or *ES TEAMS TECH*.", { parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
        });
    }

    let targetId;

    if (msg.reply_to_message) {
        targetId = msg.reply_to_message.from.id;
    } 
    else if (match[1]) {
        try {
            const userInfo = await EsTeams.getChat(match[1]);
            targetId = userInfo.id;
        } catch (error) {
            return EsTeams.sendMessage(chatId, "❌ Error: Unable to find user. Make sure the username is correct!", { parse_mode: "Markdown" });
        }
    } 
    else {
        targetId = senderId;
    }

    EsTeams.sendMessage(chatId, `✅ *User ID:* \`${targetId}\``, { parse_mode: "Markdown",
    reply_markup: {
                inline_keyboard: [
                    [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
                ]
            }
    });
});

    // Add premium command
    EsTeams.onText(/\/addprem (\d+),(\d+)([dmy])/, (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (!isOwner(userId) && !isDeveloper(userId)) {
            return EsTeams.sendMessage(chatId, '❌ Owner command only!', { parse_mode: 'Markdown' });
        }

        try {
            const [_, targetId, duration, unit] = match;
            PremiumManager.add(parseInt(targetId), duration, unit);
            
            EsTeams.sendMessage(chatId, `✅ Added ${targetId} as a premium user for ${duration} ${unit}`, { parse_mode: 'Markdown' });
        } catch (error) {
            EsTeams.sendMessage(chatId, `❌ Error: ${error.message}`, { parse_mode: 'Markdown' });
        }
    });

//======================================================================
//  NEW COMMANDS — GAMES, UTILITIES & INFO
//======================================================================

const waChannelBtn = {
    inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
    ]
};

function isLockedFor(userId) {
    return LOCK_BOT && !CONFIG.OWNER_IDS.includes(userId);
}

function newCmdLocked(chatId) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...",
        parse_mode: "Markdown",
        reply_markup: waChannelBtn
    }).catch(() => EsTeams.sendPhoto(chatId, botImageUrl, { caption: "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...",
        parse_mode: "Markdown",
        reply_markup: waChannelBtn
     }));
}

async function telegramRawApi(method, payload) {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return res.json();
}

//---------------- GAMES ----------------//

EsTeams.onText(/^\/8ball(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const question = match[1] ? match[1].trim() : null;
    if (!question) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/8ball <question>`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    const answers = [
        "It is certain.", "Without a doubt.", "Yes, definitely.", "You may rely on it.",
        "As I see it, yes.", "Most likely.", "Outlook good.", "Signs point to yes.",
        "Reply hazy, try again.", "Ask again later.", "Better not tell you now.",
        "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.",
        "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."
    ];
    const answer = answers[Math.floor(Math.random() * answers.length)];

    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🎱 *𝗠𝗔𝗚𝗜𝗖 𝟴 𝗕𝗔𝗟𝗟*\n\n❓ ${question}\n\n🔮 ${answer}`,
        parse_mode: "Markdown", reply_markup: waChannelBtn
     }).catch(err => console.error("8BALL ERROR:", err.message));
});

async function sendNativeDice(chatId, emoji, label) {
    try {
        await EsTeams.sendDice(chatId, { emoji });
    } catch (err) {
        console.error(`${label} ERROR:`, err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to roll right now. Try again later.*", parse_mode: "Markdown"  }).catch(() => {});
    }
}

EsTeams.onText(/^\/dice$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    await sendNativeDice(chatId, '🎲', 'DICE');
});

EsTeams.onText(/^\/slot$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    await sendNativeDice(chatId, '🎰', 'SLOT');
});

EsTeams.onText(/^\/basketball$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    await sendNativeDice(chatId, '🏀', 'BASKETBALL');
});

EsTeams.onText(/^\/football$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    await sendNativeDice(chatId, '⚽', 'FOOTBALL');
});

EsTeams.onText(/^\/darts$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    await sendNativeDice(chatId, '🎯', 'DARTS');
});

EsTeams.onText(/^\/bowling$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    await sendNativeDice(chatId, '🎳', 'BOWLING');
});

EsTeams.onText(/^\/coinflip$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const result = Math.random() < 0.5 ? "🟡 Heads" : "⚪ Tails";
    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🪙 *𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣*\n\nResult: *${result}*`,
        parse_mode: "Markdown", reply_markup: waChannelBtn
     }).catch(err => console.error("COINFLIP ERROR:", err.message));
});

EsTeams.onText(/^\/rps(?:\s+(\S+))?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const choices = ['rock', 'paper', 'scissors'];
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    const userChoice = match[1] ? match[1].toLowerCase() : null;

    if (!userChoice || !choices.includes(userChoice)) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/rps rock`, `/rps paper` or `/rps scissors`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    let result;
    if (botChoice === userChoice) {
        result = "🤝 It's a tie!";
    } else if (
        (userChoice === 'rock' && botChoice === 'scissors') ||
        (userChoice === 'paper' && botChoice === 'rock') ||
        (userChoice === 'scissors' && botChoice === 'paper')
    ) {
        result = "🎉 You win!";
    } else {
        result = "🤖 Bot wins!";
    }

    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `✊ *𝗥𝗢𝗖𝗞 𝗣𝗔𝗣𝗘𝗥 𝗦𝗖𝗜𝗦𝗦𝗢𝗥𝗦*\n\nYou: ${emojis[userChoice]} ${userChoice}\nBot: ${emojis[botChoice]} ${botChoice}\n\n${result}`, parse_mode: "Markdown", reply_markup: waChannelBtn  }).catch(err => console.error("RPS ERROR:", err.message));
});

const riddles = [
    { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An echo." },
    { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps." },
    { q: "What has keys but can't open locks?", a: "A piano." },
    { q: "What has a head, a tail, but no body?", a: "A coin." },
    { q: "What gets wetter the more it dries?", a: "A towel." },
    { q: "What has hands but can't clap?", a: "A clock." },
    { q: "What has to be broken before you can use it?", a: "An egg." },
    { q: "I'm tall when I'm young, and short when I'm old. What am I?", a: "A candle." },
    { q: "What can travel around the world while staying in a corner?", a: "A stamp." },
    { q: "What has one eye but cannot see?", a: "A needle." }
];

EsTeams.onText(/^\/riddle$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const index = Math.floor(Math.random() * riddles.length);
    const riddle = riddles[index];

    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🧩 *𝗥𝗜𝗗𝗗𝗟𝗘*\n\n${riddle.q}`,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🔍 𝗥𝗘𝗩𝗘𝗔𝗟 𝗔𝗡𝗦𝗪𝗘𝗥", callback_data: `reveal_riddle_${index}` }],
                [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
            ]
        }
     }).catch(err => console.error("RIDDLE ERROR:", err.message));
});

EsTeams.on('callback_query', async (query) => {
    if (!query.data || !query.data.startsWith('reveal_riddle_')) return;
    try {
        const index = parseInt(query.data.replace('reveal_riddle_', ''), 10);
        const riddle = riddles[index];
        if (!riddle) {
            return EsTeams.answerCallbackQuery(query.id, { text: "Riddle not found." });
        }
        await EsTeams.answerCallbackQuery(query.id, { text: `Answer: ${riddle.a}`, show_alert: true });
    } catch (err) {
        console.error("RIDDLE REVEAL ERROR:", err.message);
    }
});

const truths = [
    "What's a habit you're trying to break?",
    "What's the most embarrassing thing you've done this year?",
    "What's a goal you haven't told anyone about?",
    "What's your biggest fear?",
    "What's the last lie you told?",
    "What's a talent people don't know you have?",
    "What's the best advice you've ever received?",
    "What's something you regret not doing?",
    "Who do you admire most and why?",
    "What's a rule you secretly break?"
];

const dares = [
    "Send a voice note singing your favorite song.",
    "Text a friend a compliment right now.",
    "Do 10 push-ups before your next message.",
    "Speak in rhymes for your next 3 messages.",
    "Share the last photo in your gallery (safely!).",
    "Type your next message using only emojis.",
    "Give a random compliment to the last person you texted.",
    "Do your best impression of a robot for one message.",
    "Send a fun fact you just looked up.",
    "Describe your day using only three words."
];

const wyrs = [
    "Would you rather have the ability to fly or be invisible?",
    "Would you rather always be 10 minutes late or 20 minutes early?",
    "Would you rather lose your phone or your wallet?",
    "Would you rather live without music or without movies?",
    "Would you rather be able to talk to animals or speak every language?",
    "Would you rather have unlimited money or unlimited time?",
    "Would you rather never use social media again or never watch TV again?",
    "Would you rather explore space or the ocean?",
    "Would you rather be famous or be a close friend of someone famous?",
    "Would you rather always know when someone is lying or always get away with lying?"
];

EsTeams.onText(/^\/truth$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const truth = truths[Math.floor(Math.random() * truths.length)];
    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🤫 *𝗧𝗥𝗨𝗧𝗛*\n\n${truth}`,
        parse_mode: "Markdown", reply_markup: waChannelBtn
     }).catch(err => console.error("TRUTH ERROR:", err.message));
});

EsTeams.onText(/^\/dare$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const dare = dares[Math.floor(Math.random() * dares.length)];
    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🔥 *𝗗𝗔𝗥𝗘*\n\n${dare}`,
        parse_mode: "Markdown", reply_markup: waChannelBtn
     }).catch(err => console.error("DARE ERROR:", err.message));
});

EsTeams.onText(/^\/wyr$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const wyr = wyrs[Math.floor(Math.random() * wyrs.length)];
    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🤔 *𝗪𝗢𝗨𝗟𝗗 𝗬𝗢𝗨 𝗥𝗔𝗧𝗛𝗘𝗥*\n\n${wyr}`,
        parse_mode: "Markdown", reply_markup: waChannelBtn
     }).catch(err => console.error("WYR ERROR:", err.message));
});

const triviaSessions = new Map();

EsTeams.onText(/^\/trivia$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    try {
        const res = await fetch("https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986");
        const data = await res.json();
        const item = data?.results?.[0];
        if (!item) throw new Error("No trivia question returned");

        const question = decodeURIComponent(item.question);
        const correct = decodeURIComponent(item.correct_answer);
        const options = [...item.incorrect_answers.map(a => decodeURIComponent(a)), correct]
            .sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correct);

        const sessionId = crypto.randomBytes(4).toString('hex');
        triviaSessions.set(sessionId, correctIndex);
        setTimeout(() => triviaSessions.delete(sessionId), 5 * 60 * 1000);

        await EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🧠 *𝗧𝗥𝗜𝗩𝗜𝗔 𝗧𝗜𝗠𝗘*\n\n${question}`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: options.map((opt, i) => ([
                    { text: opt.length > 60 ? opt.slice(0, 57) + "..." : opt, callback_data: `trivia_${sessionId}_${i}` }
                ]))
            }
         });
    } catch (err) {
        console.error("TRIVIA ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to fetch a trivia question right now. Try again later.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.on('callback_query', async (query) => {
    if (!query.data || !query.data.startsWith('trivia_')) return;
    try {
        const parts = query.data.split('_');
        const chosenIndex = parseInt(parts.pop(), 10);
        const sessionId = parts.slice(1).join('_');
        const correctIndex = triviaSessions.get(sessionId);

        if (correctIndex === undefined) {
            return EsTeams.answerCallbackQuery(query.id, { text: "⏱ This trivia session expired.", show_alert: true });
        }

        triviaSessions.delete(sessionId);
        const isCorrect = chosenIndex === correctIndex;

        await EsTeams.answerCallbackQuery(query.id, { text: isCorrect ? "✅ Correct!" : "❌ Wrong answer!" });
        await EsTeams.editMessageCaption(
            `🧠 *𝗧𝗥𝗜𝗩𝗜𝗔 𝗥𝗘𝗦𝗨𝗟𝗧*\n\n${isCorrect ? "✅ Correct! Well played." : "❌ Not quite — better luck next time!"}`,
            { chat_id: query.message.chat.id, message_id: query.message.message_id, parse_mode: "Markdown" }
        );
    } catch (err) {
        console.error("TRIVIA CALLBACK ERROR:", err.message);
    }
});

//---------------- UTILITIES ----------------//

EsTeams.onText(/^\/base64(?:\s+(encode|decode)\s+([\s\S]+))?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const mode = match[1] ? match[1].toLowerCase() : null;
    const text = match[2] ? match[2].trim() : null;

    if (!mode || !text) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/base64 encode <text>` or `/base64 decode <text>`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    try {
        const result = mode === 'encode'
            ? Buffer.from(text, 'utf8').toString('base64')
            : Buffer.from(text, 'base64').toString('utf8');

        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🔐 *𝗕𝗔𝗦𝗘𝟲𝟰 ${mode.toUpperCase()}*\n\n\`${result}\``,
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    } catch (err) {
        console.error("BASE64 ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to process that text.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/hash(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const text = match[1] ? match[1].trim() : null;
    if (!text) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/hash <text>`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    try {
        const md5 = crypto.createHash('md5').update(text).digest('hex');
        const sha1 = crypto.createHash('sha1').update(text).digest('hex');
        const sha256 = crypto.createHash('sha256').update(text).digest('hex');

        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🔑 *𝗛𝗔𝗦𝗛 𝗥𝗘𝗦𝗨𝗟𝗧𝗦*\n\n*MD5:*\n\`${md5}\`\n\n*SHA1:*\n\`${sha1}\`\n\n*SHA256:*\n\`${sha256}\``, parse_mode: "Markdown", reply_markup: waChannelBtn  });
    } catch (err) {
        console.error("HASH ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to hash that text.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/genpass(?:\s+(\d+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    let length = match[1] ? parseInt(match[1], 10) : 16;
    if (isNaN(length) || length < 6) length = 6;
    if (length > 64) length = 64;

    try {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
        const bytes = crypto.randomBytes(length);
        let password = "";
        for (let i = 0; i < length; i++) {
            password += chars[bytes[i] % chars.length];
        }

        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🔒 *𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥*\n\n\`${password}\`\n\n_Length: ${length} characters_`,
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    } catch (err) {
        console.error("GENPASS ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to generate a password right now.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/uuid$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const id = crypto.randomUUID();
    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🆔 *𝗨𝗨𝗜𝗗*\n\n\`${id}\``,
        parse_mode: "Markdown", reply_markup: waChannelBtn
     }).catch(err => console.error("UUID ERROR:", err.message));
});

function safeCalculate(expr) {
    const cleaned = expr.replace(/\s+/g, '');
    if (!cleaned || cleaned.length > 100 || !/^[0-9+\-*/().%]+$/.test(cleaned)) {
        throw new Error("Only numbers and + - * / % ( ) . are allowed.");
    }
    const result = Function(`"use strict"; return (${cleaned});`)();
    if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error("Invalid expression.");
    }
    return result;
}

EsTeams.onText(/^\/calc(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const expr = match[1] ? match[1].trim() : null;
    if (!expr) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/calc <expression>`\ne.g. `/calc (12+8)*3`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    try {
        const result = safeCalculate(expr);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🧮 *𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗧𝗢𝗥*\n\n${expr} = *${result}*`,
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    } catch (err) {
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `⚠️ *${err.message}*`, parse_mode: "Markdown", reply_markup: waChannelBtn  }).catch(() => {});
    }
});

const MORSE_MAP = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
    'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
    'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
    'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    ' ': '/'
};
const MORSE_MAP_REVERSED = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

EsTeams.onText(/^\/morse(?:\s+(encode|decode)\s+([\s\S]+))?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const mode = match[1] ? match[1].toLowerCase() : null;
    const text = match[2] ? match[2].trim() : null;

    if (!mode || !text) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/morse encode <text>` or `/morse decode <morse code>`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    try {
        let result;
        if (mode === 'encode') {
            result = text.toUpperCase().split('').map(ch => MORSE_MAP[ch] ?? ch).join(' ');
        } else {
            result = text.split(' ').map(code => MORSE_MAP_REVERSED[code] ?? code).join('');
        }
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `📡 *𝗠𝗢𝗥𝗦𝗘 ${mode.toUpperCase()}*\n\n\`${result}\``,
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    } catch (err) {
        console.error("MORSE ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to process that text.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/reverse(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const text = match[1] ? match[1].trim() : null;
    if (!text) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/reverse <text>`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    const reversed = [...text].reverse().join('');
    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🔁 *𝗥𝗘𝗩𝗘𝗥𝗦𝗘𝗗 𝗧𝗘𝗫𝗧*\n\n${reversed}`,
        parse_mode: "Markdown", reply_markup: waChannelBtn
     }).catch(err => console.error("REVERSE ERROR:", err.message));
});

EsTeams.onText(/^\/translate(?:\s+(\S+)\s+([\s\S]+))?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const targetLang = match[1] ? match[1].toLowerCase() : null;
    const text = match[2] ? match[2].trim() : null;

    if (!targetLang || !text) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/translate <lang_code> <text>`\ne.g. `/translate es Hello there`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${encodeURIComponent(targetLang)}`;
        const res = await fetch(url);
        const data = await res.json();
        const translated = data?.responseData?.translatedText;

        if (!translated) throw new Error("No translation returned");

        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🌐 *𝗧𝗥𝗔𝗡𝗦𝗟𝗔𝗧𝗜𝗢𝗡 (${targetLang.toUpperCase()})*\n\n${translated}`,
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    } catch (err) {
        console.error("TRANSLATE ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to translate right now. Try again later.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/define(?:\s+(\S+))?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const word = match[1] ? match[1].trim() : null;
    if (!word) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/define <word>`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        const data = await res.json();
        if (!Array.isArray(data) || !data[0]) throw new Error("Word not found");

        const entry = data[0];
        const meanings = entry.meanings.slice(0, 3).map(m => {
            const def = m.definitions[0]?.definition || "No definition available";
            return `*${m.partOfSpeech}:* ${def}`;
        }).join('\n\n');

        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `📖 *𝗗𝗘𝗙𝗜𝗡𝗜𝗧𝗜𝗢𝗡: ${entry.word}*\n\n${meanings}`,
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    } catch (err) {
        console.error("DEFINE ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `⚠️ *No definition found for "${word}".*`, parse_mode: "Markdown", reply_markup: waChannelBtn  }).catch(() => {});
    }
});

EsTeams.onText(/^\/avatar$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const targetUser = msg.reply_to_message?.from || msg.from;

    try {
        const photos = await EsTeams.getUserProfilePhotos(targetUser.id, { limit: 1 });
        if (!photos.total_count || !photos.photos.length) {
            return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *This user has no profile photo set, or it's private.*",
                parse_mode: "Markdown", reply_markup: waChannelBtn
             });
        }

        const sizes = photos.photos[0];
        const fileId = sizes[sizes.length - 1].file_id;

        await EsTeams.sendPhoto(chatId, fileId, {
            caption: `🖼️ *𝗔𝗩𝗔𝗧𝗔𝗥 — ${targetUser.first_name || 'User'}*`,
            parse_mode: "Markdown",
            reply_markup: waChannelBtn
        });
    } catch (err) {
        console.error("AVATAR ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to fetch avatar right now.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/timestamp(?:\s+(\d+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    try {
        if (match[1]) {
            const unix = parseInt(match[1], 10);
            const date = new Date(unix * 1000);
            if (isNaN(date.getTime())) throw new Error("Invalid timestamp");

            EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🕒 *𝗧𝗜𝗠𝗘𝗦𝗧𝗔𝗠𝗣 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗥*\n\nUnix: \`${unix}\`\nDate (UTC): ${date.toUTCString()}\nISO: ${date.toISOString()}`,
                parse_mode: "Markdown", reply_markup: waChannelBtn
             });
        } else {
            const now = new Date();
            EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🕒 *𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗧𝗜𝗠𝗘𝗦𝗧𝗔𝗠𝗣*\n\nUnix: \`${Math.floor(now.getTime() / 1000)}\`\nDate (UTC): ${now.toUTCString()}\nISO: ${now.toISOString()}\n\n_Tip: use \`/timestamp <unix>\` to convert one._`,
                parse_mode: "Markdown", reply_markup: waChannelBtn
             });
        }
    } catch (err) {
        console.error("TIMESTAMP ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Invalid timestamp provided.*", parse_mode: "Markdown", reply_markup: waChannelBtn  }).catch(() => {});
    }
});

EsTeams.onText(/^\/color(?:\s+#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    let hex = match[1];
    if (!hex) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/color <hex>`\ne.g. `/color ff5733`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    try {
        const canvas = createCanvas(300, 120);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = `#${hex}`;
        ctx.fillRect(0, 0, 300, 120);
        ctx.fillStyle = (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#000000' : '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`#${hex.toUpperCase()}`, 20, 65);
        const buf = canvas.toBuffer('image/png');

        await EsTeams.sendPhoto(chatId, buf, {
            caption: `🎨 *𝗖𝗢𝗟𝗢𝗥 𝗣𝗥𝗘𝗩𝗜𝗘𝗪*\n\nHEX: \`#${hex.toUpperCase()}\`\nRGB: \`${r}, ${g}, ${b}\``,
            parse_mode: "Markdown",
            reply_markup: waChannelBtn
        });
    } catch (err) {
        console.error("COLOR ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🎨 *𝗖𝗢𝗟𝗢𝗥 𝗜𝗡𝗙𝗢*\n\nHEX: \`#${hex.toUpperCase()}\`\nRGB: \`${r}, ${g}, ${b}\``,
            parse_mode: "Markdown", reply_markup: waChannelBtn
         }).catch(() => {});
    }
});

EsTeams.onText(/^\/react(?:\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const emoji = match[1] ? match[1].trim() : null;
    const target = msg.reply_to_message;

    if (!emoji || !target) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nReply to a message with `/react <emoji>`\ne.g. reply with `/react 🔥`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    try {
        const result = await telegramRawApi('setMessageReaction', {
            chat_id: chatId,
            message_id: target.message_id,
            reaction: [{ type: 'emoji', emoji }]
        });

        if (!result.ok) throw new Error(result.description || 'Reaction rejected');

        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `✅ Reacted with ${emoji}`, parse_mode: "Markdown"  }).catch(() => {});
    } catch (err) {
        console.error("REACT ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *That emoji isn't a valid reaction. Try 👍 ❤️ 🔥 🎉 😁 etc.*",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         }).catch(() => {});
    }
});

//---------------- INFO ----------------//

EsTeams.onText(/^\/myid$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🆔 *𝗬𝗢𝗨𝗥 𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠 𝗜𝗗*\n\n\`${msg.from.id}\``,
        parse_mode: "Markdown", reply_markup: waChannelBtn
     }).catch(err => console.error("MYID ERROR:", err.message));
});

EsTeams.onText(/^\/chatid$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `💬 *𝗖𝗛𝗔𝗧 𝗜𝗗*\n\n\`${chatId}\`\nType: ${msg.chat.type}`,
        parse_mode: "Markdown", reply_markup: waChannelBtn
     }).catch(err => console.error("CHATID ERROR:", err.message));
});

EsTeams.onText(/^\/whoami$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const u = msg.from;
    const fullName = [u.first_name, u.last_name].filter(Boolean).join(' ');

    EsTeams.sendPhoto(chatId, botImageUrl, { caption: `👤 *𝗪𝗛𝗢 𝗔𝗠 𝗜*\n\n` +
        `*Name:* ${fullName || 'N/A'}\n` +
        `*Username:* ${u.username ? '@' + u.username : 'N/A'}\n` +
        `*ID:* \`${u.id}\`\n` +
        `*Language:* ${u.language_code || 'N/A'}\n` +
        `*Premium:* ${u.is_premium ? 'Yes ✅' : 'No'}`, parse_mode: "Markdown", reply_markup: waChannelBtn  }).catch(err => console.error("WHOAMI ERROR:", err.message));
});

EsTeams.onText(/^\/botinfo$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    try {
        const me = await EsTeams.getMe();
        const uptimeSeconds = Math.floor(process.uptime());
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);

        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `🤖 *𝗕𝗢𝗧 𝗜𝗡𝗙𝗢*\n\n` +
            `*Name:* ${me.first_name}\n` +
            `*Username:* @${me.username}\n` +
            `*ID:* \`${me.id}\`\n` +
            `*Commands:* ${totalCommands}\n` +
            `*Process Uptime:* ${hours}h ${minutes}m\n` +
            `*Node Version:* ${process.version}`, parse_mode: "Markdown", reply_markup: waChannelBtn  });
    } catch (err) {
        console.error("BOTINFO ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to fetch bot info right now.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/groupinfo$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *This command only works inside a group.*",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    try {
        const chat = await EsTeams.getChat(chatId);
        let memberCount = null;
        try {
            memberCount = await EsTeams.getChatMemberCount(chatId);
        } catch {}

        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `👥 *𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢*\n\n` +
            `*Title:* ${chat.title || 'N/A'}\n` +
            `*ID:* \`${chat.id}\`\n` +
            `*Type:* ${chat.type}\n` +
            `*Members:* ${memberCount ?? 'N/A'}`, parse_mode: "Markdown", reply_markup: waChannelBtn  });
    } catch (err) {
        console.error("GROUPINFO ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to fetch group info right now.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

//---------------- FIXED: /gitstalk (was listed in the menu but never implemented) ----------------//

EsTeams.onText(/^\/gitstalk(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const username = match[1] ? match[1].trim().replace(/\s+/g, '') : null;
    if (!username) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "❌ *𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗙𝗼𝗿𝗺𝗮𝘁*\n\nPlease use `/gitstalk username`.",
            parse_mode: "Markdown",
            reply_markup: waChannelBtn
        });
    }

    let waitMessage;
    try {
        waitMessage = await EsTeams.sendPhoto(chatId, botImageUrl, { caption: "🔄 *𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴...*",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    } catch (err) {
        console.error("Error sending wait message:", err);
    }

    try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
            headers: { 'User-Agent': 'ES-TEAMS-V1-Bot' }
        });
        const data = await res.json();

        if (waitMessage) {
            try { await EsTeams.deleteMessage(chatId, waitMessage.message_id); } catch {}
        }

        if (!res.ok || data.message === 'Not Found') {
            throw new Error("GitHub user not found");
        }

        const caption = `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗚𝗜𝗧𝗛𝗨𝗕 𝗦𝗧𝗔𝗟𝗞𝗘𝗥*\n\n` +
            `*Username:* ${data.login}\n` +
            `*Name:* ${data.name || 'N/A'}\n` +
            `*Bio:* ${data.bio || 'N/A'}\n` +
            `*Public Repos:* ${data.public_repos}\n` +
            `*Followers:* ${data.followers}\n` +
            `*Following:* ${data.following}\n` +
            `*Profile:* ${data.html_url}\n\n` +
            `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`;

        await EsTeams.sendPhoto(chatId, data.avatar_url || botImageUrl, {
            caption,
            parse_mode: "Markdown",
            reply_markup: waChannelBtn
        });
    } catch (err) {
        if (waitMessage) {
            try { await EsTeams.deleteMessage(chatId, waitMessage.message_id); } catch {}
        }
        await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: `❌ *𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝗱𝗮𝘁𝗮.*\n\n${err.message}`,
            parse_mode: "Markdown",
            reply_markup: waChannelBtn
        });
    }
});

//======================================================================
//  INLINE MODE, SPOILER MEDIA, MESSAGE EFFECTS, TOPICS & BUSINESS BOTS
//======================================================================

//---------------- INLINE MODE ----------------//
EsTeams.on('inline_query', async (inlineQuery) => {
    const query = (inlineQuery.query || '').trim();

    try {
        let results = [];

        if (!query) {
            results = [{
                type: 'article',
                id: 'help',
                title: '💡 Type something to search…',
                description: 'Try: calc 12*8, color ff5733, 8ball <question>, joke, riddle',
                input_message_content: {
                    message_text: 'ℹ️ Type after my username to try inline mode — e.g. `calc 12*8`, `color ff5733`, `joke`, `riddle`, or `8ball will it rain today?`',
                    parse_mode: 'Markdown'
                }
            }];
        } else if (/^calc\s+/i.test(query)) {
            const expr = query.replace(/^calc\s+/i, '');
            try {
                const result = safeCalculate(expr);
                results = [{
                    type: 'article',
                    id: 'calc',
                    title: `🧮 ${expr} = ${result}`,
                    description: 'Tap to send this result',
                    input_message_content: { message_text: `🧮 *𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗧𝗢𝗥*\n\n${expr} = *${result}*`, parse_mode: 'Markdown' }
                }];
            } catch (e) {
                results = [{
                    type: 'article',
                    id: 'calc_error',
                    title: '⚠️ Invalid expression',
                    description: e.message,
                    input_message_content: { message_text: `⚠️ ${e.message}` }
                }];
            }
        } else if (/^color\s+#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/i.test(query)) {
            let hex = query.replace(/^color\s+#?/i, '');
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            results = [{
                type: 'article',
                id: 'color',
                title: `🎨 #${hex.toUpperCase()}`,
                description: `RGB: ${r}, ${g}, ${b}`,
                input_message_content: { message_text: `🎨 *𝗖𝗢𝗟𝗢𝗥 𝗜𝗡𝗙𝗢*\n\nHEX: \`#${hex.toUpperCase()}\`\nRGB: \`${r}, ${g}, ${b}\``, parse_mode: 'Markdown' }
            }];
        } else if (/^8ball\s+/i.test(query)) {
            const question = query.replace(/^8ball\s+/i, '');
            const answers8 = ["It is certain.", "Without a doubt.", "Ask again later.", "My sources say no.", "Outlook good.", "Very doubtful.", "Signs point to yes."];
            const answer = answers8[Math.floor(Math.random() * answers8.length)];
            results = [{
                type: 'article',
                id: '8ball',
                title: '🎱 Magic 8-Ball',
                description: answer,
                input_message_content: { message_text: `🎱 *𝗠𝗔𝗚𝗜𝗖 𝟴 𝗕𝗔𝗟𝗟*\n\n❓ ${question}\n\n🔮 ${answer}`, parse_mode: 'Markdown' }
            }];
        } else if (/^joke$/i.test(query)) {
            try {
                const res = await fetch("https://official-joke-api.appspot.com/jokes/random");
                const joke = await res.json();
                results = [{
                    type: 'article',
                    id: 'joke',
                    title: joke.setup,
                    description: joke.punchline,
                    input_message_content: { message_text: `😂 *${joke.setup}*\n\n👉 _${joke.punchline}_`, parse_mode: 'Markdown' }
                }];
            } catch {
                results = [];
            }
        } else if (/^riddle$/i.test(query)) {
            const riddle = riddles[Math.floor(Math.random() * riddles.length)];
            results = [{
                type: 'article',
                id: 'riddle',
                title: '🧩 ' + riddle.q,
                description: 'Tap to send this riddle',
                input_message_content: { message_text: `🧩 *𝗥𝗜𝗗𝗗𝗟𝗘*\n\n${riddle.q}`, parse_mode: 'Markdown' }
            }];
        } else {
            results = [{
                type: 'article',
                id: 'echo',
                title: `Send: "${query.slice(0, 60)}"`,
                description: 'Send this text as a message',
                input_message_content: { message_text: query }
            }];
        }

        await EsTeams.answerInlineQuery(inlineQuery.id, results, { cache_time: 5, is_personal: true });
    } catch (err) {
        console.error("INLINE_QUERY ERROR:", err.message);
        EsTeams.answerInlineQuery(inlineQuery.id, [], { cache_time: 5 }).catch(() => {});
    }
});

//---------------- SPOILER MEDIA ----------------//

EsTeams.onText(/^\/spoiler$/, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    const target = msg.reply_to_message;
    if (!target || (!target.photo && !target.video && !target.animation)) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Usage*\n\nReply to a photo, video, or GIF with `/spoiler` to resend it blurred until tapped.", parse_mode: "Markdown", reply_markup: waChannelBtn  });
    }

    try {
        const caption = target.caption || undefined;
        if (target.photo) {
            const fileId = target.photo[target.photo.length - 1].file_id;
            await EsTeams.sendPhoto(chatId, fileId, { caption, has_spoiler: true, reply_markup: waChannelBtn });
        } else if (target.video) {
            await EsTeams.sendVideo(chatId, target.video.file_id, { caption, has_spoiler: true, reply_markup: waChannelBtn });
        } else if (target.animation) {
            await EsTeams.sendAnimation(chatId, target.animation.file_id, { caption, has_spoiler: true, reply_markup: waChannelBtn });
        }
    } catch (err) {
        console.error("SPOILER ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to send spoiler media right now.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

//---------------- MESSAGE EFFECTS ----------------//

const MESSAGE_EFFECTS = {
    fire: '5104841245755180586',
    heart: '5159385139981059251',
    thumbsup: '5107584321108051014',
    thumbsdown: '5104858069142078462',
    party: '5046509860389126442',
    poop: '5046589136895476101'
};

EsTeams.onText(/^\/effect(?:\s+(\S+)(?:\s+([\s\S]+))?)?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    if (msg.chat.type !== 'private') {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Message effects only work in private chats* — that's a Telegram limitation, not a bot one.",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    const effectName = match[1] ? match[1].toLowerCase() : null;
    const text = match[2] ? match[2].trim() : "✨";

    if (!effectName || !MESSAGE_EFFECTS[effectName]) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: `*Invalid Input*\n\nPlease use \`/effect <name> [text]\`\n\nAvailable: ${Object.keys(MESSAGE_EFFECTS).join(', ')}`, parse_mode: "Markdown", reply_markup: waChannelBtn  });
    }

    try {
        await EsTeams.sendPhoto(chatId, botImageUrl, { caption: text, message_effect_id: MESSAGE_EFFECTS[effectName]  });
    } catch (err) {
        console.error("EFFECT ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Unable to send that effect right now.*", parse_mode: "Markdown"  }).catch(() => {});
    }
});

//---------------- TOPICS (FORUM) MANAGEMENT ----------------//

async function isGroupAdmin(chatId, userId) {
    try {
        const member = await EsTeams.getChatMember(chatId, userId);
        return ['creator', 'administrator'].includes(member.status);
    } catch {
        return false;
    }
}

EsTeams.onText(/^\/newtopic(?:\s+([\s\S]+))?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    if (!msg.chat.is_forum) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *This group doesn't have Topics enabled.*\n\nEnable it via Group Settings → Topics first.",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }
    if (!(await isGroupAdmin(chatId, msg.from.id))) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "❌ *Only group admins can create topics.*", parse_mode: "Markdown"  });
    }

    const name = match[1] ? match[1].trim() : null;
    if (!name) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/newtopic <name>`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    try {
        const topic = await EsTeams.createForumTopic(chatId, name);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `✅ *𝗧𝗢𝗣𝗜𝗖 𝗖𝗥𝗘𝗔𝗧𝗘𝗗*\n\n"${name}"`,
            parse_mode: "Markdown", reply_markup: waChannelBtn, message_thread_id: topic.message_thread_id
         });
    } catch (err) {
        console.error("NEWTOPIC ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `⚠️ *Unable to create topic.*\n\n${err.message}`, parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/closetopic$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    if (!msg.message_thread_id) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Use this command inside the topic you want to close.*", parse_mode: "Markdown"  });
    }
    if (!(await isGroupAdmin(chatId, msg.from.id))) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "❌ *Only group admins can close topics.*", parse_mode: "Markdown"  });
    }
    try {
        await EsTeams.closeForumTopic(chatId, msg.message_thread_id);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "🔒 *Topic closed.*", parse_mode: "Markdown", message_thread_id: msg.message_thread_id  }).catch(() => {});
    } catch (err) {
        console.error("CLOSETOPIC ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `⚠️ *Unable to close topic.*\n\n${err.message}`, parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/reopentopic$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    if (!msg.message_thread_id) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Use this command inside the topic you want to reopen.*", parse_mode: "Markdown"  });
    }
    if (!(await isGroupAdmin(chatId, msg.from.id))) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "❌ *Only group admins can reopen topics.*", parse_mode: "Markdown"  });
    }
    try {
        await EsTeams.reopenForumTopic(chatId, msg.message_thread_id);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: "🔓 *Topic reopened.*", parse_mode: "Markdown", message_thread_id: msg.message_thread_id  }).catch(() => {});
    } catch (err) {
        console.error("REOPENTOPIC ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `⚠️ *Unable to reopen topic.*\n\n${err.message}`, parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/deletetopic$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    if (!msg.message_thread_id) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Use this command inside the topic you want to delete.*", parse_mode: "Markdown"  });
    }
    if (!(await isGroupAdmin(chatId, msg.from.id))) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "❌ *Only group admins can delete topics.*", parse_mode: "Markdown"  });
    }
    try {
        await EsTeams.deleteForumTopic(chatId, msg.message_thread_id);
    } catch (err) {
        console.error("DELETETOPIC ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `⚠️ *Unable to delete topic.*\n\n${err.message}`, parse_mode: "Markdown"  }).catch(() => {});
    }
});

EsTeams.onText(/^\/renametopic(?:\s+([\s\S]+))?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    if (!msg.message_thread_id) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "⚠️ *Use this command inside the topic you want to rename.*", parse_mode: "Markdown"  });
    }
    if (!(await isGroupAdmin(chatId, msg.from.id))) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "❌ *Only group admins can rename topics.*", parse_mode: "Markdown"  });
    }

    const name = match[1] ? match[1].trim() : null;
    if (!name) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/renametopic <new name>` inside the topic.",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    try {
        await EsTeams.editForumTopic(chatId, msg.message_thread_id, { name });
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `✅ *Topic renamed to "${name}"*`, parse_mode: "Markdown", message_thread_id: msg.message_thread_id  }).catch(() => {});
    } catch (err) {
        console.error("RENAMETOPIC ERROR:", err.message);
        EsTeams.sendPhoto(chatId, botImageUrl, { caption: `⚠️ *Unable to rename topic.*\n\n${err.message}`, parse_mode: "Markdown"  }).catch(() => {});
    }
});

//---------------- TELEGRAM BUSINESS ACCOUNT ASSISTANT ----------------//
const BUSINESS_FILE = './ES_TEAMS-MEDIA/business_connections.json';

function loadBusinessConnections() {
    try {
        if (fs.existsSync(BUSINESS_FILE)) {
            return JSON.parse(fs.readFileSync(BUSINESS_FILE, 'utf8'));
        }
    } catch (err) {
        console.error("BUSINESS LOAD ERROR:", err.message);
    }
    return {};
}

function saveBusinessConnections() {
    try {
        fs.writeFileSync(BUSINESS_FILE, JSON.stringify(businessConnections, null, 2));
    } catch (err) {
        console.error("BUSINESS SAVE ERROR:", err.message);
    }
}

let businessConnections = loadBusinessConnections();

const BIZ_SETTINGS_DOC = doc(db, "botData", "businessSettings");
let businessSettings = {};

async function loadBusinessSettings() {
    try {
        const snap = await getDoc(BIZ_SETTINGS_DOC);
        if (snap.exists()) return snap.data().owners || {};
        await setDoc(BIZ_SETTINGS_DOC, { owners: {} });
    } catch (err) {
        console.error("BIZ SETTINGS LOAD ERROR:", err.message);
    }
    return {};
}

async function saveBusinessSettings() {
    try {
        await setDoc(BIZ_SETTINGS_DOC, { owners: businessSettings });
    } catch (err) {
        console.error("BIZ SETTINGS SAVE ERROR:", err.message);
    }
}

let businessSettingsPromise = null;
function ensureBusinessSettings() {
    if (!businessSettingsPromise) {
        businessSettingsPromise = loadBusinessSettings().then(s => { businessSettings = s; return s; });
    }
    return businessSettingsPromise;
}
ensureBusinessSettings();

function setBusinessSetting(connection, patch) {
    const key = String(connection.userId);
    businessSettings[key] = { ...(businessSettings[key] || {}), ...patch };
    Object.assign(connection, patch);
    businessConnections[connection.id] = connection;
    saveBusinessConnections();
    saveBusinessSettings();
}

async function buildBizNotConnectedView() {
    let botUsername = '';
    try {
        botUsername = (await EsTeams.getMe()).username;
    } catch {}

    const caption =
        "ℹ️ *No Telegram Business connection found for your account.*\n\n" +
        "*How to link this bot:*\n\n" +
        "1️⃣ Open Telegram *Settings*\n" +
        "2️⃣ Tap *Account*\n" +
        "3️⃣ Tap *Chat Automation*\n" +
        "4️⃣ Select *ES TEAMS V1* and connect it\n\n" +
        "Then send any message to your Business account and try the command again.";

    const rows = [];
    if (botUsername) {
        rows.push([{ text: "🔗 𝗟𝗜𝗡𝗞 𝗬𝗢𝗨𝗥 𝗔𝗖𝗖𝗢𝗨𝗡𝗧", url: `https://t.me/${botUsername}` }]);
    }
    rows.push([{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29" }]);

    return { caption, keyboard: { inline_keyboard: rows } };
}

async function sendBizNotConnected(chatId) {
    const view = await buildBizNotConnectedView();
    try {
        return await EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: view.caption,
            parse_mode: "Markdown",
            reply_markup: view.keyboard
        });
    } catch (err) {
        console.error("BIZ NOT-CONNECTED SEND ERROR:", err.message);
        return EsTeams.sendMessage(chatId, view.caption, { parse_mode: "Markdown" }).catch(() => {});
    }
}

function storeBusinessConnection(connection) {
    const previous = businessConnections[connection.id];
    const saved = businessSettings[String(connection.user.id)] || {};

    businessConnections[connection.id] = {
        id: connection.id,
        userId: connection.user.id,
        userChatId: connection.user_chat_id,
        isEnabled: connection.is_enabled !== undefined ? !!connection.is_enabled : (previous?.isEnabled ?? true),
        canReply: connection.rights?.can_reply ?? connection.can_reply ?? previous?.canReply ?? true,
        autoReply: previous?.autoReply ?? saved.autoReply ?? false,
        ownerName: connection.user.first_name || previous?.ownerName || '',
        profile: previous?.profile || saved.profile || ''
    };
    saveBusinessConnections();
    return businessConnections[connection.id];
}

async function recoverBusinessConnection(connectionId) {
    try {
        const fresh = await EsTeams.getBusinessConnection(connectionId);
        if (fresh && fresh.user) {
            console.error(`BIZ RECOVERED connection ${connectionId} for user ${fresh.user.id}`);
            return storeBusinessConnection(fresh);
        }
    } catch (err) {
        console.error("BIZ RECOVER ERROR:", err.message);
    }
    return null;
}

function findBusinessConnectionFor(msg) {
    return Object.values(businessConnections)
        .find(c => c.userId === msg.from.id || c.userChatId === msg.chat.id);
}

EsTeams.on('business_connection', (connection) => {
    try {
        const previous = businessConnections[connection.id];
        const stateChanged = !previous || previous.isEnabled !== !!connection.is_enabled;

        storeBusinessConnection(connection);

        if (!stateChanged) return;

        const text = connection.is_enabled
            ? `✅ *𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗔𝗦𝗦𝗜𝗦𝗧𝗔𝗡𝗧 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗*\n\n` +
              `ES TEAMS V1 is now linked to your Telegram Business account.\n\n` +
              `By default I only notify you here, in this DM with me, about new customer messages. I won't touch your Business chats themselves.\n\n` +
              `Here's how to set it up:\n\n` +
              `1️⃣ \`/bizprofile <describe your business>\`\n` +
              `Optional — gets added as a note at the end of every auto-reply.\n\n` +
              `2️⃣ \`/bizassistant on\`\n` +
              `Turns on auto-reply for customer messages.\n\n` +
              `3️⃣ \`/bizstatus\`\n` +
              `Check your connection anytime.\n\n` +
              `⚠️ These only work sent directly to me, right here — not inside your Business conversations with customers, those just get relayed to me as notifications.`
            : `❌ *𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗜𝗢𝗡 𝗧𝗨𝗥𝗡𝗘𝗗 𝗢𝗙𝗙*\n\nYour Telegram Business connection to ES TEAMS V1 was disabled from Telegram settings.`;

        EsTeams.sendMessage(connection.user_chat_id, text, { parse_mode: "Markdown", reply_markup: waChannelBtn }).catch(() => {});
    } catch (err) {
        console.error("BUSINESS_CONNECTION ERROR:", err.message);
    }
});

function generateBusinessGreeting(connection) {
    const greeting = connection.ownerName
        ? `👋 Thanks for messaging ${connection.ownerName}!`
        : `👋 Thanks for your message!`;
    const note = connection.profile ? `\n\n${connection.profile}` : '';
    return `${greeting} We've received it and will get back to you as soon as possible.${note}`;
}

const BIZ_GREET_WINDOW_MS = 24 * 60 * 60 * 1000;
const bizLastSeen = new Map();

function shouldGreetBusinessChat(connectionId, chatId) {
    const key = `${connectionId}:${chatId}`;
    const now = Date.now();
    const last = bizLastSeen.get(key);
    bizLastSeen.set(key, now);
    return !last || (now - last) >= BIZ_GREET_WINDOW_MS;
}

async function generateBusinessAiReply(connection, customerText) {
    const guarded = identityGuardAnswer(customerText);
    if (guarded) return guarded;

    const about = connection.profile
        ? `About this business, in the owner's own words: "${connection.profile}".`
        : '';
    const prompt =
        `You are the customer-support assistant replying on Telegram for ${connection.ownerName || 'this business'}. ${about} ` +
        `Reply directly, warmly and helpfully to the customer's message below. Keep it short (1-4 sentences). ` +
        `Never say you are an AI language model and never mention any AI company or model name. ` +
        `If asked who made you, only say you are a virtual business Ai created by ES TEAMS TECH.\n\n` +
        `Customer's message: "${customerText}"\n\nYour reply:`;

    const reply = await askFreeAI(prompt);
    if (!reply) return null;

    return sanitizeAiReply(reply);
}

EsTeams.on('business_message', async (msg) => {
    try {
        await ensureBusinessSettings();
        const connectionId = msg.business_connection_id;
        let connection = businessConnections[connectionId];

        if (!connection) {
            connection = await recoverBusinessConnection(connectionId);
        }
        if (!connection || !connection.isEnabled) return;

        const from = msg.from || {};

        let botId;
        try {
            botId = (await EsTeams.getMe()).id;
        } catch {}
        if ((botId && from.id === botId) || from.id === connection.userId) return;

        const text = msg.text || msg.caption || '';
        const rawPreview = text ? (text.length > 300 ? text.slice(0, 300) + '…' : text) : '[non-text message]';
        const preview = escapeMarkdown(rawPreview);
        const fromName = escapeMarkdown(from.first_name || 'Customer');
        const fromUsername = from.username ? ` (@${escapeMarkdown(from.username)})` : '';

        EsTeams.sendMessage(connection.userChatId,
            `📩 *𝗡𝗘𝗪 𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗠𝗘𝗦𝗦𝗔𝗚𝗘*\n\n` +
            `*From:* ${fromName}${fromUsername}\n\n` +
            `*Message:*\n${preview}`,
            { parse_mode: "Markdown" }
        ).catch(() => {});

        if (!connection.autoReply || !connection.canReply || !text) {
            console.error(`BIZ AUTOREPLY SKIPPED: autoReply=${connection.autoReply} canReply=${connection.canReply} hasText=${!!text}`);
            return;
        }

        if (shouldGreetBusinessChat(connectionId, msg.chat.id)) {
            try {
                await EsTeams.sendMessage(msg.chat.id, generateBusinessGreeting(connection), { business_connection_id: connectionId });
                console.error(`BIZ GREETING SENT to chat ${msg.chat.id}`);
            } catch (err) {
                console.error("BIZ GREETING SEND ERROR:", err.message);
            }
        }

        try {
            await EsTeams.sendChatAction(msg.chat.id, 'typing', { business_connection_id: connectionId });
        } catch {}

        const reply = await generateBusinessAiReply(connection, text);
        if (!reply) {
            console.error("BIZ AUTOREPLY SKIPPED: all AI providers failed");
            return;
        }

        try {
            await EsTeams.sendMessage(msg.chat.id, reply, { business_connection_id: connectionId });
            console.error(`BIZ AUTOREPLY SENT to chat ${msg.chat.id}`);
        } catch (err) {
            console.error("BIZ AUTOREPLY SEND ERROR:", err.message);
        }
    } catch (err) {
        console.error("BUSINESS_MESSAGE ERROR:", err.message);
    }
});

EsTeams.onText(/^\/bizstatus$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    await ensureBusinessSettings();
    const connection = findBusinessConnectionFor(msg);

    if (!connection) {
        return sendBizNotConnected(chatId);
    }

    EsTeams.sendPhoto(chatId, botImageUrl, { caption:
        `🔗 *𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗜𝗢𝗡 𝗦𝗧𝗔𝗧𝗨𝗦*\n\n` +
        `*Connected:*\n${connection.isEnabled ? 'Yes ✅' : 'No ❌'}\n\n` +
        `*Auto-reply:*\n${connection.autoReply ? 'ON ✅' : 'OFF'}\n\n` +
        `*Can reply on your behalf:*\n${connection.canReply ? 'Yes' : 'No — grant this right in Telegram settings'}\n\n` +
        `*Business profile note:*\n${connection.profile ? escapeMarkdown(connection.profile) : '_Not set — use /bizprofile to add a note to every auto-reply._'}`,
        parse_mode: "Markdown", reply_markup: waChannelBtn  }).catch(err => console.error("BIZSTATUS ERROR:", err.message));
});

EsTeams.onText(/^\/bizz?assistant(?:\s+(on|off))?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    await ensureBusinessSettings();
    const connection = findBusinessConnectionFor(msg);
    if (!connection) {
        return sendBizNotConnected(chatId);
    }

    const mode = match[1] ? match[1].toLowerCase() : null;
    if (!mode) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "*Invalid Input*\n\nPlease use `/bizassistant on` or `/bizassistant off`",
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    setBusinessSetting(connection, { autoReply: mode === 'on' });

    EsTeams.sendPhoto(chatId, botImageUrl, { caption: mode === 'on'
            ? `✅ *𝗔𝘂𝘁𝗼-𝗿𝗲𝗽𝗹𝘆 𝗲𝗻𝗮𝗯𝗹𝗲𝗱*\n\nI'll now send an instant reply to your customers when they message your Business account — a reliable fixed message, not AI-generated.\n\n${connection.profile ? "It'll include the note you set with /bizprofile." : "Tip: set /bizprofile to add a short note (e.g. hours, what you sell) to the end of every auto-reply."}`
            : "🔕 *𝗔𝘂𝘁𝗼-𝗿𝗲𝗽𝗹𝘆 𝗱𝗶𝘀𝗮𝗯𝗹𝗲𝗱*\n\nI'll only notify you about new messages from now on — I won't reply for you.", parse_mode: "Markdown", reply_markup: waChannelBtn  }).catch(err => console.error("BIZASSISTANT ERROR:", err.message));
});

EsTeams.onText(/^\/bizprofile(?:\s+([\s\S]+))?$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    await ensureBusinessSettings();
    const connection = findBusinessConnectionFor(msg);
    if (!connection) {
        return sendBizNotConnected(chatId);
    }

    const description = match[1] ? match[1].trim() : null;
    if (!description) {
        return EsTeams.sendPhoto(chatId, botImageUrl, { caption:
            `*Invalid Input*\n\nPlease use \`/bizprofile <note>\`\n\n` +
            `e.g. \`/bizprofile We're open 9am-6pm Mon-Sat. Orders ship within 2 days.\`\n\n` +
            `${connection.profile ? `*Current note:*\n${escapeMarkdown(connection.profile)}` : 'No note set yet — auto-replies are just the plain "thanks for your message" text until you set one.'}`,
            parse_mode: "Markdown", reply_markup: waChannelBtn
         });
    }

    setBusinessSetting(connection, { profile: description.slice(0, 600) });

    EsTeams.sendPhoto(chatId, botImageUrl, { caption:
        `✅ *𝗡𝗼𝘁𝗲 𝘀𝗮𝘃𝗲𝗱*\n\n` +
        `${escapeMarkdown(connection.profile)}\n\n` +
        `From now on, this gets added to the end of every auto-reply.`,
        parse_mode: "Markdown", reply_markup: waChannelBtn
    }).catch(err => console.error("BIZPROFILE ERROR:", err.message));
});
EsTeams.onText(/^\/ocr$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const reply = msg.reply_to_message;
    if (!reply || !reply.photo) {
        return EsTeams.sendMessage(chatId, "❌ Reply to an image with /ocr to extract its text.", { reply_markup: waChannelBtn });
    }
    const wait = await EsTeams.sendMessage(chatId, "🔎 Reading text from image...");
    try {
        const fileId = reply.photo[reply.photo.length - 1].file_id;
        const fileLink = await EsTeams.getFileLink(fileId);
        const data = await esApiGet("/api/v1/dev/ocr", { url: fileLink });
        await EsTeams.deleteMessage(chatId, wait.message_id).catch(() => {});
        const text = data.text && data.text.trim() ? data.text.trim() : "(no text found)";
        return EsTeams.sendMessage(chatId, `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗢𝗖𝗥\n\n${text}`, { reply_markup: waChannelBtn });
    } catch (err) {
        await EsTeams.deleteMessage(chatId, wait.message_id).catch(() => {});
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/currency(?:\s+(\d+(?:\.\d+)?)\s+([a-zA-Z]{3})\s+([a-zA-Z]{3}))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    if (!match[1]) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /currency <amount> <from> <to>\n\nExample: /currency 100 USD NGN", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/currency", { amount: match[1], from: match[2], to: match[3] });
        return EsTeams.sendMessage(chatId, `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗨𝗥𝗥𝗘𝗡𝗖𝗬\n\n${data.amount} ${data.from} = ${data.result} ${data.to}\nRate: ${data.rate}`, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/summarize(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const text = match[1]?.trim();
    if (!text) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /summarize <text>", { reply_markup: waChannelBtn });
    }
    const wait = await EsTeams.sendMessage(chatId, "🧠 Summarizing...");
    try {
        const data = await esApiPost("/api/v1/dev/summarize", { text });
        await EsTeams.deleteMessage(chatId, wait.message_id).catch(() => {});
        return EsTeams.sendMessage(chatId, `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗦𝗨𝗠𝗠𝗔𝗥𝗬\n\n${data.summary}`, { reply_markup: waChannelBtn });
    } catch (err) {
        await EsTeams.deleteMessage(chatId, wait.message_id).catch(() => {});
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/chart(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const input = match[1]?.trim();
    if (!input) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /chart <type>|<title>|<labels>|<data>\n\nExample: /chart bar|Sales|Jan,Feb,Mar|10,20,30", { reply_markup: waChannelBtn });
    }
    const parts = input.split("|").map((p) => p.trim());
    const [type, title, labels, data] = parts;
    try {
        const result = await esApiPost("/api/v1/dev/chart", { type: type || "bar", title, labels, data });
        return EsTeams.sendPhoto(chatId, result.chart_url, { caption: "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗛𝗔𝗥𝗧", reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/linkpreview(?:\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const url = match[1];
    if (!url) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /linkpreview <url>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/linkpreview", { url });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗟𝗜𝗡𝗞 𝗣𝗥𝗘𝗩𝗜𝗘𝗪\n\n${data.title || "(no title)"}\n${data.description || ""}`;
        if (data.image) {
            return EsTeams.sendPhoto(chatId, data.image, { caption, reply_markup: waChannelBtn });
        }
        return EsTeams.sendMessage(chatId, caption, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/iplookup(?:\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const ip = match[1];
    if (!ip) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /iplookup <ip address>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/iplookup", { ip });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗜𝗣 𝗟𝗢𝗢𝗞𝗨𝗣\n\nIP: ${data.ip}\nCity: ${data.city || "Unknown"}\nRegion: ${data.region || "Unknown"}\nCountry: ${data.country || "Unknown"}\nISP: ${data.isp || "Unknown"}`;
        return EsTeams.sendMessage(chatId, caption, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/country(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const name = match[1]?.trim();
    if (!name) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /country <name>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/country", { name });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 𝗜𝗡𝗙𝗢\n\nName: ${data.name}\nCapital: ${data.capital}\nRegion: ${data.region}\nPopulation: ${Number(data.population || 0).toLocaleString()}\nCurrency: ${data.currency}`;
        if (data.flag) {
            return EsTeams.sendPhoto(chatId, data.flag, { caption, reply_markup: waChannelBtn });
        }
        return EsTeams.sendMessage(chatId, caption, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/advice$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    try {
        const data = await esApiGet("/api/v1/dev/advice", {});
        return EsTeams.sendMessage(chatId, `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗔𝗗𝗩𝗜𝗖𝗘\n\n${data.advice}`, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/catfact$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    try {
        const data = await esApiGet("/api/v1/dev/catfact", {});
        return EsTeams.sendMessage(chatId, `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗔𝗧 𝗙𝗔𝗖𝗧\n\n${data.fact}`, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/holidays(?:\s+([\s\S]+)\s+(\d{4}))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    if (!match[1]) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /holidays <country code> <year>\n\nExample: /holidays NG 2026", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/holidays", { country: match[1].trim(), year: match[2] });
        if (!data.holidays || !data.holidays.length) {
            return EsTeams.sendMessage(chatId, "❌ No holidays found for that country and year.", { reply_markup: waChannelBtn });
        }
        const list = data.holidays.slice(0, 15).map((h) => `${h.date} - ${h.name}`).join("\n");
        return EsTeams.sendMessage(chatId, `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗣𝗨𝗕𝗟𝗜𝗖 𝗛𝗢𝗟𝗜𝗗𝗔𝗬𝗦\n\n${list}`, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/dogimage$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    try {
        const data = await esApiGet("/api/v1/dev/dogimage", {});
        return EsTeams.sendPhoto(chatId, data.url, { caption: "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗥𝗔𝗡𝗗𝗢𝗠 𝗗𝗢𝗚", reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/quote$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    try {
        const data = await esApiGet("/api/v1/dev/quote", {});
        return EsTeams.sendMessage(chatId, `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗤𝗨𝗢𝗧𝗘\n\n"${data.text}"\n— ${data.author || "Unknown"}`, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/mcstatus(?:\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const address = match[1];
    if (!address) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /mcstatus <server address>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/minecraft", { address });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗠𝗜𝗡𝗘𝗖𝗥𝗔𝗙𝗧 𝗦𝗧𝗔𝗧𝗨𝗦\n\nServer: ${address}\nOnline: ${data.online ? "Yes ✅" : "No ❌"}\nPlayers: ${data.players?.online ?? "N/A"}/${data.players?.max ?? "N/A"}\nVersion: ${data.version || "Unknown"}`;
        return EsTeams.sendMessage(chatId, caption, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/npm(?:\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const pkg = match[1];
    if (!pkg) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /npm <package name>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/npm", { package: pkg });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗡𝗣𝗠 𝗣𝗔𝗖𝗞𝗔𝗚𝗘\n\nName: ${data.name}\nVersion: ${data.version}\nDescription: ${data.description || "N/A"}\nLicense: ${data.license || "N/A"}`;
        return EsTeams.sendMessage(chatId, caption, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/ytinfo(?:\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const url = match[1];
    if (!url) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /ytinfo <youtube url>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/youtube", { url });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗜𝗡𝗙𝗢\n\nTitle: ${data.title}\nChannel: ${data.channel || data.author}\nDuration: ${data.duration}\nViews: ${Number(data.views || 0).toLocaleString()}`;
        return EsTeams.sendPhoto(chatId, data.thumbnail || botImageUrl, { caption, reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/githubrepo(?:\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const repo = match[1];
    if (!repo) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /githubrepo <owner/repo>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/githubrepo", { repo });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗚𝗜𝗧𝗛𝗨𝗕 𝗥𝗘𝗣𝗢\n\nName: ${data.full_name || repo}\nStars: ${data.stars}\nForks: ${data.forks}\nLanguage: ${data.language || "N/A"}\nDescription: ${data.description || "N/A"}`;
        return EsTeams.sendMessage(chatId, caption, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/anime(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const query = match[1]?.trim();
    if (!query) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /anime <name>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/anime", { query });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗔𝗡𝗜𝗠𝗘 𝗦𝗘𝗔𝗥𝗖𝗛\n\nTitle: ${data.title}\nEpisodes: ${data.episodes || "N/A"}\nStatus: ${data.status || "N/A"}\nScore: ${data.score || "N/A"}\n\n${data.synopsis || ""}`;
        if (data.image) {
            return EsTeams.sendPhoto(chatId, data.image, { caption, reply_markup: waChannelBtn });
        }
        return EsTeams.sendMessage(chatId, caption, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/wiki(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const title = match[1]?.trim();
    if (!title) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /wiki <topic>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/wikipedia", { title });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗪𝗜𝗞𝗜𝗣𝗘𝗗𝗜𝗔\n\n${data.title}\n\n${data.summary || data.extract}`;
        if (data.thumbnail) {
            return EsTeams.sendPhoto(chatId, data.thumbnail, { caption, reply_markup: waChannelBtn });
        }
        return EsTeams.sendMessage(chatId, caption, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/sportsteam(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const name = match[1]?.trim();
    if (!name) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /sportsteam <team name>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/sportsteam", { name });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗦𝗣𝗢𝗥𝗧𝗦 𝗧𝗘𝗔𝗠\n\nName: ${data.name}\nSport: ${data.sport || "N/A"}\nLeague: ${data.league || "N/A"}\nCountry: ${data.country || "N/A"}`;
        if (data.badge) {
            return EsTeams.sendPhoto(chatId, data.badge, { caption, reply_markup: waChannelBtn });
        }
        return EsTeams.sendMessage(chatId, caption, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/videogen(?:\s+([\s\S]+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    if (!premiumUsers.includes(userId)) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
            caption: "💎 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗣𝗥𝗘𝗠𝗜𝗨𝗠*\n\nThis command is only available for premium users.\n\n💰 Price: ₦5000",
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "𝗝𝗢𝗜𝗡 𝗣𝗥𝗘𝗠𝗜𝗨𝗠", callback_data: "pay_5000" }], waChannelBtn.inline_keyboard[0]] }
        });
    }
    const prompt = match[1]?.trim();
    if (!prompt) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /videogen <prompt>", { reply_markup: waChannelBtn });
    }
    const wait = await EsTeams.sendMessage(chatId, "🎬 Generating your video. This can take a while...");
    try {
        const data = await esApiPost("/api/v1/dev/videogen", { prompt });
        await EsTeams.deleteMessage(chatId, wait.message_id).catch(() => {});
        return EsTeams.sendVideo(chatId, data.video_url, { caption: "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗔𝗜 𝗩𝗜𝗗𝗘𝗢", reply_markup: waChannelBtn });
    } catch (err) {
        await EsTeams.deleteMessage(chatId, wait.message_id).catch(() => {});
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});

EsTeams.onText(/^\/wacheck(?:\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);
    const number = match[1];
    if (!number) {
        return EsTeams.sendMessage(chatId, "❌ Usage: /wacheck <number with country code>", { reply_markup: waChannelBtn });
    }
    try {
        const data = await esApiGet("/api/v1/dev/wa-check", { number });
        const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗘𝗖𝗞\n\nNumber: ${number}\nRegistered: ${data.registered ? "Yes ✅" : "No ❌"}`;
        return EsTeams.sendMessage(chatId, caption, { reply_markup: waChannelBtn });
    } catch (err) {
        return EsTeams.sendMessage(chatId, `❌ ${err.message}`, { reply_markup: waChannelBtn });
    }
});
});


//======================================================================
// TELEGRAM BOT API 10.2 / 10.3 FEATURES
// Uses the raw Bot API so these features work even when the installed
// node-telegram-bot-api wrapper does not expose the newest methods yet.
//======================================================================
function findBroadcastPinRecord(sourceMessageId) {
    return [...broadcastPinRecords].reverse()
        .find(record => String(record.sourceMessageId) === String(sourceMessageId));
}

async function applyGlobalBroadcastPin(msg, action) {
    const chatId = msg.chat.id;
    if (!CONFIG.OWNER_IDS.includes(msg.from.id)) {
        return sendFeatureNotice(chatId, '🚫 *This is an owner-only command.*');
    }
    const target = msg.reply_to_message;
    if (!target) {
        return sendFeatureNotice(chatId,
            action === 'pin'
                ? '📌 *Reply to your broadcast copy, then send `/gpin`.*'
                : '📌 *Reply to your broadcast copy, then send `/gunpin`.*'
        );
    }
    const record = findBroadcastPinRecord(target.message_id);
    if (!record) {
        return sendFeatureNotice(chatId,
            '⚠️ *No saved user-message map was found for that broadcast.*\n\n' +
            'Run a new `/broadcast` first, make sure your own chat is included, then reply to your copy.'
        );
    }
    let successCount = 0;
    let alreadyCount = 0;
    let failureCount = 0;
    for (const [targetChatId, messageId] of Object.entries(record.messages || {})) {
        try {
            let pinnedMessageId = null;
            try {
                const chatInfo = await EsTeams.getChat(targetChatId);
                pinnedMessageId = chatInfo?.pinned_message?.message_id ?? null;
            } catch {}
            if ((action === 'pin' && String(pinnedMessageId) === String(messageId)) ||
                (action === 'unpin' && pinnedMessageId !== null && String(pinnedMessageId) !== String(messageId))) {
                alreadyCount++;
                continue;
            }
            if (action === 'pin') {
                await EsTeams.pinChatMessage(targetChatId, messageId, { disable_notification: true });
            } else {
                await EsTeams.unpinChatMessage(targetChatId, messageId);
            }
            successCount++;
        } catch (err) {
            const description = String(err?.message || '').toLowerCase();
            const alreadyInState =
                (action === 'pin' && description.includes('already pinned')) ||
                (action === 'unpin' && (
                    description.includes('not pinned') ||
                    description.includes('message to unpin not found') ||
                    description.includes('message not found')
                ));
            if (alreadyInState) {
                alreadyCount++;
            } else {
                failureCount++;
                console.error(`GLOBAL ${action.toUpperCase()} ERROR for ${targetChatId}:`, err.message);
            }
        }
    }
    return sendFeatureNotice(chatId,
        `${action === 'pin' ? '📌' : '📍'} *Global broadcast ${action === 'pin' ? 'pin' : 'unpin'} complete.*\n\n` +
        `👥 *Processed:* ${successCount + alreadyCount + failureCount}\n` +
        `✅ *Successful:* ${successCount}\n` +
        `ℹ️ *Already in requested state:* ${alreadyCount}\n` +
        `❌ *Failed:* ${failureCount}`
    );
}

function escapeHtmlText(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

async function telegramFeatureCall(method, payload) {
    const result = await telegramRawApi(method, payload);
    if (!result || !result.ok) {
        throw new Error(result?.description || `${method} failed`);
    }
    return result.result;
}

function sendFeatureNotice(chatId, caption) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: 'Markdown',
        reply_markup: waChannelBtn
    }).catch(() => EsTeams.sendMessage(chatId, caption, {
        parse_mode: 'Markdown',
        reply_markup: waChannelBtn
    }));
}

async function handleNewTelegramCommand(msg, command, text = '') {
    const chatId = msg.chat.id;
    if (isLockedFor(msg.from.id)) return newCmdLocked(chatId);

    if (command === 'gpin' || command === 'gunpin') {
        return applyGlobalBroadcastPin(msg, command === 'gpin' ? 'pin' : 'unpin');
    }

    if (command === 'ephemeral') {
        if (!text) return sendFeatureNotice(chatId, 'Usage: /ephemeral <message>\n\nIn a group, this sends a private response visible only to you.');
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
            return sendFeatureNotice(chatId, 'Ephemeral replies are intended for group and supergroup chats.');
        }
        try {
            await telegramFeatureCall('sendMessage', {
                chat_id: chatId,
                text,
                ephemeral_message_parameters: { receiver_user_id: msg.from.id }
            });
        } catch (err) {
            console.error('EPHEMERAL ERROR:', err.message);
            await sendFeatureNotice(chatId, `Unable to send an ephemeral reply. The bot may need administrator permission.\n\n${err.message}`).catch(() => {});
        }
        return;
    }

    if (command === 'rich') {
        if (!text) return sendFeatureNotice(chatId, 'Usage: /rich <message>\n\nExample: /rich Welcome to ES TEAMS');
        try {
            await telegramFeatureCall('sendRichMessage', {
                chat_id: chatId,
                rich_message: { html: `<b>ES TEAMS Rich Message</b>\n\n${escapeHtmlText(text)}` },
                reply_markup: waChannelBtn
            });
        } catch (err) {
            console.error('RICH MESSAGE ERROR:', err.message);
            await sendFeatureNotice(chatId, `ES TEAMS Rich Message\n\n${text}`).catch(() => {});
        }
        return;
    }

    if (command === 'draft') {
        if (!text) return sendFeatureNotice(chatId, 'Usage: /draft <message>\n\nDraft streaming is available in private chats.');
        if (msg.chat.type !== 'private') return sendFeatureNotice(chatId, 'Message drafts can only be streamed in private chats.');
        const draftId = Math.floor(Math.random() * 2147483646) + 1;
        try {
            const chunks = [];
            for (let i = 1; i <= text.length; i += Math.max(1, Math.ceil(text.length / 8))) chunks.push(text.slice(0, i));
            for (const chunk of chunks) {
                await telegramFeatureCall('sendMessageDraft', {
                    chat_id: chatId,
                    draft_id: draftId,
                    text: chunk,
                    can_stop: true,
                    keep_on_stop: true
                });
                await new Promise(resolve => setTimeout(resolve, 120));
            }
            await EsTeams.sendMessage(chatId, text, { reply_markup: waChannelBtn });
        } catch (err) {
            console.error('MESSAGE DRAFT ERROR:', err.message);
            await EsTeams.sendMessage(chatId, text, { reply_markup: waChannelBtn }).catch(() => {});
        }
    }
}

EsTeams.on('message', async (msg) => {
    const commandMatch = String(msg.text || '').match(/^\/(gpin|gunpin|ephemeral|rich|draft)(?:@[\w_]+)?(?:\s+([\s\S]+))?\s*$/i);
    if (!commandMatch) return;
    try {
        await handleNewTelegramCommand(msg, commandMatch[1].toLowerCase(), commandMatch[2]?.trim() || '');
    } catch (err) {
        console.error('NEW TELEGRAM COMMAND ERROR:', err);
        await EsTeams.sendMessage(msg.chat.id, '⚠️ The command failed unexpectedly. Please try again.').catch(() => {});
    }
});

// Bot API 10.3: user pressed the stop button on a message draft.
EsTeams.on('stopped_message_generation', async (update) => {
    try {
        const chatId = update?.chat?.id || update?.message?.chat?.id;
        if (chatId) {
            await EsTeams.sendMessage(chatId, 'Generation stopped.', { reply_markup: waChannelBtn });
        }
    } catch (err) {
        console.error('STOPPED GENERATION ERROR:', err.message);
    }
});

// Bot API 10.2: subscription status updates.
EsTeams.on('subscription', (update) => {
    try {
        console.log('Telegram subscription update:', JSON.stringify(update));
    } catch (err) {
        console.error('SUBSCRIPTION UPDATE ERROR:', err.message);
    }
});
