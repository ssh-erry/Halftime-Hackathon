///////////////////////////////////////////////////////////////////////////////////////////////////
//--- IMPORTS -----------------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////
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
//--- HELPERS -----------------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////
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
 * Checks if a session is valid
 *
 * @param {DataStore} data
 * @param {string} session
 * @returns {Users | undefined}
 */
export function checkSession(data: DataStore, session: string): Session | undefined {
  return data.sessions.find(user => user.sessionId.includes(session));
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
 * Create hash of a password
 *
 * @param {string} password
 * @returns {string}
 */
export function getHashOf(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
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

///////////////////////////////////////////////////////////////////////////////////////////////////
//--- MAIN --------------------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Register a user with an email, password, and names, then return their session value.
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
  password = getHashOf(password)
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
    age: -1,
    bio: '',
    gym: '',
    location: '',
    goals: '',
    gender: '',
    gym_experience: -1 
  };

  // Creates new session
  const session: Session = {
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

/**
 * Given a registered user's email and password, return their session value.
 *
 * @param {string} email
 * @param {string} password
 * @returns {session: string}
 */
function adminAuthLogin(email: string, password: string): { session: string } | ErrorObject {
  loadData()
  const data: DataStore = getData();

  // Check to see if the user with the corresponding email exists
  const emailCheck: User | undefined = checkEmail(data, email);

  // Checks if password is correct and returns session or error message
  if (emailCheck) {
    if (emailCheck.password === getHashOf(password)) {
      const userId = 
      emailCheck.numFailedPasswordsSinceLastLogin = 0;
      emailCheck.numSuccessfulLogins++;

      const sessionId = crypto.randomUUID();
      const session: Session = {
        sessionId: sessionId,
        userId: emailCheck.userId
      }
      
      data.sessions.push(session);
      saveData();

      return {
        session: sessionId
      };
      // If password is incorrect return error
    } else {
      emailCheck.numFailedPasswordsSinceLastLogin++;
      saveData();
      return {
        error: 'INVALID_CREDENTIALS',
        message: 'Password is not correct for the given email.'
      }
    }
  }

  // If email address does not exist, return error 
  return {
    error: 'INVALID_CREDENTIALS',
    message:  'Given email address does not exist.'
  }
}

/**
  * Given a user's userId, return details about the user.
  *
  * @param {int} userId - user's userId
  *
  * @returns {object} - user's userId is valid
*/
function adminUserDetails(userId: number) {
  // Loading data
  loadData();
  const data = getData();
  for (const user of data.users) {
    if (userId === user.userId) {
      // Saving data
      saveData();

      return {
        user: {
          userId: user.userId,
          name: `${user.nameFirst} ${user.nameLast}`,
          email: user.email,
          numSuccessfulLogins: user.numSuccessfulLogins,
          numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
          age: user.age,
          profilePic: user.profilePic,
          bio: user.bio,
          gym: user.gym,
          location: user.location,
          goals: user.goals,
          gender: user.gender,
          gym_experience: user.gym_experience
        }
      };
    };
  };
};

/**
 * Given a user's userId and a set of properties, update the properties of this logged in user.
 *
 * @param {int} userId
 * @param {string} email
 * @param {string} nameFirst
 * @param {string} nameLast
 * @param {int} age
 * @param {File} profilePic
 * @param {string} bio
 * @param {string} gym
 * @param {string} location
 * @param {string} goals
 * @param {string} gender
 * @param {int} gym_experience
 * @returns {empty}
 */
function adminUserDetailsUpdate(userId: number, email: string, nameFirst: string, nameLast: string, age: number, profilePic: File,
  bio: string, gym: string, location: string, goals: string, gender: string, gym_experience: number): EmptyObject | ErrorObject {
  // All fields except profilePic, bio, location, goals must have a value
  loadData();
  const data = getData();
  const user = data.users.find(user => user.userId === userId)

  // Checking whether fields are empty
  // If there is no age found, return error 
  if (user.age === INDEX_NOT_FOUND) {
    return {
      error: 'AGE_NOT_FOUND',
      message: 'Age not present, please input age!'
    }
  }

  // If there is no gym found, return error
  if (user.gym === '') {
    return {
      error: 'GYM_NOT_FOUND',
      message: 'Gym branch not present, please input gym branch!'
    }
  }

  if (user.gender === '') {
    return {
      error: 'GENDER_NOT_FOUND',
      message: 'Gender not present, '
    }
  }

  // Error checks
  // If email is invalid
  if (email === '' || email === undefined) {
    return {
      error: 'INVALID_EMAIL',
      message: 'Invalid email: address cannot be an empty string'
    }
  };
  if (validator.isEmail(email) === false) {
    return {
      error: 'INVALID_EMAIL',
      message: 'Invalid email: address provided is not a valid email address'
    }
  };

  // If can find email and it's not the same user, it is invalid
  if (data.users.find(u => u.email === email && u.userId !== userId)) {
    return {
      error: 'INVALID_EMAIL',
      message: 'Invalid email: email is currently used by another user'
    }
  };

  // Check valid nameFirst characters
  if (!VALID_NAME.test(nameFirst)) {
    return {
      error: 'INVALID_FIRST_NAME',
      message: 'Invalid first name: name contains invalid characters'
    }
  };
  // Check valid nameFirst length
  if (!checkNameLength(nameFirst.length)) {
    return {
      error: 'INVALID_FIRST_NAME',
      message: 'Invalid first name: name is not within acceptable character range (2-20)'
    }
  };

  // Check valid nameLast characters
  if (!VALID_NAME.test(nameLast)) {
    return {
      error: 'INVALID_LAST_NAME',
      message: 'Invalid last name: name contains invalid characters'
    }
  };

  // Check valid nameLast length
  if (!checkNameLength(nameLast.length)) {
    return {
      error: 'INVALID_LAST_NAME',
      message:'Invalid last name: name is not within acceptable character range (2-20)'
    }
  };

  // NEED MORE ERROR CHECKS FOR AGE...GYM_EXPERIENCE

  for (const user of data.users) {
    if (userId === user.userId) {
      user.email = email;
      user.nameFirst = nameFirst;
      user.nameLast = nameLast;
      user.age = age;
      user.profilePic = profilePic;
      user.bio = bio;
      user.gym = gym;
      user.location = location;
      user.goals = goals;
      user.gender = gender;
      user.gym_experience = gym_experience
    }
  }

  // Saving data
  saveData();

  return { };
}


export {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate
}





