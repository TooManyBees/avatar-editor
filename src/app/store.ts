import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./store/ui";
import areaReducer from "./store/area-section";
import areadataReducer from "./store/areadata";
import mobilesReducer from "./store/mobiles";
import objectsReducer from "./store/objects";
import roomsReducer from "./store/rooms";
import resetsReducer from "./store/resets";
import specialsReducer from "./store/specials";

export const store = configureStore({
	reducer: {
		ui: uiReducer,
		area: areaReducer,
		areadata: areadataReducer,
		mobiles: mobilesReducer,
		objects: objectsReducer,
		rooms: roomsReducer,
		resets: resetsReducer,
		specials: specialsReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
