import React, { ChangeEvent, CSSProperties, ReactNode } from "react";
import classnames from "classnames";
import styles from "./ToggleContainer.module.css";
import sharedStyles from "./shared.module.css";

interface Props {
	label: string;
	opened?: boolean;
	onEnabled: () => void;
	onDisabled: () => void;
	children: ReactNode;
	section?: boolean;
}

export default function ToggleContainer(props: Props) {

	function onChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.checked) props.onEnabled();
		else props.onDisabled();
	}

	const className = classnames({
		[styles.container]: true,
		[styles.open]: props.opened,
		[sharedStyles.section]: props.section,
	});

	return (
		<div className={className}>
			<label className={sharedStyles.header}>
				<input type="checkbox" checked={props.opened} onChange={onChange} />
				<h2 className={styles.label}>{props.label}</h2>
			</label>
			<div className={styles.children}>{props.children}</div>
		</div>
	);
}
