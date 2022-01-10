import React, { ChangeEvent, useRef, useState } from "react";
import classnames from "classnames";
import elementsFromColorCodes from "./elementsFromColorCodes";
import styles from "./TextArea.module.css";

type ColorScheme = "help" | "adesc" | "mobile" | "door" | "water";

interface TextFieldProps {
	name: string;
	value: string;
	onUpdate: (s: string) => void;
	className?: string;
	colors?: ColorScheme;
}

let iteration = 0;

export default function TextArea(props: TextFieldProps) {
	const [value, setValue] = useState(props.value);
	const [preview, setPreview] = useState(false);
	const [height, setHeight] = useState<number | undefined>(undefined);
	const [width, setWidth] = useState<number | undefined>(undefined);
	const textArea = useRef<HTMLTextAreaElement>(null);
	const nthTextArea = useRef<number>(iteration++);

	function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setValue(event.currentTarget.value);
	}

	function onBlur(event: any) {
		if (value !== props.value) {
			let trimmed = value.trim();
			if (trimmed) trimmed += "\n";
			if (trimmed !== value) setValue(trimmed);
			props.onUpdate(trimmed);
		}
	}

	function togglePreview(event: ChangeEvent<HTMLInputElement>) {
		if (textArea.current) {
			setHeight(textArea.current.offsetHeight);
			setWidth(textArea.current.offsetWidth);
		}
		setPreview(event.target.checked);
	}

	const textAreaId = `textarea-${nthTextArea.current}`;
	const name = props.name;
	const rows = (value.match(/\n/g)?.length || 0) + 1;
	return (
		<div className={styles.textArea}>
			<span className={styles.description}>
				<label htmlFor={textAreaId}>{name}:</label>
				<label><input type="checkbox" checked={preview} onChange={togglePreview} /> Preview colors</label>
			</span>
			<div className={styles.editor}>
				<span className={styles.guide} aria-hidden="true">................................................................................<span className={styles.guideLabel}>80</span></span>
				<span className={styles.guide} aria-hidden="true">........................................................................<span className={styles.guideLabel}>72</span></span>
				{ preview
					? <pre className={classnames(styles.colorPreview, props.colors && styles[props.colors])} style={{height, width}}>{elementsFromColorCodes(value)}</pre>
					: <textarea id={textAreaId} rows={rows} cols={90} style={{height, width}} value={value} onChange={onChange} onBlur={onBlur} ref={textArea} />
				}
			</div>
		</div>
	);
}
