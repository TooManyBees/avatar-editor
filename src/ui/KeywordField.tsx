import React, { ChangeEvent, KeyboardEvent, useState } from "react";

interface Props {
	name: string;
	value: string[];
	onUpdate: (ks: string[]) => void;
}

export default function KeywordField(props: Props) {
	const [currentKeyword, setCurrentKeyword] = useState("");

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
		if (currentKeyword === "" && event.key === "Backspace") {
			props.onUpdate(props.value.slice(0, props.value.length - 1));
		}
	}

	return (
		<label>
			{props.name}: {props.value.map((k, n) => <span key={`${n} ${k}`} style={{background: "pink", marginRight: "1rem"}}>{k}</span>)}
			<input type="text" value={currentKeyword} onChange={onChange} onKeyDown={onKeyDown} />
		</label>
	);
}
