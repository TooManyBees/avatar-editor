import React, { ChangeEvent, useState } from "react";
import classnames from "classnames";
import styles from "./inputs.module.css";

interface Props {
	name: string;
	value: string | null;
	onUpdate?: (s: string) => void;
	inline?: boolean;
}

export default function TextField(props: Props) {
	const { name, onUpdate, inline = false } = props;

	const [value, setValue] = useState(props.value || "");

	function onChange(event: ChangeEvent<HTMLInputElement>) {
		setValue(event.target.value);
	}

	function onBlur() {
		if (onUpdate) onUpdate(value);
	}

	return (
		<label className={classnames(styles.wrapper, inline && styles.inline)}>
			{name && <span className={styles.label}>{name}:</span>}
			<input
				type="text"
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				className={styles.input}
			/>
		</label>
	);
}
