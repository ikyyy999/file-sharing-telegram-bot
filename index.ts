import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile, subscribeUser, isUserSubscribed } from "./services";
import { botID, botToken } from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
  try {
    if (!isUserSubscribed(ctx.from.id)) {
      // User is not subscribed
      await ctx.reply("Please subscribe to use this service. Use /subscribe to subscribe.");
      return;
    }

    if (ctx.match && ctx.match.length === 8) {
      const file = await getFile(ctx.match);
      if (!file) {
        await ctx.reply("Code not found! Please make sure your code is correct.");
        return;
      }
      await ctx.reply("Getting your file, please wait a moment");
      await sendMediaFunction(ctx, file);
      return;
    }

    return ctx.reply("Welcome to the file-sharing Telegram bot! Just upload your file that you want to share.");
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

bot.command("subscribe", async (ctx) => {
  try {
    subscribeUser(ctx.from.id);
    await ctx.reply("Thank you for subscribing! You can now use the file-sharing service.");
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

// ... (rest of the code)

