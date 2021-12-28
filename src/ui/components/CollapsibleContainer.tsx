import React, { useState } from "react";
import "./CollapsibleContainer.css";

interface Props {
	label: string;
	summary: string;
	children?: React.ReactNode;
}

export default function ToggleContainer(props: Props) {
	const [open, setOpen] = useState(false);
	return (
		<fieldset className={`ToggleContainer ${open ? "open" : ""}`}>
			<legend onClick={() => setOpen(!open)}>
				{props.label} <span className="summary">{props.summary}</span>
			</legend>
			<div className="children">{props.children || null}</div>
		</fieldset>
	);
}
