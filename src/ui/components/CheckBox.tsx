import React from "react";
import styles from "./inputs.module.css";

interface Props {
	name: string;
	value: number | boolean;
	onUpdate: (b: boolean) => void;
}

export default function CheckBox({ name, value, onUpdate }: Props) {
	return (
		<label>
			<span className={styles.label}>{name}:</span>
			<input type="checkbox" checked={!!value} onChange={e => onUpdate(e.target.checked)} />
		</label>
	);
}
