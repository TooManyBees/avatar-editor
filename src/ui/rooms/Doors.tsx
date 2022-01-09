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
		<SectionList header={<><h2>Exits</h2><AddButton onClick={() => Actions.addedDoor(roomId)}>Add door</AddButton></>}>
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

	return <>
		<li className={classnames(danger && sharedStyles.dangerTarget)}>
			<ToolRow>
				<SelectDirection value={door.direction} onUpdate={direction => dispatch(Actions.updatedDoor([roomId, {...door, direction}]))} />
				to
				<SelectVnum
					selectedId={door.toRoomId}
					items={rooms}
					onUpdate={toRoomId => dispatch(Actions.updatedDoor([roomId, {...door, toRoomId}]))}
				/>
				<div className={styles.spacer}/>
				<DeleteButton onHoverState={setDanger} onClick={() => Actions.removedDoor([roomId, door.id])}>Remove</DeleteButton>
			</ToolRow>
			<ToolRow>
				<SelectField name="Door" value={door.locks} options={LOCKS} onUpdate={locks => dispatch(Actions.updatedDoor([roomId, {...door, locks}]))} />
				<span className={noDoor ? styles.disabled : undefined}>with key</span>
				<SelectVnum
					selectedId={door.keyId}
					items={objects}
					onUpdate={keyId => dispatch(Actions.updatedDoor([roomId, {...door, keyId}]))}
					disabled={noDoor}
				/>
				<span className={noDoor ? styles.disabled : undefined}>starting</span>
				<SelectField
					value={reset?.state || -1}
					options={RESET_STATE}
					onUpdate={state => onDoorUpdate(door.direction, state)}
					disabled={noDoor}
				/>
			</ToolRow>
			<ToolRow>
				<KeywordField name="Keywords" value={door.keywords} onUpdate={keywords => dispatch(Actions.updatedDoor([roomId, {...door, keywords}]))} />
			</ToolRow>
			<TextArea name="Description" value={door.description} colors="door" onUpdate={description => dispatch(Actions.updatedDoor([roomId, {...door, description}]))} />
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

const RESET_STATE: { value: number, label: string }[] = [
	{ value: -1, label: "None"},
	{ value: 0, label: "Open" },
	{ value: 1, label: "Closed" },
	{ value: 2, label: "Locked" },
];
