import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';

export default function UpdateSceneContent() {
    const location = useLocation();
    const { id: sceneId } = useParams();
    const scene = location.state?.scene;

    // convert "3:08 pm" -> "15:08"
    const convertTo24Hour = (time12h) => {
        if (!time12h) return '';
        // Split into ["3:08", "pm"]
        const [timePart, modifier] = time12h.split(' ');
        let [hours, minutes] = timePart.split(':').map(str => parseInt(str, 10));

        if (modifier.toLowerCase() === 'pm' && hours < 12) {
            hours += 12;
        }
        if (modifier.toLowerCase() === 'am' && hours === 12) {
            hours = 0;
        }
        const hh = hours.toString().padStart(2, '0');
        const mm = minutes.toString().padStart(2, '0');
        return `${hh}:${mm}`;
    };

    const initialFrom = scene?.fromTime ? convertTo24Hour(scene.fromTime) : '';
    const initialTo = scene?.toTime ? convertTo24Hour(scene.toTime) : '';

    const [deviceList, setDeviceList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [ruleName, setRuleName] = useState(scene?.ruleName || '');
    const [fromTime, setFromTime] = useState(initialFrom);
    const [toTime, setToTime] = useState(initialTo);
    const [selectedDays, setSelectedDays] = useState(scene?.days ? Array.from(scene.days) : []);
    const [device, setDevice] = useState(scene?.deviceId || '');
    const [room, setRoom] = useState(scene?.roomId || '');
    const [command, setCommand] = useState(scene?.command || 'ON');
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();

    const isLoggedIn = () => !!localStorage.getItem('sessionId');

    const days = [
        { short: 'Sun', full: 'SUNDAY' },
        { short: 'Mon', full: 'MONDAY' },
        { short: 'Tue', full: 'TUESDAY' },
        { short: 'Wed', full: 'WEDNESDAY' },
        { short: 'Thu', full: 'THURSDAY' },
        { short: 'Fri', full: 'FRIDAY' },
        { short: 'Sat', full: 'SATURDAY' },
    ];

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        const fetchRoomsAndDevices = async () => {
            try {
                const response1 = await axiosInstance.get('/room/list');
                if (response1.status === 200) {
                    setRoomList(response1.data.roomList || []);
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch room';
                console.error(errorMessage);
            }

            // TODO(backend): GET /device/list is gone and has no Thing
            // equivalent yet (see util/ThingApi.js) - the Device dropdown
            // below will be empty until one exists.
            setDeviceList([]);
        };
        fetchRoomsAndDevices();
    }, [navigate]);

    const toggleDay = (dayFull) => {
        setSelectedDays(prev =>
            prev.includes(dayFull) ? prev.filter(d => d !== dayFull) : [...prev, dayFull]);
    };

    const handleSubmit = async () => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        if (!ruleName || !fromTime || !toTime || selectedDays.length === 0 || !room || !device || !command) {
            setModal({
                show: true,
                title: 'Error',
                message: <span className='text-danger'>All fields are required</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
            return;
        }

        // TODO(backend): RuleController has no generic "update a rule's
        // fields" endpoint - only POST /rule/create, PUT /rule/enable
        // (status toggle only), DELETE /rule/delete, and GET /rule/list.
        // There's no route this form's Save action can call yet. Stubbed
        // until the backend adds one; the payload shape it should probably
        // accept is documented in CreateScenesContent.js next to the
        // /rule/create call (ruleName + triggerPayload + actionPayloadList).
        console.warn('Updating a schedule is not implemented on the backend yet:', sceneId);
        setModal({
            show: true,
            title: 'Not available',
            message: <span className='text-danger'>Editing a schedule's details isn't supported by the backend yet.</span>,
            isError: true,
            onConfirm: () => setModal({ ...modal, show: false }),
        });
    };

    const handleDelete = async () => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
        if (!confirmDelete) return;

        // DELETE /rule/delete (header X-RuleUid) - sceneId is the route param,
        // which YourScenesContent now passes the rule's ruleUid into.
        try {
            const { data, status } = await axiosInstance.delete('/rule/delete', { headers: { 'X-RuleUid': sceneId } });
            if (status === 200) {
                setModal({
                    show: true,
                    title: 'Success',
                    message: data.message,
                    isError: false,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                        navigate('/schedule/your_schedule');
                    }
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete schedule. Please try again.';
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
            <div className='container px-5 py-4'>

                <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }} className='mb-3'>Update Schedule</div>

                {/* Content */}
                <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>

                    <div className="mb-2">
                        <div className="form-label">Name</div>
                        <input type='text' id='ruleName' className="form-control" value={ruleName} onChange={e => setRuleName(e.target.value)} required />
                    </div>

                    <div className="mb-2">
                        <div className="form-label">Time</div>
                        <div className="d-flex gap-2">
                            <input type="time" id='fromTime' className="form-control" value={fromTime} onChange={e => setFromTime(e.target.value)} required />
                            <span className="align-self-center">To</span>
                            <input type="time" id='toTime' className="form-control" value={toTime} onChange={e => setToTime(e.target.value)} required />
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="form-label">Days</div>
                        <div className="d-flex flex-wrap gap-2">
                            {days.map(({ short, full }) => (
                                <button
                                    key={full}
                                    type='button'
                                    className={`btn border border-dark rounded-circle d-flex justify-content-center align-items-center ${selectedDays.includes(full) ? 'btn-dark text-white' : 'btn-light'}`}
                                    onClick={() => toggleDay(full)}
                                    style={{ height: '35px', width: '35px', fontSize: '12px' }}>
                                    {short}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="form-label">Device</div>
                        <select className="form-select" value={device} onChange={e => setDevice(e.target.value)} required>
                            <option value="">Select Device</option>
                            {deviceList.map((deviceListObj, index) => (
                                <option key={deviceListObj.deviceId ?? index} value={deviceListObj.deviceId}>{deviceListObj.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Room</label>
                        <select className="form-select" value={room} onChange={e => setRoom(e.target.value)} required>
                            <option value="">Select Room</option>
                            {roomList.map((roomListObj, index) => (
                                <option key={roomListObj.roomId ?? index} value={roomListObj.roomId}>{roomListObj.roomName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <div className="d-block form-label">Condition</div>
                        <div className="d-inline-flex rounded-3 overflow-hidden" style={{ border: '1px solid #eaeaea' }}>
                            <button type='button'
                                className='btn rounded-0 px-4'
                                style={command === 'ON' ? { backgroundColor: '#1C1C1E', color: '#fff' } : { backgroundColor: '#fff', color: '#1C1C1E' }}
                                onClick={() => setCommand('ON')}>
                                On
                            </button>
                            <button type='button'
                                className='btn rounded-0 px-4'
                                style={command === 'OFF' ? { backgroundColor: '#1C1C1E', color: '#fff' } : { backgroundColor: '#fff', color: '#1C1C1E' }}
                                onClick={() => setCommand('OFF')}>
                                Off
                            </button>
                        </div>
                    </div>
                </div>

                <div className='d-flex justify-content-between my-5'>
                    <button className="btn btn-outline-eaeaea" onClick={handleDelete}>Delete</button>
                    <button className="btn btn-dark" onClick={handleSubmit}>Update</button>
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