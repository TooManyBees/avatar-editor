import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { changedTab } from "../../app/store/ui";
import "./tabs.css";

interface Props {
	children: React.ReactNode;
	sideNav?: React.ReactNode;
}

export default function TabsLayout(props: Props) {
	const { children, sideNav = null } = props;
	return (
		<div className="Tabs">
			<TabsNav />
			<div className="TabsContentsContainer">
				<div className="TabsContents">{children}</div>
				{sideNav}
			</div>
		</div>
	);
}

function TabsNav() {
	const dispatch = useAppDispatch();
	const currentTab = useAppSelector(state => state.ui.tab);

	return (
		<nav className="TabsNav">
			<div className="TabsNavItem" onClick={() => dispatch(changedTab("area"))}>Area</div>
			<div className="TabsNavItem" onClick={() => dispatch(changedTab("areadata"))}>Areadata</div>
			<div className="TabsNavItem" onClick={() => dispatch(changedTab("mobiles"))}>Moblies</div>
			<div className="TabsNavItem" onClick={() => dispatch(changedTab("objects"))}>Objects</div>
			<div className="TabsNavItem" onClick={() => dispatch(changedTab("rooms"))}>Rooms</div>
		</nav>
	);
}
