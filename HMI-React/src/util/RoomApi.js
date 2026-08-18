import axiosInstance from "./AxiosInstance";

// GET /room/list -> { roomList: [{ roomId, roomName }] }
export const listRooms = () => axiosInstance.get('/room/list');

// POST /room/create -> { message }
export const createRoom = (roomName) =>
    axiosInstance.post('/room/create', { roomName });

// PATCH /room/update (header X-RoomId) -> { message }
export const updateRoom = (roomId, roomName) =>
    axiosInstance.patch(
        '/room/update',
        { roomName },
        { headers: { 'X-RoomId': roomId } }
    );

// DELETE /room/delete (header X-RoomId) -> { message }
export const deleteRoom = (roomId) =>
    axiosInstance.delete('/room/delete', { headers: { 'X-RoomId': roomId } });
