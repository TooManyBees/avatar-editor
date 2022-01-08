import React from "react";
import classnames from "classnames";
import { CSSObjectWithLabel } from "react-select";
import ReactSelect from "react-select/creatable";
import styles from "./inputs.module.css";

interface HasVnum {
	id: string;
	vnum: number | null;
	name?: string;
	shortDesc?: string;
}

interface Props<T> {
	name?: string;
	selectedId: string | null;
	items: readonly T[];
	onUpdate: (id: string) => void;
	disabled?: boolean;
}

export function SelectVnum<T extends HasVnum>(props: Props<T>) {
	const { items, selectedId, disabled, name } = props;
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

	const selectStyles = minWidthStyles(options);

	const select = (
		<ReactSelect
			value={selected}
			options={options}
			formatOptionLabel={formatOptionLabel}
			formatCreateLabel={formatCreateLabel}
			isValidNewOption={isValidNewOption}
			onChange={v => props.onUpdate(v ? v.value : "")}
			blurInputOnSelect
			captureMenuScroll
			styles={selectStyles}
			isDisabled={disabled}
		/>
	);

	return name ? (
		<label className={classnames(styles.wrapper, disabled && styles.disabled)}>
			<span className={styles.label}>{name}:</span>
			{select}
		</label>
	) : select;
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
	const minWidth = Math.min(
			400,
			options.reduce((maxLen, item) =>
				Math.max(maxLen, (item.vnum?.toString()?.length || 0) * 4.5 + item.label.length * 6.5 + 75), 0)
	);
	return {
		control: (provided: CSSObjectWithLabel) => ({
			...provided,
			minWidth: `${Math.ceil(minWidth)}px`,
			alignItems: "baseline",
		}),
		valueContainer: (provider: CSSObjectWithLabel) => ({
			...provider,
			alignItems: "baseline",
			top: "2px",
		}),
		// singleValue: ({ maxWidth, position, top, transform, ...rest}: CSSObjectWithLabel) => ({...rest}),
	};
}
