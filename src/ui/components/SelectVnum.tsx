import React from "react";
import { CSSObjectWithLabel } from "react-select";
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
	const { items, selectedId } = props;
	const options = props.items.map(item => ({
		value: item.id,
		vnum: item.vnum,
		label: item.name || item.shortDesc || "",
	}));

	let selected = options.find(item => item.value === selectedId);
	if (!selected && selectedId) {
		if (isValidNewOption(selectedId)) {
			selected = {
				value: selectedId,
				vnum: Number(selectedId),
				label: "(outside area?)",
			};
			options.unshift(selected);
		}
	}

	const styles = minWidthStyles(options);

	return (
		<ReactSelect
			value={selected}
			options={options}
			formatOptionLabel={formatOptionLabel}
			formatCreateLabel={formatCreateLabel}
			isValidNewOption={isValidNewOption}
			onChange={v => props.onUpdate(v ? v.value : "")}
			blurInputOnSelect
			captureMenuScroll
			styles={styles}
		/>
	);
}

type Option = {
	value: string;
	vnum: number | null;
	label: string;
};

function formatOptionLabel(data: Option): React.ReactNode {
	return <><code>{data.vnum}</code> {data.label}</>
}

function formatCreateLabel(input: string): string {
	return `${input} (outside area?)`;
}

function isValidNewOption(input: string): boolean {
	const number = Number(input);
	return Number.isInteger(number);
}

function minWidthStyles(options: Option[]) {
	const minWidth = options.reduce((maxLen, item) =>
		Math.max(maxLen, (item.vnum?.toString()?.length || 0) + item.label.length), 0);
	return {
		control: (provided: CSSObjectWithLabel) => ({ ...provided, minWidth: `calc(55px + ${minWidth*8}px)` }),
		singleValue: ({ maxWidth, position, top, transform, ...rest}: CSSObjectWithLabel) => ({...rest}),
	};
}
