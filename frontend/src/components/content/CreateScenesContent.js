import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';
import { listThings } from '../../util/ThingApi';
import { DAYS, buildCronExpression } from '../../util/CronUtil';


export default function CreateScenesContent() {
    const [deviceList, setDeviceList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [ruleName, setRuleName] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [selectedDays, setSelectedDays] = useState(['MONDAY']);
    const [room, setRoom] = useState('');
    const [device, setDevice] = useState('');
    const [command, setCommand] = useState('ON');
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const navigate = useNavigate();

    const isLoggedIn = () => !!localStorage.getItem('sessionId');

    const days = DAYS;

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        const fetchRoomsAndDevices = async () => {
            try {
                const response = await axiosInstance.get('/room/list');
                if (response.status === 200) {
                    setRoomList(response.data.roomList || []);
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch room';
                console.error(errorMessage);
            }
            
            try {
                const { data, status } = await listThings();
                if (status === 200) {
                    const mapped = (data.thingList || [])
                        .map((thing) => ({
                            itemName: thing.thingItemsListResponseList?.[0]?.itemName,
                            label: thing.label,
                        }))
                        .filter((d) => d.itemName);
                    setDeviceList(mapped);
                }
            } catch (err) {
                setDeviceList([]);
                console.error(err.response?.data?.message || 'Failed to fetch devices');
            }
        };
        fetchRoomsAndDevices();
    }, [navigate]);

    const toggleDay = (dayFull) => {
        setSelectedDays(prev =>
            prev.includes(dayFull) ? prev.filter(d => d !== dayFull) : [...prev, dayFull]
        );
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

        const oppositeCommand = command === 'ON' ? 'OFF' : 'ON';

        const startRulePayload = {
            ruleName: `${ruleName} (Start)`,
            triggerPayload: {
                type: 'TIME',
                cronExpression: buildCronExpression(fromTime, selectedDays),
                itemName: null,
                state: null,
            },
            actionPayloadList: [
                { itemName: device, command },
            ],
        };

        const endRulePayload = {
            ruleName: `${ruleName} (End)`,
            triggerPayload: {
                type: 'TIME',
                cronExpression: buildCronExpression(toTime, selectedDays),
                itemName: null,
                state: null,
            },
            actionPayloadList: [
                { itemName: device, command: oppositeCommand },
            ],
        };

        try {
            const { data, status } = await axiosInstance.post('/rule/create', startRulePayload);
            let secondMessage = '';
            if (status === 200) {
                const endResponse = await axiosInstance.post('/rule/create', endRulePayload);
                secondMessage = endResponse.data?.message || '';
            }
            setModal({
                show: true,
                title: 'Success',
                message: data.message + (secondMessage ? ` / ${secondMessage}` : ''),
                isError: false,
                onConfirm: () => {
                    setModal({ ...modal, show: false });
                    navigate('/schedule/your_schedule');
                }
            });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create schedule. Please try again.';
            setModal({
                show: true,
                title: 'Failed',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
        }
    };

    const selectStyle = {
        backgroundColor: '#eaeaea',
        border: 'none',
        borderRadius: '6px',
    };

    return (
        <>
            <div className='container px-5 py-4'>

                <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }} className='mb-4'>Create Scenes</div>

                {/* Content */}
                <div style={{ width: '100%', maxWidth: '620px' }}>

                    <div className="mb-4">
                        <div className="form-label fw-bold">Name</div>
                        <input type="text" id='ruleName' className="form-control py-2" style={selectStyle}
                            placeholder="Scene Name" value={ruleName} onChange={e => setRuleName(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <div className="form-label fw-bold">Time</div>
                        <div className="d-flex align-items-center gap-3">
                            <input type="time" id='fromTime' className="form-control py-2" style={selectStyle}
                                placeholder="Start Time" value={fromTime} onChange={e => setFromTime(e.target.value)} required />
                            <span>To</span>
                            <input type="time" id='toTime' className="form-control py-2" style={selectStyle}
                                placeholder="End Time" value={toTime} onChange={e => setToTime(e.target.value)} required />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="form-label fw-bold">Day</div>
                        <div className="d-flex flex-wrap gap-2">
                            {days.map(({ short, full }) => (
                                <button
                                    key={full}
                                    type='button'
                                    className={`btn rounded-circle d-flex justify-content-center align-items-center ${selectedDays.includes(full) ? 'btn-dark text-white' : ''}`}
                                    onClick={() => toggleDay(full)}
                                    style={selectedDays.includes(full) ? { height: '38px', width: '38px', fontSize: '12px' } : { height: '38px', width: '38px', fontSize: '12px', backgroundColor: '#eaeaea', color: '#1C1C1E' }}>
                                    {short}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="form-label fw-bold">Devices</div>
                        <select className="form-select py-2" style={selectStyle} id='device' value={device} onChange={e => setDevice(e.target.value)} required>
                            <option value="">Select Device</option>
                            {deviceList.map((deviceListObj, index) => (
                                <option key={deviceListObj.itemName ?? index} value={deviceListObj.itemName}>{deviceListObj.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <div className="form-label fw-bold">Rooms</div>
                        <select className="form-select py-2" style={selectStyle} id='room' value={room} onChange={e => setRoom(e.target.value)} required>
                            <option value="">Select Room</option>
                            {roomList.map((roomListObj, index) => (
                                <option key={roomListObj.roomId ?? index} value={roomListObj.roomId}>{roomListObj.roomName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <div className="form-label fw-bold">Condition</div>
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

                <div className='text-end my-4'>
                    <button className="btn btn-dark px-4 py-2" style={{ fontSize: '13px', letterSpacing: '0.5px' }} onClick={handleSubmit}>SUBMIT</button>
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