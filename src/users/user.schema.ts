import mongoose from 'mongoose';
const { Schema } = mongoose;

const mediaItemSchema = new Schema({
    file_id: String,
    file_unique_id: String,
    file_size: Number,
    width: Number,
    height: Number
}, { _id: false });

const documentSchema = new Schema({
    file_name: String,
    mime_type: String,
    thumb: mediaItemSchema,
    file_id: String,
    file_unique_id: String,
    file_size: Number
}, { _id: false });

export const messageSchema = new Schema({
    userId: { type: Number, required: true },
    messageId: { type: Number, required: true },
    message: { type: String, required: false }, // Optional for non-text messages
    photo: [mediaItemSchema], // Array for photos
    video: documentSchema,
    voice: mediaItemSchema,
    audio: mediaItemSchema,
    document: documentSchema,
    animation: documentSchema,
    replied: { type: Boolean, default: false },
    date: {
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
    },
});


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
  
  