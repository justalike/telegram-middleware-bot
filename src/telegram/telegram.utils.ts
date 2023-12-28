import { KeyboardButton, ReplyKeyboardMarkup, InlineKeyboardButton, InlineKeyboardMarkup } from 'node-telegram-bot-api'

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / chunkSize) }, (v, i) =>
    array.slice(i * chunkSize, i * chunkSize + chunkSize),
  )
}
/**
 * Creates a button with the given text, url or callback data. Requires either url or callback_data.
 * @param text The text of the button.
 * @param url if provided, the url of the button.
 * @param callback_data if provided, the callback data of the button.
 * @returns
 */
export const createButton = (text: string, callback_data?: string): InlineKeyboardButton => ({
  text,
  url: '',
  callback_data,
})

/**
 * Creates an inline keyboard with the given buttons.
 * @param buttons An array of InlineKeyboardButton objects.
 * @returns
 */
export const createKeyboard = (buttons: KeyboardButton[][]): ReplyKeyboardMarkup => ({
  keyboard: buttons,
  resize_keyboard: true,
  one_time_keyboard: true,
})

/**
 * Creates an inline keyboard with the given buttons.
 * @param buttons An array of InlineKeyboardButton objects.
 * @returns
 */
export const createInlineKeyboard = (buttons: InlineKeyboardButton[][]): InlineKeyboardMarkup => ({
  inline_keyboard: buttons,
})

