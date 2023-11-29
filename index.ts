import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile, getFileByCode } from "./services";
import { botID, botToken, adminIDs, channelUsername } from "./config"; // Tambahkan channelUsername ke konfigurasi
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
  try {
    // Periksa apakah pengguna adalah anggota saluran
    const isMember = await ctx.getChatMember(ctx.from.id, channelUsername);

    if (!isMember) {
      // Jika pengguna bukan anggota, minta mereka untuk bergabung dengan saluran
      await ctx.reply(`Untuk mengakses bot, silakan bergabung dengan saluran kami: t.me/${channelUsername}`);
      return;
    }

    if (ctx.match && ctx.match.length === 8) {
      const fileCode = ctx.match;
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

bot.on("message:text", async (ctx) => {
  await ctx.reply("Saya tidak mengerti input Anda :(. Silakan langsung unggah file yang ingin Anda bagikan :D");
});

bot.on("message:file", async (ctx) => {
  try {
    // Periksa apakah pengirim adalah admin
    const isAdmin = adminIDs && adminIDs.includes(ctx.from?.id?.toString() || "");

    if (!isAdmin) {
      await ctx.reply("Hanya admin yang dapat mengirimkan file.");
      return;
    }

    const file = await ctx.getFile();
    const fileCode = await storeFile(file.file_id);

    // Berikan link yang dapat diakses pengguna
    const fileLink = `https://t.me/${botID}?start=${fileCode}`;
    
    return ctx.reply(`File Anda telah disimpan dengan kode: ${fileCode}. Anda dapat membagikan file menggunakan tautan ini ${fileLink}`);
  } catch (error) {
    console.error(error);
    await ctx.reply("Ada yang salah! Silakan coba lagi :(");
  }
});

// Tangani webhook atau jalankan bot dalam pengembangan
if (process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot mendengarkan di port ${PORT}`);
  });
} else {
  bot.start();
}

console.log("Bot berjalan 🚀️🚀️🚀️");
