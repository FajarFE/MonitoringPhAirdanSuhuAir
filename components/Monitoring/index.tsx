import React, { useEffect, useState } from "react";
import pusher from "@/libs/pusherClient";

interface MonitoringData {
	phAir: number;
	suhuAir: number;
}

const MonitoringComponent: React.FC = () => {
	const [data, setData] = useState<MonitoringData[]>([]);

	useEffect(() => {
		const channel = pusher.subscribe("monitoring-channel");
		channel.bind("new-data", (newData: MonitoringData) => {
			console.log("Received new data:", newData);
			setData((prevData) => [...prevData, newData]);
		});

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
		};
	}, []);

	return (
		<div>
			<h1>Monitoring pH dan Suhu Air</h1>
			<ul>
				{data.map((item, index) => (
					<li key={index}>
						pH Air: {item.phAir}, Suhu Air: {item.suhuAir},
					</li>
				))}
			</ul>
		</div>
	);
};

export default MonitoringComponent;
