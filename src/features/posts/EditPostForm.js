import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// you can see when you call useHistory, you obtain an array
import { useHistory } from 'react-router-dom';

import { postUpdated, selectPostById } from './postsSlice';

export const EditPostForm = ({ match }) => {
  const { postId } = match.params;

  const post = useSelector(state => selectPostById(state, postId));

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const dispatch = useDispatch();
  const history = useHistory();

  const onTitleChanged = e => setTitle(e.target.value);
  const onContentChanged = e => setContent(e.target.value);

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(
        // what if we needed to dispatch the same action from different components, or the logic for preparing the payload is complicated? 
        // We'd have to duplicate that logic every time we wanted to dispatch the action, and we're forcing the component to know exactly what the payload for this action should look like.
        // notice we are repeating code (action) from AddPostFrom.js Again, reducers cannot calculate 
        // random things like nanoid(). However, we can use "prepare callback" to do it in reducer, with this
        // we'll not repeat actions. WATCH postAdded() in postsSlice.js
        postUpdated({
          id: postId,
          title,
          content
        })
      );
      // redirect to this path
      history.push(`/post/${postId}`)
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  );
};
