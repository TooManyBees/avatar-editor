import React, { ChangeEvent, useState } from "react";
import classnames from "classnames";
import styles from "./inputs.module.css";

interface NumberFieldProps {
	name?: string;
	value: number | null;
	min?: number;
	max?: number;
	onUpdate?: (n: number) => void;
	inline?: boolean;
	inputRef?: React.RefObject<HTMLInputElement>;
	disabled?: boolean;
}

export default function NumberField(props: NumberFieldProps) {
	const { inline = false, name, min, max, disabled } = props;
	const [value, setValue] = useState(props.value?.toString() || "");
	const [warning, setWarning] = useState(parseValue(props.value, min, max) !== props.value);

	function onChange(event: ChangeEvent<HTMLInputElement>) {
		setValue(event.currentTarget.value);
		const newValue = parseValue(event.currentTarget.value, min, max);
		setWarning(newValue == null);
	}

	function onBlur(event: any) {
		const validValue = parseValue(value, min, max);
		if (props.onUpdate && validValue != null && validValue !== props.value) {
			props.onUpdate(validValue);
		}
	}

	return (
		<label className={classnames(styles.wrapper, inline && styles.inline, disabled && styles.disabled)}>
			{name && <span className={styles.label}>{name}:</span>}
			<input
				type="text"
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				className={classnames(styles.input, styles.number, warning && styles.warning)}
				style={{width: "5rem"}}
				ref={props.inputRef}
				disabled={disabled}
			/>
		</label>
	);
}

function parseValue(input: string | number | null, min: number | undefined, max: number | undefined): number | null {
	const value = Number(input);
	if (!Number.isInteger(value)) return null;
	if (min != null && value < min) return null;
	if (max != null && value > max) return null;
	return value;
}
