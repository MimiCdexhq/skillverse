require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const bot = new TelegramBot(config.botToken, { polling: true });

const WEBAPP_URL = config.webAppUrl;

const COMMANDS = [
  { command: 'start', description: 'Start SkillVerse' },
  { command: 'play', description: 'Open the game' },
  { command: 'leaderboard', description: 'View rankings' },
  { command: 'wallet', description: 'Check wallet' },
  { command: 'invite', description: 'Invite friends' },
  { command: 'halloffame', description: 'Hall of Fame' },
  { command: 'news', description: 'Latest news' },
  { command: 'help', description: 'Get help' },
];

bot.setMyCommands(COMMANDS).catch(() => {});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'Warrior';

  bot.sendMessage(chatId, `⚔️ Welcome to *SkillVerse*, ${name}!\n\nPlay • Compete • Earn`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 Enter the Verse',
            web_app: { url: WEBAPP_URL },
          },
        ],
      ],
    },
  });
});

bot.onText(/\/play/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, '⚔️ Choose your battle:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🎮 Launch SkillVerse',
            web_app: { url: WEBAPP_URL },
          },
        ],
      ],
    },
  });
});

bot.onText(/\/leaderboard/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, '🏆 Leaderboards are available inside the app:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📊 Open Leaderboards',
            web_app: { url: `${WEBAPP_URL}#leaderboard` },
          },
        ],
      ],
    },
  });
});

bot.onText(/\/wallet/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, '💰 Wallet dashboard:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '💎 Open Wallet',
            web_app: { url: `${WEBAPP_URL}#wallet` },
          },
        ],
      ],
    },
  });
});

bot.onText(/\/invite/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : 'your friend';
  const referralLink = `https://t.me/${config.botUsername || 'SkillVerseBot'}?start=ref_${msg.from.id}`;

  bot.sendMessage(chatId, `👥 Invite warriors to SkillVerse!\n\nYour referral link:\n${referralLink}\n\nEarn +0.1 vUSDT per active referral.`);
});

bot.onText(/\/halloffame/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, '🏆 Hall of Fame:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '👑 View Hall of Fame',
            web_app: { url: `${WEBAPP_URL}#leaderboard` },
          },
        ],
      ],
    },
  });
});

bot.onText(/\/news/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, '📰 Latest SkillVerse news:\n\n• Season 1 is live\n• 10,000 USDT prize pool\n• New game modes coming soon\n\nFollow @SkillVerse for updates.');
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `🆘 SkillVerse Help\n\n/start - Open the app\n/play - Launch game\n/leaderboard - Rankings\n/wallet - Wallet\n/invite - Referral link\n/halloffame - Top players\n/news - Announcements\n/help - This message\n\nNeed support? Contact @SkillVerseSupport`);
});

bot.on('polling_error', (error) => {
  console.error('Telegram polling error:', error.message);
});

console.log('SkillVerse bot is running...');
