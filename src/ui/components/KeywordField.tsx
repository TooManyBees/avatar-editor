import React, { ChangeEvent, FocusEvent, KeyboardEvent, useState } from "react";
import styles from "./KeywordField.module.css";
import inputStyles from "./inputs.module.css";

interface Props {
	name: string;
	value: string[];
	onUpdate: (ks: string[]) => void;
}

export default function KeywordField(props: Props) {
	const [currentKeyword, setCurrentKeyword] = useState("");
	const [holdingDownBackspace, setHoldingDownBackspace] = useState(false);

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		let match =
			value.match(/^'([^']+)'$/) ||
			value.match(/^"([^"]+)"$/) ||
			value.match(/^(?!'|")(\S+)\s/);
		if (match) {
			props.onUpdate([...props.value, match[1]]);
			setCurrentKeyword("");
		} else {
			setCurrentKeyword(value);
		}
	}

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Backspace") {
			if (!holdingDownBackspace && currentKeyword === "") {
				props.onUpdate(props.value.slice(0, props.value.length - 1));
			}
			setHoldingDownBackspace(true);
		}
	}

	function onKeyUp() {
		setHoldingDownBackspace(false);
	}

	function onBlur(event: FocusEvent<HTMLInputElement>) {
		if (event.target.value) {
			props.onUpdate([...props.value, event.target.value]);
			setCurrentKeyword("");
		}
	}

	return (
		<label className={styles.keywordField}>
			<span className={styles.label}>{props.name}:</span>
			{props.value.map((k, n) => (
				<span key={`${n} ${k}`} className={styles.keyword}>{k}</span>
			))}
			<input
				type="text"
				className={inputStyles.input}
				value={currentKeyword}
				onChange={onChange}
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				onBlur={onBlur}
			/>
		</label>
	);
}
