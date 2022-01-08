import React from "react";
import { useAppSelector } from "../../app/hooks"
import AreaTab from "./area";
import AreadataTab from "./areadata";
import MobilesTab from "./mobiles";
import ObjectsTab from "./objects";
import RoomsTab from "./rooms";
import { TabsLayout } from "./tabs-layout";
import OrphansTab from "./orphans";

function Tab() {
	const tab = useAppSelector(state => state.ui.tab);
	switch (tab) {
		case "area":
			return <AreaTab />;
		case "areadata":
			return <AreadataTab />;
		case "mobiles":
			return <MobilesTab />;
		case "objects":
			return <ObjectsTab />;
		case "rooms":
			return <RoomsTab />;
		case "orphans":
			return <OrphansTab />;
	}
}

export default function Tabs() {
	return <TabsLayout><Tab /></TabsLayout>;
}
