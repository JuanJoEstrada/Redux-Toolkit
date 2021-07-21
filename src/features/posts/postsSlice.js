import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const initialState = {
  posts: [],
  status: 'idle',
  error: null
};

// createAsyncThunk accepts two arguments:
// A string that will be used as the prefix for the generated action types
// A "payload creator" callback function that should return a Promise containing some data, or a rejected Promise with an error
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts');
  return response.posts;
});

export const addNewPost = createAsyncThunk('posts/addNewPost',
  // we can send a request body like { title, content, user: userId } to the fake server
  async initialPost => {
    // we send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', { post: initialPost});
    // The response includes the complete post object, including unique ID
    // In most apps that save data to a server, the server will take care of generating
    // unique IDs and filling out any extra fields, and will usually return the completed data in its response.
    return response.post;
  } 
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // "prepare callback" function can take multiple arguments, generate random values like unique IDs,
    // and run whatever other synchronous logic is needed to decide what values go into the action object. 
    // It should then return an object with the payload field inside. 
    // postAdded(state, action) {
      // Since the posts slice only knows about the data it's responsible for,
      // the state argument will be the array of posts by itself, and not the entire Redux state object.
      // state.push(action.payload)
    // },
    //since you are fetchig the posts, you don't need to make this way
    // postAdded: {
    //   reducer(state, action) {
    //     state.posts.push(action.payload)
    //   },
    //   prepare(title, content, userId) {
    //     return {
    //       // Now our component doesn't have to worry about what the payload object looks like,
    //       // the action creator will take care of putting it together the right way
    //       // LOOK THE PAYLOAD IN AddPostForm.js
    //       payload: {
    //         id: nanoid(),
    //         date: new Date().toISOString(),
    //         title,
    //         content,
    //         user: userId,
    //         reactions: {
    //           thumbsUp: 0,
    //           hooray: 0,
    //           heart: 0,
    //           rocket: 0,
    //           eyes: 0,
    //         },
    //       }
    //     }
    //   }
    // },
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find(post => post.id === id);
      if(existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    // We could have calculated the new reaction counter value and put that in the action,
    // but it's always better to keep the action objects as small as possible,
    // and do the state update calculations in the reducer. 
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  // In this case, we need to listen for the "pending" and "fulfilled" action types dispatched by our fetchPosts thunk.
  // Those action creators are attached to our actual fetchPost function, and we can pass those to extraReducers to listen for those actions:
  // When the request starts, we'll set the status enum to 'loading'
  // If the request succeeds, we mark the status as 'succeeded', and add the fetched posts to state.posts
  // If the request fails, we'll mark the status as 'failed', and save any error message into the state so we can display it
  // In this case, we need to listen for the "pending" and "fulfilled" action types dispatched by our fetchPosts thunk.
  // Those action creators are attached to our actual fetchPost function, and we can pass those to extraReducers to listen for those actions
  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      // Add any fetched posts to the array
      // Once the Promise resolves, the fetchPosts thunk takes the response.posts array we returned from the callback,
      // and dispatches a 'posts/fetchPosts/fulfilled' action containing the posts array as action.payload:
      // concat because you want to combine two arrays
      state.posts = state.posts.concat(action.payload)
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [addNewPost.fulfilled]: (state, action) => {
      // We can directly add the new post object to our posts array
      // cant use concat because payload is an object, you push an object
      state.posts.push(action.payload);
    },
  },
});

// When we write the postAdded reducer function,
// createSlice will automatically generate an "action creator" function with the same name
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

// It would be nice if we didn't have to keep rewriting our components every time we made a change to the data format in our reducers.
// One way to avoid this is to define reusable selector functions in the slice files,
// and have the components use those selectors to extract the data they need instead of repeating the selector logic in each component.
// That way, if we do change our state structure again, we only need to update the code in the slice file.
export const selectAllPosts = state => state.posts.posts;
export const selectPostById = (state, postId) => {
  return state.posts.posts.find(post => post.id === postId);
};