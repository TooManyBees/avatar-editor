import React, { useState, useRef } from "react";
import classnames from "classnames";
import { Button } from "./components";
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
	const [kbNav, setKbNav] = useState(false);
	const selectedRef = useRef<HTMLAnchorElement>(null);
	const firstItemRef = useRef<HTMLAnchorElement>(null);
	const itemsRef = useRef<HTMLOListElement>(null);

	function onKbNavEnable() {
		setKbNav(true);
		if (selectedRef.current) selectedRef.current.focus();
		else if (firstItemRef.current) firstItemRef.current.focus();
	}

	function onBlur(e: React.FocusEvent) {
		if (e.relatedTarget && !itemsRef.current?.contains(e.relatedTarget)) {
			setKbNav(false);
		}
	}

	return (
		<div className={styles.vnumItemList}>
			<div className={styles.buttons}>
				<Button onClick={onAdd} style={{margin: "0.5rem 3rem"}}>
					Create a new {itemName}
				</Button>
				<div className={styles.enableKbNav}>
					<Button onClick={onKbNavEnable} tabIndex={items.length > 0 ? 0 : -1}>
						Tab through {items.length} {itemName}s
					</Button>
				</div>
			</div>
			<ol className={styles.list} ref={itemsRef} onBlur={onBlur}>
				{items.map(({ id, vnum, name, shortDesc }, n) => (
					<li key={id}>
						<a
							href="#"
							onClick={() => onChange(id)}
							className={classnames(selected === id && styles.selected, styles.link)}
							tabIndex={kbNav ? 0 : -1}
							ref={selected === id ? selectedRef : (n === 0 ? firstItemRef : undefined)}
						>
							<span className={styles.vnum}>{vnum || ""}</span> {name || shortDesc || ""}
						</a>
					</li>
				))}
			</ol>
		</div>
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
