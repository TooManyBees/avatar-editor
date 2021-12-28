import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as AreaActions from "../../app/store/area-section";
import TabsNav from "./tabs-nav";
import { NumberField, SelectField, TextArea, TextField } from "../fields";
import "./area.css";

export default function AreaTab() {
	const dispatch = useAppDispatch();
	const area = useAppSelector(state => state.area);

	const updatedLine = (s: string) => dispatch(AreaActions.updatedLine(s));

	return (
		<div>
			<TabsNav />

			<div>
				<TextField className="area-field" name="#AREA" value={area.line} onUpdate={updatedLine} />
			</div>
		</div>
	);
}
