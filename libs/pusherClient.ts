import Pusher from "pusher-js";

const pusher = new Pusher(process.env.KEY_PUSHER as string, {
	cluster: process.env.CLUSTER_PUSHER as string,
});

export default pusher;
