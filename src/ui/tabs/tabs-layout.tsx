import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { changedTab } from "../../app/store/ui";
import { dismissUnsavedChanges } from "../../app/store";
import serializeArea from "../../serializer";
import { Button } from "../components";
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
		dismissUnsavedChanges();
	}

	return (
		<nav className={styles.tabsNav}>
			<div className={styles.tabsNavItem} data-selected={currentTab === "area"} onClick={() => dispatch(changedTab("area"))}>Area</div>
			<div className={styles.tabsNavItem} data-selected={currentTab === "areadata"} onClick={() => dispatch(changedTab("areadata"))}>Areadata</div>
			<div className={styles.tabsNavItem} data-selected={currentTab === "mobiles"} onClick={() => dispatch(changedTab("mobiles"))}>Moblies</div>
			<div className={styles.tabsNavItem} data-selected={currentTab === "objects"} onClick={() => dispatch(changedTab("objects"))}>Objects</div>
			<div className={styles.tabsNavItem} data-selected={currentTab === "rooms"} onClick={() => dispatch(changedTab("rooms"))}>Rooms</div>
			<Button onClick={save}>Write .are</Button>
		</nav>
	);
}
