// Impor modul dan fungsi yang diperlukan
import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile } from "./services";
import { botID, botToken, adminIDs } from "./config"; // Mengasumsikan adminIDs didefinisikan dalam konfigurasi Anda

import sendMediaFunction from "./utils/sendMediaFunction";

// Membuat instance Bot baru
const bot = new Bot(botToken);

// Menangani perintah start
bot.command("start", async (ctx) => {
  try {
    // ... (Bagian tersisa dari perintah start tetap tidak berubah)
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

// Menangani pesan teks
bot.on("message:text", async (ctx) => {
  await ctx.reply(
    "I don't understand your input :(. Please directly upload your file that you want to share :D"
  );
});

// Menangani pesan file
bot.on("message:file", async (ctx) => {
  try {
    // Periksa apakah pengirim adalah admin
    const isAdmin = adminIDs && adminIDs.includes(ctx.from?.id?.toString() || "");

    if (!isAdmin) {
      await ctx.reply("Only admins can send files.");
      return;
    }

    // Sisanya dari logika penanganan file tetap tidak berubah
    const file = await ctx.getFile();
    const fileCode = await storeFile(file.file_id);
    return ctx.reply(
      `Your file has been stored with code: ${fileCode}. You can share the file using this link https://t.me/${botID}?start=${fileCode}`
    );
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

// Jalankan bot atau atur webhook di produksi
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
