import React, { useState } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import classnames from "classnames";
import { useAppDispatch } from "../../app/hooks";
import { Edesc } from "../../app/models";
import TextArea from "./TextArea";
import { Section } from "./shared";
import { AddButton, DeleteButton } from "./Button";
import KeywordField from "./KeywordField";
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
		<Section header={<><h2>Extra Descs</h2><AddButton onClick={() => dispatch(addedEdesc(id))}>Add extra desc</AddButton></>}>
			<ol className={styles.edescFields}>
				{edescs.map(edesc => <EdescItem key={edesc.id} id={id} edesc={edesc} updatedEdesc={updatedEdesc} removedEdesc={removedEdesc} />)}
			</ol>
		</Section>
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
		<li className={classnames(sharedStyles.container, danger && sharedStyles.dangerTarget)}>
			<KeywordField name="Keywords" value={edesc.keywords} onUpdate={keywords => dispatch(updatedEdesc([id, {...edesc, keywords}]))} />
			<TextArea name="Description" value={edesc.body} onUpdate={body => dispatch(updatedEdesc([id, {...edesc, body}]))} />
			<DeleteButton onHoverState={setDanger} onClick={() => dispatch(removedEdesc([id, edesc.id]))}>Remove</DeleteButton>
		</li>
	);
}
