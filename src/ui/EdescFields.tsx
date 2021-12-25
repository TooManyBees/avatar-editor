import React from "react";

import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useAppDispatch } from "../app/hooks";
import { KeywordField, TextArea } from "./fields";

interface Props {
	id: string;
	edescs: [string[], string][];
	updatedEdesc: ActionCreatorWithPayload<[string, number, [string[], string]], string>;
	addedEdesc: ActionCreatorWithPayload<string, string>;
	removedEdesc: ActionCreatorWithPayload<[string, number], string>;
}

export default function EdescFields({ id, edescs, updatedEdesc, addedEdesc, removedEdesc }: Props) {
	const dispatch = useAppDispatch();

	const onUpdate = (n: number, p: [string[], string]) => dispatch(updatedEdesc([id, n, p]));

	return (
		<ol>
			<p>Extra Descs</p>
			{edescs.map(([keywords, text], n) => (
				<li>
					<KeywordField name="Keywords" value={keywords} />
					<TextArea name="Description" value={text} />
					<button onClick={() => dispatch(removedEdesc([id, n]))}>Remove</button>
				</li>
			))}
			<button onClick={() => dispatch(addedEdesc(id))}>Add extra desc</button>
		</ol>
	);
}
