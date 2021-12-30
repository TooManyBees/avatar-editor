import React, { ChangeEvent, ReactNode } from "react";
import styles from "./ToggleContainer.module.css";

interface Props {
	label: string;
	opened?: boolean;
	onEnabled: () => void;
	onDisabled: () => void;
	children: ReactNode;
}

export default function ToggleContainer(props: Props) {

	function onChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.checked) props.onEnabled();
		else props.onDisabled();
	}

	return (
		<div className={`${styles.container} ${props.opened ? styles.open : ""}`}>
			<h2 className={styles.label}><input type="checkbox" checked={props.opened} onChange={onChange} /> {props.label}</h2>
			<div className={styles.children}>{props.children}</div>
		</div>
	);
}
