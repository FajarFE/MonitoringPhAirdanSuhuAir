import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1815990",
  key: "cf6e225105d441779619",
  secret: "2577b716ec9435b0acfb",
  cluster: "mt1",
  useTLS: true,
});

/**
 * The following pusher client uses auth, not neccessary for the video chatroom example
 * Only the cluster would be important for that
 * These values can be found after creating a pusher app under
 * @see https://dashboard.pusher.com/apps/<YOUR_APP_ID>/keys
 */

export const pusherClient = new PusherClient("cf6e225105d441779619", {
  cluster: "mt1",
});
