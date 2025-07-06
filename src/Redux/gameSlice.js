import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "Game",
  initialState: { players: null, isOnline: false },
  reducers: {
    addGameInfo: (state, action) => {
      return action.payload;
    },
    resetGameInfo: () => {
      return { players: null, isOnline: false };
    },
  },
});

export const { addGameInfo, resetGameInfo } = gameSlice.actions;

export default gameSlice.reducer;
