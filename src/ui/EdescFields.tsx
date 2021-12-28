import React from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useAppDispatch } from "../app/hooks";
import { Edesc } from "../app/models";
import { KeywordField, TextArea } from "./fields";

interface Props {
	id: string;
	edescs: Edesc[];
	updatedEdesc: ActionCreatorWithPayload<[string, Edesc], string>;
	addedEdesc: ActionCreatorWithPayload<string, string>;
	removedEdesc: ActionCreatorWithPayload<[string, string], string>;
}

export default function EdescFields({ id, edescs, updatedEdesc, addedEdesc, removedEdesc }: Props) {
	const dispatch = useAppDispatch();

	const onUpdate = (e: Edesc) => dispatch(updatedEdesc([id, e]));

	return (
		<ol>
			<p>Extra Descs</p>
			{edescs.map(edesc => (
				<li>
					<KeywordField name="Keywords" value={edesc.keywords} onUpdate={keywords => dispatch(updatedEdesc([id, {...edesc, keywords}]))} />
					<TextArea name="Description" value={edesc.body} onUpdate={body => dispatch(updatedEdesc([id, {...edesc, body}]))} />
					<button onClick={() => dispatch(removedEdesc([id, edesc.id]))}>Remove</button>
				</li>
			))}
			<button onClick={() => dispatch(addedEdesc(id))}>Add extra desc</button>
		</ol>
	);
}
