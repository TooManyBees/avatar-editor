import React from "react";

interface Props {
	name: string;
	value: string[];
	onUpdate?: (ks: string[]) => void;
}

interface State {
	keywords: string[];
	currentWord: string | null;
}

export default class KeywordField extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			keywords: props.value,
			currentWord: null,
		};
		this.onBlur = this.onBlur.bind(this);
	}

	onBlur(event: any) {
		if (this.props.onUpdate) {
			this.props.onUpdate(this.state.keywords);
		}
	}

	render() {
		return (
			<div>
				<label>{this.props.name}: {this.state.keywords.map((k, n) => <span key={n} style={{background: "pink", marginRight: "1rem"}}>{k}</span>)}</label>
			</div>
		);
	}
}
