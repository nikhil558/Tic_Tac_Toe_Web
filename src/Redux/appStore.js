import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./userSlice";
import GameReducer from "./gameSlice";

const appStore = configureStore({
  reducer: {
    user: UserReducer,
    game: GameReducer,
  },
});

export default appStore;
