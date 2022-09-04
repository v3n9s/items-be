import dataSource from './data-source';
import { Session } from './entities/session';
import { deleteSession } from './services/auth';

export const scheduleSessionDeletion = (sessionId: number, date: Date) => {
  const deltaTime = date.getTime() - Date.now();
  const deleteInMs = Math.min(
    Math.max(deltaTime, 0),
    2 ** 31 - 1
  );
  setTimeout(() => {
    deleteSession(sessionId);
  }, deleteInMs);
}

export const scheduleDeletion = async () => {
  const sessions = await dataSource.getRepository(Session).find();
  sessions.forEach((session) => {
    scheduleSessionDeletion(session.id, session.expiresAt);
  });
}
