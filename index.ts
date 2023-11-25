import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile } from "./services";
import { botID, botToken, channelUsername } from "./config"; // Add channelUsername to your config file
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
  try {
    const userId = ctx.from.id;
    
    // Check if the user is a member of the channel
    const isMember = await bot.api.getChatMember(channelUsername, userId);
    if (isMember.status !== "member" && isMember.status !== "administrator") {
      await ctx.reply("To use this bot, you must join our channel first!");
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

    return ctx.reply(
      "Welcome to the file-sharing Telegram bot! Just upload your file that you want to share."
    );
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

// ... (Other parts of your code remain unchanged)
