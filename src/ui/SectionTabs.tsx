import React, { useState } from "react";
import { Area } from "../parser";
import VnumList from "./VnumList";
import MobileForm from "./MobileForm";
import ObjektForm from "./ObjektForm";
import RoomForm from "./RoomForm";
import "./SectionTabs.css";

interface Props {
	area: Area;
}

function renderSection(section: keyof Area, area: Area) {
	switch (section) {
		case "mobiles":
			return <VnumList items={area.mobiles} FormComponent={MobileForm} />;
		case "objects":
			return <VnumList items={area.objects} FormComponent={ObjektForm} />;
		case "rooms":
			return <VnumList items={area.rooms} FormComponent={RoomForm} />;
		default:
			return null;
	}
}

export default function SectionTabs({ area }: Props) {
	const [currentSection, setSection] = useState<keyof Area>("mobiles");

	const view = renderSection(currentSection, area);

	return (
		<div className="SectionTabs">
			<nav className="SectionTabsNav">
				<div className="SectionTabsNavItem" onClick={() => setSection("mobiles")}>Moblies</div>
				<div className="SectionTabsNavItem" onClick={() => setSection("objects")}>Objects</div>
				<div className="SectionTabsNavItem" onClick={() => setSection("rooms")}>Rooms</div>
			</nav>

			{view}
		</div>
	);
}