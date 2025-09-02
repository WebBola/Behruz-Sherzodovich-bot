import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';

const token = '8242549919:AAF-N7u2WR8XwFPT5_WvyIKAuOuhCZhGMB4';
const adminId = 7760337711;

const bot = new TelegramBot(token, { polling: true });
console.log('🤖 Bot ishga tushdi...');

const USERS_FILE = './users.json';
let users = {};
if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers() {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

const stickers = [
    'CAACAgQAAxkBAAER5FNotSRlE2YHRXUH9BhSPI69fTdc8gACbQ0AAvf2iVL76YobXaDinTYE',
    'CAACAgQAAxkBAAER5FVotSSywNhQIMOvHZdDoE-FcDxC4AACzg0AArwegFKIPf9q-RjrUzYE',
    'CAACAgQAAxkBAAER5FdotSS8tHBGwL_lU1FMDRuk1756hwACQQsAAv5YgFKX_qptJLpH1zYE',
    'CAACAgQAAxkBAAER5FlotSTLMzCZMN8k-AYwJTNv5KhqhgAC4QwAAncDgFJyxneuAAFI-4U2BA',
    'CAACAgQAAxkBAAER5FtotSTpLYvZgDnGF9c9iamjMOaiUgACFg8AAnhVEVNFGDJJUOf6mzYE',
    'CAACAgQAAxkBAAER5F9otST7KhpL2VRZp-hiou3PW4LsmQACngwAAibUgFL55-5cBL0RajYE',
    'CAACAgQAAxkBAAER5GFotSUV8O1vldB2DxGglZv0uty7JAAC0QwAApkGgFKYih_1thLcaTYE',
    'CAACAgQAAxkBAAER5GNotSUigqekg2FsyuSgEon64WtrdgACFRMAAsF1uVD3t3j5nPkhcjYE',
];

function getRandomSticker() {
    return stickers[Math.floor(Math.random() * stickers.length)];
}

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || '';
    const username = msg.from.username ? '@' + msg.from.username : '[username yo‘q]';
    const text = msg.text ? msg.text.trim() : '';

    users[chatId] = { firstName, username };
    saveUsers();

    console.log(`✉️ Yangi xabar: ID=${chatId}, Ism=${firstName}, Username=${username}, Xabar=${text}`);

    if (chatId !== adminId) {
        if (text === '/start') {
            try {
                bot.sendSticker(chatId, getRandomSticker());
            } catch (e) {
                console.log('Stiker yuborishda xato:', e.message);
            }

            const welcomeText = `👋 Salom, ${firstName} (${username})!\n\n` +
                `Siz bot bilan lichkada muloqot qilyapsiz. 📩\n` +
                `Savol yoki takliflaringizni shu yerga yozing, admin javob beradi.\n\n` +
                `🔔 Kanalimiz: <a href="https://t.me/behruz_sherzodovich">Bizning Kanal</a>`;

            bot.sendMessage(chatId, welcomeText, { parse_mode: 'HTML' });

            const adminMessage = `🟢 Yangi foydalanuvchi start bosdi!\n` +
                `👤 Ismi: ${firstName}\n` +
                `🔹 Username: ${username}\n` +
                `🆔 ID: ${chatId}`;

            bot.sendMessage(adminId, adminMessage);
        } else {
            const adminMessage = `📩 Yangi xabar:\n` +
                `👤 Foydalanuvchi: ${firstName} (${username})\n` +
                `🆔 ID: ${chatId}\n` +
                `💬 Xabar: ${text || '[media]'}`;

            bot.sendMessage(adminId, adminMessage);
        }
    } else {
        if (msg.reply_to_message) {
            const match = msg.reply_to_message.text.match(/ID: (\d+)/);
            if (match) {
                const userId = parseInt(match[1]);
                bot.sendMessage(userId, `${text}`);
            }
        }
    }
});

