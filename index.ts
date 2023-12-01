import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile, getFileByCode } from "./services";
import { botID, botToken, adminIDs } from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
  try {
    if (ctx.match && ctx.match.length === 8) {
      const fileCode = ctx.match; // Ambil kode dari tautan yang diberikan oleh pengguna
      const file = await getFileByCode(fileCode);
      
      if (!file) {
        await ctx.reply("File tidak ditemukan! Tolong pastikan kodenya benar.");
        return;
      }

      // Kirim file ke pengguna
      await sendMediaFunction(ctx, file);
      return;
    }

    return ctx.reply("Selamat Datang di File Sharing Telegram Bot! Cukup unggah file anda yang ingin anda bagikan.");
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

bot.on("message:text", async (ctx) => {
  await ctx.reply("Saya tidak mengerti masukkan anda :(. Silahkan langsung unggah file anda yang ingin anda bagikan :D");
});

bot.on("message:file", async (ctx) => {
  try {
    // Periksa apakah pengirim adalah admin
    const isAdmin = adminIDs && adminIDs.includes(ctx.from?.id?.toString() || "");

    if (!isAdmin) {
      await ctx.reply("Hanya admins yang dapat mengirim files.");
      return;
    }

    const file = await ctx.getFile();
    const fileCode = await storeFile(file.file_id);

    // Berikan link yang dapat diakses pengguna
    const fileLink = `https://t.me/${botID}?start=${fileCode}`;
    
    return ctx.reply(`${fileLink}`);
  } catch (error) {
    console.error(error);
    await ctx.reply("Ada sesuatu yang salah! Tolong coba lagi :(");
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

console.log("Bot sedang berjalan 🚀️🚀️🚀️");
