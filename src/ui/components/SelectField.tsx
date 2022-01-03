import React from "react";
import ReactSelect, { CSSObjectWithLabel } from "react-select";

interface Props<V> {
	options: { value: V, label: string }[];
	defaultValue: { value: V, label: string };
	value: V;
	onUpdate: (v: V) => void;
}

export default function SelectField<V>(props: Props<V>) {
	const { options, defaultValue, onUpdate } = props;
	const value = options.find(({ value }) => value === props.value) || defaultValue;
	const styles = minWidthStyles(options);
	return (
		<ReactSelect
			options={options}
			value={value}
			onChange={v => onUpdate(v ? v.value : defaultValue.value)}
			styles={styles}
		/>
	);
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
