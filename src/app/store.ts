import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./store/ui";
import mobilesReducer from "./store/mobiles";
import objectsReducer from "./store/objects";
import roomsReducer from "./store/rooms";

export const store = configureStore({
	reducer: {
		ui: uiReducer,
		mobiles: mobilesReducer,
		objects: objectsReducer,
		rooms: roomsReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;