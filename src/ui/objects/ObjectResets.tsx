import React, { useState } from "react";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
	addedObjectReset,
	updatedObjectReset,
	removedObjectReset,
} from "../../app/store/resets";
import { ObjectReset as ObjectResetType, Objekt, Room } from "../../app/models";
import {
	AddButton,
	DeleteButton,
	NumberField,
	Row,
	Section,
	SelectVnum,
	TextField,
	ToolRow,
} from "../components";
import styles from "./ObjectResets.module.css";
import sharedStyles from "../components/shared.module.css";

import ReactSelect, { CSSObjectWithLabel } from "react-select";

interface Props {
	objectId: string;
}

export default function ObjectResets(props: Props) {
	const dispatch = useAppDispatch();
	const { objectId } = props;
	const resets = useAppSelector(state => state.resets.resets.object.filter(r => r.objectId === objectId));
	const rooms = useAppSelector(state => state.rooms.rooms);
	return (
		<Section header={<><h2>Object resets</h2> ({resets.length}) <AddButton onClick={() => dispatch(addedObjectReset(objectId))}>Add reset</AddButton></>}>
			<ol className={styles.list}>
				{resets.map(reset => (
					<ObjectReset key={reset.id} reset={reset} rooms={rooms} />
				))}
			</ol>
		</Section>
	);
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
				Room: <SelectVnum selectedId={reset.roomId} items={rooms} onUpdate={() => {}} />
				<div className={styles.spacer}/>
				<DeleteButton onHoverState={setDanger} onClick={() => dispatch(removedObjectReset(reset.id))} >Remove</DeleteButton>
			</ToolRow>
			<Row>
				<TextField name="Comment" value={reset.comment} />
			</Row>
		</li>
		<hr className={styles.separator} />
	</>;
}
