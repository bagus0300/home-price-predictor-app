
import { Navigation } from "../components/nav";
import { fetchEvents} from '../api/fetchdata';
import MapView from "./mapView";

export default async function MapPage() {
	const events = await fetchEvents()

    return (
		<div className=" bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<Navigation />
			<MapView web3eventMap = {events}/>
		</div>
    );
};