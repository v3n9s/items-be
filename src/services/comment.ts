import dataSource from '../data-source';
import { Comment } from '../entities/comment';

export const getComments = ({ itemId }: { itemId: number }) => {
  return dataSource.getRepository(Comment).find({
    where: {
      item: {
        id: itemId
      }
    }
  });
}

export const getComment = (id: number) => {
  return dataSource.getRepository(Comment).findOneBy({ id });
}

interface CreateCommentArgs {
  message: string;
  createDate: Date;
  itemId: number;
  userId: number;
}

export const createComment = ({
  message,
  createDate,
  itemId,
  userId
}: CreateCommentArgs) => {
  return dataSource.getRepository(Comment).save({
    message,
    createDate,
    item: {
      id: itemId
    },
    user: {
      id: userId
    }
  });
}

export const deleteComment = async (id: number) => {
  const existingComment = await dataSource.getRepository(Comment).findOneBy({ id });
  return existingComment
    ? dataSource.getRepository(Comment).remove(existingComment)
    : null;
}

export const isCommentBelongsToUser = async (commentId: number, userId: number) => {
  return !!(await dataSource.getRepository(Comment).findOneBy({
    id: commentId,
    user: {
      id: userId
    }
  }));
}
