import { InlineKeyboardButton } from 'node-telegram-bot-api'
import {
createKeyboard,
createButton,
createInlineKeyboard,
chunkArray,
} from './telegram.utils'

export class KeyboardService {
 
  // static getMainMenuKeyboard = () => [
  //   ['Помощь (/help)'],
  // ]

  static getAdminKeyboard = () =>  createInlineKeyboard(
    [
      [createButton('Черный список', 'list')],
    ],
  )

  static getAdminReplyKeyboard = (message_id: number) => createInlineKeyboard(
    [
      [createButton('Ответить', `msgId|${message_id}`)],
      [createButton('Добавить в чс', `blockList|add|${message_id}`)],
    ],
  )
  static getAdminBlockListKeyboard = () => createInlineKeyboard(
    [
      [createButton('Открыть черный список', `blockList|list`)],
    ],
  )

}

export class MessageService {
 

  static genericError = (e?) => `Произошла ошибка! Проверьте ввод и попробуйте ещё раз.\n\n${e || ''}`

  static startMessage = () => 'Пожалуйста введите информацию которой хотите поделиться.'

  static helpMessage = () => ` Помощь:`

  static infoMessage = (user) => ` Информация: о пользователе: ${user}`
  
  static notFoundMessage = () =>
    'Команда не найдена! Попробуйте отправить команду /help для получения информации о возможностях бота.'
}
