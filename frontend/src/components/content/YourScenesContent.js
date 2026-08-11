import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegLightbulb } from 'react-icons/fa';
import { FiPower, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';
import { listThings } from '../../util/ThingApi';
import { DAYS, parseCronExpression, formatDateForDisplay } from '../../util/CronUtil';

// GET /rule/list returns [{ ruleUid, ruleName, status, triggerJson, actionsJson }].
// triggerJson / actionsJson are JSON strings - parse each scene once up front
// so every card renders straight from the same data that was actually saved
// when the scene was created (see CreateScenesContent.js), instead of any
// hardcoded/guessed fields.
const parseScene = (scenesObj) => {
    let trigger = {};
    try {
        trigger = scenesObj?.triggerJson ? JSON.parse(scenesObj.triggerJson) : {};
    } catch {
        trigger = {};
    }
    let actions = [];
    try {
        actions = scenesObj?.actionsJson ? JSON.parse(scenesObj.actionsJson) : [];
    } catch {
        actions = [];
    }
    const { time, days } = parseCronExpression(trigger.cronExpression);
    const dates = Array.isArray(trigger.dates) ? trigger.dates : [];
    const firstAction = actions[0] || {};
    return { time, days, dates, itemName: firstAction.itemName, command: firstAction.command };
};

export default function YourScenes() {
    const [scenes, setScenes] = useState([]);
    const [deviceList, setDeviceList] = useState([]);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const [deletingScene, setDeletingScene] = useState(null);
    const navigate = useNavigate();
    const isLoggedIn = () => !!localStorage.getItem('sessionId');

    const fetchScene = useCallback(async () => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        try {
            const { data, status } = await axiosInstance.get('/rule/list');
            if (status === 200) {
                setScenes(data.ruleList || []);
            }
        } catch (err) {
            setScenes([]);
            const errorMessage = err.response?.data?.message || 'Failed to fetch schedule';
            console.error(errorMessage);
        }
    }, [navigate]);

    // Same device source as Create/Update Scenes, used to resolve an
    // action's itemName back to the human-readable device label.
    const fetchDevices = useCallback(async () => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
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
    }, [navigate]);

    useEffect(() => {
        fetchScene();
        fetchDevices();
    }, [fetchDevices, fetchScene]);

    // PUT /rule/enable (header X-RuleUid) -> EnableRuleHttpRequest { status }
    const handleToggleScene = async (ruleUid, newEnabled) => {
        const previousScenes = scenes;
        setScenes(prevScenes =>
            prevScenes.map(scene =>
                scene.ruleUid === ruleUid ? { ...scene, status: newEnabled ? 'ENABLED' : 'DISABLED' } : scene
            )
        );
        try {
            const { status } = await axiosInstance.put('/rule/enable',
                { status: newEnabled ? 'ENABLED' : 'DISABLED' },
                { headers: { 'X-RuleUid': ruleUid } }
            );
            if (status !== 200) {
                throw new Error('Failed to update rule');
            }
        } catch (err) {
            setScenes(previousScenes);
            const errorMessage = err.response?.data?.message || 'Failed to update rule';
            setModal({
                show: true,
                title: 'Failed',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
        }
    };

    // DELETE /rule/delete (header X-RuleUid)
    const handleDeleteScene = async () => {
        if (!deletingScene) return;
        const ruleUid = deletingScene.ruleUid;
        setDeletingScene(null);
        try {
            const { status } = await axiosInstance.delete('/rule/delete', { headers: { 'X-RuleUid': ruleUid } });
            if (status === 200) {
                setScenes(prevScenes => prevScenes.filter(scene => scene.ruleUid !== ruleUid));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete schedule';
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

                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '0' }}>Your Scenes</div>
                </div>

                {/* Content - flows naturally with the page; no fixed height/scroll
                    here so the 3rd/4th+ cards just appear below instead of being
                    clipped, and the shared page scroll (InsideLayout) takes over
                    only once there's actually more content than fits. */}
                {scenes.length === 0 ? (
                    <div className='alert d-flex justify-content-center align-items-center' style={{ minHeight: '120px' }}>
                        No schedule yet to create
                    </div>
                ) : (
                    <div className='row g-3'>
                        {scenes.map((scenesObj) => {
                            const { time, days, dates, itemName, command } = parseScene(scenesObj);
                            const deviceLabel = deviceList.find((d) => d.itemName === itemName)?.label || itemName || 'Unknown device';

                            return (
                                <div className='col-12 col-md-6' key={scenesObj.ruleUid}>
                                    <div className='d-flex flex-column border rounded p-3 h-100' style={{ backgroundColor: '#ffffff' }}>

                                        <div className='d-flex justify-content-between align-items-start mb-2'>
                                            <div style={{ fontSize: '14px' }}>
                                                <span className='fw-bold'>{scenesObj.ruleName}</span>
                                                {time && <span className='text-muted'> - {time}</span>}
                                            </div>
                                            <div className='form-check form-switch flex-shrink-0'>
                                                <input
                                                    className='form-check-input'
                                                    type='checkbox'
                                                    role='switch'
                                                    checked={scenesObj.status === 'ENABLED'}
                                                    onChange={(e) => handleToggleScene(scenesObj.ruleUid, e.target.checked)}
                                                />
                                            </div>
                                        </div>

                                        {dates.length > 0 && (
                                            <div className='d-flex align-items-center flex-wrap gap-1 mb-2' style={{ fontSize: '12px' }}>
                                                <FiCalendar className='text-muted' />
                                                {dates.map((d) => (
                                                    <span key={d} className='badge rounded-pill bg-eaeaea text-dark fw-normal'>
                                                        {formatDateForDisplay(d)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 mb-2'>

                                            <div className='d-flex flex-column justify-content-center align-items-center bg-eaeaea rounded p-2'>
                                                <FaRegLightbulb className='text-muted mb-1' style={{ width: '24px', height: '24px' }} />
                                                <div className='d-flex justify-content-center align-items-center' style={{ fontSize: '12px' }}>
                                                    <FiPower className='mx-1' />
                                                    <div className='mx-1'>{command === 'ON' ? 'On' : 'Off'}</div>
                                                </div>
                                                <div className='text-muted text-truncate' style={{ fontSize: '10px', maxWidth: '80px' }}>
                                                    {deviceLabel}
                                                </div>
                                            </div>

                                            <div className='d-flex gap-1 flex-wrap'>
                                                {DAYS.map(({ short, full }) => {
                                                    const isActive = days?.includes(full);
                                                    return (
                                                        <span key={full}
                                                            className={`d-flex justify-content-center align-items-center rounded-circle ${isActive ? 'bg-dark text-white' : 'bg-eaeaea text-muted'}`}
                                                            style={{ height: '30px', width: '30px', fontSize: '10px' }}>
                                                            {short}
                                                        </span>
                                                    );
                                                })}
                                            </div>

                                        </div>

                                        <div className='d-flex justify-content-end gap-2 mt-auto'>
                                            <FiEdit2
                                                style={{ fontSize: '14px', cursor: 'pointer' }}
                                                onClick={() => navigate(`/schedule/update_schedule/${scenesObj.ruleUid}`, { state: { scene: scenesObj } })}
                                            />
                                            <FiTrash2
                                                style={{ fontSize: '14px', cursor: 'pointer' }}
                                                onClick={() => setDeletingScene(scenesObj)}
                                            />
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>

            {deletingScene && (
                <ModalLayout title={'Delete Schedule'}
                    msg={<span>Do you really want to delete {deletingScene.ruleName}?</span>}
                    modal={() => setDeletingScene(null)}>
                    <div className='d-flex justify-content-around'>
                        <button type='button' className='btn btn-outline-eaeaea px-5' onClick={() => setDeletingScene(null)}>Cancel</button>
                        <button type='button' className='btn btn-dark px-5' onClick={handleDeleteScene}>Delete</button>
                    </div>
                </ModalLayout>
            )}

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