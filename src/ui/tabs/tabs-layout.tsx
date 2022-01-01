import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { changedTab } from "../../app/store/ui";
import serializeArea from "../../serializer";
import styles from "./tabs-layout.module.css";

interface Props {
	children: React.ReactNode;
	sideNav?: React.ReactNode;
}

export default function TabsLayout(props: Props) {
	const { children, sideNav = null } = props;
	return (
		<div className={styles.tabs}>
			<TabsNav />
			<div className={styles.tabsContentsContainer}>
				<div className={styles.tabsContents}>{children}</div>
				{sideNav}
			</div>
		</div>
	);
}

function TabsNav() {
	const dispatch = useAppDispatch();
	const currentTab = useAppSelector(state => state.ui.tab);
	const rootState = useAppSelector(state => state);

	function save() {
		const output = serializeArea(rootState);
		const w = window.open("");
		if (w) {
			w.document.write(`<pre><code>${output}</code></pre>`);
		}
	}

	return (
		<nav className={styles.tabsNav}>
			<div className={styles.tabsNavItem} onClick={() => dispatch(changedTab("area"))}>Area</div>
			<div className={styles.tabsNavItem} onClick={() => dispatch(changedTab("areadata"))}>Areadata</div>
			<div className={styles.tabsNavItem} onClick={() => dispatch(changedTab("mobiles"))}>Moblies</div>
			<div className={styles.tabsNavItem} onClick={() => dispatch(changedTab("objects"))}>Objects</div>
			<div className={styles.tabsNavItem} onClick={() => dispatch(changedTab("rooms"))}>Rooms</div>
			<button onClick={save}>Save</button>
		</nav>
	);
}
