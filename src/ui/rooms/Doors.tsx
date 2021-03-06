import React, { useState } from "react";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Actions from "../../app/store/rooms";
import {
	addedDoorReset,
	updatedDoorReset,
	removedDoorReset,
} from "../../app/store/resets";
import { Room, Door, Objekt, DoorReset } from "../../app/models";
import {
	AddButton,
	DeleteButton,
	KeywordField,
	SectionList,
	SelectField,
	SelectVnum,
	TextArea,
	ToolRow,
} from "../components";
import SelectDirection from "./SelectDirection"
import SelectDoorState from "./SelectDoorState"
import styles from "./Doors.module.css";
import sharedStyles from "../components/shared.module.css";

interface Props {
	roomId: string,
	doors: Door[],
	rooms: Room[],
	objects: Objekt[],
}

export default function Doors({ roomId, doors, rooms, objects }: Props) {
	const dispatch = useAppDispatch();
	const resets = useAppSelector(state => state.resets.resets.door).filter(r => r.roomId === roomId);
	return (
		<SectionList header={<><h2>Exits</h2><AddButton onClick={() => dispatch(Actions.addedDoor(roomId))}>Add door</AddButton></>}>
			{doors.map(door => (
				<DoorItem key={door.id} roomId={roomId} door={door} rooms={rooms} objects={objects} reset={resets.find(r => r.direction === door.direction) || null} />
			))}
		</SectionList>
	);
}

interface DoorProps {
	roomId: string;
	door: Door;
	rooms: Room[];
	objects: Objekt[];
	reset: DoorReset | null;
}

function DoorItem({ roomId, door, rooms, objects, reset }: DoorProps) {
	const dispatch = useAppDispatch();
	const [danger, setDanger] = useState(false);

	const noDoor = door.locks <= 0;

	function onDoorUpdate(direction: number, state: number) {
		if (reset && state < 0) dispatch(removedDoorReset(reset.id));
		else if (reset) dispatch(updatedDoorReset({...reset, state}));
		else dispatch(addedDoorReset({ roomId, state, direction }));
	}

	const keywordsLabel = door.locks !== 0 ? "Keywords (must include \"door\" to be visible)" : "Keywords";

	return <>
		<li className={classnames(styles.door, danger && sharedStyles.dangerTarget)}>
			<ToolRow>
				<SelectDirection value={door.direction} onUpdate={direction => dispatch(Actions.updatedDoor([roomId, {...door, direction}]))} />
				<SelectVnum
					name="Destination"
					selectedId={door.toRoomId}
					items={rooms}
					onUpdate={toRoomId => dispatch(Actions.updatedDoor([roomId, {...door, toRoomId}]))}
					nothing="Nowhere (door desc, but no connection)"
				/>
			</ToolRow>
			<ToolRow>
				<SelectField name="Door type" value={door.locks} options={LOCKS} onUpdate={locks => dispatch(Actions.updatedDoor([roomId, {...door, locks}]))} />
				<SelectVnum
					name="Key"
					selectedId={door.keyId}
					items={objects}
					onUpdate={keyId => dispatch(Actions.updatedDoor([roomId, {...door, keyId}]))}
					disabled={noDoor}
				/>
				<SelectDoorState
					reset={reset}
					noDoor={noDoor}
					onUpdate={onDoorUpdate}
				/>
			</ToolRow>
			<ToolRow>
				<KeywordField name={keywordsLabel} value={door.keywords} onUpdate={keywords => dispatch(Actions.updatedDoor([roomId, {...door, keywords}]))} />
			</ToolRow>
			<TextArea name="Description" value={door.description} colors="door" onUpdate={description => dispatch(Actions.updatedDoor([roomId, {...door, description}]))} />
			<DeleteButton absolute onHoverState={setDanger} onClick={() => dispatch(Actions.removedDoor([roomId, door.id]))}>Remove</DeleteButton>
		</li>
		<hr className={styles.separator} />
	</>;
}

const LOCKS: { value: number, label: string }[] = [
	{ value: 0, label: "No door" },
	{ value: 1, label: "Plain door" },
	{ value: 2, label: "Pickproof" },
	{ value: 3, label: "Bashproof" },
	{ value: 4, label: "Passproof" },
	{ value: 5, label: "Pick/Pass-proof" },
	{ value: 6, label: "Bash/Pass-proof" },
	{ value: 7, label: "Pick/Bash-proof" },
	{ value: 8, label: "Everything-proof" },
];

