import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile, getFileByCode } from "./services";
import { botID, botToken, channelUsername } from "./config"; // Mengasumsikan Anda memiliki bidang konfigurasi untuk nama pengguna saluran
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
  try {
    const isMember = await ctx.getChatMember(ctx.from.id, channelUsername);
    
    if (!isMember) {
      // Jika pengguna bukan anggota, minta mereka untuk bergabung dengan saluran
      await ctx.reply(`Untuk mengakses bot, silakan bergabung dengan saluran kami: t.me/${channelUsername}`);
      return;
    }

    if (ctx.match && ctx.match.length === 8) {
      const fileCode = ctx.match; // Ambil kode dari tautan yang diberikan oleh pengguna
      const file = await getFileByCode(fileCode);
      
      if (!file) {
        await ctx.reply("File tidak ditemukan! Pastikan kode yang dimasukkan benar.");
        return;
      }

      // Kirim file ke pengguna
      await sendMediaFunction(ctx, file);
      return;
    }

    return ctx.reply("Selamat datang di bot pengiriman file Telegram! Cukup unggah file yang ingin Anda bagikan.");
  } catch (error) {
    console.error(error);
    await ctx.reply("Ada yang salah! Silakan coba lagi :(");
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
