export interface User {
    telegramId: number
    username: string
    first_name: string
    last_name: string
    language_code: string
    messages: string[]
    blocked: boolean
    date: {
      created: Date
      updated: Date
    }
  }

export interface Message {
    userId: number
    messageId: number
    message: string
    replied: boolean
    date: {
      created: Date
      updated: Date
    }
  }
  