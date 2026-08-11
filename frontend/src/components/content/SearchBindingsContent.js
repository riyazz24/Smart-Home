import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../util/AxiosInstance';
import React from 'react';
import ModalLayout from '../layout/ModalLayout';
import { scanThing, createThing } from '../../util/ThingApi';
import useWebSocketTopic from '../../hooks/useWebSocketTopic';

export default function SearchBindingsContent() {
    const [rooms, setRooms] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBinding, setSelectedBinding] = useState('');
    const [inbox, setInbox] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [customLabels, setCustomLabels] = useState({});
    const [customConfig, setCustomConfig] = useState({}); // { [index]: { ipAddress, macAddress } }
    const [scanning, setScanning] = useState(false);
    const [addingIndex, setAddingIndex] = useState(null);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();

    const bindings = ['Wiz', 'Astro', 'Z-Wave', 'Nest'];

    const sessionId = localStorage.getItem('sessionId');

    useEffect(() => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        const fetchRoom = async () => {
            try {
                const { data, status } = await axiosInstance.get('/room/list');
                if (status === 200) {
                    setRooms(data.roomList || []);
                }
            } catch (err) {
                setRooms([]);
                const errorMessage = err.response?.data?.message || 'Failed to fetch room';
                console.error(errorMessage);
            }
        };
        fetchRoom();
    }, [navigate, sessionId]);

    // Live results of the currently running scan. POST /thing/scan just
    // triggers the scan over MQTT - the Agent publishes the discovered
    // devices back asynchronously on this topic once it's done.
    useWebSocketTopic('/topic/scan', useCallback((payload) => {
        const list = Array.isArray(payload) ? payload : [];
        setInbox(list);
        setScanning(false);
        setCustomLabels({});
        setCustomConfig({});
    }, []));

    // Ack for POST /thing/create - lets us tell the user whether the device
    // was actually added (creation happens asynchronously on the Agent).
    //
    // Note: the backend's CreateThingHandler only ever publishes to
    // /topic/thing/create *after* the thing has been created successfully -
    // if creation fails on the Agent/openHAB side it's just logged
    // server-side and nothing is broadcast on this topic (see
    // CreateThingHandler#handle's catch block). The `status` field on
    // ThingResultPayload is a shared DTO field that only carries meaning for
    // /topic/thing/control (there it's the bulb's ON/OFF state) - it's never
    // set here, so it defaults to `false` even on success and must NOT be
    // used to infer an error, otherwise every successful add gets shown in
    // the failure panel. Any message received on this topic is a success.
    useWebSocketTopic('/topic/thing/create', useCallback((payload) => {
        setAddingIndex(null);
        const message = payload?.message || 'Device added successfully';
        setModal({
            show: true,
            title: 'Success',
            message,
            isError: false,
            onConfirm: () => {
                setModal((m) => ({ ...m, show: false }));
                navigate('/devices/all_devices');
            },
        });
    }, [navigate]));

    const handleSelect = async (binding) => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        setSelectedBinding(binding);
        setIsOpen(false);
        setInbox([]);
        setScanning(true);
        try {
            // Backend currently only knows how to create things for the "wiz"
            // binding (see ThingsUseCase#thingCreateEvent), but scanning
            // itself is generic across bindings.
            await scanThing(binding.toLowerCase());
        } catch (err) {
            setScanning(false);
            const errorMessage = err.response?.data?.message || 'Scanning failed';
            setModal({
                show: true,
                title: 'Failed',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal((m) => ({ ...m, show: false })),
            });
        }
    };

    const handleLabelChange = (index, value) => {
        setCustomLabels(prev => ({ ...prev, [index]: value }));
    };

    const handleConfigChange = (index, field, value) => {
        setCustomConfig(prev => ({ ...prev, [index]: { ...prev[index], [field]: value } }));
    };

    const handleAddDevice = async (device, index) => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        if (!selectedRoomId) {
            setModal({
                show: true,
                title: 'Error',
                message: <span className='text-danger'>Please select a room</span>,
                isError: true,
                onConfirm: () => setModal((m) => ({ ...m, show: false })),
            });
            return;
        }

        // openHAB inbox entries expose discovered device properties as a free-form
        // map, so the key names for IP/MAC vary by binding. We try the common
        // keys first, and otherwise fall back to whatever the user typed in the
        // (optional) IP/MAC fields shown per row.
        const properties = device.properties || {};
        const ipAddress = customConfig[index]?.ipAddress || properties.ipAddress || properties.hostname || '';
        const macAddress = customConfig[index]?.macAddress || properties.macAddress || properties.deviceId || device.representationProperty || '';

        if (!ipAddress || !macAddress) {
            setModal({
                show: true,
                title: 'Error',
                message: <span className='text-danger'>Couldn't determine this device's IP/MAC address automatically - please fill them in below.</span>,
                isError: true,
                onConfirm: () => setModal((m) => ({ ...m, show: false })),
            });
            return;
        }

        setAddingIndex(index);
        try {
            await createThing({
                roomId: selectedRoomId,
                thingTypeUid: device.thingTypeUid,
                label: customLabels[index] || device.label,
                ipAddress,
                macAddress,
            });
            // Result (success/failure) arrives asynchronously over
            // /topic/thing/create - see the useWebSocketTopic subscription above.
        } catch (err) {
            setAddingIndex(null);
            const errorMessage = err.response?.data?.message || 'Failed to add device';
            setModal({
                show: true,
                title: 'Failed',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal((m) => ({ ...m, show: false })),
            });
        }
    };

    return (
        <>
            <div className='container px-5 py-4'>

                <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }} className='mb-3'>Scan Devices</div>

                <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>

                    {/* Binding selection dropdown */}
                    <div className='mb-3'>

                        <div className='form-label fw-bold'>Device Brand</div>

                        <div className='position-relative'>
                            <button type='button' onClick={() => setIsOpen(!isOpen)} className='form-select text-start py-2'>{selectedBinding || 'Select Options'}</button>
                            {isOpen && (
                                <ul className='list-group position-absolute mt-1 w-100 shadow' style={{ zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                                    {bindings.map((bindingsObj, index) => (
                                        <React.Fragment key={index}>
                                            <li className='list-group-item list-group-item-action' style={{ cursor: 'pointer' }} onClick={() => handleSelect(bindingsObj)}>
                                                {bindingsObj}
                                            </li>
                                        </React.Fragment>
                                    ))}
                                </ul>
                            )}
                        </div>

                    </div>

                    {/* Room selection dropdown */}
                    <div className='mb-3'>

                        <div className='form-label fw-bold'>Select Room</div>

                        <select className='form-select py-2' id='room' value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)}>
                            <option value=''>-- Select Room --</option>
                            {rooms.map((roomObj, index) => (
                                <option key={roomObj.roomId ?? index} value={roomObj.roomId}>{roomObj.roomName}</option>
                            ))}
                        </select>

                    </div>

                    {scanning && <div className='text-muted mb-2'>Scanning for {selectedBinding} devices...</div>}

                    {!scanning && inbox.length > 0 && <div className='fw-bold'>{selectedBinding}</div>}

                    {!scanning && inbox.length === 0 && selectedBinding && (
                        <div className='text-muted'>No devices found yet</div>
                    )}

                    {inbox.length > 0 && (
                        inbox.map((inboxObj, index) => (
                            <React.Fragment key={inboxObj.thingUid ?? index}>
                                <li className='list-group-item'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className='flex-grow-1 me-3'>
                                            <input
                                                id='label'
                                                type='text'
                                                className='form-control py-2 mb-2'
                                                value={customLabels[index] ?? inboxObj.label}
                                                onChange={(e) => handleLabelChange(index, e.target.value)}
                                                autoFocus={index === 0}
                                            />
                                            {/* Shown only as a fallback - normally pre-filled from the scan's
                                                discovered properties, see handleAddDevice */}
                                            {!(inboxObj.properties?.ipAddress) && (
                                                <input
                                                    type='text'
                                                    className='form-control py-1 mb-2'
                                                    placeholder='IP address'
                                                    value={customConfig[index]?.ipAddress || ''}
                                                    onChange={(e) => handleConfigChange(index, 'ipAddress', e.target.value)}
                                                />
                                            )}
                                            {!(inboxObj.properties?.macAddress) && (
                                                <input
                                                    type='text'
                                                    className='form-control py-1'
                                                    placeholder='MAC address'
                                                    value={customConfig[index]?.macAddress || ''}
                                                    onChange={(e) => handleConfigChange(index, 'macAddress', e.target.value)}
                                                />
                                            )}
                                        </div>
                                        <button className='btn btn-sm btn-dark' disabled={addingIndex === index} onClick={() => handleAddDevice(inboxObj, index)}>
                                            {addingIndex === index ? 'Adding...' : 'Add Device'}
                                        </button>
                                    </div>
                                </li>
                            </React.Fragment>
                        ))
                    )}
                </div>
            </div>

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
