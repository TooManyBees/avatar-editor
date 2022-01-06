import React from "react";
import styles from "./VnumList.module.css";

interface HasVnum {
	id: string;
	vnum: number | null;
	name?: string;
	shortDesc?: string;
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
		<ol className={styles.vnumItemList}>
			<button onClick={onAdd}>New {itemName}</button>
			{items.map(({ id, vnum, name, shortDesc }) => (
				<li key={id} onClick={() => onChange(id)} className={selected === id ? styles.selected : undefined}>
					<span className={styles.vnum}>{vnum || ""}</span> {name || shortDesc || ""}
				</li>
			))}
		</ol>
	);
}

// export default class VnumItemEditor<T extends HasVnum> extends React.Component<Props<T>, State> {
// 	constructor(props: Props<T>) {
// 		super(props)
// 		this.state = { selected: null };
// 		this.onChange = this.onChange.bind(this);
// 	}

// 	onChange(selected: string) {
// 		this.setState({ selected });
// 	}

// 	render() {
// 		const { items, FormComponent} = this.props;
// 		const selectedId = this.state.selected;
// 		const selectedItem = items.find(i => i.id === selectedId);

// 		return (
// 			<div className="VnumItemEditor">
// 				{selectedItem ? <FormComponent key={selectedId} item={selectedItem} /> : <div className="VnumItemEditorPlaceholder"/> }
// 				<VnumItemList items={items} selected={selectedId} onChange={this.onChange} />
// 			</div>
// 		);
// 	}
// }
