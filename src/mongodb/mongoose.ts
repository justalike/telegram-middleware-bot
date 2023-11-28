import { connect, Connection, disconnect, Mongoose } from 'mongoose'
import { settings } from '../config'

export class MongooseService {
  static instance: MongooseService

  private uri: string = settings.mongoUri as string

  public connection: Connection | null = null

  static async getConnection() {
    if (!MongooseService.instance) {
      MongooseService.instance = new MongooseService()
      MongooseService.instance.connection = await MongooseService.instance.connect()
    }
    return MongooseService.instance.connection
  }

  private async connect(): Promise<Connection> {
    const mongoose: Mongoose = await connect(this.uri, {
      dbName: 'our_telegramBot',
    }).then(
      (mongoose: Mongoose) => {
        console.log('База данных подключена')
        return mongoose
      },
      (err) => {
        console.log('MONGO CONNECTION ERROR', err)
        throw err
      },
    )

    return mongoose.connection
  }

  async closeConnection() {
    return disconnect()
  }
}
