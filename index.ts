import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile, getFileByCode } from "./services"; // Tambahkan fungsi getFileByCode
import { botID, botToken, adminIDs, } from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
 try {
  if (ctx.match && ctx.match.length === 8) {
   const fileCode = ctx.match; // Ambil kode dari tautan yang diberikan oleh penggunan
   const file = await getFileByCode(fileCode);
    
   if (!file) {
    await ctx.reply("File not found! Please make sure the code is correct.");
    return;
   }

  // Periksa apakah pengguna telah berlangganan channel atau group
  if (!await ctx.chat.isMember(channelID)) { // Ganti channelID dengan ID channel atau group yang ingin Anda force subscribe
    await ctx.reply("Anda harus berlangganan channel atau group ini terlebih dahulu.");
    await ctx.reply("Ketik /join untuk bergabung dengan channel atau group.");
    return;
   }

  // Kirim file ke pengguna
   await sendMediaFunction(ctx, file);
   return;
  }

  return ctx.reply("Welcome to the file-sharing Telegram bot! Just upload your file that you want to share.");
 } catch (error) {
  console.error(error);
  await ctx.reply("Something wrong! Please try again :(");
 }
});

// Handle webhook or start the bot in development
if (process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  bot.start();
}

console.log("The bot is running 🚀️🚀️🚀️");
