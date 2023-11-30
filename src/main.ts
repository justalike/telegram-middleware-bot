import { settings } from './config';
import { MongooseService } from './mongodb/mongoose';
import { TelegramController } from './telegram/telegram.controller';
import TelegramBot from 'node-telegram-bot-api';


const telegramBot = new TelegramBot(settings.apiTelegramToken, { polling: true })

const startApp = async () => {
    

  await MongooseService.getConnection()
  const telegram = new TelegramController(telegramBot)
    console.log('Телеграм-бот запущен!');
};

startApp();
