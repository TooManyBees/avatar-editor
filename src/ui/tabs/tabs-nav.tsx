import React from "react"
import { Area } from "../../app/models";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { changedTab } from "../../app/store/ui";
import "./tabs.css";

export default function TabsNav() {
	const dispatch = useAppDispatch();
	const currentTab = useAppSelector(state => state.ui.tab);

	function changeTab(tab: keyof Area) {
		dispatch(changedTab(tab));
	}

	return (
		<nav className="TabsNav">
			<div className="TabsNavItem" onClick={() => changeTab("mobiles")}>Moblies</div>
			<div className="TabsNavItem" onClick={() => changeTab("objects")}>Objects</div>
			<div className="TabsNavItem" onClick={() => changeTab("rooms")}>Rooms</div>
		</nav>
	);
}
