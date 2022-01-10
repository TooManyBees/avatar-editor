import React, { ChangeEvent } from 'react';
import { Area } from "./app/models";
import parseAreaFile from "./parser";
import { Button } from "./ui/components";
import Tabs from "./ui/tabs";

import styles from './App.module.css';

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { dismissUnsavedChanges } from "./app/store";
import { loaded } from "./app/store/ui";
import { init as initArea } from "./app/store/area-section";
import { init as initAreadata } from "./app/store/areadata";
import { init as initMobs } from "./app/store/mobiles";
import { init as initObjs } from "./app/store/objects";
import { init as initRooms } from "./app/store/rooms";
import { init as initResets } from "./app/store/resets";

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
		dispatch(initMobs([area.mobiles, area.orphanedSpecials, area.orphanedShops]));
		dispatch(initObjs(area.objects));
		dispatch(initRooms(area.rooms));
		dispatch(initResets(area.resets));
		dispatch(loaded());
		dismissUnsavedChanges();
	}

	return (
		<div className={styles.setupWrapper}>
			<img className={styles.logo} src={`${process.env.PUBLIC_URL}/legendora-desktop.png`} aria-hidden="true" />
			<h1>Midgaard Royal Surveyor's Guild</h1>
			<div className={styles.setupControls}>
				<ReadAreaForm onRead={onRead} />
				or
				<Button onClick={() => dispatch(loaded())}>Start new area</Button>
			</div>
			<p className={styles.disclaimer}>
				The <em>Royal Surveyors' Guild</em> is provided without warranty, yadda yadda.
				Listen, it's mostly done, but has rough edges. Scevine doesn't guarantee that
				you'll never click "back" or smash F5 and lose all your work. Scevine doesn't
				guarantee that it preserves 100% of an area's fidelity, especially around the
				really fiddly bits of <code>.are</code> files. Screenreader accessibility and
				keyboard nav are going to improve.
			</p>
			<ul className={styles.disclaimer}>
				<li><strong>Do</strong> regularly export to <code>.are</code> file and save your work locally.</li>
				<li><strong>Don't</strong> stop using an area file syntax checker.</li>
				<li><strong>Don't</strong> rely 100% on this (yet!)</li>
				<li><strong>Do</strong> use your own version control to verify any changes this app makes to an area.</li>
				<li><strong>Do</strong> contact Scevine with bug reports or feature requests.</li>
			</ul>
			<p className={styles.credits}>
				This whole shebang is ©42069 Jess Bees (Scevine). Source hosted on <a href="https://github.com/TooManyBees/avatar-editor">GitHub</a>. Icons by <a href="https://iconarchive.com/show/legendora-icons-by-raindropmemory/Desktop-icon.html">Teekatas Suwannakrua</a>.
			</p>
		</div>
	);
}

function App() {
	const isLoaded = useAppSelector(state => state.ui.loaded);

	return (
		<div className={styles.app} aria-live="polite">
			{ isLoaded ?
				<Tabs /> :
				<InitForm />
			}
		</div>
	);
}

export default App;
