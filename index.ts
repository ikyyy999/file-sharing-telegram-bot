import { Bot, webhookCallback, Context } from "grammy";
import express from "express";
import { getFile, storeFile } from "./services";
import { botID, botToken, channelUsername, adminIDs } from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
  try {
    // ... (Bagian start command tidak berubah)
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

bot.on("message:text", async (ctx) => {
  await ctx.reply(
    "I don't understand your input :(. Please directly upload your file that you want to share :D"
  );
});

bot.on("message:file", async (ctx) => {
  try {
    // Periksa apakah pengirim pesan adalah admin
    const isAdmin = adminIDs.includes(ctx.from.id);
    if (!isAdmin) {
      await ctx.reply("Only admins can send files.");
      return;
    }

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
