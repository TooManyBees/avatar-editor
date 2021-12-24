import React, { ChangeEvent } from "react";
import KeywordField from "./KeywordField";
import "./fields.css";

interface TextFieldProps {
	name: string;
	value: string | null;
	onUpdate?: (s: string) => void;
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
		const name = this.props.name;
		const value = this.state.value;
		const valueString = value == null ? "" : value.toString();
		return (
			<div className="TextField">
				<label>{name}: <input type="text" value={valueString} onChange={this.onChange} onBlur={this.onBlur} /></label>
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
		return (
			<label className="TextArea">{name}: <textarea rows={8} value={valueString} onChange={this.onChange} onBlur={this.onBlur} /></label>
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
				<label>{name}:</label> <input type="text" value={valueString} min={min} max={max} onChange={this.onChange} onBlur={this.onBlur} />
			</div>
		);
	}
}

interface BitsFieldProps {
	name: string;
	value: number[];
	map: [number, string, string][];
	onUpdate?: (bs: number[]) => void;
}

interface BitsFieldState {
	value: number[];
}

export class BitsField extends React.Component<BitsFieldProps, BitsFieldState> {
	constructor(props: BitsFieldProps) {
		super(props);
		this.state = { value: props.value };
		this.onChange = this.onChange.bind(this);
	}

	onChange(event: ChangeEvent<HTMLInputElement>) {
		const bit = parseInt(event.currentTarget.value, 10);
		if (Number.isInteger(bit)) {
			let value = this.state.value;
			let idx = value.indexOf(bit);
			if (idx > -1){
				value = value.slice(0, idx).concat(value.slice(idx + 1));
			} else {
				value = value.concat(bit);
			}
			this.setState({ value });
			if (this.props.onUpdate) {
				this.props.onUpdate(value);
			}
		}
	}

	render() {
		const { map, name } = this.props;
		return (
			<fieldset className="BitsField">
				<legend>{name}</legend>
				{map.map(([bit, desc, help]) => (
					<label key={bit} title={help}><input
						type="checkbox"
						value={bit}
						checked={this.state.value.includes(bit)}
						onChange={this.onChange}
					/> {desc}</label>
				))}
			</fieldset>
		);
	}
}

interface SelectFieldProps {
	name: string;
	value: number | undefined;
	map: [number, string, string][];
	onUpdate?: (n: number) => void;
}

interface SelectFieldState {
	value: number | undefined;
}

export class SelectField extends React.Component<SelectFieldProps, SelectFieldState> {
	constructor(props: SelectFieldProps) {
		super(props);
		this.state = { value: props.value };
		this.onChange = this.onChange.bind(this);
	}

	onChange(event: ChangeEvent<HTMLSelectElement>) {
		const value = parseInt(event.currentTarget.value, 10);
		if (Number.isInteger(value)){
			this.setState({ value });
			if (this.props.onUpdate) {
				this.props.onUpdate(value);
			}
		}
	}

	render() {
		const { map, name, } = this.props;
		return (
			<label className="SelectField">{name}: <select value={this.state.value} onChange={this.onChange}>
				{map.map(([bit, desc]) => (
					<option key={bit} value={bit}>{desc}</option>
				))}
			</select></label>
		);
	}
}

export {
	KeywordField,
}
