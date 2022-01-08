import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { changedTab } from "../../app/store/ui";
import { dismissUnsavedChanges } from "../../app/store";
import serializeArea from "../../serializer";
import { Button } from "../components";
import styles from "./tabs-layout.module.css";

interface Props {
	children: React.ReactNode;
}

export function TabsLayout(props: Props) {
	return (
		<div className={styles.tabs}>
			<TabsNav />
			<div className={styles.tabsContentsContainer}>
				{props.children}
			</div>
		</div>
	);
}

interface ContentsProps {
	children: React.ReactNode;
	scrollRef?: React.RefObject<HTMLDivElement>;
}

export function TabsContents(props: ContentsProps) {
	const { children, scrollRef } = props;
	return <div className={styles.tabsContents} ref={scrollRef}>{children}</div>;
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
			<button className={styles.tabsNavItem} data-selected={currentTab === "area"} onClick={() => dispatch(changedTab("area"))}>
				<span className={styles.tabsNavText}>Area</span>
			</button>
			<button className={styles.tabsNavItem} data-selected={currentTab === "areadata"} onClick={() => dispatch(changedTab("areadata"))}>
				<span className={styles.tabsNavText}>Areadata</span>
			</button>
			<button className={styles.tabsNavItem} data-selected={currentTab === "mobiles"} onClick={() => dispatch(changedTab("mobiles"))}>
				<span className={styles.tabsNavText}>Moblies</span>
			</button>
			<button className={styles.tabsNavItem} data-selected={currentTab === "objects"} onClick={() => dispatch(changedTab("objects"))}>
				<span className={styles.tabsNavText}>Objects</span>
			</button>
			<button className={styles.tabsNavItem} data-selected={currentTab === "rooms"} onClick={() => dispatch(changedTab("rooms"))}>
				<span className={styles.tabsNavText}>Rooms</span>
			</button>
			<button className={styles.tabsNavItem} data-selected={currentTab === "orphans"} onClick={() => dispatch(changedTab("orphans"))}>
				<span className={styles.tabsNavText}>Orphans</span>
			</button>
			<span style={{marginRight: "0.5rem"}} />
			<Button onClick={save}>Write .are</Button> <span style={{color: "var(--neutral)"}}>← (do this often!)</span>
		</nav>
	);
}
