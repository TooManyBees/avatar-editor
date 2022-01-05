import React, { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { Area } from "./app/models";
import parseAreaFile from "./parser";
import { Button } from "./ui/components";
import Tabs from "./ui/tabs";

import styles from './App.module.css';

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { loaded } from "./app/store/ui";
import { init as initArea } from "./app/store/area-section";
import { init as initAreadata } from "./app/store/areadata";
import { init as initMobs } from "./app/store/mobiles";
import { init as initObjs } from "./app/store/objects";
import { init as initRooms } from "./app/store/rooms";
import { init as initResets } from "./app/store/resets";
import { init as initShops } from "./app/store/shops";

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
		<label className={styles.fileInput}>
			<span className={styles.button} role="button">Load .are file</span>
			<input type="file" onChange={onChange} />
		</label>
	);
}

function InitForm() {
	const dispatch = useAppDispatch();

	function onRead(area: Area) {
		dispatch(initArea([area.area, area.helps]));
		dispatch(initAreadata(area.areadata));
		dispatch(initMobs([area.mobiles, area.orphanedSpecials]));
		dispatch(initObjs(area.objects));
		dispatch(initRooms(area.rooms));
		dispatch(initResets(area.resets));
		dispatch(initShops([area.shops, area.orphanedShops]));
		dispatch(loaded());
	}

	return (
		<div className={styles.setupWrapper}>
			<div className={styles.setupControls}>
				<ReadAreaForm onRead={onRead} />
				or
				<Button onClick={() => dispatch(loaded())}>Start new area</Button>
			</div>
		</div>
	);
}

function App() {
	const isLoaded = useAppSelector(state => state.ui.loaded);

	return (
		<div className={styles.app}>
			{ isLoaded ?
				<Tabs /> :
				<InitForm />
			}
		</div>
	);
}

export default App;
