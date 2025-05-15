/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  ChainSocial,
  ChainSocial_CommentAdded,
  ChainSocial_Followed,
  ChainSocial_PostCreated,
  ChainSocial_PostLiked,
  ChainSocial_Unfollowed,
  ChainSocial_UserCreated,
} from "generated";

ChainSocial.CommentAdded.handler(async ({ event, context }) => {
  const entity: ChainSocial_CommentAdded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    commentId: event.params.commentId,
    postId: event.params.postId,
    author: event.params.author,
    content: event.params.content,
  };

  context.ChainSocial_CommentAdded.set(entity);
});

ChainSocial.Followed.handler(async ({ event, context }) => {
  const entity: ChainSocial_Followed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    follower: event.params.follower,
    followed: event.params.followed,
  };

  context.ChainSocial_Followed.set(entity);
});

ChainSocial.PostCreated.handler(async ({ event, context }) => {
  const entity: ChainSocial_PostCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    postId: event.params.postId,
    author: event.params.author,
    content: event.params.content,
  };

  context.ChainSocial_PostCreated.set(entity);
});

ChainSocial.PostLiked.handler(async ({ event, context }) => {
  const entity: ChainSocial_PostLiked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    postId: event.params.postId,
    liker: event.params.liker,
  };

  context.ChainSocial_PostLiked.set(entity);
});

ChainSocial.Unfollowed.handler(async ({ event, context }) => {
  const entity: ChainSocial_Unfollowed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    follower: event.params.follower,
    followed: event.params.followed,
  };

  context.ChainSocial_Unfollowed.set(entity);
});

ChainSocial.UserCreated.handler(async ({ event, context }) => {
  const entity: ChainSocial_UserCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    userAddress: event.params.userAddress,
    username: event.params.username,
  };

  context.ChainSocial_UserCreated.set(entity);
});
