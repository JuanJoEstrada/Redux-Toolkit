import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAllPosts, fetchPosts } from './postsSlice';
import { PostAuthor } from './PostAuthor';
import { ReactionButtons } from './ReactionButtons';
import { TimeAgo } from './TimeAgo';
// import { fetchUsers } from '../users/usersSlice';

const PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
      // dispatch(fetchUsers());
    }
  }, [postStatus, dispatch]);

  let content

  if (postStatus === 'loading') {
    // to make loding appear, make fakeapi delay in api/server.js
    // and uncomment this line  this.timing = 2000
    content = <div className="loader">Loading...</div>
  } else if (postStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    // to show the lastest posts first
  // slice because we need to not mutate, instead make a copy with slice
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map(post => (
      <PostExcerpt key={post.id} post={post} />
    ))
  } else if (postStatus === 'error') {
    content = <div>{error}</div>
  }

  // to show the lastest posts first
  // slice because we need to not mutate, instead make a copy with slice
  


  return (
    <section className='posts-list'>
      <h2>Posts</h2>
      {content}
      {/* {renderedPosts} */}
    </section>
  );
};