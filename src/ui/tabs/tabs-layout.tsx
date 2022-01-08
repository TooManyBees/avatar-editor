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
			<button className={styles.tabsNavItem} data-selected={currentTab === "area"} onClick={() => dispatch(changedTab("area"))}>Area</button>
			<button className={styles.tabsNavItem} data-selected={currentTab === "areadata"} onClick={() => dispatch(changedTab("areadata"))}>Areadata</button>
			<button className={styles.tabsNavItem} data-selected={currentTab === "mobiles"} onClick={() => dispatch(changedTab("mobiles"))}>Moblies</button>
			<button className={styles.tabsNavItem} data-selected={currentTab === "objects"} onClick={() => dispatch(changedTab("objects"))}>Objects</button>
			<button className={styles.tabsNavItem} data-selected={currentTab === "rooms"} onClick={() => dispatch(changedTab("rooms"))}>Rooms</button>
			<span style={{marginRight: "0.5rem"}} />
			<Button onClick={save}>Write .are</Button> <span style={{color: "var(--neutral)"}}>← (do this often!)</span>
		</nav>
	);
}
