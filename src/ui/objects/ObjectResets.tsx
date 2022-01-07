import React, { useState } from "react";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
	addedObjectReset,
	updatedObjectReset,
	removedObjectReset,
	addedInObjectReset,
	updatedInObjectReset,
	removedInObjectReset,
} from "../../app/store/resets";
import { selectedMobileId } from "../../app/store/ui";
import {
	ObjectReset as ObjectResetType,
	InObjectReset as InObjectResetType,
	Objekt,
	Room,
} from "../../app/models";
import {
	AddButton,
	DeleteButton,
	LinkButton,
	NumberField,
	Row,
	SectionList,
	SelectVnum,
	TextField,
	ToolRow,
} from "../components";
import styles from "./ObjectResets.module.css";
import sharedStyles from "../components/shared.module.css";
import reciprocalStyles from "../components/ReciprocalResets.module.css";

import ReactSelect, { CSSObjectWithLabel } from "react-select";

interface Props {
	objectId: string;
}

export default function ObjectResets(props: Props) {
	const dispatch = useAppDispatch();
	const { objectId } = props;
	const objectResets = useAppSelector(state => state.resets.resets.object.filter(r => r.objectId === objectId));
	const inObjectResets = useAppSelector(state => state.resets.resets.inObject.filter(r => r.objectId === objectId));
	const rooms = useAppSelector(state => state.rooms.rooms);
	const objects = useAppSelector(state => state.objects.objects);
	return <>
		<SectionList header={<><h2>In-room resets</h2> ({objectResets.length}) <AddButton onClick={() => dispatch(addedObjectReset(objectId))}>Add reset</AddButton></>}>
			{objectResets.map(reset => (
				<ObjectReset key={reset.id} reset={reset} rooms={rooms} />
			))}
		</SectionList>
		<SectionList header={<><h2>In-container resets</h2> ({inObjectResets.length}) <AddButton onClick={() => dispatch(addedInObjectReset(objectId))}>Add reset</AddButton></>}>
			{inObjectResets.map(reset => <InObjectReset reset={reset} objects={objects} />)}
		</SectionList>
	</>;
}

interface ResetProps {
	reset: ObjectResetType;
	rooms: Room[];
}

function ObjectReset(props: ResetProps) {
	const dispatch = useAppDispatch();
	const { reset, rooms } = props;
	const [danger, setDanger] = useState(false);
	return <>
		<li className={classnames(styles.reset, danger && sharedStyles.dangerTarget)}>
			<ToolRow>
				Room: <SelectVnum selectedId={reset.roomId} items={rooms} onUpdate={roomId => dispatch(updatedObjectReset({...reset, roomId}))} />
				<div className={styles.spacer}/>
				<DeleteButton onHoverState={setDanger} onClick={() => dispatch(removedObjectReset(reset.id))} >Remove</DeleteButton>
			</ToolRow>
			<Row>
				<TextField name="Comment" value={reset.comment} onUpdate={comment => dispatch(updatedObjectReset({...reset, comment}))} />
			</Row>
		</li>
		<hr className={styles.separator} />
	</>;
}

function InObjectReset({ reset, objects }: { reset: InObjectResetType, objects: Objekt[] }) {
	const dispatch = useAppDispatch();
	const [danger, setDanger] = useState(false);
	return <>
		<li className={classnames(styles.reset, danger && sharedStyles.dangerTarget)}>
			<ToolRow>
			Container: <SelectVnum selectedId={reset.containerId} items={objects} onUpdate={containerId => dispatch(updatedInObjectReset({...reset, containerId}))} />
			<div className={styles.spacer}/>
			<DeleteButton onHoverState={setDanger} onClick={() => dispatch(removedInObjectReset(reset.id))} >Remove</DeleteButton>
			</ToolRow>
			<Row>
				<TextField name="Comment" value={reset.comment} onUpdate={comment => dispatch(updatedInObjectReset({...reset, comment}))} />
			</Row>
		</li>
	</>;
}
