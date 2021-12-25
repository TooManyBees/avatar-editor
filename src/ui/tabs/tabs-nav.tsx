import React from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { changedTab } from "../../app/store/ui";
import "./tabs.css";

export default function TabsNav() {
	const dispatch = useAppDispatch();
	const currentTab = useAppSelector(state => state.ui.tab);

	return (
		<nav className="TabsNav">
			<div className="TabsNavItem" onClick={() => dispatch(changedTab("mobiles"))}>Moblies</div>
			<div className="TabsNavItem" onClick={() => dispatch(changedTab("objects"))}>Objects</div>
			<div className="TabsNavItem" onClick={() => dispatch(changedTab("rooms"))}>Rooms</div>
		</nav>
	);
}
