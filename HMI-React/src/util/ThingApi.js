import axiosInstance from './AxiosInstance';

// Ported from the CRA reference app's src/util/ThingApi.js - same backend
// contract (ThingController / ThingItemsController), just re-exported here so
// HMI pages/components can import it directly.

export const scanThing = (binding) =>
    axiosInstance.post('/thing/scan', null, {
        headers: { 'X-Binding': binding },
    });

export const createThing = ({ roomId, thingTypeUid, label, ipAddress, macAddress }) =>
    axiosInstance.post('/thing/create', { roomId, thingTypeUid, label, ipAddress, macAddress });

export const controlThing = (thingUid, channelId, command) =>
    axiosInstance.post(
        '/thing/items/control',
        { command },
        { headers: { 'X-ThingUid': thingUid, 'X-ChannelId': channelId } }
    );

export const listThings = (roomId) => axiosInstance.get('/thing/list', { params: roomId ? { roomId } : {} });
export const updateThing = (thingUid, { label }) => axiosInstance.patch(`/thing/${thingUid}`, { label });
export const deleteThing = (thingUid) => axiosInstance.delete(`/thing/${thingUid}`);
