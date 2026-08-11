import { useEffect, useRef } from 'react';
import { subscribeTopic } from '../util/WebSocketClient';

/**
 * Subscribes to a STOMP topic for the lifetime of the calling component.
 * Handles connecting, resubscribing after a reconnect, and cleanup.
 *
 * @param {string|null|undefined} destination e.g. '/topic/scan'. Pass a
 *   falsy value to skip subscribing (useful when the destination depends on
 *   data that hasn't loaded yet).
 * @param {(payload: any, rawMessage: any) => void} onMessage
 */
export default function useWebSocketTopic(destination, onMessage) {
    const onMessageRef = useRef(onMessage);
    onMessageRef.current = onMessage;

    useEffect(() => {
        if (!destination) return undefined;

        let unsubscribe;
        let cancelled = false;

        subscribeTopic(destination, (payload, rawMessage) => {
            onMessageRef.current?.(payload, rawMessage);
        }).then((fn) => {
            if (cancelled) {
                fn();
            } else {
                unsubscribe = fn;
            }
        });

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [destination]);
}
