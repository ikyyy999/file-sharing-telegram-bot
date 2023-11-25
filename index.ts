import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile } from "./services";
import { botID, botToken, channelUsername } from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
  const userIdToForceSubscribe = 123456789; // Ganti dengan ID pengguna yang diinginkan

  if (ctx.from && ctx.from.id === userIdToForceSubscribe) {
    // Pengguna yang diinginkan
    const keyboard = {
      inline_keyboard: [[{ text: "Join Channel", url: `https://t.me/wbbdubbindo` }]],
    };

    await ctx.reply("Silakan bergabung dengan saluran kami terlebih dahulu.", { reply_markup: keyboard });
  } else {
    // Pengguna lain
    await ctx.reply(
      "Selamat datang! Untuk melanjutkan, silakan kirimkan file yang ingin Anda bagikan."
    );
  }
});

// Penanganan peristiwa yang sudah ada

bot.on("message:new_chat_members", async (ctx) => {
  // Periksa apakah anggota baru adalah pengguna yang ingin Anda paksa berlangganan
  const userIdToForceSubscribe = 123456789; // Ganti dengan ID pengguna yang diinginkan
  const newMemberId = ctx.message?.new_chat_members?.[0]?.id;

  if (newMemberId === userIdToForceSubscribe) {
    const keyboard = {
      inline_keyboard: [[{ text: "Join Channel", url: `https://t.me/wbbdubbindo` }]],
    };

    await ctx.reply("Silakan bergabung dengan saluran kami terlebih dahulu.", { reply_markup: keyboard });
  }
});

if (process.env.NODE_ENV === "production") {
  // Kode produksi yang sudah ada
} else {
  bot.start();
}

console.log("Bot berjalan 🚀️🚀️🚀️");
