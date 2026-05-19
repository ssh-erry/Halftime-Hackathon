// User registration etc 

import crypto from 'crypto'
import validator from 'validator';
import { 
  DataStore,
  User,
  Session,
  ErrorObject,
  EmptyObject,
  getData, 
  loadData,
  saveData 
} from './dataStore'

// Constants
const MIN_NAME_LEN = 2;
const MAX_NAME_LEN = 20;
const MIN_PASSWORD_LEN = 8;
const VALID_NAME: RegExp = /^[A-Za-z\s-']+$/;
const UPPER_LOWER_ALPHABET = /[a-zA-Z]/;
const DIGITS = /[0-9]/;
const INDEX_NOT_FOUND = -1;
const REMOVE_ONE_ITEM = 1;

/**
 * Register a user with an email, password, and names, then return their session
 * value.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} nameFirst
 * @param {string} nameLast
 * @returns {session: string}
 */
function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): { session: string } | ErrorObject {
  // Loads data 
  loadData();
  const data = getData();

  // Invalid email, return error
  const userExists: User | undefined = checkEmail(data, email)
  if (userExists) {
    return {
      error: 'INVALID_EMAIL', 
      message: 'Email address is used by another user.'
    }
  } else if (!validator.isEmail(email)) {
    return {
      error: 'INVALID_EMAIL', 
      message: 'Email does not satisfy this: https://www.npmjs.com/package/validator (validator.isEmail function).'
    }
  }

  // Invalid first name, return error
  if (!VALID_NAME.test(nameFirst)) {
    return {
      error: 'INVALID_FIRST_NAME',
      message: 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
    }
  } else if (!checkNameLength(nameFirst.length)) {
    return {
      error: 'INVALID_FIRST_NAME',
      message: 'NameFirst is less than 2 characters or more than 20 characters.'
    }
  }

  // Invalid last name, return error
  if (!VALID_NAME.test(nameLast)) {
    return {
      error: 'INVALID_LAST_NAME',
      message: 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
    }
  } else if (!checkNameLength(nameLast.length)) {
    return {
      error: 'INVALID_LAST_NAME',
      message: 'nameLast is less than 2 characters or more than 20 characters.'
    }
  }

  // Invalid password, return error
  if (!checkPasswordLen(password.length)) {
    return {
      error: 'INVALID_PASSWORD',
      message: 'Password is less than 8 characters.'
    }
  } else if (!checkPasswordCharacters(password)) {
    return {
      error: 'INVALID_PASSWORD',
      message: 'Password does not contain at least one number and at least one letter.'
    }
  }

  // Create new user
  const sessionId = crypto.randomUUID();
  password = crypto.createHash('sha256').update(password).digest('hex');
  const userId = data.users.length;

  const newUser: User = {
    userId: userId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: password,
    usedPasswords: [password],
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
  };

  // Creates new session
  const session = {
    sessionId: sessionId,
    userId: userId
  };

  // Pushes new user and session to dataStore
  data.users.push(newUser);
  data.sessions.push(session);
  saveData();

  // Return the session of the new user
  return {
    session: sessionId
  };
}

export { adminAuthRegister }

// Helper Functions

/**
 * Checks to see if the user with the given email exists
 *
 * @param {object} data
 * @param {string} email
 * @returns {Users | undefined}
 */
export function checkEmail(data: DataStore, email: string): User | undefined {
  return data.users.find(user => user.email === email);
}

/**
 * Checks if a password reaches the minimum valid length
 *
 * @param {string} passwordLen
 * @returns {boolean}
 */
export function checkPasswordLen(passwordLen: number): boolean {
  if (passwordLen < MIN_PASSWORD_LEN) {
    return false;
  }
  return true;
}

/**
 * Checks if a given name length is valid or invalid
 *
 * @param {string} name
 * @returns {boolean}
 */
export function checkNameLength(nameLen: number): boolean {
  if (nameLen < MIN_NAME_LEN || nameLen > MAX_NAME_LEN) {
    return false;
  }
  return true;
}

/**
 * Checks if the characters in a password are valid or not
 *
 * @param {string} password
 * @returns {boolean}
 */
export function checkPasswordCharacters(password: string): boolean {
  if (!UPPER_LOWER_ALPHABET.test(password) || !DIGITS.test(password)) {
    return false;
  }
  return true;
}





