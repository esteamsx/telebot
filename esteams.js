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
const EsTeams = tokens.map(token => new TelegramBot(token, { polling: true }));
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const startTime = Date.now();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const adminId = 5523737392;
const channelId = -1003410474720; 
const REACTION_COOLDOWN = 30000; 
const groupId = -1002408064092;
let LOCK_BOT = false;

//============= BOT ERROR HANDLER ==============//
EsTeams.forEach(bot => {
  bot.on('polling_error', (err) => {
    if (err.code === 'ETELEGRAM' && err.message.includes('409')) {
      setTimeout(() => process.exit(0), 1000);
    } else {
      console.error('❌ [polling_error]', err);
    }
  });
});

//================= FILES =================//
const TIMER_FILE = "ES_TEAMS-MEDIA/ctimer.json";
const WELCOME_FILE = 'ES_TEAMS-MEDIA/welcome_settings.json';
const ANTILINK_FILE = './ES_TEAMS-MEDIA/antilink.json';
const CHATBOT_FILE = './ES_TEAMS-MEDIA/chatbot.json';
const CHATBOT_MEMORY_FILE = './ES_TEAMS-MEDIA/chatbot_memory.json';
const START_TIME_FILE = 'ES_TEAMS-MEDIA/start_time.json';
const TTT_FILE = './ES_TEAMS-MEDIA/ttt.json';
const botImageUrl = 'https://files.catbox.moe/3jibot.jpg';
const SITE_BASE = 'https://bot-connect.emmyhenztech.site';
const USERNAME = 'peterchuks';
const PASSWORD = 'Password';
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
const sessionsLogo2 = {};
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
const sessions = {}; 
const receiptSteps = {}; 
const tradeSessions = {}; 
const memoryUsed = {}; 
const tttGames = {};
const xoMemory = {};
const tttLobbies = {};
const airtimeSessions = {}; 
const pinLocks = {};
const ccgenSessions = {};
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

//============ SUPPRESS EXCESSIVE LOGGING ============//
console.error = function(...args) {
  if (args[0]?.includes?.('Error') || args[0]?.code === 429) {
    process.stderr.write(`${args.join(' ')}\n`);
  }
};

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

async function getToken(forceRefresh = false) {
  if (!forceRefresh && cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const res = await axios.post(`${SITE_BASE}/api/login`, {
      username: USERNAME,
      password: PASSWORD
    });

    if (res.data.success) {
      cachedToken = res.data.token;
      tokenExpiry = Date.now() + (12 * 60 * 60 * 1000); 
      console.log('✅ Login successful, token cached for 12 hours');
      return cachedToken;
    } else {
      throw new Error('Login failed: ' + (res.data.error || 'Unknown error'));
    }
  } catch (err) {
    console.error('❌ Login error:', err.message);
    throw err;
  }
}

// ========== CHANNEL REACT STATUS FUNCTION ======= //
async function sendChannelReact(link, emoji = null) {
  try {
    let token = await getToken();

    console.log("🔑 Using token:", token);

    const payload = {
      link: link,
      emoji: emoji,
      random: !emoji
    };

    console.log("📤 Sending request:", payload);

    try {
      const res = await axios.post(`${SITE_BASE}/api/channel-react`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        timeout: 30000
      });

      console.log("✅ Response:", res.data);

      if (res.data.success) {
        return {
          success: true,
          message: "✅ Done!",
          emojisUsed: res.data.emojisUsed,
          coinsLeft: res.data.coinsLeft
        };
      } else {
        return {
          success: false,
          message: `❌ Error: ${res.data.error}`
        };
      }

    } catch (err) {
      if (err.response?.status === 401) {
        console.log("⚠️ Token expired, refreshing...");

        token = await getToken(true);

        console.log("🔑 New token:", token);

        const retryRes = await axios.post(`${SITE_BASE}/api/channel-react`, payload, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
          },
          timeout: 30000
        });

        console.log("✅ Retry Response:", retryRes.data);

        if (retryRes.data.success) {
          return {
            success: true,
            message: "✅ Done!",
            emojisUsed: retryRes.data.emojisUsed,
            coinsLeft: retryRes.data.coinsLeft
          };
        } else {
          return {
            success: false,
            message: `❌ Error: ${retryRes.data.error}`
          };
        }
      }

      throw err;
    }

  } catch (err) {
    console.error("========== CHANNEL REACT ERROR ==========");
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);
    console.error("Headers:", err.response?.headers);
    console.error("Message:", err.message);
    console.error("=========================================");

    return {
      success: false,
      message: `❌ Request failed: ${err.message}`
    };
  }
}

//========== GENERATED COINS FUNCTIONS ==========//
async function getTotalCoinsFromAllAccounts() {
  try {
    const coinsRef = doc(db, "generatedCoins", "stats");
    const snapshot = await getDoc(coinsRef);

    if (!snapshot.exists()) {
      await setDoc(coinsRef, {
        totalCoins: 0,
        updatedAt: Date.now()
      });
      return 0;
    }

    return Number(snapshot.data().totalCoins) || 0;
  } catch (err) {
    console.error("❌ Error getting total coins:", err.message);
    return 0;
  }
}

async function addGeneratedCoins(coins) {
  try {
    coins = Number(coins) || 0;

    if (coins <= 0) return false;

    const coinsRef = doc(db, "generatedCoins", "stats");
    const snapshot = await getDoc(coinsRef);

    if (!snapshot.exists()) {
      await setDoc(coinsRef, {
        totalCoins: coins,
        updatedAt: Date.now()
      });
    } else {
      const currentCoins = Number(snapshot.data().totalCoins) || 0;

      await updateDoc(coinsRef, {
        totalCoins: currentCoins + coins,
        updatedAt: Date.now()
      });
    }

    console.log(`💎 Added ${coins} generated coins`);
    return true;
  } catch (err) {
    console.error("❌ Error updating total coins:", err.message);
    return false;
  }
}

//========== WAREACT COOLDOWN FUNCTIONS ==========//
const WAREACT_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

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

//=============== GENERATED ACCOUNTS  ================//
async function getGeneratedAccounts() {
  try {
    const ref = doc(db, "generatedAccounts", "list");
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return [];
    return snapshot.data().accounts || [];
  } catch (err) {
    console.error("❌ Error getting generated accounts:", err.message);
    return [];
  }
}

// ============ CREATE ACCT. FUNCTION ========= //
async function registerNewAccount() {
  const username = `es_${crypto.randomBytes(4).toString("hex")}`;
  const password = crypto.randomBytes(6).toString("hex");

  const email = `${username}@gmail.com`;

  try {
    const res = await axios.post(
      `${SITE_BASE}/api/register`,
      {
        username,
        email,
        password,
        referralCode: null
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    if (!res.data.success) {
      return {
        success: false,
        error: res.data.error || "Registration failed"
      };
    }

    const ref = doc(db, "generatedAccounts", "list");
    const snapshot = await getDoc(ref);

    const newAccount = {
      username,
      password,
      email,
      createdAt: Date.now()
    };

    if (!snapshot.exists()) {
      await setDoc(ref, {
        accounts: [newAccount]
      });
    } else {
      await updateDoc(ref, {
        accounts: arrayUnion(newAccount)
      });
    }

    console.log(`✅ Generated account: ${username}`);

    return {
      success: true,
      username,
      password,
      email
    };
  } catch (err) {
    console.error(
      "❌ Registration failed:",
      err.response?.data || err.message
    );

    return {
      success: false,
      error: err.response?.data?.error || err.message
    };
  }
}

// ============ CLAIM DAILY COINS FUNCTION ========= //
async function claimCoinsFromAccount(username, password) {
  try {
    // Login
    const loginRes = await axios.post(`${SITE_BASE}/api/login`, {
      username,
      password
    });

    if (!loginRes.data.success) {
      return {
        success: false,
        error: loginRes.data.error || "Login failed"
      };
    }

    const token = loginRes.data.token;

    // Claim daily coin
    const claimRes = await axios.post(
      `${SITE_BASE}/api/claim-coin`,
      {},
      {
        headers: {
          "x-auth-token": token
        },
        timeout: 30000
      }
    );

    if (claimRes.data.success) {
      return {
        success: true,
        coinsClaimed:
          Number(
            claimRes.data.coinsClaimed ??
            claimRes.data.coin ??
            claimRes.data.coins ??
            1
          )
      };
    }

    return {
      success: false,
      error: claimRes.data.error || "Claim failed"
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || err.message
    };
  }
}

// ============ ACCT BALANCE FUNCTION ========= //
async function getAccountBalance() {
  try {
    const token = await getToken();
    const res = await axios.get(`${SITE_BASE}/api/balance`, {
      headers: { 'x-auth-token': token },
      timeout: 30000
    });
    return res.data.balance ?? res.data.coins ?? 0;
  } catch (err) {
    console.error('❌ Error getting account balance:', err.message);
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

// ============ CROW JOB FUNCTION ========= //
cron.schedule('0 */12 * * *', async () => {
  console.log('⏰ 12-hour interval triggered - Creating new account...');
  try {
    const result = await registerNewAccount();
    if (result.success) {
      console.log(`✅ New account created automatically: ${result.username}`);
    } else {
      console.log(`❌ Failed to create account: ${result.error}`);
    }
  } catch (err) {
    console.error('❌ Error in 12-hour cron job:', err.message);
  }
});

cron.schedule('0 0 * * *', async () => {
  console.log('⏰ 24-hour interval triggered - Claiming coins from all accounts...');
  try {
    const accounts = await getGeneratedAccounts();
    console.log(`📊 Processing ${accounts.length} accounts for coin claim...`);
    
    for (const account of accounts) {
      const claimResult = await claimCoinsFromAccount(account.username, account.password);
      if (claimResult.success) {
  console.log(`✅ Claimed ${claimResult.coinsClaimed} coins from ${account.username}`);

  await addGeneratedCoins(claimResult.coinsClaimed || 0);
      } else {
        console.log(`⚠️ Could not claim coins from ${account.username}: ${claimResult.error}`);
      }
      // Small delay betwe
      await new Promise(r => setTimeout(r, 2000));
    }
    
    const totalCoins = await getTotalCoinsFromAllAccounts();
    console.log(`💎 Total coins available: ${totalCoins}`);
  } catch (err) {
    console.error('❌ Error in 24-hour cron job:', err.message);
  }
});

//============ SERVER HEALTH CHECK =================//
async function checkServerHealth() {
  try {
    const res = await axios.post(`${SITE_BASE}/api/login`, {
      username: USERNAME,
      password: PASSWORD
    }, { 
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

    const sentMessage = await EsTeams[0].sendPhoto(channelId, botImageUrl, {
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
      await EsTeams[0].forwardMessage(
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

    await EsTeams[0].sendPhoto(adminId, botImageUrl, {
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

          const sentMsg = await EsTeams[0].sendPhoto(channelId, photoToSend, {
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

EsTeams.forEach((EsTeams, esteams) => {
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

    EsTeams.sendPhoto(chatId, imageUrl, {
        caption: messages.mainMenu + messages.ownerMenu + messages.userMenu,
        parse_mode: 'Markdown',
        reply_markup: mainMenu.reply_markup
    });

    EsTeams.on("callback_query", (query) => {
    const data = query.data;
    const messageId = query.message.message_id;
    const userId = query.from.id;  

        if (data === "open_menu") {
            
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

            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.userMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: expandedMenu.reply_markup
            });
        } else if (data === "close_menu") {
            
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.userMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
        } else if (data === "canva_menu") {
            
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.canvaMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
      } else if (data === "stalk_menu") {
            
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.stalkMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
     } else if (data === "game_menu") {
            
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.gameMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
        } else if (data === "scrape_menu") {
            
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.scrapeMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
        } else if (data === "media_menu") {
        
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.mediaMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: downloadMenu.reply_markup
            });
            } else if (data === "vtu_menu") {
        
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.vtuMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: downloadMenu.reply_markup
            });
        } else if (data === "tools_menu") {
        
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.toolsMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: downloadMenu.reply_markup
            });
         } else if (data === "group_menu") {
             
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.groupMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: groupMenu.reply_markup
            });
           } else if (data === "religion_menu") {
               
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.religionMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: groupMenu.reply_markup
            });
          } else if (data === "mail_menu") {
              
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.mailMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
            } else if (data === "rentbot_menu") {
            
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.rentbotMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
             } else if (data === "crypto_menu") {
                
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.cryptoMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: mainMenu.reply_markup
            });
         } else if (data === "other_menu") {
             
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
  
            EsTeams.editMessageCaption(messages.mainMenu + messages.ownerMenu + messages.aiMenu, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: "Markdown",
                reply_markup: groupMenu.reply_markup
            });
        } else if (data === "end_menu") {
         
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
  
            EsTeams.sendMessage(query.from.id, { parse_mode: "Markdown" });
        }
    }); 
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
        const apiUrl = `https://apis.davidcyril.name.ng/twitter?url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success || !data.video_hd) {
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
        const videoResponse = await fetch(data.video_hd);
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

    const lyricsUrl = `https://apis.davidcyril.name.ng/lyrics2?t=${encodeURIComponent(title)}&a=${encodeURIComponent(artist)}`;
    const lyricsRes = await axios.get(lyricsUrl, { timeout: 15000 }).catch(() => null);

    await EsTeams.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    if (!lyricsRes?.data?.lyrics) {
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `⚠️ Lyrics not found\n\nPlease try again!.`,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: waButton }
      });
    }

    const fullLyrics = String(lyricsRes.data.lyrics).trim();
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

    const apiUrl = `https://apis.davidcyril.name.ng/generate/book?text=${encodeURIComponent(inputText)}&size=30`;
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

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch image from API.");

        const stream = fs.createWriteStream(savePath);
        await new Promise((resolve, reject) => {
            res.body.pipe(stream);
            res.body.on("error", reject);
            stream.on("finish", resolve);
        });

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

    const response = await axios.get(
      `https://apis.davidcyril.name.ng/download/tiktokv3?url=${encodeURIComponent(url)}`
    );

    const data = response.data;

    if (!data.success || !data.video)
      throw new Error('Video download link not found.');

    const videoUrl = data.video;
    const audioUrl = data.audio;
    const author = data.author || "Unknown";
    const description = data.description || "No description";

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

    const audioResponse = await axios.get(audioUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.tiktok.com/',
        'Accept': 'audio/mpeg',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const audioBuffer = Buffer.from(audioResponse.data);
    const audioPath = `./temp_audio_${Date.now()}.m4a`;
    const outputPath = `./tiktok_audio_${Date.now()}.mp3`;

    fs.writeFileSync(audioPath, audioBuffer);

    await new Promise((resolve, reject) => {
      ffmpeg(audioPath)
        .toFormat('mp3')
        .audioCodec('libmp3lame')
        .audioBitrate('128k')
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

    const audioDownloadURL = uploadRes.data.data.downloadPage;

    await EsTeams.sendVideo(chatId, videoBuffer, {
      caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗧𝗜𝗞𝗧𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*

👤 *Author:* ${author}

📝 *Description:* ${description}

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎵 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗔𝗨𝗗𝗜𝗢", url: audioDownloadURL }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(audioPath);
    fs.unlinkSync(outputPath);

  } catch (err) {
    try { await EsTeams.deleteMessage(chatId, loading.message_id); } catch {}

    await EsTeams.sendMessage(chatId, `❌ Failed to process TikTok video.\n\n${err.message}`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗧 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
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
    const formattedPrompt = encodeURIComponent(prompt.trim().replace(/\s+/g, '+'));
    const apiUrl = `https://apis.davidcyril.name.ng/flux?prompt=${formattedPrompt}`;

    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Referer": "https://apis.davidcyril.name.ng/"
      }
    });

    const contentType = response.headers['content-type'];
    if (!contentType.startsWith('image/')) {
      throw new Error("Invalid image received");
    }

    const fileExt = contentType.split('/')[1];
    const imagePath = `ES_TEAMS-MEDIA/image/${chatId}_flux.${fileExt}`;
    fs.writeFileSync(imagePath, response.data);

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
    const imageUrl = `https://apis.davidcyril.name.ng/ssweb?url=${encodeURIComponent(input)}&device=tablet`;

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://apis.davidcyril.name.ng"
      }
    });

    const imagePath = `ES_TEAMS-MEDIA/image/${chatId}_ssweb.jpg`;
    fs.writeFileSync(imagePath, Buffer.from(response.data));

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

    const removeBGUrl = `https://apis.davidcyril.name.ng/removebg?url=${encodeURIComponent(imageURL)}`;
    const removed = await axios.get(removeBGUrl, { responseType: "arraybuffer" });

    const outputImagePath = `ES_TEAMS-MEDIA/image/${userId}_nobg.png`;
    fs.writeFileSync(outputImagePath, removed.data);

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

  const qrApi = `https://apis.davidcyril.name.ng/tools/qrcode?text=${encodeURIComponent(input)}`;
const waitingMsg = await EsTeams.sendMessage(chatId, "Processing Qr. Please hold on...");

  try {
    const res = await axios.get(qrApi, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://apis.davidcyril.name.ng/",
        "Accept": "image/png,image/*"
      }
    });

    fs.writeFileSync(imagePath, res.data);

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
    const apiUrl = `https://apis.davidcyril.name.ng/tinyurl?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const short = response.data.shortened_url;

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
    const apiUrl = `https://apis.davidcyril.name.ng/weather?city=${encodeURIComponent(city)}`;
    const response = await axios.get(apiUrl);
    const data = response.data.data;

    const weatherReport = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗗𝗜𝗦𝗣𝗟𝗔𝗬

Location: ${data.location}, ${data.country}
Weather: ${data.weather}
Description: ${data.description}
Temperature: ${data.temperature}
Feels Like: ${data.feels_like}
Pressure: ${data.pressure}
Humidity: ${data.humidity}
Wind Speed: ${data.wind_speed}
Coordinates: Latitude ${data.coordinates.latitude}, Longitude ${data.coordinates.longitude}

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
        const apiUrl = "https://apis.davidcyril.name.ng/temp-mail";
        const res = await axios.get(apiUrl);
        const data = res.data;

        const output =
`𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟

⏳ Expires At: ${data.expires_at}

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
                            copy_text: { text: data.session_id }
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
    const apiUrl = `https://apis.davidcyril.name.ng/temp-mail/inbox?id=${sessionId}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data.success || !data.messages || data.messages.length === 0) {
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

    for (let i = 0; i < data.messages.length; i++) {
      const mail = data.messages[i];
      const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗠𝗔𝗜𝗟 𝗜𝗡𝗕𝗢𝗫

Mail ${i + 1}:
From: ${mail.fromAddr}
To: ${mail.toAddr}
Subject: ${mail.headerSubject}
Text: ${mail.text}

𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛`;

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬇️ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗔𝗧𝗧𝗔𝗖𝗛𝗠𝗘𝗡𝗧", url: mail.downloadUrl }],
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
    const encoded = encodeURIComponent(passage);
    const apiUrl = `https://apis.davidcyril.name.ng/bible?reference=${encoded}`;
    const response = await axios.get(apiUrl);
    const result = response.data;

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    if (!result.success || !result.text) {
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
    const apiUrl = `https://apis.davidcyril.name.ng/quran?surah=${surahNumber}`;
    const response = await axios.get(apiUrl);
    const result = response.data;

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    if (!result.success || !result.surah) {
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

    const surah = result.surah;

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗤𝗨𝗥𝗔𝗡 𝗥𝗘𝗔𝗗𝗘𝗥

𝐒𝐮𝐫𝐚𝐡: ${surah.name.english} (${surah.name.arabic})
𝐀𝐲𝐚𝐡𝐬: ${surah.ayahCount}
𝐓𝐲𝐩𝐞: ${surah.type}

𝐓𝐚𝐟𝐬𝐢𝐫:
${surah.tafsir.id}

𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎧 𝗠𝗣3 𝗥𝗘𝗖𝗜𝗧𝗔𝗧𝗜𝗢𝗡", url: surah.recitation }],
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

//BROADCAST COMMAND
EsTeams.onText(/\/broadcast(?:\s+(.+))?/, async (msg, match) => {
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

        // ✅ Correct API URL and param
        const apiUrl = `https://apis.davidcyril.name.ng/ai/gpt4omini?text=${encodeURIComponent(query)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success || !data.response) {
            throw new Error("Invalid AI response");
        }

        const caption = `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗔𝗜*\n\n*Response:*\n${data.response}\n\n*𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦*`;

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
    const apiRes = await fetch(`https://apis.davidcyril.name.ng/facebook?url=${encodeURIComponent(url)}&apikey=`);
    const json = await apiRes.json();

    const downloads = json?.result?.downloads;
    if (!downloads || (!downloads.hd?.url && !downloads.sd?.url)) {
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

    const videoUrl = downloads.hd?.url || downloads.sd?.url;
    if (!videoUrl) {
      return EsTeams.editMessageText("⚠️ No downloadable video found.", {
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

    const res = await axios.get(
      `https://apis.davidcyril.name.ng/instagram?url=${encodeURIComponent(url)}`
    );

    const videoUrl = res.data?.result?.video;

    if (!res.data.success || !videoUrl)
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
      const totalUsers = users.length;

      const caption = `
📊 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗨𝗦𝗘𝗥 𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘*

👥 Total Registered Users: *${totalUsers}*

✅ Database synced successfully.

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ
`;

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔁 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "users_refresh" }],
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
      const totalUsers = users.length;

      const caption = `
📊 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗨𝗦𝗘𝗥 𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘*

👥 Total Registered Users: *${totalUsers}*

✅ Database refreshed successfully.

ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ
`;

      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔁 𝗥𝗘𝗙𝗥𝗘𝗦𝗛", callback_data: "users_refresh" }],
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
      console.error("Users refresh error:", err.message);
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
  archive.append(fs.createReadStream('esteamsv1.json'), { name: 'esteamsv1.json' });
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
    console.error(err);
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

//XVIDEO  DOWNLOADER
EsTeams.onText(/\/xsearch(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const isPremium = premiumUsers.includes(userId);
  const query = match[1];

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

  if (!query) {
    return EsTeams.sendMessage(chatId, "❌ Invalid Input\n\nPlease use /xsearch <search term>.", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const wait = await EsTeams.sendMessage(chatId, "Searching for your X Video. Please hold on...");

  try {
    const api = await axios.get(`https://apis.davidcyril.name.ng/search/xvideo?text=${encodeURIComponent(query)}`);
    const result = api.data.result;

    if (!result || result.length === 0) {
      await EsTeams.deleteMessage(chatId, wait.message_id);
      return EsTeams.sendMessage(chatId, "❌ No video found for your search.", {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    const random = result[Math.floor(Math.random() * result.length)];
    const title = random.title || "ES TEAMS XVIDEO";
    const duration = random.duration || "Unknown";
    const quality = random.quality || "Unknown";
    const thumbnail = random.thumbnail || "https://i.ibb.co/SwL0Xmw/ES-TEAMS-TELEBOT.jpg";
    const url = random.url;

    await EsTeams.deleteMessage(chatId, wait.message_id);

    await EsTeams.sendPhoto(chatId, thumbnail, {
      caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗫𝗩𝗜𝗗𝗘𝗢 𝗦𝗘𝗔𝗥𝗖𝗛\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Quality:* ${quality}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "▶️ 𝗪𝗔𝗧𝗖𝗛 𝗩𝗜𝗗𝗘𝗢", url: url }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

  } catch (err) {
    console.error("XVIDEO ERROR:", err.message);
    await EsTeams.deleteMessage(chatId, wait.message_id);

    EsTeams.sendMessage(chatId, "⚠️ Failed to process the video. Try again later.", {
      parse_mode: "Markdown",
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

    const response = await fetch("https://apis.davidcyril.name.ng/random/technews");
    const data = await response.json();

    if (!data.status || !data.result) {
      await EsTeams.deleteMessage(chatId, techMessage.message_id);

      return EsTeams.sendMessage(chatId, "❌ Failed to fetch Tech News. Please try again later.", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    const { title, link, image, description } = data.result;

    const descSentences = description.split('. ').slice(0, 2).join('. ') + '.';

    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗧𝗘𝗖𝗛 𝗡𝗘𝗪𝗦\n\n𝗧𝗶𝘁𝗹𝗲:*${title}*\n\n${descSentences}\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🌐 𝗩𝗜𝗘𝗪 𝗔𝗥𝗧𝗜𝗖𝗟𝗘", url: link }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      },
      parse_mode: "Markdown"
    };

    await EsTeams.deleteMessage(chatId, techMessage.message_id);

    return EsTeams.sendPhoto(chatId, image, {
      caption,
      ...buttons
    });

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

//SPOTIFY COMMAND
EsTeams.onText(/^\/spotify(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const spotifyUrl = match[1];

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

  if (!spotifyUrl || !spotifyUrl.startsWith("https://open.spotify.com/track/")) {
    return EsTeams.sendMessage(chatId, "❌ *Invalid Command*\n\nPlease use /spotify <Spotify URL>", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  try {
    const processingMessage = await EsTeams.sendMessage(chatId, "🔄 *Processing your Spotify Track...*", { parse_mode: "Markdown" });

    const response = await fetch(`https://apis.davidcyril.name.ng/spotifydl?url=${encodeURIComponent(spotifyUrl)}`);
    const data = await response.json();

    await EsTeams.deleteMessage(chatId, processingMessage.message_id);

    if (!data || !data.success) {
      return EsTeams.sendMessage(chatId, "❌ Failed to process Spotify track. Please try again later.", {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
    }

    const { title, duration, channel, thumbnail, DownloadLink } = data;

    const caption = `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗦𝗣𝗢𝗧𝗜𝗙𝗬 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n\n𝗧𝗶𝘁𝗹𝗲: *${title}*\n𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: *${duration}*\n𝗔𝘂𝘁𝗵𝗼𝗿: *${channel}*\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`;

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎵 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗡𝗢𝗪", url: DownloadLink }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      },
      parse_mode: "Markdown"
    };

    return EsTeams.sendPhoto(chatId, thumbnail, {
      caption,
      ...buttons
    });

  } catch (err) {
    console.error(err.message);
    return EsTeams.sendMessage(chatId, "❌ Failed to process Spotify track. Please try again later.", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//CCGEN COMMAND
EsTeams.onText(/^\/ccgen$/i, async (msg) => {
  const chatId = msg.chat.id;

  // Set session and auto-select MasterCard
  ccgenSessions[chatId] = { step: "awaiting_amount", msgIds: [], type: "MasterCard" };

  const res = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: `✅ *MasterCard selected!*\n\nPlease enter the amount of cards to generate.\n\nℹ️ *Input only:* \`5\` or \`10\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_ccgen" }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  ccgenSessions[chatId].msgIds.push(res.message_id);
});

EsTeams.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  if (!text || !ccgenSessions[chatId]) return;

  const session = ccgenSessions[chatId];
  session.msgIds.push(msg.message_id);

  if (session.step === "awaiting_amount") {
    const amount = parseInt(text, 10);
    if (amount !== 5 && amount !== 10) {
      const err = await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "❌ Invalid amount.\n\nPlease enter *5* or *10* only.",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_ccgen" }],
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });
      session.msgIds.push(err.message_id);
      return;
    }

    // Show generating message
    const loading = await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "🔄 Generating cards... Please wait",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_ccgen" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    session.msgIds.push(loading.message_id);

    try {
      const res = await fetch(
        `https://apis.davidcyril.name.ng/tools/ccgen?type=${encodeURIComponent(session.type)}&amount=${amount}`
      );

      const data = await res.json();
      if (!data.status || !data.cards) throw new Error("API error");

      let caption = `💳 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗖𝗚𝗘𝗡 𝗥𝗘𝗦𝗨𝗟𝗧 (${session.type})*\n\n`;
      for (const card of data.cards) {
        caption += `👤 *𝗡𝗮𝗺𝗲:* ${card.name}\n💳 *𝗖𝗮𝗿𝗱:* \`${card.number}\`\n🔐 *𝗖𝗩𝗩:* \`${card.cvv}\`\n📅 *𝗘𝘅𝗽𝗶𝗿𝘆:* \`${card.expiry}\`\n\n`;
      }
      caption += "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ";

      // Delete all temp messages
      for (let id of session.msgIds) {
        try { await EsTeams.deleteMessage(chatId, id); } catch {}
      }

      delete ccgenSessions[chatId];
      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });

    } catch (e) {
      await EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: "❌ Error generating cards. Please try again later.",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
          ]
        }
      });

      delete ccgenSessions[chatId];
    }
  }
});

EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;

  if (query.data === "cancel_ccgen" && ccgenSessions[chatId]) {
    const session = ccgenSessions[chatId];
    for (let id of session.msgIds) {
      try { await EsTeams.deleteMessage(chatId, id); } catch {}
    }

    await EsTeams.deleteMessage(chatId, msgId).catch(() => {});
    delete ccgenSessions[chatId];

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗖𝗖 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥\n\n𝗦𝘁𝗮𝘁𝘂𝘀: Cancelled",
      parse_mode: "Markdown",
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
    const apiUrl = `https://apis.davidcyril.name.ng/canvas/fakewa?name=${encodeURIComponent(name.trim())}&number=${encodeURIComponent(number)}&status=${encodeURIComponent(status)}`;
    
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
      url: apiUrl,
      method: "GET",
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://www.google.com/",
        "Accept": "*/*"
      }
    });
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

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

//WHATSAPP CHANNEL STALK COMMAND 
EsTeams.onText(/\/wastalk(?: (.+))?/, async (msg, match) => {
  let chatId = msg.chat.id;
  let url = match[1];

  if (LOCK_BOT && !CONFIG.OWNER_IDS.includes(msg.from.id)) {
    return EsTeams.sendMessage(chatId, "❌ *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗦 𝗟𝗢𝗖𝗞𝗘𝗗*\n\nKindly Check back later ...", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]
      }
    });
  }

  if (!url || !url.includes("whatsapp.com/channel/")) {
    return EsTeams.sendMessage(chatId, "❌ Invalid Input\n\nPlease use /wastalk <WhatsApp Channel URL>", {
      reply_markup: {
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]
      }
    });
  }

  let waitMsg = await EsTeams.sendMessage(chatId, "⏳ Processing info please wait...", {
    reply_markup: {
      inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]
    }
  });

  try {
    let response = await axios.get(`https://apis.davidcyril.name.ng/stalk/wa?url=${encodeURIComponent(url)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json",
        "Referer": "https://www.google.com"
      },
      httpsAgent: new (await import('https')).Agent({ rejectUnauthorized: false }),
      timeout: 10000
    });

    let data = response.data;

    if (!data || !data.title || !data.followers || !data.followersCount) {
      throw new Error("Incomplete data received");
    }

    let caption = `*𝐄𝐒 𝐓𝐄𝐀𝐌𝐒 𝐕𝟏 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐒𝐓𝐀𝐋𝐊𝐄𝐑*\n\n` +
                  `*Channel Name:* ${data.title}\n` +
                  `*Followers:* ${data.followers}\n` +
                  `*Number:* ${data.followersCount}\n` +
                  `*Description:*\n${data.description}\n\n` +
                  `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ*`;

    await EsTeams.deleteMessage(chatId, waitMsg.message_id);

    // ✅ Use the local image path here
    await EsTeams.sendPhoto(chatId, "ES_TEAMS-MEDIA/image/ES_TEAMS.jpg", {
      caption,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]
      }
    });

  } catch (err) {
    console.error("❌ WAStalk Error:", err.message || err);

    try { await EsTeams.deleteMessage(chatId, waitMsg.message_id); } catch {}

    await EsTeams.sendMessage(chatId, "❌ Failed to fetch channel info. Please ensure the link is valid and try again.", {
      reply_markup: {
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]
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

//JAIL COMMAND 
EsTeams.onText(/\/jail/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
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
      caption: "❌ Please *reply to an image* with `/jail`.",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  const processing = await EsTeams.sendMessage(chatId, `⛓️ Processing your image...`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  try {
    // Download photo
    const fileId = reply.photo.pop().file_id;
    const fileLink = await EsTeams.getFileLink(fileId);
    const response = await axios.get(fileLink, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const inputPath = `ES_TEAMS-MEDIA/image/${userId}.jpg`;
    fs.writeFileSync(inputPath, response.data);

    // Upload to Catbox
    const formData = new FormData();
    formData.append("fileToUpload", fs.createReadStream(inputPath));
    formData.append("reqtype", "fileupload");

    const catRes = await axios.post("https://catbox.moe/user/api.php", formData, {
      headers: formData.getHeaders()
    });

    const catboxUrl = catRes.data;
    console.log("Catbox URL:", catboxUrl);

    if (!catboxUrl.startsWith("https://files.catbox.moe")) {
      throw new Error(`Catbox upload failed: ${catboxUrl}`);
    }

    // Process with Jail API
    const jailUrl = `https://apis.davidcyril.name.ng/canvas/jail?image=${encodeURIComponent(catboxUrl)}`;
    console.log("Jail API URL:", jailUrl);

    const jailRes = await axios.get(jailUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.google.com",
        "Accept": "image/*"
      }
    });

    const outputPath = `ES_TEAMS-MEDIA/image/${userId}_jail.jpg`;
    fs.writeFileSync(outputPath, jailRes.data);

    await EsTeams.deleteMessage(chatId, processing.message_id);

    await EsTeams.sendPhoto(chatId, outputPath, {
      caption: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

  } catch (err) {
    console.error("❌ Jail command error:", err.message || err);

    if (err.response) {
      console.error("❌ API response error:", err.response.status, err.response.data);
    }

    try { await EsTeams.deleteMessage(chatId, processing.message_id); } catch {}

    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `❌ *Failed to process the image.*\n\n_Error:_ ${err.message || "Unknown error"}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
});

//LOGO1 COMMAND
EsTeams.onText(/^\/logo$/, async (msg) => {
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

  sessions[chatId] = { step: 1 };
  await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: "𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗟𝗢𝗚𝗢 𝗠𝗔𝗞𝗘𝗥\n\nPlease send a wallpaper or background picture.",
    reply_markup: {
      inline_keyboard: [
        [{ text: "⏭️ 𝗦𝗞𝗜𝗣", callback_data: "skip_bg" }],
        [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel" }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });
});

EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const session = sessions[chatId];
  if (!session) return;

  if (query.data === "cancel") {
    delete sessions[chatId];
    await EsTeams.deleteMessage(chatId, messageId);
    return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "❌ Session cancelled." });
  }

  if (query.data === "skip_bg" && session.step === 1) {
    session.bgUrl = "https://i.pinimg.com/736x/2f/9c/95/2f9c955cbc2dc6038b4d8a6f23271771.jpg";
    session.step = 2;
    await EsTeams.deleteMessage(chatId, messageId);
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗟𝗢𝗚𝗢 𝗠𝗔𝗞𝗘𝗥\n\nPlease send a header name for your logo.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⏭️ 𝗦𝗞𝗶𝗣", callback_data: "skip_name" }],
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (query.data === "skip_name" && session.step === 2) {
    session.name = "ES TEAMS TECH";
    session.step = 3;
    await EsTeams.deleteMessage(chatId, messageId);
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗟𝗢𝗚𝗢 𝗠𝗔𝗞𝗘𝗥\n\nPlease send a sub-text for your logo.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⏭️ 𝗦𝗞𝗜𝗣", callback_data: "skip_sub" }],
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (query.data === "skip_sub" && session.step === 3) {
    session.subtitle = "Testing";
    return processLogo(chatId); 
  }
});

EsTeams.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const session = sessions[chatId];
  if (!session) return;

  if (session.step === 1 && msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileUrl = await EsTeams.getFileLink(fileId);
    const imagePath = path.join(`ES_TEAMS-MEDIA/image/${chatId}_bg.jpg`);
    const resp = await fetch(fileUrl);
    const buffer = await resp.buffer();
    fs.writeFileSync(imagePath, buffer);

    const formData = new FormData();
    formData.append("fileToUpload", fs.createReadStream(imagePath));
    formData.append("reqtype", "fileupload");

    const upRes = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: formData });
    session.bgUrl = await upRes.text();
    fs.unlinkSync(imagePath);

    session.step = 2;
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗟𝗢𝗚𝗢 𝗠𝗔𝗞𝗘𝗥\n\nPlease send a header name for your logo.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⏭️ 𝗦𝗞𝗜𝗣", callback_data: "skip_name" }],
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (session.step === 2 && msg.text) {
    session.name = msg.text;
    session.step = 3;
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗟𝗢𝗚𝗢 𝗠𝗔𝗞𝗘𝗥\n\nPlease send a sub-text for your logo.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⏭️ 𝗦𝗞𝗜𝗣", callback_data: "skip_sub" }],
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (session.step === 3 && msg.text) {
    session.subtitle = msg.text;
    return processLogo(chatId);
  }
});

async function processLogo(chatId) {
  const session = sessions[chatId];
  if (!session) return;

  const processMsg = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: "🖼️ Processing your logo, please hold on...",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  try {
    const apiUrl = `https://apis.davidcyril.name.ng/canvas/quote?image=${encodeURIComponent(
      session.bgUrl
    )}&text=${encodeURIComponent(
      session.name
    )}&font=Times%20New%20Roman&name=${encodeURIComponent(
      session.subtitle
    )}`;

    const resp = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://apis.davidcyril.name.ng",
        Accept: "*/*"
      }
    });

    const outPath = `ES_TEAMS-MEDIA/image/${chatId}_logo1.png`;
    fs.writeFileSync(outPath, resp.data);

    await EsTeams.deleteMessage(chatId, processMsg.message_id);
    delete sessions[chatId];

    await EsTeams.sendPhoto(chatId, outPath, {
      caption: "✅ 𝗬𝗢𝗨𝗥 𝗟𝗢𝗚𝗢 𝗜𝗦 𝗥𝗘𝗔𝗗𝗬\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(outPath);

  } catch (err) {
    await EsTeams.deleteMessage(chatId, processMsg.message_id);
    return EsTeams.sendMessage(chatId, "❌ Failed to process the logo. Please try again.", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
}

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
    const apiUrl = `https://apis.davidcyril.name.ng/tools/downloadweb?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://apis.davidcyril.name.ng"
      },
      timeout: 10000
    });

    if (response.data?.response?.downloadUrl) {
      const downloadUrl = response.data.response.downloadUrl;

      await EsTeams.deleteMessage(chatId, waitMsg.message_id);

      return EsTeams.sendPhoto(chatId, botImageUrl, {
        caption: `𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗪𝗘𝗕𝗦𝗜𝗧𝗘 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n\nStatus: Success\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗨𝗥𝗟", url: downloadUrl }],
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

//LOGO2 COMMAND
EsTeams.onText(/^\/logo2$/, async (msg) => {
  const chatId = msg.chat.id;

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

  sessionsLogo2[chatId] = { step: 1 };
  return EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: "𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗟𝗢𝗚𝗢\n\nPlease send an image to use as background.",
    reply_markup: {
      inline_keyboard: [
        [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_logo2" }],
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });
});

EsTeams.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const session2 = sessionsLogo2[chatId]; 
  if (!session2) return;

  if (session2.step === 1 && msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileUrl = await EsTeams.getFileLink(fileId);
    const imagePath = path.join(`ES_TEAMS-MEDIA/image/${chatId}_bg2_temp.jpg`);

    const resp = await fetch(fileUrl);
    const buffer = await resp.buffer();
    fs.writeFileSync(imagePath, buffer);

    const formData = new FormData();
    formData.append("fileToUpload", fs.createReadStream(imagePath));
    formData.append("reqtype", "fileupload");

    const upRes = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: formData });
    session2.bgUrl2 = await upRes.text();
    fs.unlinkSync(imagePath); 

    session2.step = 2;
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "𝗣𝗜𝗖𝗧𝗨𝗥𝗘 𝗥𝗘𝗖𝗘𝗜𝗩𝗘𝗗 ✅\n\nPlease send the text caption you’d like on your logo.",
      reply_markup: {
        inline_keyboard: [
          [{ text: "❌ 𝗖𝗔𝗡𝗖𝗘𝗟", callback_data: "cancel_logo2" }],
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }

  if (session2.step === 2 && msg.text) {
    session2.caption2 = msg.text;
    return processLogo2(chatId);
  }
});

EsTeams.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const session2 = sessionsLogo2[chatId];
  if (!session2) return;

  if (query.data === "cancel_logo2") {
    delete sessionsLogo2[chatId];
    await EsTeams.deleteMessage(chatId, messageId);
    return EsTeams.sendPhoto(chatId, botImageUrl, { caption: "❌ Session cancelled." });
  }
});

async function processLogo2(chatId) {
  const session2 = sessionsLogo2[chatId];
  if (!session2) return;

  const processMsg = await EsTeams.sendPhoto(chatId, botImageUrl, {
    caption: "🖼️ Processing your logo 2, please hold on...",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
      ]
    }
  });

  try {
    const apiUrl = `https://apis.davidcyril.name.ng/canvas/gun?image=${encodeURIComponent(
      session2.bgUrl2
    )}&text=${encodeURIComponent(session2.caption2)}`;

    const resp = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://apis.davidcyril.name.ng",
        Accept: "*/*"
      }
    });

    const outputPath = `ES_TEAMS-MEDIA/image/${chatId}_logo2_final.png`;
    fs.writeFileSync(outputPath, resp.data);

    await EsTeams.deleteMessage(chatId, processMsg.message_id);

    await EsTeams.sendPhoto(chatId, outputPath, {
      caption: "✅ 𝗬𝗢𝗨𝗥 𝗟𝗢𝗚𝗢 𝗜𝗦 𝗥𝗘𝗔𝗗𝗬\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });

    fs.unlinkSync(outputPath);

    delete sessionsLogo2[chatId]; 
  } catch (error) {
    await EsTeams.deleteMessage(chatId, processMsg.message_id);
    return EsTeams.sendMessage(chatId, "❌ Failed to process the logo. Please try again.", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]
        ]
      }
    });
  }
}

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

// WA CHANNEL COMMAND
EsTeams.onText(/^\/wachannel(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

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
    
  if (!url) {
    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: "❌ *𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗙𝗼𝗿𝗺𝗮𝘁*\n\nPlease use `/wachannel LINK`.",
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
    const res = await axios.get(`https://apis.davidcyril.name.ng/stalk/wa?url=${encodeURIComponent(url)}`);
    const data = res.data;

    const safeDescription = data.description.replace(/[_*`]/g, '');

    await EsTeams.deleteMessage(chatId, wait.message_id);

    await EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗪𝗔 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗦𝗧𝗔𝗟𝗞𝗘𝗥*\n\n*Title:* ${data.title}\n\n*Followers:* ${data.followers}\n\n*Description:* ${safeDescription}\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: url }]
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
    const res = await axios.get(`https://apis.davidcyril.name.ng/tiktokStalk?q=${encodeURIComponent(username)}`);
    const user = res.data.data.user;
    const stats = res.data.data.stats;

    await EsTeams.deleteMessage(chatId, wait.message_id);

    const caption = `👀 *𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗧𝗜𝗞𝗧𝗢𝗞 𝗦𝗧𝗔𝗟𝗞𝗘𝗥*\n\n` +
      `*Username:* ${user.uniqueId}\n` +
      `*Nickname:* ${user.nickname}\n` +
      `*Verified:* ${user.verified ? "Yes ✅" : "No ❌"}\n` +
      (user.signature ? `*Bio:* ${user.signature}\n` : "") +
      `*Followers:* ${stats.followerCount.toLocaleString()}\n` +
      `*Following:* ${stats.followingCount}\n` +
      `*Likes:* ${stats.heartCount.toLocaleString()}\n` +
      `*Videos:* ${stats.videoCount}\n` +
      `*Region:* ${user.region}\n` +
      (user.bioLink?.link ? `*Website:* ${user.bioLink.link}\n` : "") +
      `\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`;

    await EsTeams.sendPhoto(chatId, user.avatarLarger, {
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
    const res = await axios.get(`https://apis.davidcyril.name.ng/igstalk?username=${encodeURIComponent(username)}`);
    const data = res.data;

    if (waitMessage) {
      try {
        await EsTeams.deleteMessage(chatId, waitMessage.message_id);
      } catch (deleteErr) {
      }
    }

    const caption = `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩𝟭 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠 𝗦𝗧𝗔𝗟𝗞𝗘𝗥*\n\n` +
      `*Username:* ${data.usrname}\n` +
      `*Posts:* ${data.status.post}\n` +
      `*Followers:* ${data.status.follower}\n` +
      `*Following:* ${data.status.following}\n` +
      `*Bio:* ${data.desk}\n\n` +
      `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ`;

    await EsTeams.sendPhoto(chatId, data.pp, {
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

    let chatbotSettings = {};
    if (fs.existsSync(CHATBOT_FILE)) {
        chatbotSettings = JSON.parse(fs.readFileSync(CHATBOT_FILE));
    }

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

    let chatbotSettings = {};
    if (fs.existsSync(CHATBOT_FILE)) {
        chatbotSettings = JSON.parse(fs.readFileSync(CHATBOT_FILE));
    }

    if (chatbotSettings[userId] === mode) {
        return EsTeams.answerCallbackQuery(callbackQuery.id, { text: `⚠️ Chatbot is already ${mode.toUpperCase()}!` });
    }

    chatbotSettings[userId] = mode;
    fs.writeFileSync(CHATBOT_FILE, JSON.stringify(chatbotSettings, null, 2));

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

    let chatbotSettings = {};
    if (fs.existsSync(CHATBOT_FILE)) {
        chatbotSettings = JSON.parse(fs.readFileSync(CHATBOT_FILE));
    }

    if (chatbotSettings[userId] !== "on") return;

    let chatbotMemory = {};
    if (fs.existsSync(CHATBOT_MEMORY_FILE)) {
        chatbotMemory = JSON.parse(fs.readFileSync(CHATBOT_MEMORY_FILE));
    }
    if (!chatbotMemory[userId]) chatbotMemory[userId] = [];

    chatbotMemory[userId].push({ role: "user", content: text });

    // Keep last 15 messages for better memory
    if (chatbotMemory[userId].length > 15) {
        chatbotMemory[userId] = chatbotMemory[userId].slice(-15);
    }

    fs.writeFileSync(CHATBOT_MEMORY_FILE, JSON.stringify(chatbotMemory, null, 2));

    await EsTeams.sendChatAction(chatId, "typing");

    try {
        const conversation = chatbotMemory[userId].map(m => `${m.role}: ${m.content}`).join("\n");

        // ✅ Correct API endpoint and parameter
        const res = await fetch(`https://apis.davidcyril.name.ng/ai/gpt4omini?text=${encodeURIComponent(conversation)}`);
        const data = await res.json();
        const aiResponse = data.response || "⚠️ Error fetching response.";

        chatbotMemory[userId].push({ role: "bot", content: aiResponse });
        fs.writeFileSync(CHATBOT_MEMORY_FILE, JSON.stringify(chatbotMemory, null, 2));

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
            can_send_media_messages: false,
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
            can_send_media_messages: true,
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

        const apiUrl = `https://apis.davidcyril.name.ng/imgscan?url=${encodeURIComponent(catboxUrl)}`;
        const scanRes = await fetch(apiUrl);
        const data = await scanRes.json();

        if (!data.success || !data.result) throw new Error("Image scan failed");

        const caption = `*𝐄𝐒 𝐓𝐄𝐀𝐌𝐒 𝐕𝟏 𝐀𝐍𝐀𝐋𝐘𝐙𝐄𝐑*\n\n*Result:*\n${data.result}\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ ᴛᴇᴄʜ*`;

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
    const apiUrl = `https://apis.davidcyril.name.ng/download/apk?text=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.success || !data.download_link) {
      await EsTeams.deleteMessage(chatId, waitingMsg.message_id);
      return EsTeams.sendMessage(chatId, "🚫 *APK not found.* Please try another name.", { parse_mode: "Markdown" });
    }

    const { apk_name, thumbnail, download_link } = data;

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    return EsTeams.sendPhoto(chatId, botImageUrl, {
      caption: `📦App Name: ${apk_name}\n\nPlease click the button below to download the APK.`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬇️ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗔𝗣𝗞", url: download_link }],
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
    const apiUrl = `https://apis.davidcyril.name.ng/gdrive?url=${encodeURIComponent(inputUrl)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.success) {
      throw new Error("API returned failure");
    }

    // 📁 Save to file (UNCHANGED as you wanted)
    const logEntry = `
Name: ${data.name}
Size: ${data.size}
Link: ${data.download_link}
Date: ${new Date().toLocaleString()}
-----------------------------`;
    fs.appendFileSync(driveLogPath, logEntry);

    await EsTeams.deleteMessage(chatId, waitingMsg.message_id);

    const mime = data.mimeType || "";
    const fileName = data.name || "Unknown";
    const fileSize = data.size || "Unknown";
    const link = data.download_link;

    // Extract fileId for thumbnail
    const fileIdMatch = inputUrl.match(/\/d\/(.*?)\//);
    const fileId = fileIdMatch ? fileIdMatch[1] : null;

    const thumbnail = fileId
      ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
      : botImageUrl;

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
            { text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗧 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }
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
  const channelLink = match[1];  
    
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
  
  if (!CONFIG.OWNER_IDS.includes(userId)) {  
    const cooldown = await checkWareactCooldown(userId);  
  
    if (!cooldown.canUse) {  
      const timeLeft = cooldown.timeLeft;  
      const hours = Math.floor(timeLeft / (60 * 60 * 1000));  
      const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));  
  
      const paymentMsg = await EsTeams.sendPhoto(chatId, botImageUrl, {  
        caption: `*𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦*  
  
Your daily free limit has been used.  
  
Pay *1* Star to continue the service.  
  
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
  
async function processWareact(chatId, channelLink, userId) {  
  let loading = await EsTeams.sendMessage(chatId, "⏳ Processing...\n▰▱▱▱▱▱▱");  
  
  const health = await checkServerHealth();  
  
  if (!health.isHealthy) {  
    try {  
      await EsTeams.deleteMessage(chatId, loading.message_id);  
    } catch (e) {}  
  
    await EsTeams.sendPhoto(chatId, botImageUrl, {  
      caption: `⚠️ *𝗦𝗘𝗥𝗩𝗘𝗥 𝗨𝗡𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘*\n\n${health.reason}\n\nPlease try again later.`,  
      parse_mode: "Markdown",  
      reply_markup: {  
        inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]  
      }  
    });  
    return;  
  }  
  
  const steps = [  
    "▰▰▱▱▱▱▱ Logging in...",  
    "▰▰▰▱▱▱▱ Solving captcha...",  
    "▰▰▰▰▱▱▱ Waiting for ad...",  
    "▰▰▰▰▰▱▱ Sending request...",  
    "▰▰▰▰▰▰▱ Processing reactions...",  
    "▰▰▰▰▰▰▰ Completing..."  
  ];  
  
  try {  
    for (let i = 0; i < steps.length; i++) {  
      await new Promise(r => setTimeout(r, i === 2 ? 15000 : 500));  
        
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
  
    const totalGeneratedCoins = await getTotalCoinsFromAllAccounts();  
  
    const result = await sendChannelReact(channelLink);  
  
    try {  
      await EsTeams.deleteMessage(chatId, loading.message_id);  
    } catch (e) {}  
  
    if (result.success) {  
      if (userId) {  
        await saveWareactTime(userId);  
      }  
  
      const emoji = result.emojisUsed?.length  
        ? result.emojisUsed.join(" ")  
        : "👍";  
  
      const mainAccountCoins = result.coinsLeft || 0;  
      const totalCoinsAvailable = mainAccountCoins + totalGeneratedCoins;  
  
      await EsTeams.sendPhoto(chatId, botImageUrl, {  
        caption: `*✅ 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 𝗥𝗘𝗔𝗖𝗧 𝗦𝗨𝗖𝗖𝗘𝗦𝗦*  
  
😊 *Reactions Used:*  
${emoji}  
  
💎 *Coins Available:*  
\`${totalCoinsAvailable}\` (${mainAccountCoins} main + ${totalGeneratedCoins} generated)  
  
📌 *Status:*  
${result.message}  
  
🤖 *Generated Accounts:* ${(await getGeneratedAccounts()).length}  
  
_𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛_`,  
        parse_mode: "Markdown",  
        reply_markup: {  
          inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]  
        }  
      });  
    } else {  
      await EsTeams.sendPhoto(chatId, botImageUrl, {  
        caption: `❌ *𝗥𝗘𝗔𝗖𝗧 𝗙𝗔𝗜𝗟𝗘𝗗*\n\n${result.message}`,  
        parse_mode: "Markdown",  
        reply_markup: {  
          inline_keyboard: [[{ text: "📢 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟", url: "https://whatsapp.com/channel/0029VatAyCwFy72JdZXFPm29", style: "primary" }]]  
        }  
      });  
    }  
  } catch (err) {  
    console.error('Command error:', err.message);  
      
    try {  
      await EsTeams.deleteMessage(chatId, loading.message_id);  
    } catch (e) {}  
  
    await EsTeams.sendPhoto(chatId, botImageUrl, {  
      caption: `❌ *𝗘𝗥𝗥𝗢𝗥*\n\n\`${err.message}\``,  
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
          amount: 1  
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
  const userId = msg.from.id;  
  const chatId = msg.chat.id;  
    
  const pending = userPendingReactions.get(userId);  
  
  if (pending) {  
    try {  
      await EsTeams.deleteMessage(chatId, pending.paymentMsgId);  
    } catch (e) {}  
  
    userPendingReactions.delete(userId);  
    await processWareact(chatId, pending.channelLink, userId);  
  }  
});  

// ============ CREATE ACC COMMAND ========= //
EsTeams.onText(/^\/createacc$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ Admin command only!");
  }

  const loading = await EsTeams.sendMessage(chatId, "⏳ Creating account...");

  try {
    const result = await registerNewAccount();
    
    if (result.success) {
      await EsTeams.editMessageText(
        `✅ *Account Created Successfully*\n\n📝 Username: \`${result.username}\`\n🔐 Password: \`${result.password}\`\n📧 Email: \`${result.email}\``,
        {
          chat_id: chatId,
          message_id: loading.message_id,
          parse_mode: "Markdown"
        }
      );
    } else {
      await EsTeams.editMessageText(
        `❌ Account creation failed: ${result.error}`,
        {
          chat_id: chatId,
          message_id: loading.message_id,
          parse_mode: "Markdown"
        }
      );
    }
  } catch (err) {
    await EsTeams.editMessageText(
      `❌ Error: ${err.message}`,
      {
        chat_id: chatId,
        message_id: loading.message_id,
        parse_mode: "Markdown"
      }
    );
  }
});

// ============ ACC STATS COMMAND ========= //
EsTeams.onText(/^\/accstats$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ Admin command only!");
  }

  try {
    const accounts = await getGeneratedAccounts();
    const totalCoins = await getTotalCoinsFromAllAccounts();

    let accountsList = `*📊 Generated Accounts Statistics*\n\n`;
    accountsList += `👥 Total Accounts: \`${accounts.length}\`\n`;
    accountsList += `💎 Total Generated Coins: \`${totalCoins}\`\n\n`;
    accountsList += `*Generated Accounts:*\n\n`;

    if (accounts.length === 0) {
      accountsList += `No accounts generated yet.`;
    } else {
      accounts.slice(0, 10).forEach((acc, idx) => {
        const createdDate = acc.createdAt
          ? new Date(acc.createdAt).toLocaleDateString()
          : "Unknown";

        accountsList += `${idx + 1}. \`${acc.username}\`\n`;
        accountsList += `   📅 Created: \`${createdDate}\`\n\n`;
      });

      if (accounts.length > 10) {
        accountsList += `...and ${accounts.length - 10} more accounts`;
      }
    }

    await EsTeams.sendMessage(chatId, accountsList, {
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error("Accstats error:", err.message);

    await EsTeams.sendMessage(chatId, `❌ Error: \`${err.message}\``, {
      parse_mode: "Markdown",
    });
  }
});

// ============ CLAIM ALL COMMAND ========= //
EsTeams.onText(/^\/claimall$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!CONFIG.OWNER_IDS.includes(userId)) {
    return EsTeams.sendMessage(chatId, "❌ Admin command only!");
  }

  const loading = await EsTeams.sendMessage(
    chatId,
    "⏳ Claiming coins from all accounts..."
  );

  try {
    const accounts = await getGeneratedAccounts();

    let totalClaimed = 0;
    let successCount = 0;
    let failedCount = 0;

    for (const account of accounts) {
      const claimResult = await claimCoinsFromAccount(
        account.username,
        account.password
      );

      if (claimResult.success) {
        const claimed = Number(claimResult.coinsClaimed || 0);

        totalClaimed += claimed;
        successCount++;

        await addGeneratedCoins(claimed);

        console.log(`✅ ${account.username}: +${claimed} coins`);
      } else {
        failedCount++;
        console.log(`❌ ${account.username}: ${claimResult.error}`);
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    const totalCoins = await getTotalCoinsFromAllAccounts();

    await EsTeams.editMessageText(
`✅ *Coin Claiming Complete*

👥 Total Accounts: ${accounts.length}

✅ Successful: ${successCount}

❌ Failed: ${failedCount}

💰 Coins Claimed This Run: ${totalClaimed}

💎 Total Generated Coins: ${totalCoins}`,
      {
        chat_id: chatId,
        message_id: loading.message_id,
        parse_mode: "Markdown",
      }
    );
  } catch (err) {
    console.error("Claimall error:", err);

    await EsTeams.editMessageText(
      `❌ Error: ${err.message}`,
      {
        chat_id: chatId,
        message_id: loading.message_id,
        parse_mode: "Markdown",
      }
    );
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

  const next12 = new Date(now);
  if (now.getHours() < 12) {
    next12.setHours(12, 0, 0, 0);
  } else {
    next12.setDate(next12.getDate() + 1);
    next12.setHours(0, 0, 0, 0);
  }

  const next24 = new Date(now);
  next24.setDate(next24.getDate() + 1);
  next24.setHours(0, 0, 0, 0);

  await EsTeams.sendMessage(
    chatId,
    `🕒 *𝗖𝗥𝗢𝗡 𝗦𝗖𝗛𝗘𝗗𝗨𝗟𝗘*

👤 Create Account (12h):
\`${next12.toLocaleString()}\`

💎 Claim Coins (24h):
\`${next24.toLocaleString()}\``,
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
        [{ text: "▶️ 𝗟𝗜𝗩𝗘 𝗧𝗩", web_app: { url: "https://stream-qgr4.onrender.com/" } }],
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

      const api = `https://apis.davidcyril.name.ng/song?query=${encodeURIComponent(query)}`;
      let res;
      try { res = await axios.get(api, { timeout: 90000 }); }
      catch { res = await axios.get(api, { timeout: 120000 }); }

      clearInterval(typingInterval);

      if (!res.data?.status || !res.data?.result?.audio?.download_url)
    throw new Error("Unable to fetch song.");

      const { title, thumbnail, audio } = res.data.result;
      const download = audio.download_url;
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
    }

  } catch (err) {
    if (typingInterval) clearInterval(typingInterval);
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

      const lyricsUrl = `https://apis.davidcyril.name.ng/lyrics2?t=${encodeURIComponent(title)}&a=${encodeURIComponent(artist)}`;
      const res = await axios.get(lyricsUrl, { timeout: 15000 });

      await EsTeams.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

      if (!res.data?.lyrics) {
        return EsTeams.sendPhoto(chatId, botImageUrl, {
          caption: "⚠️ Lyrics not found.",
          parse_mode: "Markdown"
        });
      }

      const fullLyrics = res.data.lyrics.trim();

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

            const apiUrl = `https://apis.davidcyril.name.ng/song?query=${encodeURIComponent(query)}`;
            
            const response = await axios.get(apiUrl, { timeout: 60000 }).catch(() => null);
            const data = response?.data;

            if (!data || !data.status || !data.result) {
                return EsTeams.sendMessage(chatId, "🚫 *Error fetching video details from API.* Please try again later.", { parse_mode: "Markdown" });
            }

            const { title, thumbnail, published, video: videoData } = data.result;
            
            // --- TARGETED SAVENOW.TO LINK FILTERING ---
            let download_url = "";

            if (videoData?.download_url && videoData.download_url.includes("savenow.to")) {
                download_url = videoData.download_url;
            } else {
                const fallbackUrls = [
                    videoData?.download_url,
                    data.result?.video_url,
                    data.result?.download_url
                ].filter(url => url && url.includes("savenow.to"));

                if (fallbackUrls.length > 0) {
                    download_url = fallbackUrls[0];
                }
            }

            if (!download_url) {
                return EsTeams.sendMessage(chatId, "❌ *Could not isolate the secure savenow.to video link.* Please try another title.", { parse_mode: "Markdown" });
            }

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
                        "Accept": "*/*",
                        "Origin": "https://savenow.to",
                        "Referer": "https://savenow.to/"
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
                    caption: `*𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗩1 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\n🎬 *Title:* _${title}_\n📅 *Released:* _${published}_\n💼 *Status:* _Premium_\n\n📥 *Uploading video to Telegram...*\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴇꜱ ᴛᴇᴀᴍꜱ*`,
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
                console.error("Download Stream Error Details:", dlError.message);
                await EsTeams.sendMessage(chatId, "❌ *Failed to stream video.* The download server blocked the request. Try another keyword.", { parse_mode: "Markdown" });
            } finally {
                // Always scrub file assets out of local container directory when finished
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

    } catch (error) {
        console.error("General error handling in video layout execution block:", error);
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

        const apiUrl = `https://apis.davidcyril.name.ng/download/ytmp4?url=${encodeURIComponent(link)}&apikey=`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success || !data.result || typeof data.result.download_url !== "string") {
            return EsTeams.sendMessage(chatId, "🚫 *Error fetching video.* Please try again later.", { parse_mode: "Markdown" });
        }

        const { download_url, title, thumbnail, quality } = data.result;
        const filePath = `./ES_TEAMS-MEDIA/video/${chatId}.mp4`;

        const videoStream = await fetch(download_url);
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
        console.error("Error in /ytdl command:", error);
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
});