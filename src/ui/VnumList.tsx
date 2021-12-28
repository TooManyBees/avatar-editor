import React from "react";
import "./VnumList.css";

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
	selected: string | null;
}

interface ListProps<T> {
	selected: string | null;
	itemName: string;
	items: T[];
	onAdd: () => void;
	onChange: (selected: string) => void;
}

export function VnumItemList<T extends HasVnum>({ selected, itemName, items, onAdd, onChange }: ListProps<T>) {
	return (
		<ol className="VnumItemList">
			<button onClick={onAdd}>New {itemName}</button>
			{items.map(({ id, vnum, name }) => (
				<li key={id} onClick={() => onChange(id)} className={selected === id ? "selected" : undefined}>
					<span className="vnum">{vnum || ""}</span> {name}
				</li>
			))}
		</ol>
	);
}

export default class VnumItemEditor<T extends HasVnum> extends React.Component<Props<T>, State> {
	constructor(props: Props<T>) {
		super(props)
		this.state = { selected: null };
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
			<div className="VnumItemEditor">
				{selectedItem ? <FormComponent key={selectedId} item={selectedItem} /> : <div className="VnumItemEditorPlaceholder"/> }
				<VnumItemList items={items} selected={selectedId} onChange={this.onChange} />
			</div>
		);
	}
}
