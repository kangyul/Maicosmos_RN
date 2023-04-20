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
      state.nick = action.payload.nick;
      state.accessToken = action.payload.accessToken;
    },
    setNick(state, action) {
      state.nick = action.payload;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
