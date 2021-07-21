import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { addNewPost } from './postsSlice';

// import { postAdded } from './postsSlice';

export const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const dispatch = useDispatch();

  const users = useSelector(state => state.users);

  const onTitleChanged = e => setTitle(e.target.value);
  const onContentChanged = e => setContent(e.target.value);
  const onAuthorChanged = e => setUserId(e.target.value);

  // const canSave = Boolean(title) && Boolean(content) && Boolean(userId);
  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

  const onSavePostClicked = async () => {
    // notice there are two ways to handle response from post request
    // one is here and the other in postsSlice [fetchPosts.fulfilled]
    if(canSave) {
      try {
        // user can't accidentally try to save a post twice
        setAddRequestStatus('pending');
        // When we call dispatch(addNewPost()), the async thunk returns a Promise from dispatch.
        // We can await that promise here to know when the thunk has finished its request.
        // But, we don't yet know if that request succeeded or failed.
        const resultAction = await dispatch (
          addNewPost({ title, content, user: userId })
        );
        // createAsyncThunk handles any errors internally, so that we don't see any messages about "rejected Promises" in our logs.
        // It then returns the final action it dispatched: either the fulfilled action if it succeeded, or the rejected action if it failed. See postsSlice again
        // Redux Toolkit has a utility function called unwrapResult that will return either the actual action.payload value from a fulfilled action,
        // or throw an error if it's the rejected action. This lets us handle success and failure in the component using normal try/catch logic
        unwrapResult(resultAction); // you cannot process this code if addNewPost is done, that's why you are awaiting it
      } catch (err) {
        console.error('Failed to save the post:', err);
      } finally {
        setAddRequestStatus('idle');
      }
      // dispatch(
        // Reducers should never calculate random values, because that makes the results unpredictable
        // just inside actions
        // postAdded({
        //   id: nanoid(),
        //   title: title,
        //   content: content
        // })
        // postAdded(title, content, userId)
      // );
      setTitle('');
      setContent('');
    };
  };



  const usersOptions = users.map(user => {
    return (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    );
  });

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
      {/* For must be linked with id */}
        <label htmlFor='postTitle'>Post Title:</label>
        <input
          type='text'
          id='postTitle'
          name='postTitle'
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor='postAuthor'>Author:</label>
        <select id='postAuthor' value={userId} onChange={onAuthorChanged}> 
          <option value=''></option>
          {usersOptions}
        </select>
        <label htmlFor='postContent'>Content:</label>
        <textarea
          id='postContent'
          name='postContent'
          value={content}
          onChange={onContentChanged}
        />
        {/* you can put onSavePostClicked in form with submit, use prevendeffault() */}
        <button type='button' onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
      </form>
    </section>
  );
};