import React, { ChangeEvent } from "react";
import KeywordField from "./KeywordField";
import ApplyFields from "./ApplyFields";
import EdescFields from "./EdescFields";
import "./fields.css";

interface TextFieldProps {
	name: string;
	value: string | null;
	onUpdate?: (s: string) => void;
	className?: string;
}

interface TextFieldState {
	value: string | null;
}

export class TextField extends React.Component<TextFieldProps, TextFieldState> {
	constructor(props: TextFieldProps) {
		super(props);
		this.state = { value: props.value };
		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	onChange(event: ChangeEvent<HTMLInputElement>) {
		this.setState({ value: event.currentTarget.value });
	}

	onBlur(event: any) {
		if (this.props.onUpdate && this.state.value) {
			this.props.onUpdate(this.state.value);
		}
	}

	render() {
		const { name, className } = this.props;
		const value = this.state.value;
		const valueString = value == null ? "" : value.toString();
		return (
			<div className="TextField">
				<label>{name}: <input type="text" className={className} value={valueString} onChange={this.onChange} onBlur={this.onBlur} /></label>
			</div>
		);
	}
}

export class TextArea extends React.Component<TextFieldProps, TextFieldState> {
	constructor(props: TextFieldProps) {
		super(props);
		this.state = { value: props.value };
		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	onChange(event: ChangeEvent<HTMLTextAreaElement>) {
		this.setState({ value: event.currentTarget.value });
	}

	onBlur(event: any) {
		if (this.props.onUpdate && this.state.value) {
			this.props.onUpdate(this.state.value);
		}
	}

	render() {
		const name = this.props.name;
		const value = this.state.value;
		const valueString = value == null ? "" : value.toString();
		const rows = (valueString.match(/\n/g)?.length || 0) + 1;
		return (
			<label className="TextArea">{name}: <textarea rows={rows} value={valueString} onChange={this.onChange} onBlur={this.onBlur} /></label>
		);
	}
}

interface NumberFieldProps {
	name: string;
	value: number | null;
	min?: number;
	max?: number;
	onUpdate?: (n: number) => void;
}

interface NumberFieldState {
	value: number | null;
}

export class NumberField extends React.Component<NumberFieldProps, NumberFieldState> {
	constructor(props: NumberFieldProps) {
		super(props);
		this.state = { value: props.value };
		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	onChange(event: ChangeEvent<HTMLInputElement>) {
		const value = Number(event.currentTarget.value);
		const { max, min } = this.props;
		if (!Number.isInteger(value)) return;
		if (max != null && value > max) return;
		if (min != null && value < min) return;
		this.setState({ value });
	}

	onBlur(event: any) {
		if (this.props.onUpdate && this.state.value) {
			this.props.onUpdate(this.state.value);
		}
	}

	render() {
		const { name, max, min } = this.props;
		const value = this.state.value;
		const valueString = value != null ? value.toString() : "";
		return (
			<div className="NumberField">
				<label>{name}: <input type="text" value={valueString} min={min} max={max} onChange={this.onChange} onBlur={this.onBlur} /></label>
			</div>
		);
	}
}

interface SelectFieldProps {
	name: string;
	value: number | undefined;
	map: [number, string, string?][];
	onUpdate?: (n: number) => void;
}

export function SelectField(props: SelectFieldProps) {

	function onChange(event: ChangeEvent<HTMLSelectElement>) {
		const value = Number(event.currentTarget.value);
		if (Number.isInteger(value)){
			if (props.onUpdate) {
				props.onUpdate(value);
			}
		}
	}

	const { map, name, value } = props;
	return (
		<label className="SelectField">{name}: <select value={value} onChange={onChange}>
			{map.map(([bit, desc]) => (
				<option key={bit} value={bit}>{desc}</option>
			))}
		</select></label>
	);
}

export {
	ApplyFields,
	EdescFields,
	KeywordField,
}
