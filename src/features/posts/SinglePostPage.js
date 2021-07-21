import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectPostById } from './postsSlice';
import { ReactionButtons } from './ReactionButtons';
import { TimeAgo } from './TimeAgo';
import { PostAuthor } from './PostAuthor';

export const SinglePostPage = ({match}) => {
  // React Router will pass in a match object as a prop that contains the URL information we're looking for
  const {postId} = match.params;

  // post will be equal to the whole array wich matched post.id
  // It's important to note that the component will re-render any time the value returned from useSelector
  // changes to a new reference. Components should always try to select the smallest possible amount of data
  // they need from the store, which will help ensure that it only renders when it actually needs to.
  const post = useSelector(state => selectPostById(state, postId));

  if(!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className='post'>
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className='post-content'>{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className='button'>
          Edit Post
        </Link>
      </article>
    </section>
  );
};