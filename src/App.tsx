import React, { Dispatch, SetStateAction, ChangeEvent } from 'react';
import './App.css';
import { Area } from "./app/models";
import parseAreaFile from "./parser";
import Tabs from "./ui/tabs";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { loaded } from "./app/store/ui";
import { init as initArea } from "./app/store/area-section";
import { init as initMobs } from "./app/store/mobiles";
import { init as initObjs } from "./app/store/objects";
import { init as initRooms } from "./app/store/rooms";

function ReadAreaForm({onRead}: {onRead: (a: Area) => void}) {
	function onChange(event: ChangeEvent<HTMLInputElement>) {
		let input = event.currentTarget;
		if (input.files && input.files.length > 0) {
			let fileReader = new FileReader();
			fileReader.onload = (event: ProgressEvent<FileReader>) => {
				if (event.target && typeof event.target.result === "string") {
					let parsed = parseAreaFile(event.target.result);
					onRead(parsed);
				}
			};
			fileReader.readAsText(input.files[0]);
		}
	}
	return (
		<form>
			<input type="file" onChange={onChange} />
		</form>
	);
}

function App() {
	const dispatch = useAppDispatch();
	const isLoaded = useAppSelector(state => state.ui.loaded);

	function onRead(area: Area) {
		dispatch(initArea([area.area, area.areadata]));
		dispatch(initMobs(area.mobiles));
		dispatch(initObjs(area.objects));
		dispatch(initRooms(area.rooms));
		dispatch(loaded());
	}

	return (
		<div className="App">
			{ isLoaded ?
				<Tabs /> :
				<ReadAreaForm onRead={onRead} />
			}
		</div>
	);
}

export default App;
