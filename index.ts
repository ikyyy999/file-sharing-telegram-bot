// Impor modul dan fungsi yang diperlukan
import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile } from "./services";
import { botID, botToken, adminIDs } from "./config"; // Mengasumsikan adminIDs didefinisikan dalam konfigurasi Anda

import sendMediaFunction from "./utils/sendMediaFunction";

bot.on("message:file", async (ctx) => {
  try {
    // Periksa apakah pengirim adalah admin
    const isAdmin = adminIDs && adminIDs.includes(ctx.from?.id?.toString() || "");

    if (isAdmin) {
      // Jika pengirim adalah admin, proses seperti biasa
      const file = await ctx.getFile();
      const fileCode = await storeFile(file.file_id);
      return ctx.reply(
        `Your file has been stored with code: ${fileCode}. You can share the file using this link https://t.me/${botID}?start=${fileCode}`
      );
    } else {
      // Jika pengirim bukan admin, izinkan pengguna mengakses tautan yang dikirimkan
      const fileId = ctx.message?.document?.file_id;
      if (fileId) {
        return ctx.reply(
          `You can access the file using this link: https://t.me/${botID}?start=${fileId}`
        );
      } else {
        return ctx.reply("Sorry, I couldn't process the file. Please try again.");
      }
    }
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
