import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  id: '',
  nick: '',
  email: '',
  desc: '',
  accessToken: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.desc = action.payload.desc;
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
