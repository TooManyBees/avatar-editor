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
	const [height, setHeight] = useState<number | undefined>(undefined);
	const [width, setWidth] = useState<number | undefined>(undefined);
	const textArea = useRef<HTMLTextAreaElement>(null);

	function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setState(event.currentTarget.value);
	}

	function onBlur(event: any) {
		props.onUpdate(value);
	}

	function togglePreview(event: ChangeEvent<HTMLInputElement>) {
		if (textArea.current) {
			setHeight(textArea.current.offsetHeight);
			setWidth(textArea.current.offsetWidth);
		}
		setPreview(event.target.checked);
	}

	const name = props.name;
	const rows = (value.match(/\n/g)?.length || 0) + 1;
	return (
		<div className={styles.textArea}>
			<span className={styles.description}>
				{/* FIXME: apply htmlFor pointing to the textarea */}
				<label>{name}:</label>
				<label><input type="checkbox" checked={preview} onChange={togglePreview} /> Preview colors</label>
			</span>
			<div className={styles.editor}>
				{ preview
					? <div className={styles.colorPreview} style={{height, width}}>{elementsFromColorCodes(value)}</div>
					: <textarea rows={rows} cols={90} style={{height, width}} value={value} onChange={onChange} onBlur={onBlur} ref={textArea} />
				}
			</div>
		</div>
	);
}
