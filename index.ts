import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile, getFileByCode } from "./services";
import { botID, botToken, adminIDs, channelUsername } from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

async function checkSubscription(userId: number): Promise<boolean> {
  try {
    const chatMember = await bot.api.getChatMember(channelUsername, userId);

    // Periksa apakah status anggota adalah "member" atau "administrator"
    const isSubscriber = (
      chatMember.status === ChatMemberStatus.Member ||
      chatMember.status === ChatMemberStatus.Administrator
    );

    return isSubscriber;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false; // Mengembalikan false jika terjadi kesalahan
  }
}

bot.command("start", async (ctx) => {
  try {
    if (ctx.match && ctx.match.length === 8) {
      const fileCode = ctx.match;
      const fileId = await getFileByCode(fileCode);

      if (!fileId) {
        await ctx.reply("File not found! Please make sure the code is correct.");
        return;
      }

      const userId = ctx.from?.id || 0;
      const isSubscribed = await checkSubscription(userId);

      if (!isSubscribed) {
        await ctx.reply("You need to subscribe to access this file.");
        return;
      }

      const file = await getFile(fileId);
      await sendMediaFunction(ctx, file);
      return;
    }

    return ctx.reply("Welcome to the file-sharing Telegram bot! Just upload your file that you want to share.");
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

bot.on("message:text", async (ctx) => {
  await ctx.reply("I don't understand your input :(. Please directly upload your file that you want to share :D");
});

bot.on("message:file", async (ctx) => {
  try {
    const isAdmin = adminIDs && adminIDs.includes(ctx.from?.id?.toString() || "");

    if (!isAdmin) {
      await ctx.reply("Only admins can send files.");
      return;
    }

    const file = await ctx.getFile();
    const fileCode = await storeFile(file.file_id);

    const fileLink = `https://t.me/${botID}?start=${fileCode}`;
    
    return ctx.reply(`Your file has been stored with code: ${fileCode}. You can share the file using this link ${fileLink}`);
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
