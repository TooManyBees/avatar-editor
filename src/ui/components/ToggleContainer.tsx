import React, { ChangeEvent, CSSProperties, ReactNode, useRef } from "react";
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

let iteration = 0;

export default function ToggleContainer(props: Props) {
	const nthContainer = useRef(iteration++);

	function onChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.checked) props.onEnabled();
		else props.onDisabled();
	}

	const className = classnames({
		[styles.container]: true,
		[styles.open]: props.opened,
		[sharedStyles.section]: props.section,
	});

	const checkboxId = `toggle-container-${iteration}`;

	return (
		<div className={className}>
			<div className={sharedStyles.header}>
				<label className={styles.header} data-checkbox>
					<input type="checkbox" checked={props.opened} onChange={onChange} aria-expanded={props.opened} aria-controls={checkboxId} />
					<h2 className={styles.label}>{props.label}</h2>
				</label>
			</div>
			<div className={styles.children}>{props.children}</div>
		</div>
	);
}
