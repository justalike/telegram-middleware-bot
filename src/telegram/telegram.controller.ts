import { settings } from '../config'
import TelegramBot from 'node-telegram-bot-api'
import { TelegramService } from './telegram.service'


export class TelegramController {
    
    public readonly service: TelegramService
    private readonly adminId: number
    
    constructor(private readonly bot: TelegramBot) {
      this.service = new TelegramService(bot)
      this.adminId = +settings.adminId
      this.bot.on('message', (message) => {
        this.service.ensureUserExists(message);
    
        // Check if the message contains any media or file
        if (message.photo || message.document || message.video || message.audio || message.voice) {
            this.onMediaMessageHandle(message);
        }
    });
      this.bot.onText(/\/.+\w/, (userMessage, match) => this.onCommandHandle(userMessage, match))
      this.bot.onText(/.+/, (userMessage) => this.onTextHandle(userMessage, null))
      this.bot.on('callback_query', (query) => this.onCallbackQueryHandle(query))

    }
    
    private async onMediaMessageHandle(msg: TelegramBot.Message): Promise<TelegramBot.Message|void> {
      try{
        console.log(msg)

        return await this.service.handleMediaMessage(this.adminId, msg)
      }
      catch (e) {
        console.error(e)
      }
    }
    
    private async onTextHandle(msg: TelegramBot.Message, match: RegExpMatchArray): Promise<TelegramBot.Message|void> {
      const telegramId = msg.from!.id
      if (msg.from.id === this.adminId) return await this.service.onAdminTextMessage(msg);
      if (match == null) return this.service.handleMessage(this.adminId, msg)
        
        }
    
    private async onCommandHandle(msg: TelegramBot.Message, match: RegExpMatchArray): Promise<TelegramBot.Message> {
        const telegramId = msg.from!.id
        if (msg.from.id === this.adminId) return 
        if (match == null) return 
          
        try {
          switch (match[0]) {
            case '/start':
              return await this.service.startMenu(telegramId)
            // case '/help':
            //   return await this.service.helpMenu(telegramId)
           default:
              console.log(msg)
              //return await this.service.onNotFound(telegramId)
          }
  
  
        } catch (e) {
          console.error(e)
        }
      }
  
    private async onCallbackQueryHandle(query: TelegramBot.CallbackQuery): Promise<any> {
      try{
    const telegramId = query.from.id
      const { data } = query
      
      
      if (data.startsWith(`msgId`)){
        //console.log(`in query data is: ${data}`)
        const messageId = Number(data.split(`|`)[1])
        //console.log(`in query msgid is: ${messageId}`)
        await this.service.askForInput(telegramId, messageId)
      }

      if (data.startsWith('blockList')){ //blockList|add|123456
        let action = data.split(`|`)[1]
        let userId = Number(data.split(`|`)[2]) || 0

        if (action == 'add' && userId > 0){
        return  await this.service.onBlockUser(query, userId) //actually it is messageid
        }
        else if (action == 'remove' && userId > 0){
        return  await this.service.onUnblockUser(query, userId)
        }
        else if (action == 'list'){
         return await this.service.onListBlockedUsers(query)

        }
        else { 
          console.log(`in query data is: ${data}`)
          return await this.service.onNotFound(telegramId)
        }

      }
      
      } catch (e: any) {
        console.error(e)
        await this.service.onError(this.adminId, e)
      }
    }
}