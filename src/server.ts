import express, { json, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminAuthLogout
} from './auth';
import { ErrorObject } from './dataStore';

const app = express();
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
const HOST = config.host;
const PORT = config.port;

// Middleware
app.use(json());
app.use(morgan('dev'));
app.use(cors());

// Helper to check if result is an ErrorObject
function isError(result: any): result is ErrorObject {
  return result && typeof result.error === 'string';
}

// auth.ts routes
app.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    const result = adminAuthRegister(email, password, nameFirst, nameLast);

    if (isError(result)) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong' });
  }
});

app.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = adminAuthLogin(email, password);

    if (isError(result)) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong' });
  }
});

app.post('/auth/logout', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const result = adminAuthLogout(sessionId);

    if (isError(result)) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong' });
  }
});

app.get('/user/details', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.query.userId as string);
    const result = adminUserDetails(userId);

    if (isError(result)) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong' });
  }
});

app.put('/user/details', (req: Request, res: Response) => {
  try {
    const { userId, email, nameFirst, nameLast, dob, profilePic, bio, gym, location, goals, gender, gym_experience } = req.body;
    const result = adminUserDetailsUpdate(userId, email, nameFirst, nameLast, dob, profilePic, bio, gym, location, goals, gender, gym_experience);

    if (isError(result)) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong' });
  }
});

app.put('/user/password', (req: Request, res: Response) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const result = adminUserPasswordUpdate(userId, oldPassword, newPassword);

    if (isError(result)) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong' });
  }
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
});

try {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});

export default app;