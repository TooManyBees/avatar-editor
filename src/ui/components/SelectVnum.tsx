import React from "react";
import ReactSelect from "react-select/creatable";

interface HasVnum {
	id: string;
	vnum: number | null;
	name?: string;
	shortDesc?: string;
}

interface Props<T> {
	selectedId: string | null;
	items: readonly T[];
	onUpdate: (id: string) => void;
}

export function SelectVnum<T extends HasVnum>(props: Props<T>) {
	const options = props.items.map(item => ({
		value: item.id,
		label: serializeVnumItem(item),
	}));

	let selected = options.find(item => item.value === props.selectedId);
	if (!selected && props.selectedId) {
		if (isValidNewOption(props.selectedId)) {
			selected = { value: props.selectedId, label: formatCreateLabel(props.selectedId) };
			options.unshift(selected);
		}
	}

	return (
		<ReactSelect
			value={selected}
			options={options}
			formatCreateLabel={formatCreateLabel}
			isValidNewOption={isValidNewOption}
			onChange={v => props.onUpdate(v ? v.value : "")}
			blurInputOnSelect
		/>
	);
}

function formatCreateLabel(input: string): string {
	return `${input} (outside area?)`;
}

function isValidNewOption(input: string): boolean {
	const number = Number(input);
	return Number.isInteger(number);
}

function serializeVnumItem<T extends HasVnum>(item: T): string {
	return `${item.vnum || ""} ${item.name || item.shortDesc || ""}`;
}
