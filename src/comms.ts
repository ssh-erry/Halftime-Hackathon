// Allows for user to navigate their own profile etc 
///////////////////////////////////////////////////////////////////////////////////////////////////
//--- IMPORTS -----------------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////
import crypto from 'crypto'
import validator from 'validator';
import { 
  DataStore,
  User,
  Session,
  Message,
  ErrorObject,
  EmptyObject,
  getData, 
  loadData,
  saveData 
} from './dataStore'

import { checkSession } from './auth';

///////////////////////////////////////////////////////////////////////////////////////////////////
//--- CONSTANTS ---------------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////
const MIN_NAME_LEN = 2;
const MAX_NAME_LEN = 20;
const MIN_PASSWORD_LEN = 8;
const VALID_NAME: RegExp = /^[A-Za-z\s-']+$/;
const UPPER_LOWER_ALPHABET = /[a-zA-Z]/;
const DIGITS = /[0-9]/;
const INDEX_NOT_FOUND = -1;
const REMOVE_ONE_ITEM = 1;

///////////////////////////////////////////////////////////////////////////////////////////////////
//--- MAIN --------------------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Create a new message for a logged in user, then return the message id
 *
 * @param {string} session
 * @param {number} receiverId
 * @param {string} message
 * @returns {messageId: number}
 */
function messageSend(session: string, receiverId: number, message: string): { messageId: number } | ErrorObject {
  loadData();
  const data = getData();
  const validSession = checkSession(data, session);

  if (validSession == undefined) {
    return {
      error: 'INVALID_SESSION', 
      message: 'Session is invalid.'
    }
  }

  const senderId = validSession.userId;
  const receiver = data.users.find(user => user.userId === receiverId);

  if (receiver === undefined) {
    return {
      error: 'INVALID_USER', 
      message: 'Receiver does not exist.'
    }
  }

  if (senderId === receiverId) {
    return {
      error: 'INVALID_USER', 
      message: 'You cannot send a message to yourself.'
    }
  }

  if (message.length < 1 || message.length > 5000) {
    return {
      error: 'INVALID_MESSAGE', 
      message: 'Message must be in between 1 and 5000 characters.'
    }
  }

  const newMessage: Message = {
    messageId: data.messages.length,
    senderId: senderId,
    receiverId: receiverId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000)
  };

  data.messages.push(newMessage);
  saveData();

  return {
    messageId: newMessage.messageId
  };
}

/**
 * Returns list of messages between two users
 *
 * @param {string} session
 * @param {number} otherUserId
 * @returns {messages: Message[]} 
 */
function messageList(session: string, otherUserId: number): { messages: Message[] } | ErrorObject {
  loadData();
  const data = getData();

  const validSession = checkSession(data, session);

  if (validSession == undefined) {
    return {
      error: 'INVALID_SESSION', 
      message: 'Session is invalid.'
    }
  }

  const currentUserId = validSession.userId;
  const otherUser = data.users.find(user => user.userId === otherUserId);

  if (otherUser === undefined) {
    return {
      error: 'INVALID_USER', 
      message: 'User does not exist.'
    }
  }

  const messages = data.messages.filter(message => {
    const currentUserSentMsg = message.senderId === currentUserId && message.receiverId === otherUserId;

    const otherUserSentMsg = message.senderId === otherUserId && message.receiverId === currentUserId;

    return currentUserSentMsg || otherUserSentMsg;
  });

  messages.sort((a, b) => a.timeSent - b.timeSent);

  return {
    messages: messages
  };
}

export { 
  messageSend, 
  messageList 
}