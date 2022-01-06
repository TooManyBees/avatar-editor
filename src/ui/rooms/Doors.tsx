import React, { useState } from "react";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Actions from "../../app/store/rooms";
import { Room, Door, Objekt } from "../../app/models";
import {
	AddButton,
	DeleteButton,
	KeywordField,
	Section,
	SelectField,
	SelectVnum,
	TextArea,
	ToolRow,
} from "../components";
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
	return (
		<Section header={<><h2>Exits</h2><AddButton onClick={() => Actions.addedDoor(roomId)}>Add door</AddButton></>}>
			<ol className={styles.doors}>
				{doors.map(door => (
					<DoorItem key={door.id} roomId={roomId} door={door} rooms={rooms} objects={objects} />
				))}
			</ol>
		</Section>
	);
}

interface DoorProps {
	roomId: string;
	door: Door;
	rooms: Room[];
	objects: Objekt[];
}

function DoorItem({ roomId, door, rooms, objects }: DoorProps) {
	const dispatch = useAppDispatch();
	const [danger, setDanger] = useState(false);
	return <>
		<li className={classnames(styles.door, danger && sharedStyles.dangerTarget)}>
			<ToolRow>
				<SelectField name="Direction" value={door.direction} options={DIRECTIONS} onUpdate={direction => dispatch(Actions.updatedDoor([roomId, {...door, direction}]))} />
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
				{door.locks > 0 && (
					<>
						Key:
						<SelectVnum
							selectedId={door.keyId}
							items={objects}
							onUpdate={keyId => dispatch(Actions.updatedDoor([roomId, {...door, keyId}]))}
						/>
						{/* door reset */}
					</>
				)}
			</ToolRow>
			<ToolRow>
				<KeywordField name="Keywords" value={door.keywords} onUpdate={keywords => dispatch(Actions.updatedDoor([roomId, {...door, keywords}]))} />
			</ToolRow>
			<TextArea name="Description" value={door.description} onUpdate={description => dispatch(Actions.updatedDoor([roomId, {...door, description}]))} />
		</li>
		<hr className={styles.separator} />
	</>;
}

const DIRECTIONS: { value: number, label: string }[] = [
	{ value: 0, label: "North" },
	{ value: 1, label: "East" },
	{ value: 2, label: "South" },
	{ value: 3, label: "West" },
	{ value: 4, label: "Up" },
	{ value: 5, label: "Down" },
];

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
