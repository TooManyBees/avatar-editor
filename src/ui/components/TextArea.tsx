import React, { ChangeEvent, useRef, useState } from "react";
import elementsFromColorCodes from "./elementsFromColorCodes";
import styles from "./TextArea.module.css";

interface TextFieldProps {
	name: string;
	value: string;
	onUpdate: (s: string) => void;
	className?: string;
}

export default function TextArea(props: TextFieldProps) {
	const [value, setState] = useState(props.value);
	const [preview, setPreview] = useState(false);
	const textArea = useRef<HTMLTextAreaElement>(null);

	function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setState(event.currentTarget.value);
	}

	function onBlur(event: any) {
		props.onUpdate(value);
	}

	function togglePreview(event: ChangeEvent<HTMLInputElement>) {
		setPreview(event.target.checked);
	}

	const name = props.name;
	const rows = (value.match(/\n/g)?.length || 0) + 1;
	return (
		<label className={styles.textArea}>
			<span className={styles.description}>
				{name}:
				<label><input type="checkbox" checked={preview} onChange={togglePreview} /> Preview colors</label>
			</span>
			{ preview
				? <div className={styles.preview} style={{height: textArea.current?.offsetHeight}}>{elementsFromColorCodes(value)}</div>
				: <textarea rows={rows} value={value} onChange={onChange} onBlur={onBlur} ref={textArea} />
			}
		</label>
	);
}
