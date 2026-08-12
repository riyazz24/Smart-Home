
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiX } from 'react-icons/fi';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';
import { listThings } from '../../util/ThingApi';
import { DAYS, buildCronExpression, buildCronExpressionsForDates, formatDateForDisplay } from '../../util/CronUtil';


export default function CreateScenesContent() {
    const [deviceList, setDeviceList] = useState([]);
    const [ruleName, setRuleName] = useState('');
    const [time, setTime] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [selectedDates, setSelectedDates] = useState([]); // ["2025-06-25", "2025-06-27", ...]
    const [selectedDays, setSelectedDays] = useState([]);
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
        const fetchDevices = async () => {
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
        fetchDevices();
    }, [navigate]);

    const handleDateChange = (value) => {
        if (!value) return;

        setSelectedDates((prev) => (prev.includes(value) ? prev : [...prev, value].sort()));

        const weekdayIndex = new Date(`${value}T00:00:00`).getDay(); // 0=Sun ... 6=Sat, matches DAYS order
        const matchingDay = days[weekdayIndex]?.full;
        if (matchingDay) {
            setSelectedDays((prev) => (prev.includes(matchingDay) ? prev : [...prev, matchingDay]));
        }

        setDateInput('');
    };

    const removeDate = (value) => {
        setSelectedDates((prev) => prev.filter((d) => d !== value));
    };

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
        // A scene needs either specific dates or recurring days to know when
        // to fire - not necessarily both.
        const hasDates = selectedDates.length > 0;
        const hasDays = selectedDays.length > 0;
        if (!ruleName || !time || (!hasDates && !hasDays) || !device || !command) {
            setModal({
                show: true,
                title: 'Error',
                message: <span className='text-danger'>All fields are required</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
            return;
        }

        const cronExpressions = hasDates
            ? buildCronExpressionsForDates(time, selectedDates)
            : [buildCronExpression(time, selectedDays)];

        if (cronExpressions.length === 0 || cronExpressions.some((c) => !c)) {
            setModal({
                show: true,
                title: 'Error',
                message: <span className='text-danger'>Could not build a valid schedule from the selected date/time.</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
            return;
        }

        const buildRulePayload = (cronExpression) => ({
            ruleName,
            triggerPayload: {
                type: 'TIME',
                cronExpression,
                itemName: null,
                state: null,
            },
            actionPayloadList: [
                { itemName: device, command },
            ],
        });

        try {
            let lastMessage = '';
            for (const cronExpression of cronExpressions) {
                const { data } = await axiosInstance.post('/rule/create', buildRulePayload(cronExpression));
                lastMessage = data.message;
            }
            setModal({
                show: true,
                title: 'Success',
                message: lastMessage,
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
                        <input type="time" id='time' className="form-control py-2" style={selectStyle}
                            placeholder="Start Time" value={time} onChange={e => setTime(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <div className="form-label fw-bold">Date</div>
                        <div className="position-relative">
                            <input type="date" id='date' className="form-control py-2 pe-5" style={selectStyle}
                                placeholder="Select Date" value={dateInput} onChange={e => handleDateChange(e.target.value)} required={selectedDates.length === 0} />
                            <FiCalendar
                                className="position-absolute top-50 translate-middle-y"
                                style={{ right: '14px', pointerEvents: 'none', fontSize: '15px', color: '#1C1C1E' }}
                            />
                        </div>

                        {/* Selected dates - e.g. picking 25/06/2025, 27/06/2025, 30/06/2025 shows all three here */}
                        {selectedDates.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {selectedDates.map((d) => (
                                    <span key={d}
                                        className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1"
                                        style={{ backgroundColor: '#1C1C1E', color: '#fff', fontSize: '13px' }}>
                                        {formatDateForDisplay(d)}
                                        <FiX style={{ cursor: 'pointer' }} onClick={() => removeDate(d)} />
                                    </span>
                                ))}
                            </div>
                        )}
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