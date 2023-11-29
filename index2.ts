import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile, getFileByCode } from "./services";
import { botID, botToken, adminIDs } from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";
import os from "os"; // Import the os module

// Add the FORCE_MSG variable
const FORCE_MSG = os.environ.get(
    "FORCE_SUB_MESSAGE",
    "<b>Hello {first}\n\nAnda harus bergabung di Channel/Grup saya Terlebih dahulu untuk Melihat File yang saya Bagikan\n\nSilakan Join Ke Channel & Group Terlebih Dahulu</b>",
);

const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
  try {
    const userId: number | undefined = ctx.from?.id;

    // Periksa status langganan menggunakan Telegram API ID
    const isSubscribed = await checkSubscription(userId);

    if (!isSubscribed) {
      // Use the FORCE_MSG variable in the reply
      await ctx.replyWithHTML(FORCE_MSG.replace("{first}", ctx.from?.first_name || ""));
      return;
    }

    if (ctx.match && ctx.match.length === 8) {
      const fileCode = ctx.match;
      const file = await getFileByCode(fileCode);

      if (!file) {
        await ctx.reply("File tidak ditemukan! Pastikan kode yang dimasukkan benar.");
        return;
      }

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
  await ctx.reply("Saya tidak mengerti masukan Anda :(. Silakan langsung unggah file yang ingin Anda bagikan :D");
});

bot.on("message:file", async (ctx) => {
  try {
    const isAdmin = adminIDs && adminIDs.includes(ctx.from?.id?.toString() || "");

    if (!isAdmin) {
      await ctx.reply("Hanya admin yang dapat mengirimkan file.");
      return;
    }

    const file = await ctx.getFile();
    const fileCode = await storeFile(file.file_id);

    const fileLink = `https://t.me/${botID}?start=${fileCode}`;
    
    return ctx.reply(`File Anda telah disimpan dengan kode: ${fileCode}. Anda dapat berbagi file menggunakan tautan ini ${fileLink}`);
  } catch (error) {
    console.error(error);
    await ctx.reply("Ada yang salah! Silakan coba lagi :(");
  }
});

// Fungsi untuk memeriksa langganan pengguna menggunakan Telegram API ID
async function checkSubscription(userId) {
  // Your subscription check logic goes here
  // ...

  // Example: Return true for the sake of the demonstration
  return true;
}

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

console.log("Bot sedang berjalan 🚀️🚀️🚀️");
