import React, { useState } from "react";
import styles from "./CollapsibleContainer.module.css";

interface Props {
	label: string;
	summary: string;
	children: React.ReactNode;
}

export default function ToggleContainer(props: Props) {
	const [open, setOpen] = useState(false);
	return (
		<fieldset className={`${styles.container} ${open ? styles.open : ""}`}>
			<legend onClick={() => setOpen(!open)}>
				{props.label} <span className={styles.summary}>{props.summary}</span>
			</legend>
			<div className={styles.children}>{props.children}</div>
		</fieldset>
	);
}
