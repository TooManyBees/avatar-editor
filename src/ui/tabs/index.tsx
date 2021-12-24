import React from "react";
import { useAppSelector } from "../../app/hooks"
import MobilesTab from "./mobiles";
import ObjectsTab from "./objects";
import RoomsTab from "./rooms";

export default function Tabs() {
	const tab = useAppSelector(state => state.ui.tab);
	switch (tab) {
		case "area":
			return null;
		case "areadata":
			return null;
		case "helps":
			return null;
		case "mobiles":
			return <MobilesTab />;
		case "objects":
			return <ObjectsTab />;
		case "rooms":
			return <RoomsTab />;
		case "resets":
			return null;
		case "shops":
			return null;
		case "specials":
			return null;
	}
}
