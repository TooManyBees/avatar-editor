import React, { ChangeEvent, CSSProperties, useState, useRef } from "react";
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
				<label key={bit} title={help} data-checkbox><input
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

let iteration = 0;

export default function BitsField(props: BitsFieldProps) {
	const [open, setOpen] = useState(false);
	const nthBitsField = useRef(iteration++);
	const { name, map, value, className, style } = props;
	const summary = map.filter(([bit]) => value.includes(bit)).map(([bit, name]) => name).join(", ") || "None";
	const id = `bitsfield-${nthBitsField}`;
	const ariaLabel = open
		? `Collapse ${name}, currently ${summary}`
		: `Expand ${name}, currently ${summary}`;
	return (
		<div className={classnames(styles.details, className, open && styles.open)} style={style}>
			<div className={styles.summary}>
				<button className={styles.clickable} onClick={() => setOpen(!open)} aria-label={ariaLabel} aria-expanded={open} aria-controls={id}>
					<span className={styles.label}>{name}:</span>
					<span className={styles.marker} />
					<span className={styles.summary}>{summary}</span>
				</button>
			</div>
			<div id={id} className={styles.body}>
				<BitsFieldN {...props} />
			</div>
		</div>
	);
}
