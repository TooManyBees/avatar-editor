import React, { useState } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import classnames from "classnames";
import { useAppDispatch } from "../../app/hooks";
import { Edesc } from "../../app/models";
import {
	AddButton,
	DeleteButton,
	KeywordField,
	SectionList,
	TextArea,
	ToolRow,
} from ".";
import styles from "./EdescFields.module.css";
import sharedStyles from "./shared.module.css";

interface Props {
	id: string;
	edescs: Edesc[];
	updatedEdesc: ActionCreatorWithPayload<[string, Edesc], string>;
	addedEdesc: ActionCreatorWithPayload<string, string>;
	removedEdesc: ActionCreatorWithPayload<[string, string], string>;
}

export default function EdescFields({ id, edescs, updatedEdesc, addedEdesc, removedEdesc }: Props) {
	const dispatch = useAppDispatch();
	return (
		<SectionList header={<><h2>Extra Descs</h2><AddButton onClick={() => dispatch(addedEdesc(id))}>Add extra desc</AddButton></>}>
			{edescs.map(edesc => <EdescItem key={edesc.id} id={id} edesc={edesc} updatedEdesc={updatedEdesc} removedEdesc={removedEdesc} />)}
		</SectionList>
	);
}

interface EdescItemProps {
	id: string;
	edesc: Edesc;
	updatedEdesc: ActionCreatorWithPayload<[string, Edesc], string>;
	removedEdesc: ActionCreatorWithPayload<[string, string], string>;
}

function EdescItem({ id, edesc, updatedEdesc, removedEdesc }: EdescItemProps) {
	const dispatch = useAppDispatch();
	const [danger, setDanger] = useState(false);
	return (
		<li className={classnames(styles.edesc, danger && sharedStyles.dangerTarget)}>
			<ToolRow>
				<KeywordField name="Keywords" value={edesc.keywords} onUpdate={keywords => dispatch(updatedEdesc([id, {...edesc, keywords}]))} />
			</ToolRow>
			<TextArea name="Description" value={edesc.body} onUpdate={body => dispatch(updatedEdesc([id, {...edesc, body}]))} />
			<DeleteButton onHoverState={setDanger} absolute onClick={() => dispatch(removedEdesc([id, edesc.id]))}>Remove extra desc</DeleteButton>
		</li>
	);
}
