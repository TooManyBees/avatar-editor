import React from "react";

interface Props {
	name: string;
	value: string[];
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
	}

	render() {
		return (
			<div>
				<label>{this.props.name}: {this.state.keywords.map(k => <span style={{background: "pink", marginRight: "1rem"}}>{k}</span>)}</label>
			</div>
		);
	}
}