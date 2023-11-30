import os

from dotenv import load_dotenv

load_dotenv()

bot_token = os.getenv("BOT_TOKEN")
cyclic_db_name = os.getenv("CYCLIC_DB_NAME")
force_sub_channel = os.getenv("FSUB_CHANNEL")
admin_ids = os.getenv("ADMIN_ID")
bot_id = os.getenv("BOT_ID")
telegram_api_id = os.getenv("API_ID")
