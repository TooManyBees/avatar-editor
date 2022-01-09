import React from "react";
import { SelectField } from "../components";

interface Props {
	value: number;
	onUpdate: (n: number) => void;
	disabled?: boolean;
}

export default function SelectDirection({ value, onUpdate, disabled }: Props) {
	return (
		<SelectField
			name="Direction"
			value={value}
			options={DIRECTIONS}
			onUpdate={onUpdate}
			disabled={disabled}
		/>
	);
}

const DIRECTIONS: { value: number, label: string }[] = [
	{ value: 0, label: "North" },
	{ value: 1, label: "East" },
	{ value: 2, label: "South" },
	{ value: 3, label: "West" },
	{ value: 4, label: "Up" },
	{ value: 5, label: "Down" },
];
