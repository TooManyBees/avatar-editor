import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as AreaActions from "../../app/store/area-section";
import TabsNav from "./tabs-nav";
import { NumberField, SelectField, TextArea, TextField } from "../fields";

export default function AreaTab() {
	const dispatch = useAppDispatch();
	const area = useAppSelector(state => state.area);

	const updatedAuthor = (s: string) => dispatch(AreaActions.updatedAuthor(s));
	const updatedName = (s: string) => dispatch(AreaActions.updatedName(s));

	return (
		<div>
			<TabsNav />

			<div>
				<TextField name="Author" value={area.author} onUpdate={updatedAuthor} />
				<TextField name="Name" value={area.name} onUpdate={updatedName} />
				<TextField name="Level Range" value={""} />

			</div>
		</div>
	);
}
