import React, { ChangeEvent, FocusEvent, KeyboardEvent, useState } from "react";
import styles from "./KeywordField.module.css";
import inputStyles from "./inputs.module.css";

interface Props {
	name: string;
	value: string[];
	onUpdate: (ks: string[]) => void;
}

function getKeyword(value: string): string | null {
	let match =
		value.match(/^'([^']+)'\s*$/) ||
		value.match(/^"([^"]+)"\s*$/) ||
		value.match(/^(?!'|")(\S+)\s/);
	return match ? match[1] : null;
}

export default function KeywordField(props: Props) {
	const [currentKeyword, setCurrentKeyword] = useState("");
	const [holdingDownBackspace, setHoldingDownBackspace] = useState(false);

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		let keyword = getKeyword(value);
		if (keyword) {
			props.onUpdate([...props.value, keyword]);
			setCurrentKeyword("");
		} else {
			setCurrentKeyword(value);
		}
	}

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			let keyword = getKeyword(currentKeyword + " ");
			if (keyword) {
				event.preventDefault();
				props.onUpdate([...props.value, keyword]);
				setCurrentKeyword("");
			}
		}
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

	function onBlur(e: FocusEvent<HTMLInputElement>) {
		const value = e.target.value;
		let keyword = getKeyword(currentKeyword + " ");
		if (keyword) {
			props.onUpdate([...props.value, keyword]);
			setCurrentKeyword("");
		}
	}

	return (
		<label className={inputStyles.wrapper}>
			<span className={styles.label}>{props.name}:</span>
			<div className={styles.keywordField}>
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
			</div>
		</label>
	);
}
