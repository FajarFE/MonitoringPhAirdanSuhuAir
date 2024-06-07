import Pusher from "pusher";

const pusher = new Pusher({
	appId: process.env.APP_ID as string,
	key: process.env.KEY_PUSHER as string,
	secret: process.env.SECRET_PUSHER as string,
	cluster: process.env.CLUSTER_PUSHER as string,
	useTLS: true,
});

export default pusher;
