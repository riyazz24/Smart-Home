import { useState, useEffect, useCallback, useRef } from 'react';
import { FiEdit2, FiTrash2, FiMonitor, FiX, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ModalLayout from '../layout/ModalLayout';
import { listThings, controlThing, updateThing, deleteThing } from '../../util/ThingApi';
import useWebSocketTopic from '../../hooks/useWebSocketTopic';

const customStyle1 = { fontWeight: '700', fontSize: '16px', lineHeight: '100%', letterSpacing: '-0.39px' };
const customStyle2 = { fontWeight: '600', fontSize: '14px', lineHeight: '100%', letterSpacing: '-0.39px', height: '60px' };

export default function AllDevicesContent() {
    const [devices, setDevices] = useState([]);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });

    // Edit device name modal
    const [editingDevice, setEditingDevice] = useState(null);
    const [editedName, setEditedName] = useState('');

    // Delete success modal
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

    // Delete confirmation modal - holds the device pending deletion, if any
    const [deletingDevice, setDeletingDevice] = useState(null);

    const navigate = useNavigate();

    const isLoggedIn = () => !!localStorage.getItem('sessionId');

    const fetchDevice = useCallback(async () => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        try {
            const { data, status } = await listThings();
            if (status === 200) {
                const mapped = (data.thingList || []).map((thing) => ({
                    thingUid: thing.thingUID,
                    label: thing.label,
                    roomName: thing.roomName || '—',
                    status: false,
                    channelId: thing.thingItemsListResponseList?.[0]?.channelId,
                }));
                setDevices(mapped);
            }
        } catch (err) {
            setDevices([]);
            console.error(err.response?.data?.message || 'Failed to fetch devices');
        }
    }, [navigate]);

    const pendingToggleRef = useRef(null);

    useEffect(() => {
        fetchDevice();
    }, [fetchDevice]);

    // Re-fetch the list on create (a new device was added, or a scan
    // finished) so the table picks it up without the user refreshing.
    useWebSocketTopic('/topic/thing/create', useCallback(() => {
        fetchDevice();
    }, [fetchDevice]));

    // On control results, DON'T refetch - GET /thing/list has no status
    // field, so a refetch would just reset every toggle back to off. Instead,
    // apply the result directly to the device we were waiting on.
    useWebSocketTopic('/topic/thing/control', useCallback((payload) => {
        const thingUid = pendingToggleRef.current;
        if (!thingUid) return;
        setDevices((prev) => prev.map((d) => (
            d.thingUid === thingUid ? { ...d, status: !!payload?.status } : d
        )));
        pendingToggleRef.current = null;
    }, []));

    // POST /thing/items/control (headers X-ThingUid, X-ChannelId) -> { command }.
    // Result (success/failure) arrives asynchronously on /topic/thing/control,
    // handled above.
    const handleToggle = async (device, newStatus) => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }

        // Flip the switch immediately (optimistic update). Without this the
        // checkbox stays visually frozen at the old value until the
        // request/response round trip to the agent completes, and a second
        // click before then would compute `!devicesObj.status` off the same
        // stale value and just re-send the same command instead of toggling -
        // which is what made it feel "locked" and need repeated clicks.
        setDevices((prev) => prev.map((d) => (
            d.thingUid === device.thingUid ? { ...d, status: newStatus } : d
        )));

        pendingToggleRef.current = device.thingUid;
        try {
            await controlThing(device.thingUid, device.channelId, newStatus ? 'ON' : 'OFF');
            // The /topic/thing/control handler above will reconcile `status`
            // with what the agent actually reports once it arrives.
        } catch (err) {
            // Request never made it out - revert the optimistic flip.
            setDevices((prev) => prev.map((d) => (
                d.thingUid === device.thingUid ? { ...d, status: !newStatus } : d
            )));
            pendingToggleRef.current = null;
            const errorMessage = err.response?.data?.message || 'Sending command failed';
            console.error(errorMessage);
        }
    };

    // --- Edit device name -----------------------------------------------
    const openEditModal = (devicesObj) => {
        setEditingDevice(devicesObj);
        setEditedName(devicesObj.label);
    };

    const closeEditModal = () => {
        setEditingDevice(null);
        setEditedName('');
    };

    // PUT /thing/{thingUid} { label } -> { message }
    const handleSaveDeviceName = async () => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        const trimmedName = editedName.trim();
        if (!trimmedName) return;

        const device = editingDevice;
        const previousLabel = device?.label;

        // Optimistic update so the table reflects the new name immediately.
        setDevices((prev) => prev.map((d) => (
            d.thingUid === device.thingUid ? { ...d, label: trimmedName } : d
        )));
        closeEditModal();

        try {
            await updateThing(device.thingUid, { label: trimmedName });
        } catch (err) {
            // Revert on failure.
            setDevices((prev) => prev.map((d) => (
                d.thingUid === device.thingUid ? { ...d, label: previousLabel } : d
            )));
            const errorMessage = err.response?.data?.message || 'Renaming the device failed';
            setModal({
                show: true,
                title: 'Not available',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal((m) => ({ ...m, show: false })),
            });
        }
    };

    const openDeleteModal = (device) => setDeletingDevice(device);
    const closeDeleteModal = () => setDeletingDevice(null);

    const handleDelete = async () => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        if (!deletingDevice) return;

        try {
            await deleteThing(deletingDevice.thingUid);
            setDevices((prev) => prev.filter((d) => d.thingUid !== deletingDevice.thingUid));
            closeDeleteModal();
            setShowDeleteSuccess(true);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete device';
            closeDeleteModal();
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

                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }}>All Devices</div>
                    <button
                        className='btn btn-sm d-flex align-items-center gap-2'
                        style={{ border: '1px solid #ddd', backgroundColor: '#fff' }}
                        onClick={() => navigate('/devices/scan_devices')}
                    >
                        <FiSearch size={14} /> Scan Devices
                    </button>
                </div>

                {/* Table */}
                <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>
                    {devices.length > 0 ? (
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
                                    {devices.map((devicesObj, index) => (
                                        <tr key={devicesObj.thingUid ?? index} className={index % 2 === 0 ? 'table-EAEAEA' : ''}>
                                            <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                <div className='d-flex align-items-center'>
                                                    <FiMonitor className='me-2' style={{ fontSize: '16px' }} />
                                                    {devicesObj.label}
                                                </div>
                                            </td>
                                            <td className='p-3 border-0' style={{ ...customStyle2, color: '#5B6EE1' }}>
                                                {devicesObj.roomName}
                                            </td>
                                            <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                <div className='form-check form-switch d-flex align-items-center'>
                                                    <input
                                                        style={{ cursor: 'pointer' }}
                                                        className='form-check-input'
                                                        type='checkbox'
                                                        checked={devicesObj.status}
                                                        onChange={() => handleToggle(devicesObj, !devicesObj.status)}
                                                    />
                                                </div>
                                            </td>
                                            <td className='p-3 border-0' style={{ ...customStyle2 }}>
                                                <div className='d-flex align-items-center gap-3'>
                                                    <FiEdit2 style={{ fontSize: '15px', cursor: 'pointer' }}
                                                        onClick={() => openEditModal(devicesObj)}
                                                    />
                                                    <FiTrash2 style={{ fontSize: '15px', cursor: 'pointer' }}
                                                        onClick={() => openDeleteModal(devicesObj)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='alert d-flex justify-content-center align-items-center h-100'>No devices found</div>
                    )}
                </div>

            </div>

            {/* Edit device name modal */}
            {editingDevice && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1050
                }}>
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '12px',
                        width: '100%', maxWidth: '380px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        padding: '24px', position: 'relative'
                    }}>
                        <button onClick={closeEditModal} style={{
                            position: 'absolute', top: '12px', right: '14px',
                            background: 'none', border: 'none', cursor: 'pointer'
                        }}>
                            <FiX size={16} />
                        </button>

                        <div className='fw-bold mb-3' style={{ fontSize: '15px' }}>Change the device name</div>

                        <input
                            type='text'
                            className='form-control mb-4'
                            style={{ backgroundColor: '#eaeaea', border: 'none' }}
                            placeholder='Device Name'
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            autoFocus
                        />

                        <div className='text-center'>
                            <button className='btn btn-dark px-5' onClick={handleSaveDeviceName}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirmation modal */}
            {deletingDevice && (
                <ModalLayout
                    title='Delete Device'
                    msg={`Are you sure you want to delete "${deletingDevice.label}"? This also removes its channels and any modes/schedulers using it.`}
                    modal={closeDeleteModal}
                >
                    <div className='d-flex justify-content-center gap-3'>
                        <button type='button' className='btn btn-outline-eaeaea px-4' onClick={closeDeleteModal}>Cancel</button>
                        <button type='button' className='btn btn-dark px-4' onClick={handleDelete}>Delete</button>
                    </div>
                </ModalLayout>
            )}

            {/* Delete success modal */}
            {showDeleteSuccess && (
                <ModalLayout hideClose>
                    <div className='d-flex justify-content-center mb-3'>
                        <div className='d-flex justify-content-center align-items-center rounded-circle'
                            style={{ width: '64px', height: '64px', backgroundColor: '#2FB6E0' }}>
                            <div className='d-flex justify-content-center align-items-center rounded-circle bg-white'
                                style={{ width: '48px', height: '48px' }}>
                                <FiX size={26} color='#E14434' />
                            </div>
                        </div>
                    </div>
                    <div className='mb-1' style={{ fontSize: '15px' }}>The Device is Deleted Sucessfully</div>
                    <div className='text-muted mb-4' style={{ fontSize: '14px' }}>Go to All Device Page</div>
                    <button className='btn btn-dark px-5' onClick={() => setShowDeleteSuccess(false)}>Done</button>
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