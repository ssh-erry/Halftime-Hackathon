///////////////////////////////////////////////////////////////////////////////////////////////////
//--- IMPORTS -----------------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////
import fs from 'fs';

///////////////////////////////////////////////////////////////////////////////////////////////////
//--- INTERFACES --------------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////
export interface User {
  userId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  password: string;
  usedPasswords: string[];
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
}

export interface Session {
  sessionId: string;
  userId: number;
}

export interface ErrorObject {
  error: string;
  message: string;
}

export type EmptyObject = Record<never, never>;

export interface DataStore {
  users: User[];
  sessions: Session[];
}

const data: DataStore = {
  users: [],
  sessions: []
};

///////////////////////////////////////////////////////////////////////////////////////////////////
//--- FUNCTIONS ---------------------------------------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Retrieves data
 * 
 * @param {null}
 * 
 * @returns {data}
 */
function getData() {
  return data;
}

/**
 * Saves data to data.json
 * 
 * @param {null}
 * 
 * @returns {null}
 */
function saveData() {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

/**
 * Loads data from data.json
 * 
 * @param {null}
 * 
 * @returns {null}
 */
function loadData() {
  const loadedData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

  data.users = loadedData.users;
  data.sessions = loadedData.sessions;
}

export {
  getData,
  saveData,
  loadData
};
