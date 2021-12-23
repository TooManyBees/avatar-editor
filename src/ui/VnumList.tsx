import React from "react";

interface HasVnum {
	id: string;
	vnum: number | null;
	name: string;
}

interface Props<T> {
	items: T[];
	FormComponent: React.ComponentType<{ item: T }>;
}

interface State {
	selected: string | undefined;
}

interface ListProps<T> {
	selected: string | undefined;
	items: T[];
	onChange: (selected: string) => void;
}

function VnumList<T extends HasVnum>({ selected, items, onChange }: ListProps<T>) {
	return (
		<ol>
			{items.map(item => (
				<li key={item.id} onClick={() => onChange(item.id)}>{item.vnum || ""} {item.name}</li>
			))}
		</ol>
	);
}

export default class VnumListEditor<T extends HasVnum> extends React.Component<Props<T>, State> {
	constructor(props: Props<T>) {
		super(props)
		this.state = { selected: undefined };
		this.onChange = this.onChange.bind(this);
	}

	onChange(selected: string) {
		this.setState({ selected });
	}

	render() {
		const { items, FormComponent} = this.props;
		const selectedId = this.state.selected;
		const selectedItem = items.find(i => i.id === selectedId);



		return (
			<div>
				<VnumList items={items} selected={selectedId} onChange={this.onChange} />
				{selectedItem ? <FormComponent key={selectedId} item={selectedItem} /> : null }
			</div>
		);
	}
}
