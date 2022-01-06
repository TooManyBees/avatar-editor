import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./store/ui";
import areaReducer from "./store/area-section";
import areadataReducer from "./store/areadata";
import mobilesReducer from "./store/mobiles";
import objectsReducer from "./store/objects";
import roomsReducer from "./store/rooms";
import resetsReducer from "./store/resets";
import shopsReducer from "./store/shops";

export const store = configureStore({
	reducer: {
		ui: uiReducer,
		area: areaReducer,
		areadata: areadataReducer,
		mobiles: mobilesReducer,
		objects: objectsReducer,
		rooms: roomsReducer,
		resets: resetsReducer,
		shops: shopsReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

let unsavedChanges = false;

function warnOnUnload(event: BeforeUnloadEvent) {
	event.preventDefault();
	const result = confirm("There's no edit history on this app. Really leave?");
	if (result) dismissUnsavedChanges();
	return result;
}

let previousState: RootState = store.getState();
let RELEVANT_STATE_KEYS: (keyof RootState)[] = [
	"area", "areadata", "mobiles", "objects", "rooms", "resets", "shops",
];

store.subscribe(() => {
	const newState = store.getState();
	if (newState !== previousState && RELEVANT_STATE_KEYS.reduce((acc, key) => acc || newState[key] !== previousState[key], false)) {
		window.addEventListener("beforeunload", warnOnUnload);
		// console.debug("Marking unsaved changes");
	}
	previousState = newState;
});

export function dismissUnsavedChanges() {
	window.removeEventListener("beforeunload", warnOnUnload);
	console.debug("Dismissing unsaved changes");
}
