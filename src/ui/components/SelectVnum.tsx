import React from "react";
import classnames from "classnames";
import { CSSObjectWithLabel, Theme } from "react-select";
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
	nothing?: string;
}

export function SelectVnum<T extends HasVnum>(props: Props<T>) {
	const { items, selectedId, disabled, name } = props;
	const options = props.items.map(item => ({
		value: item.id,
		vnum: item.vnum,
		label: item.name || item.shortDesc || "",
	}));

	let selected = options.find(item => item.value === selectedId);
	let warning = false;
	if (!selected && selectedId) {
		if (isValidNewOption(selectedId)) {
			const vnum = Number(selectedId);
			selected = {
				value: selectedId,
				vnum,
				label: "(outside area?)",
			};
			if (props.nothing && vnum < 1) selected.label = props.nothing;
			else warning = true;
			options.unshift(selected);
		}
	}

	const selectStyles = minWidthStyles(options, warning);
	const selectTheme = warningTheme(warning);

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
			theme={selectTheme}
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

function minWidthStyles(options: Option[], warning: boolean) {
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
			backgroundColor: warning ? "var(--warning-faint)" : undefined,
		}),
		valueContainer: (provided: CSSObjectWithLabel) => ({
			...provided,
			alignItems: "baseline",
			top: "2px",
		}),
		// singleValue: ({ maxWidth, position, top, transform, ...rest}: CSSObjectWithLabel) => ({...rest}),
	};
}

function warningTheme(warning: boolean) {
	return (theme: Theme) => ({
		...theme,
		colors: {
			...theme.colors,
			primary: warning ? "var(--warning)" : theme.colors.primary,
			neutral20: warning ? "var(--warning-dim)" : theme.colors.neutral20,
			neutral30: warning ? "var(--warning)" : theme.colors.neutral30,
			neutral40: warning ? "var(--warning)" : theme.colors.neutral40,
		},
	});
}
