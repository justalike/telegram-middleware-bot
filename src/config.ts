import * as dotenv from 'dotenv'
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

export const settings = {
  apiTelegramToken: process.env.TELEGRAM_BOT_TOKEN as string,
  mongoUri: process.env.MONGODB_URI,
  adminId: process.env.ADMIN_ID as string,
}
