// Impor modul dan fungsi yang diperlukan
import { Bot, webhookCallback, Context } from "grammy"; // Impor Context dari grammY
import express from "express";
import { getFile, storeFile } from "./services";
import { botID, botToken, adminIDs } from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";

// Membuat instance Bot baru
const bot = new Bot(botToken);

// Menangani perintah start
bot.command("start", async (ctx: Context) => { // Tambahkan anotasi tipe untuk 'ctx'
  try {
    // ... (Bagian tersisa dari perintah start tetap tidak berubah)
  } catch (error) {
    console.error(error);
    await ctx.reply("Ada kesalahan! Silakan coba lagi :(");
  }
});

// Menangani pesan teks
bot.on("message:text", async (ctx: Context) => { // Tambahkan anotasi tipe untuk 'ctx'
  await ctx.reply(
    "Saya tidak mengerti input Anda :(. Silakan langsung unggah file yang ingin Anda bagikan :D"
  );
});

// Menangani pesan file
bot.on("message:file", async (ctx: Context) => { // Tambahkan anotasi tipe untuk 'ctx'
  try {
    // Periksa apakah pengirim adalah admin
    const isAdmin = adminIDs && adminIDs.includes(ctx.from?.id?.toString() || "");

    if (isAdmin) {
      // Jika pengirim adalah admin, lanjutkan seperti biasa
      const file = await ctx.getFile();
      const fileCode = await storeFile(file.file_id);
      return ctx.reply(
        `File Anda telah disimpan dengan kode: ${fileCode}. Anda dapat berbagi file menggunakan tautan ini https://t.me/${botID}?start=${fileCode}`
      );
    } else {
      // Jika pengirim bukan admin, izinkan pengguna mengakses tautan
      const fileId = ctx.message?.document?.file_id;
      if (fileId) {
        return ctx.reply(
          `Anda dapat mengakses file menggunakan tautan ini: https://t.me/${botID}?start=${fileId}`
        );
      } else {
        return ctx.reply("Maaf, saya tidak dapat memproses file tersebut. Silakan coba lagi.");
      }
    }
  } catch (error) {
    console.error(error);
    await ctx.reply("Ada kesalahan! Silakan coba lagi :(");
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
