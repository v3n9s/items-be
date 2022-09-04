import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import config from '../config';
import dataSource from '../data-source';
import { Session } from '../entities/session';
import { User } from '../entities/user';
import { scheduleSessionDeletion } from '../session-deletion-scheduler';
import { getUser } from './user';

const getTokens = async (userId: number, sessionId: number) => {
  const accessToken = sign({ userId, sessionId }, config.JWT_ACCESS_SECRET_KEY, {
    expiresIn: `${config.JWT_ACCESS_EXPIRE_MS}ms`
  });
  const refreshToken = sign({ userId, sessionId }, config.JWT_REFRESH_SECRET_KEY, {
    expiresIn: `${config.JWT_REFRESH_EXPIRE_MS}ms`
  });

  return { accessToken, refreshToken };
}

export const refreshUserTokens = async (userId: number, sessionId: number) => {
  const session = await dataSource.getRepository(Session).findOneBy({
    id: sessionId,
    user: {
      id: userId
    }
  });
  if (session) {
    dataSource.getRepository(Session).delete({ id: sessionId });
  }
  return session && session.expiresAt > new Date() ? getTokens(userId, sessionId) : null;
}

export const registerUser = async (name: string, password: string) => {
  if (await dataSource.getRepository(User).findOneBy({ name })) {
    return null;
  }
  const passwordHash = await hash(password, 10);
  return dataSource.getRepository(User).save({ name, password: passwordHash });
}

export const loginUser = async (name: string, password: string) => {
  const user = await dataSource.getRepository(User).findOne({
    where: {
      name
    },
    select: {
      id: true,
      password: true
    }
  });
  if (!user || !(await compare(password, user.password))) {
    return null;
  }
  const session = await dataSource.getRepository(Session).save({
    user: { id: user.id },
    expiresAt: new Date(Date.now() + config.JWT_REFRESH_EXPIRE_MS)
  });
  const tokens = await getTokens(user.id, session.id);
  scheduleSessionDeletion(session.id, session.expiresAt);
  const safeUser = (await getUser({ name }))!;
  return {
    user: safeUser,
    ...tokens
  };
}

export const deleteSession = async (sessionId: number) => {
  const session = await dataSource.getRepository(Session).findOneBy({
    id: sessionId
  });
  if (session) {
    await dataSource.getRepository(Session).remove(session);
    return true;
  }
  return false;
}

export const isSessionExist = async (sessionId: number) => {
  return !!(await dataSource.getRepository(Session).findOneBy({ id: sessionId }));
}
