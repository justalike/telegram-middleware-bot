import mongoose from 'mongoose'

const { Schema } = mongoose

export const messageSchema = new Schema({
  userId: { type: Number, required: true },
  messageId: { type: Number, required: true },
  message: { type: String, required: true },
  replied: { type: Boolean, default: false },
  date: {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
})

export const MessageModel = mongoose.model('Message', messageSchema)




export const userSchema = new Schema({
    telegramId: { type: Number, required: true },
    username: { type: String, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    language_code: { type: String, required: false },
    messages: { type: [Number], default: [] },
    blocked: { type: Boolean, default: false },
    date: {
      created: { type: Date, default: Date.now },
      updated: { type: Date, default: Date.now },
    },
  })
  
  export const UserModel = mongoose.model('User', userSchema)
  
  