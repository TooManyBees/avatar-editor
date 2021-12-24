import React, { useState } from "react";
import { Area } from "../parser";
import VnumList from "./VnumList";
import MobileForm from "./MobileForm";
import ObjektForm from "./ObjektForm";
import RoomForm from "./RoomForm";

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
		<div>
			<nav>
				<div onClick={() => setSection("mobiles")}>#MOBILES</div>
				<div onClick={() => setSection("objects")}>#OBJECTS</div>
				<div onClick={() => setSection("rooms")}>#ROOMS</div>
			</nav>

			<div>{view}</div>
		</div>
	);
}