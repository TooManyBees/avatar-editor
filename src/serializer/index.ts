import { RootState } from "../app/store";
import serializeArea from "./area";
import serializeAreadata from "./areadata";
import serializeHelps from "./helps";
import serializeMobiles from "./mobiles";
import serializeObjects from "./objects";
import serializeRooms from "./rooms";
import serializeResets from "./resets";
import serializeShops from "./shops";
import serializeSpecials from "./specials";

export default function serialize(state: RootState): string {
	let buffer = "";

	buffer += serializeArea(state.area) + "\n";
	buffer += serializeAreadata(state.areadata) + "\n";
	buffer += serializeHelps(state.area.helps) + "\n";
	buffer += serializeMobiles(state.mobiles.mobiles) + "\n";
	buffer += serializeObjects(state.objects.objects) + "\n";
	buffer += serializeRooms(state.rooms.rooms, state.objects.objects) + "\n";
	buffer += serializeResets(state.resets.resets, state.mobiles.mobiles, state.objects.objects, state.rooms.rooms) + "\n";
	buffer += serializeShops(state.shops.shops, state.mobiles.mobiles) + "\n";
	buffer += serializeSpecials(state.specials.specials, state.mobiles.mobiles) + "\n";

	return buffer;
}
