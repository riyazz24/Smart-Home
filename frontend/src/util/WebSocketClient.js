import { Client } from '@stomp/stompjs';

// The backend registers a plain STOMP endpoint at /ws (no SockJS fallback -
// see WebSocketConfig#registerStompEndpoints), so we connect with a native
// WebSocket. The endpoint is listed as public in SecurityConfig, so no auth
// headers are required on the handshake/CONNECT frame today.
//
// Broker destinations currently published by the backend (WebSocketService):
//   /topic/scan          -> ScanResultPayload[]   (result of POST /thing/scan)
//   /topic/thing/create   -> ThingResultPayload    (result of POST /thing/create)
//   /topic/thing/control  -> ThingResultPayload    (result of POST /thing/items/control)
//   /topic/rule/create    -> ThingResultPayload    (result of POST /rule/create)
//   /topic/rule/enable    -> ThingResultPayload    (result of PUT /rule/enable)
//   /topic/rule/delete    -> ThingResultPayload    (result of DELETE /rule/delete)
// There is currently no per-user/per-session routing on these topics (they're
// broadcast via a SimpleBroker), so every connected client receives every
// message. If the backend later scopes these (e.g. /user/queue/...), only
// the destinations below need to change.

const getWsUrl = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';
    return apiUrl.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws';
};

let client = null;
let connectPromise = null;

/**
 * Returns a singleton, lazily-connected STOMP client. Safe to call from
 * multiple components - they'll all share the same underlying WebSocket
 * connection.
 */
const getClient = () => {
    if (client) return client;

    client = new Client({
        brokerURL: getWsUrl(),
        reconnectDelay: 5000, // auto-reconnect every 5s if the connection drops
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: () => { }, // set to console.log for verbose STOMP frame logging
    });

    return client;
};

/**
 * Ensures the shared client is connected (activating it if necessary) and
 * resolves once the CONNECT handshake completes. Multiple concurrent callers
 * share the same in-flight connection attempt.
 */
export const connectWebSocket = () => {
    const c = getClient();

    if (c.connected) return Promise.resolve(c);
    if (connectPromise) return connectPromise;

    connectPromise = new Promise((resolve, reject) => {
        c.onConnect = () => resolve(c);
        c.onStompError = (frame) => {
            console.error('STOMP protocol error:', frame.headers?.message, frame.body);
        };
        c.onWebSocketError = (event) => {
            console.error('WebSocket error:', event);
        };
        c.onWebSocketClose = () => {
            // reconnectDelay handles retrying automatically; nothing to do here.
        };
        c.activate();
    }).finally(() => {
        connectPromise = null;
    });

    return connectPromise;
};

/**
 * Subscribes to a STOMP destination, connecting first if needed. Returns an
 * unsubscribe function. `onMessage` receives the already-JSON-parsed body
 * (falls back to the raw string if it isn't JSON).
 *
 * Usage (typically inside a useEffect):
 *   useEffect(() => {
 *     let unsubscribe;
 *     subscribeTopic('/topic/scan', (payload) => setInbox(payload)).then(fn => { unsubscribe = fn; });
 *     return () => unsubscribe?.();
 *   }, []);
 */
export const subscribeTopic = async (destination, onMessage) => {
    const c = await connectWebSocket();
    const subscription = c.subscribe(destination, (message) => {
        let body = message.body;
        try {
            body = JSON.parse(message.body);
        } catch (e) {
            // not JSON, pass the raw string through
        }
        onMessage(body, message);
    });
    return () => subscription.unsubscribe();
};

/**
 * Publishes a message to an /app-prefixed destination. Not currently used by
 * the app (all device/thing actions are triggered over the existing REST
 * endpoints, which publish results back over the /topic destinations above),
 * but kept available since the backend's STOMP broker is configured to
 * accept /app messages (see WebSocketConfig#setApplicationDestinationPrefixes).
 */
export const publishMessage = async (destination, body) => {
    const c = await connectWebSocket();
    c.publish({ destination, body: JSON.stringify(body) });
};

export const disconnectWebSocket = () => {
    if (client) {
        client.deactivate();
    }
};
