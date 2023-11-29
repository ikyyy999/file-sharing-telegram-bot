import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile, getFileByCode } from "./services";
import { botID, botToken, adminIDs, FORCE_SUB_CHANNEL} from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";

class MyTelegramBot extends Bot {
  constructor() {
    super(botToken);
  }

  async start() {
    try {
      await super.start();
      const botInfo = await this.getMe();
      this.username = botInfo.username;
      this.namebot = botInfo.first_name;
      console.log(`TG_BOT_TOKEN detected!\n┌ First Name: ${this.namebot}\n└ Username: @${this.username}\n——`);
    } catch (error) {
      console.error(error);
      console.log("Bot stopped. Join https://t.me/SharingUserbot for assistance");
      process.exit();
    }

    // Rest of the start method..

    console.log("Bot is running 🚀️🚀️🚀️");
  }

  // Add other methods and functionalities here...
}

const myTelegramBot = new MyTelegramBot();

myTelegramBot.command("start", async (ctx) => {
  try {
    // Your existing command logic...
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

myTelegramBot.on("message:text", async (ctx) => {
  await ctx.reply("I don't understand your input :(. Please directly upload your file that you want to share :D");
});

myTelegramBot.on("message:file", async (ctx) => {
  try {
    // Your existing file message logic...
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

// Handle webhook or start the bot in development
if (process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(myTelegramBot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  myTelegramBot.start();
}
