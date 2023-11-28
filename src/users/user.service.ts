import { UserModel, MessageModel } from './user.schema'
import { User, Message } from './user.model'


export class UserService {
  static async createUser(user) {
   
    const { id, language_code, username, first_name, last_name } = user

    try {
      console.log(`Trying to create new User for ${id}`)
      await UserModel.create({
        telegramId: id,
        language_code: language_code,
        username: username || "",
        first_name: first_name|| "",
        last_name: last_name|| "",
        messages: [],
        blocked: false,
        date: {
          created: new Date(),
          updated: new Date(),
        },
      })
    } catch (err) {
      console.error(err)
    }

    console.log(`User created`)
  }

  static async findUserByTelegramId(telegramId: number): Promise<User | null> {
    return UserModel.findOne({ telegramId })
  }

  static async getMessageById(messageId: number): Promise<Message | null> {
    return MessageModel.findOne({ messageId })
  }

  static async createMessage (userId: number, message: string, messageId: number, replied = false) {
    try {
      await MessageModel.create({
        userId,
        messageId,
        message,
        replied,
        date: {
          created: new Date(),
          updated: new Date(),
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  static async setMessageReplied(messageId: number, replied: boolean) {
    await MessageModel.updateOne({ messageId }, { replied: replied })
  }

  static async appendMessageToUser(userId: number, messageId: number) {
    await UserModel.updateOne({ telegramId: userId }, { $push: { messages: messageId } })
  }

  static  async blockUser(userId: number) {
    //console.log(`Blocking user ${userId}`)
    const result =  await UserModel.updateOne({ telegramId: userId }, { blocked: true })
    //console.log((result))
   
  }

  static async unblockUser(userId: number) {
    //console.log(`UNBlocking user ${userId}`)
    const result =  await UserModel.updateOne({ telegramId: userId }, { blocked: false })
    //console.log((result))
  }

  static async listBlockedUsers() {
    const users = await UserModel.find({ blocked: true })
    return users
  }
}

  


