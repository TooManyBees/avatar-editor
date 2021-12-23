import React, { Dispatch, SetStateAction, ChangeEvent } from 'react';
import './App.css';
import parseAreaFile, { Area } from "./parser";
import MobileForm from "./ui/MobileForm";
import VnumList from "./ui/VnumList";

function ReadAreaForm({onRead}: {onRead: Dispatch<SetStateAction<Area | null>>}) {
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
	const [areaFile, setAreaFile] = React.useState<Area | null>(null);
	return (
		<div className="App">
			{ areaFile && areaFile.mobiles[0] ?
				<VnumList items={areaFile.mobiles} FormComponent={MobileForm} /> :
				<ReadAreaForm onRead={setAreaFile} />
			}
		</div>
	);
}

export default App;
