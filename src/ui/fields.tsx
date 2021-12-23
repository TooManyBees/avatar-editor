import React, { ChangeEvent } from "react";

interface TextFieldProps {
	name: string;
	value: string | null;
}

interface TextFieldState {
	value: string | null;
}

export class TextField extends React.Component<TextFieldProps, TextFieldState> {
	constructor(props: TextFieldProps) {
		super(props);
		this.state = { value: props.value };
		this.onChange = this.onChange.bind(this);
	}

	onChange(event: ChangeEvent<HTMLInputElement>) {
		this.setState({ value: event.currentTarget.value });
	}

	render() {
		const name = this.props.name;
		const value = this.state.value;
		const valueString = value == null ? "" : value.toString();
		return (
			<label>{name}: <input type="text" value={valueString} onChange={this.onChange} /></label>
		);
	}
}

export class TextArea extends React.Component<TextFieldProps, TextFieldState> {
	constructor(props: TextFieldProps) {
		super(props);
		this.state = { value: props.value };
		this.onChange = this.onChange.bind(this);
	}

	onChange(event: ChangeEvent<HTMLTextAreaElement>) {
		this.setState({ value: event.currentTarget.value });
	}

	render() {
		const name = this.props.name;
		const value = this.state.value;
		const valueString = value == null ? "" : value.toString();
		return (
			<label>{name}: <textarea value={valueString} onChange={this.onChange} /></label>
		);
	}
}

interface NumberFieldProps {
	name: string;
	value: number | null;
	min?: number;
	max?: number;
}

interface NumberFieldState {
	value: number | null;
}

export class NumberField extends React.Component<NumberFieldProps, NumberFieldState> {
	constructor(props: NumberFieldProps) {
		super(props);
		this.state = { value: props.value };
		this.onChange = this.onChange.bind(this);
	}

	onChange(event: ChangeEvent<HTMLInputElement>) {
		const value = parseInt(event.currentTarget.value, 10);
		const { max, min } = this.props;
		if (!Number.isInteger(value)) return;
		if (max != null && value > max) return;
		if (min != null && value < min) return;
		this.setState({ value });
	}

	render() {
		const { name, max, min } = this.props;
		const value = this.state.value;
		const valueString = value ? value.toString() : "";
		return (
			<label>{name}: <input type="number" value={valueString} min={min} max={max} onChange={this.onChange} /></label>
		);
	}
}

interface BitsFieldProps {
	name: string;
	value: number[];
	map: [number, string, string][];
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
			let idx = this.state.value.indexOf(bit);
			const value = this.state.value;
			if (idx > -1) this.setState({ value: value.slice(0, idx).concat(value.slice(idx + 1)) });
			else this.setState({ value: value.concat(bit) });
		}
	}

	render() {
		const { map, name } = this.props;
		return (
			<fieldset>
				<legend>{name}</legend>
				{map.map(([bit, desc, help]) => (
					<label title={help}><input key={bit}
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
		if (Number.isInteger(value)) this.setState({ value });
	}

	render() {
		const { map, name, } = this.props;
		return (
			<label>{name}: <select value={this.state.value} onChange={this.onChange}>
				{map.map(([bit, desc]) => (
					<option key={bit} value={bit}>{desc}</option>
				))}
			</select></label>
		);
	}
}
