import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash, FaPlus, FaPen } from 'react-icons/fa';
import { FiMonitor } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';
import EmptyRoomImg from '../../assets/EmptyRoom.png';
import { controlThing, listThings } from '../../util/ThingApi';
import useWebSocketTopic from '../../hooks/useWebSocketTopic';

const customStyle1 = { fontWeight: '700', fontSize: '16px', lineHeight: '100%', letterSpacing: '-0.39px' };
const customStyle2 = { fontWeight: '600', fontSize: '14px', lineHeight: '100%', letterSpacing: '-0.39px' };

const normalizeRoomName = (str) => (str || '').trim().toLowerCase(); 

export default function RoomsContent({ roomName: roomNameProp, onRoomAdded }) {
    const { roomName: roomNameParam } = useParams();
    const roomName = roomNameProp || (roomNameParam
        ? roomNameParam.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : '');
    const [devices, setDevices] = useState([]);
    const [hasRoom, setHasRoom] = useState(false);
    const [loadingRoom, setLoadingRoom] = useState(true);
    const [roomList, setRoomList] = useState([]);
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);
    const [showRoomMenu, setShowRoomMenu] = useState(false);
    const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [roomModalMode, setRoomModalMode] = useState('add');
    const [editingRoomId, setEditingRoomId] = useState(null);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
    const [showDeleteDeviceModal, setShowDeleteDeviceModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [editDeviceName, setEditDeviceName] = useState('');
    const navigate = useNavigate();
    const isLoggedIn = () => !!localStorage.getItem('sessionId');
    // The "No rooms" empty state should only show when the room list is
    // actually empty - not just when the room in the current URL happens not
    // to match (which is what `hasRoom` tracks).
    const hasAnyRoom = roomList.length > 0;

    // TODO(backend): there is still no endpoint to list the Things that
    // belong to a room (the old /user/thing endpoint referenced below is
    // gone, and the new Thing API only exposes scan/create/control - see
    // util/ThingApi.js for the full rundown). Swap this stub for a real call
    // once one exists; handleToggle below is already wired to the real
    // control endpoint and just needs each device to carry a `thingUid` and
    // `channelId`.
    //
    const fetchDevice = useCallback(async (roomId) => {
        if (!isLoggedIn()) { 
            navigate('/'); 
            return;
        }
    
        if(!roomId) {
            setDevices([]);
            return;
        }

        try {
            const { data, status } = await listThings(roomId);
            if (status === 200) {
                const mapped = (data.thingList || []).map((thing) => ({
                    thingUid: thing.thingUID,
                    label: thing.label,
                    roomName: thing.roomName || roomName,
                    status: false,
                    channelId: thing.thingItemsListResponseList?.[0]?.channelId,
                }));
                setDevices(mapped);
            }
        } catch (err) {
            setDevices([]);
            console.error(err.response?.data?.message || 'Failed to fetch device');
        }
    }, [roomName, navigate]);

    const fetchRoomList = useCallback(async () => {
        if(!isLoggedIn()) {
            navigate('/');
            return;
        }

        try {
            const { data, status } = await axiosInstance.get('/room/list');
            if (status === 200) {
                setRoomList(data.roomList);
                // hasRoom only tells us whether THIS particular room (from the URL)
                // exists - it says nothing about whether rooms exist at all, so it
                // must not be used to decide whether to show the "No rooms" empty
                // state (see hasAnyRoom below, used in the render instead).
                setHasRoom(data.roomList.some(r => normalizeRoomName(r.roomName) === normalizeRoomName(roomName)));
            }
        } catch (err) {
            setHasRoom(false);
            setRoomList([]);
            const errorMessage = err.response?.data?.message || 'Failed to fetch room';
            console.error(errorMessage);
        } finally {
            setLoadingRoom(false);
        }
    }, [navigate, roomName]);

    // useEffect(() => {
    //     const fetchRoom = async () => {
    //         if (!sessionId) {
    //             navigate('/');
    //             return;
    //         }
    //         try {
    //             const { data, status } = await axiosInstance.get('/room/list',
    //                 { headers: {  "X-HomeId": "HOME001", } }
    //             );
    //             if (status === 200 && data.length > 0) {
    //                 setHasRoom(true);
    //                 return;
    //             }
    //         } catch (err) {
    //             setHasRoom(false);
    //             const errorMessage = err.response?.data?.error || 'Failed to fetch room';
    //             console.error(errorMessage); 
    //         }
    //     };
    //     fetchRoom();

    //     fetchDevice();
    // //     const intervalId = setInterval(() => {
    // //         fetchDevice();
    // //     }, 3000);
    // //     return () => clearInterval(intervalId);
    // }, [fetchDevice, navigate, sessionId]);

    useEffect(() => {
        fetchRoomList();
    }, [fetchRoomList]);

    useEffect(() => {
        const currentRoomId = roomList.find((r) => normalizeRoomName(r.roomName) === normalizeRoomName(roomName))?.roomId;
        fetchDevice(currentRoomId);
    },[fetchDevice, roomList, roomName]);

    const capitalize = (str) => {
        if (!str) return '';
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }

        // No frontend agent-existence check here - /room/create is called
        // directly and the backend is responsible for validating the agent.
        // Whatever error message it returns is shown verbatim below.
        try {
            const normalizedRoomName = capitalize(newRoomName);
            
            if(roomModalMode === 'edit') {
                const { data, status } = await axiosInstance.patch('/room/update',
                    { roomName: normalizedRoomName },
                    { headers: { 'X-RoomId': editingRoomId } }
                );

                if (status === 200) {
                    setNewRoomName('');
                    setShowAddRoomModal(false);
                    setRoomModalMode('add');
                    setEditingRoomId(null);
                    await fetchRoomList();
                    onRoomAdded?.();
                    setModal({
                        show: true,
                        title: 'Success',
                        message: data?.message || 'Room updated successfully',
                        isError: false,
                        onConfirm: () => {
                            setModal({ ...modal, show: false });
                            navigate( `/room/${normalizedRoomName}`);
                        }
                    })
                }
                // Edit path is done - don't fall through into the create branch below.
                return;
            }
            const { data, status } = await axiosInstance.post('/room/create', 
                { roomName: normalizedRoomName }
            );
            if (status === 200) {
                setNewRoomName('');
                setShowAddRoomModal(false);
                onRoomAdded?.();
                setModal({
                    show: true,
                    title: 'Success',
                    message: data.message,
                    isError: false,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                        navigate(`/room/${normalizedRoomName}`);
                    }
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to add room';
            setModal({
                show: true,
                title: 'Failed',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
        }  
    };

    const openEditDeviceModal = (device) => {
        setSelectedDevice(device);
        setEditDeviceName(device.label || '');
        setShowEditDeviceModal(true);
    };

    const openEditRoomModal = () => {
        const roomToEdit = roomList.find(r => normalizeRoomName(r.roomName) === normalizeRoomName(roomName));
        if (!roomToEdit) return;
        setRoomModalMode('edit');
        setEditingRoomId(roomToEdit.roomId);
        setNewRoomName(roomToEdit.roomName);
        setShowAddRoomModal(true);
    };    
    
    const closeRoomModal = () => {
        setShowAddRoomModal(false);
        setRoomModalMode('add');
        setEditingRoomId(null);
        setNewRoomName('');
    };
    
    const openDeleteDeviceModal = (device) => {
        setSelectedDevice(device);
        setShowDeleteDeviceModal(true);
    };

    // TODO(backend): there is no device update/delete endpoint yet (see the
    // fetchDevice TODO above - the whole device list is still a stub), so
    // these just update local state for now, matching the pattern already
    // used elsewhere in this file for not-yet-available backend features.
    const handleEditDeviceConfirmed = (e) => {
        e.preventDefault();
        setDevices((prev) => prev.map((d) => (d === selectedDevice ? { ...d, label: editDeviceName } : d)));
        setShowEditDeviceModal(false);
        setSelectedDevice(null);
    };

    const handleDeleteDeviceConfirmed = () => {
        setDevices((prev) => prev.filter((d) => d !== selectedDevice));
        setShowDeleteDeviceModal(false);
        setSelectedDevice(null);
    };

    // POST /thing/items/control (headers X-ThingUid, X-ChannelId) -> { command }.
    // This is the real, currently-available Thing API - it just can't be
    // exercised from this page yet because `devices` is always empty (see the
    // fetchDevice TODO above, which is what needs to supply the thingUid /
    // channelId for each row).
    const handleToggle = async (device, newStatus) => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        if (!device?.thingUid || !device?.channelId) {
            console.warn('Device control is not available yet - missing thingUid/channelId (device list API is still pending):', device, newStatus);
            return;
        }
        try {
            await controlThing(device.thingUid, device.channelId, newStatus ? 'ON' : 'OFF');
            // Result arrives asynchronously on /topic/thing/control - see the
            // useWebSocketTopic subscription below, which re-fetches on ack.
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to send command';
            console.error(errorMessage);
        }
    }

    // Once fetchDevice is wired to a real endpoint, this keeps the room's
    // device table in sync with the result of any control command.
    useWebSocketTopic('/topic/thing/control', useCallback(() => {
        const currentRoomId = roomList.find((r) => normalizeRoomName(r.roomName) === normalizeRoomName(roomName))?.roomId;
        fetchDevice(currentRoomId);
    }, [fetchDevice, roomList, roomName]));

    const confirmDeleteRoom = () => {
        setShowDeleteRoomModal(true);
    };

    const handleDeleteRoomConfirmed = async () => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        setShowDeleteRoomModal(false);
        const roomToDelete = roomList.find(r => normalizeRoomName(r.roomName) === normalizeRoomName(roomName));
        if (!roomToDelete) {
            setModal({
                show: true,
                title: 'Error',
                message: <span className='text-danger'>Room not found</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
            return;
        }
        try {
            // DELETE /room/delete takes X-RoomId and X-AgentId headers, not a roomId query param.
            // TODO: 'X-AgentId' is hardcoded - nothing in the app currently tracks the real agentId yet
            const response = await axiosInstance.delete('/room/delete', {
                headers: { 'X-RoomId': roomToDelete.roomId }
            });
            if (response.status === 200) {
                await fetchRoomList();
                setModal({
                    show: true,
                    title: 'Success',
                    message: response.data.message,
                    isError: false,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                        const remaining = roomList.filter(r => r.roomId !== roomToDelete.roomId);
                        if (remaining.length === 0) {
                            navigate("/room/no_room");
                        } else {
                            navigate(`/room/${remaining[0].roomName}`);
                        }
                    }
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete room';
            setModal({
                show: true,
                title: 'Failed',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
        }
    };

    return (
        <>
            {/* <div className="container px-5 py-4">

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }}>{hasRoom === false ? 'No Room' : roomName}</div>
                    <button className="btn btn-dark" onClick={() => setShowAddRoomModal(true)}>Add Room</button>
                </div>

                Table
                <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>
                    {hasRoom === true &&
                        <div className='table-responsive'>
                            <table className='table align-middle border-0'>
                                <thead className='table-1C1C1E border-0'>
                                    <tr>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '40%' }}>Devices</th>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Room</th>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Status</th>
                                        <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {devices.length > 0 ? (
                                        devices.map((devicesObj, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'table-EAEAEA' : ''}>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    {devicesObj.label}
                                                </td>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    {devicesObj.roomName}
                                                </td>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    <div className='form-check form-switch d-flex align-items-center'>
                                                        <input style={{ cursor: 'pointer' }} className='form-check-input' type='checkbox' checked={devicesObj.status}
                                                            onChange={() => handleToggle(devicesObj, !devicesObj.status)} />
                                                    </div>
                                                </td>
                                                <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                    <FaTrash onClick={confirmDeleteRoom} style={{ fontSize: '16px', cursor: 'pointer' }} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className='table-EAEAEA'>
                                            <td colSpan='3' className='p-3 border-0 text-center' style={{ ...customStyle2 }}>
                                                No devices found
                                            </td>
                                            <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                <FaTrash onClick={confirmDeleteRoom} style={{ fontSize: '16px', cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    }

                    {hasRoom === false && (
                        <div className='alert d-flex justify-content-center align-items-center h-100'>No rooms yet to create</div>
                    )}
                </div>
            </div >

            Add Room Modal
            {showAddRoomModal && (
                <ModalLayout title={'Add Room'} modal={() => setShowAddRoomModal(false)}>
                    <form onSubmit={handleAddRoom}>
                        <div className="text-start mb-5">
                            <label className="form-label" htmlFor='roomName'>Room Name</label>
                            <input type="text" id='roomName' className="form-control" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} required />
                        </div>
                        <Buttons buttonName={'Add'} onCancel={() => setShowAddRoomModal(false)} />
                    </form>
                </ModalLayout>
            )}

            Delete Room Modal
            {showDeleteRoomModal && (
                <ModalLayout title={'Delete Room'} msg={<span>Do you really want to delete {roomName} ?</span>}
                    modal={() => setShowDeleteRoomModal(false)}>
                    <Buttons buttonName={'Delete'} onCancel={() => setShowDeleteRoomModal(false)} onDelete={handleDeleteRoomConfirmed} />
                </ModalLayout>
            )}

            Alert Modal
            {modal.show && (
                <ModalLayout title={modal.title} msg={modal.message} modal={modal.onConfirm} hideClose={!modal.isError}>
                    <button onClick={modal.onConfirm} className={`btn btn-dark px-3`}>
                        {modal.isError ? 'Try Again' : 'OK'}
                    </button>
                </ModalLayout>
            )} */}

            <div className="container px-5 py-4">

                {/* Breadcrumb */}
                {/* <div className="bg-light rounded p-3 mb-3">
                    <span className="text-muted">All Rooms</span>
                    <span className="text-muted mx-2">&gt;</span>
                    <span style={{ fontWeight: 700 }}>{loadingRoom ? roomName : (hasRoom ? roomName : (capitalize(newRoomName) || roomName))}</span>
                </div> */}

                <div className="bg-white rounded p-4">
                    {loadingRoom ? (
                        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : hasAnyRoom ? (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }}>{hasRoom ? roomName : roomList[0]?.roomName}</div>
                                <div className="d-flex align-items-center gap-3 position-relative">
                                    <BsThreeDotsVertical
                                        style={{ fontSize: '18px', cursor: 'pointer' }}
                                        onClick={() => setShowRoomMenu(!showRoomMenu)}
                                    />
                                    {showRoomMenu && (
                                        <ul className='list-group position-absolute shadow' style={{ top: '36px', right: 0, zIndex: 10, minWidth: '160px' }}>
                                            <li className='list-group-item list-group-item-action d-flex align-items-center gap-2'
                                                style={{ cursor: 'pointer', fontSize: '14px' }}
                                                onClick={() => { setShowRoomMenu(false); setRoomModalMode('add'); setEditingRoomId(null); setNewRoomName(''); setShowAddRoomModal(true); }}>
                                                <FaPlus size={12} /> Add Room
                                            </li>
                                            <li className='list-group-item list-group-item-action d-flex align-items-center gap-2'
                                                style={{ cursor: 'pointer', fontSize: '14px' }}
                                                onClick={() => { setShowRoomMenu(false); openEditRoomModal(); }}>
                                                <FaPen size={12} /> Edit Room
                                            </li>
                                            <li className='list-group-item list-group-item-action d-flex align-items-center gap-2 text-danger'
                                                style={{ cursor: 'pointer', fontSize: '14px' }}
                                                onClick={() => { setShowRoomMenu(false); confirmDeleteRoom(); }}>
                                                <FaTrash size={12} /> Delete Room
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Table */}
                            <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>
                                <div className='table-responsive'>
                                    <table className='table align-middle border-0'>
                                        <thead className='table-1C1C1E border-0'>
                                            <tr>
                                                <th className='p-3 border-0' style={{ ...customStyle1, width: '55%' }}>Devices</th>
                                                <th className='p-3 border-0' style={{ ...customStyle1, width: '25%' }}>Status</th>
                                                {/* <th className='p-3 border-0' style={{ ...customStyle1, width: '20%' }}>Action</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {devices.length > 0 ? (
                                                devices.map((devicesObj, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? 'table-EAEAEA' : ''}>
                                                        <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                            <div className='d-flex align-items-center'>
                                                                <FiMonitor className='me-2' style={{ fontSize: '16px' }} />
                                                                {devicesObj.label}
                                                            </div>
                                                        </td>
                                                        <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                            <div className='form-check form-switch d-flex align-items-center'>
                                                                <input style={{ cursor: 'pointer' }} className='form-check-input' type='checkbox' checked={devicesObj.status}
                                                                    onChange={() => handleToggle(devicesObj, !devicesObj.status)} />
                                                            </div>
                                                        </td>
                                                        {/* <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                            <div className='d-flex align-items-center gap-2'>
                                                                <button
                                                                    onClick={() => openEditDeviceModal(devicesObj)}
                                                                    className='btn btn-sm'
                                                                    style={{ border: '1px solid #ddd', backgroundColor: '#fff', color: '#1C1C1E', fontSize: '12px', fontWeight: 600, padding: '4px 12px' }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => openDeleteDeviceModal(devicesObj)}
                                                                    className='btn btn-sm'
                                                                    style={{ border: 'none', backgroundColor: '#E14434', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 12px' }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr className='table-EAEAEA'>
                                                    <td colSpan='3' className='p-3 border-0 text-center' style={{ ...customStyle2 }}>
                                                        No devices found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div className="bg-light rounded p-3 flex-grow-1 me-3">
                                    There is no room is added still now
                                </div>
                                <button
                                    className="btn btn-sm d-flex align-items-center gap-1 flex-shrink-0"
                                    style={{ border: '1px solid #ddd', backgroundColor: '#fff' }}
                                    onClick={() => setShowAddRoomModal(true)}
                                >
                                    <FaPlus size={12} /> Add Room
                                </button>
                            </div>
                            <div className="d-flex justify-content-center py-4">
                                {/* TODO: replace with your actual empty-room illustration */}
                                <img src={EmptyRoomImg} alt="No rooms yet" style={{ maxWidth: '420px' }} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Add / Edit Room Modal */}
            {showAddRoomModal && (
                <ModalLayout modal={closeRoomModal}>
                    <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px' }} className="mb-4">
                        {roomModalMode === 'edit' ? 'EDIT ROOM' : 'ADD ROOM'}
                    </div>
                    <form onSubmit={handleAddRoom}>
                        <div className="mb-4">
                            <input
                                type="text" id='roomName' className="form-control" placeholder="Room Name"
                                value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} required
                            />
                        </div>
                        <div className='d-flex justify-content-center gap-3'>
                            <button type='submit' className='btn btn-dark px-4'>{roomModalMode === 'edit' ? 'Save' : 'Add'}</button>
                            <button type='button' className='btn btn-dark px-4' onClick={closeRoomModal}>Cancel</button>
                        </div>
                    </form>
                </ModalLayout>
            )}

            {/* Edit Device Modal - same panel style as Add Room */}
            {showEditDeviceModal && (
                <ModalLayout modal={() => setShowEditDeviceModal(false)}>
                    <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px' }} className="mb-4">
                        EDIT DEVICE
                    </div>
                    <form onSubmit={handleEditDeviceConfirmed}>
                        <div className="mb-4">
                            <input
                                type="text" id='editDeviceName' className="form-control" placeholder="Device Name"
                                value={editDeviceName} onChange={(e) => setEditDeviceName(e.target.value)} required
                            />
                        </div>
                        <div className='d-flex justify-content-center gap-3'>
                            <button type='submit' className='btn btn-dark px-4'>Save</button>
                            <button type='button' className='btn btn-dark px-4' onClick={() => setShowEditDeviceModal(false)}>Cancel</button>
                        </div>
                    </form>
                </ModalLayout>
            )}

            {/* Delete Device Modal - same panel style as Add Room */}
            {showDeleteDeviceModal && (
                <ModalLayout modal={() => setShowDeleteDeviceModal(false)}>
                    <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px' }} className="mb-4">
                        DELETE DEVICE
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '16px' }} className='mb-4'>
                        Do you really want to delete {selectedDevice?.label}?
                    </div>
                    <div className='d-flex justify-content-center gap-3'>
                        <button type='button' className='btn btn-dark px-4' onClick={handleDeleteDeviceConfirmed}>Delete</button>
                        <button type='button' className='btn btn-dark px-4' onClick={() => setShowDeleteDeviceModal(false)}>Cancel</button>
                    </div>
                </ModalLayout>
            )}

            {/* Delete Room Modal */}
            {showDeleteRoomModal && (
                <ModalLayout title={'Delete Room'} msg={<span>Do you really want to delete {roomName} ?</span>}
                    modal={() => setShowDeleteRoomModal(false)}>
                    <div className='d-flex justify-content-around'>
                        <button type='button' className='btn btn-outline-eaeaea px-5' onClick={() => setShowDeleteRoomModal(false)}>Cancel</button>
                        <button type='submit' className='btn btn-dark px-5' onClick={handleDeleteRoomConfirmed}>Delete</button>
                    </div>
                </ModalLayout>
            )}

            {/* Alert Modal */}
            {modal.show && (
                <ModalLayout title={modal.title} msg={modal.message} modal={modal.onConfirm} hideClose={!modal.isError}>
                    <button onClick={modal.onConfirm} className={`btn btn-dark px-3`}>
                        {modal.isError ? 'Try Again' : 'OK'}
                    </button>
                </ModalLayout>
            )}
        </>
    );
};