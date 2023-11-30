import TelegramBot from 'node-telegram-bot-api'
import { KeyboardService, MessageService } from './telegram.model'
import { UserService } from '../users/user.service'
import { settings } from '../config'

export class TelegramService {
  private adminId: number
  private adminReplyState = new Map<number, number >();
 

    constructor(private readonly telegram: TelegramBot) {
    this.adminId = +settings.adminId
  }

  public async onAdminTextMessage(message: TelegramBot.Message): Promise<TelegramBot.Message> {
    
    const replyToMessageId = this.adminReplyState.get(this.adminId);
   // console.log(replyToMessageId)
    if (replyToMessageId !== undefined) {
        const originalMessage = await UserService.getMessageById(replyToMessageId);
        if (originalMessage) {
            await UserService.setMessageReplied(replyToMessageId, true);
           return await this.sendMessage(originalMessage.userId, message.text);
        }
        this.adminReplyState.delete(this.adminId);
    } else {
       switch (message.text) {
           case '/start':
               return await this.sendMessage(this.adminId, `Привет, админ!`, {
                   parse_mode: 'HTML',
                   reply_markup: KeyboardService.getAdminBlockListKeyboard(),
               })
           case '/list':
               return await this.sendMessage(this.adminId, `Что вы хотите сделать?`, {
                   parse_mode: 'HTML',
                   reply_markup: KeyboardService.getAdminBlockListKeyboard(),
               })
       }
    }
}


public async handleMediaMessage(adminId: number, message: TelegramBot.Message): Promise<TelegramBot.Message|void> {
  // First, check if the user is blocked or not found
  const user = await UserService.findUserByTelegramId(message.from.id);
  if (!user || user.blocked) return console.log(`Заблокированный пользователь написал: ${message.text}`);

  // Send confirmation to the user
  await this.sendMessage(message.from.id, `Ваше медиа отправлено!`)
  .then(
      (confirmationMessage) => 
      setTimeout(() => this.telegram.deleteMessage(confirmationMessage.chat.id, confirmationMessage.message_id), 5000)
  );

  // Forward the media message to the admin
   
  await this.sendMessage(
    adminId, 
   `${message.from.id}: ${message.from.first_name || ''} ${message.from.last_name || ''} ${message.from.username ||'неизвестно'} прислал сообщение:`, {
  reply_markup: KeyboardService.getAdminReplyKeyboard(message.message_id),
  })
   
return await this.telegram.forwardMessage(adminId, message.chat.id, message.message_id, {
  disable_notification: true
});
}

  public async handleMessage(adminId: number, message: TelegramBot.Message): Promise<TelegramBot.Message|void> {
    if (message.text.startsWith('/')) return 
  
    const user = await UserService.findUserByTelegramId(message.from.id);
    if (!user || user.blocked)  return console.log(`Заблокированный пользователь написал: ${message.text}`);

    this.sendMessage(message.from.id, `Ваше сообщение отправлено!`)
    .then(
        (message) => 
        setTimeout(() => this.telegram.deleteMessage(message.chat.id, message.message_id), 5000)
    )

    return this.sendMessage(
        adminId, 
       `${message.from.id}: ${message.from.first_name || ''} ${message.from.last_name || ''} ${message.from.username ||'неизвестно'} прислал сообщение:
        ${message.text}`, {
      reply_markup: KeyboardService.getAdminReplyKeyboard(message.message_id),
    })
  }
  public async askForInput(adminId: number, messageId: number): Promise<TelegramBot.Message> {
    // Store the message ID that the admin is replying to
    this.adminReplyState.set(adminId, messageId);

    // Ask the admin to type their reply
    return this.sendMessage(adminId, 'Напишите ваш ответ:', {
        // Additional options if necessary
    });
}


public async onBlockUser(query: TelegramBot.CallbackQuery, messageId: number): Promise<TelegramBot.Message> {
    try{

    const user = await UserService.getMessageById(messageId);
    if (!user) {
        return this.answer(query, 'Пользователь не найден');
    }
    await UserService.blockUser(user.userId);

} catch (e) {
    return this.answer(query, 'Пользователя невозможно заблокировать');
}
    return this.answer(query, 'Пользователь заблокирован');
}

public async onUnblockUser(query: TelegramBot.CallbackQuery, userId: number): Promise<TelegramBot.Message> {
    try{
    await UserService.unblockUser(userId);
} catch (e) {
    return this.answer(query, 'Пользователя невозможно разблокировать');
}
    return this.answer(query, 'Пользователь разблокирован');
}


public async onListBlockedUsers(query: TelegramBot.CallbackQuery): Promise<TelegramBot.Message> {
    const blockedUsers = await UserService.listBlockedUsers();
    const replyMarkup = {
        inline_keyboard: blockedUsers.map(user => ([
            { text: `Разблокировать ${user.telegramId}`, callback_data: `blockList|remove|${user.telegramId}` }
        ]))
    };
    return this.sendMessage(query.from.id, 'Заблокированные пользователи: ' + blockedUsers.map(user => (user.username? `${user.username}(id: ${user.telegramId})` : user.telegramId)).join('\n'), { reply_markup: replyMarkup });
}

public async answer (query: TelegramBot.CallbackQuery, text: string): Promise<any> {
    return await this.telegram.answerCallbackQuery(query.id, {text, show_alert: true});
}

  public async startMenu(telegramId: number): Promise<TelegramBot.Message> {

    if (telegramId == this.adminId) return 

    return this.sendMessage(telegramId, MessageService.startMessage(), {
      parse_mode: 'HTML',
      // reply_markup: {
      //   keyboard: KeyboardService.getMainMenuKeyboard(),
      //   resize_keyboard: true,
      // },
    })
  }

  // public async helpMenu(telegramId: number): Promise<TelegramBot.Message> {
  //   return this.sendMessage(telegramId, MessageService.helpMessage(), {
  //     parse_mode: 'HTML',
  //     //keyboard: KeyboardService.getMainMenuKeyboard(),
  //     //resize_keyboard: true,
  //   })
  // }

  public async onNotFound(telegramId: number): Promise<TelegramBot.Message> {
    return this.sendMessage(telegramId, MessageService.notFoundMessage())
  }

  public async onError(telegramId: number, error: any): Promise<TelegramBot.Message> {
    return this.sendMessage(telegramId, MessageService.genericError(error))
  }

  public async sendMessage(id: number, text: string, options?: object): Promise<TelegramBot.Message> {
    try {
      return await this.telegram.sendMessage(id, text, options || { parse_mode: 'HTML' }) // somehow need to check if options exist, if not - replace it with {parse_mode: 'HTML'}
    } catch (error: any) {
      if (error.message.includes('bot was blocked by the user')) {
        console.log(`${id} blocked the bot. Deleting user from db`)
        
       // return await this.telegram.sendMessage(this.telegram, error.message)
      }
      return await this.telegram.sendMessage(id, error.message)
    }
  }

//   public async sendPhoto(
//     chatId: TelegramBot.ChatId,
//     photo: string | Buffer,
//     options?: TelegramBot.SendPhotoOptions,
//     fileOptions?: TelegramBot.FileOptions,
//   ): Promise<TelegramBot.Message> {
//     try {
//       return await this.telegram.sendPhoto(chatId, photo, options, fileOptions)
//     } catch (e: any) {
//       console.log(e.message)
//     }
//   }

  public async ensureUserExists(message:TelegramBot.Message): Promise<void> {
    // init db only once, save user on any interaction
    const telegramUserId = message.chat.id
    const user = await UserService.findUserByTelegramId(telegramUserId)
    if (!user) {
       
      await UserService.createUser(message.from)
    }
    await UserService.createMessage(telegramUserId, message.text, message.message_id)
    await UserService.appendMessageToUser(telegramUserId, message.message_id)
  }
}
