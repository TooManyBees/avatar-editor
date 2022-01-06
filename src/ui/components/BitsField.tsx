import React, { ChangeEvent, CSSProperties, useState } from "react";
import classnames from "classnames";
import styles from "./BitsField.module.css";

interface BitsFieldNProps {
	value: number[];
	map: [number, string, string, ((bits: number[]) => boolean)?][];
	onUpdate: (bs: number[]) => void;
}

export function BitsFieldN(props: BitsFieldNProps) {
	const { map, value, onUpdate } = props;

	function onChange(event: ChangeEvent<HTMLInputElement>) {
		const bit = Number(event.currentTarget.value);
		if (Number.isInteger(bit)) {
			let idx = value.indexOf(bit);
			if (idx > -1){
				onUpdate(value.slice(0, idx).concat(value.slice(idx + 1)));
			} else {
				onUpdate(value.concat(bit));
			}
		}
	}

	return (
		<div className={styles.bitsField}>
			{map.map(([bit, desc, help, isEnabled]) => (
				<label key={bit} title={help}><input
					type="checkbox"
					value={bit}
					checked={value.includes(bit)}
					onChange={onChange}
					disabled={isEnabled ? !isEnabled(value) : false}
				/> {desc}</label>
			))}
		</div>
	);
}

interface BitsFieldProps extends BitsFieldNProps {
	name: string;
	style?: CSSProperties;
	className?: string;
}

export default function BitsField(props: BitsFieldProps) {
	const [open, setOpen] = useState(false);
	const { name, map, value, className, style } = props;
	const summary = map.filter(([bit]) => value.includes(bit)).map(([bit, name]) => name).join(", ") || "None";
	return (
		<details className={classnames(styles.details, className)} style={style}>
			<summary>
				<span className={styles.label}>{name}:</span>
				<span className={styles.marker} />
				<span className={styles.summary}>{summary}</span>
			</summary>
			<BitsFieldN {...props} />
		</details>
	);
}
