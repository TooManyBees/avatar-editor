import React from "react";
import ReactSelect, { CSSObjectWithLabel } from "react-select";
import classnames from "classnames";
import styles from "./inputs.module.css";

interface Props<V> {
	name?: string;
	options: { value: V, label: string }[];
	defaultValue: { value: V, label: string };
	value: V;
	onUpdate: (v: V) => void;
	inline?: boolean;
}

export default function SelectField<V>(props: Props<V>) {
	const { inline, name, options, defaultValue, onUpdate } = props;
	const value = options.find(({ value }) => value === props.value) || defaultValue;
	const selectStyles = minWidthStyles(options);

	const select = (
		<ReactSelect
			options={options}
			value={value}
			onChange={v => onUpdate(v ? v.value : defaultValue.value)}
			styles={selectStyles}
		/>
	);

	return name ? (
		<label className={classnames(styles.wrapper, inline && styles.inline)}>
			<span className={styles.label}>{name}:</span>
			{select}
		</label>
	) : select;
}

function minWidthStyles(options: { label: string }[]) {
	const minWidth = options.reduce((maxLen, item) =>
		Math.max(maxLen, item.label.length), 0);
	return {
		control: (provided: CSSObjectWithLabel) => ({
			...provided,
			minWidth: `calc(55px + ${minWidth/2}rem)`,
			alignItems: "baseline",
		}),
		valueContainer: (provider: CSSObjectWithLabel) => ({
			...provider,
			alignItems: "baseline",
			top: "2px",
		}),
		singleValue: ({ maxWidth, position, top, transform, ...rest}: CSSObjectWithLabel) => ({...rest}),
	};
}
