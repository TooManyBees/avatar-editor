import React from "react";
import { DoorReset } from "../../app/models";
import { SelectField } from "../components";

interface Props {
	disabled?: boolean;
	reset: DoorReset | null;
	noDoor?: boolean;
	onUpdate: (dir: number, state: number) => void;
}

export default function SelectDoorState(props: Props) {
	const { disabled, reset, noDoor, onUpdate } = props;
	return (
		<SelectField
			name="Reset state"
			value={reset?.state || -1}
			options={RESET_STATE}
			onUpdate={state => reset && onUpdate(reset.direction, state)}
			disabled={disabled || noDoor}
		/>
	);
}

const RESET_STATE: { value: number, label: string }[] = [
	{ value: -1, label: "None"},
	{ value: 0, label: "Open" },
	{ value: 1, label: "Closed" },
	{ value: 2, label: "Locked" },
];
