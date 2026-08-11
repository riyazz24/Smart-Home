import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegLightbulb } from 'react-icons/fa';
import { FiPower, FiEdit2, FiTrash2 } from 'react-icons/fi';
import axiosInstance from '../../util/AxiosInstance';
import ModalLayout from '../layout/ModalLayout';

const ALL_DAYS = [
    { short: 'Sun', full: 'SUNDAY' },
    { short: 'Mon', full: 'MONDAY' },
    { short: 'Tue', full: 'TUESDAY' },
    { short: 'Wed', full: 'WEDNESDAY' },
    { short: 'Thu', full: 'THURSDAY' },
    { short: 'Fri', full: 'FRIDAY' },
    { short: 'Sat', full: 'SATURDAY' },
];

export default function YourScenes() {
    const [scenes, setScenes] = useState([]);
    const [devices, setDevices] = useState([]);
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

    const fetchDevice = useCallback(async () => {
        if (!isLoggedIn()) {
            navigate('/');
            return;
        }
        setDevices([]);
    }, [navigate]);

    useEffect(() => {
        fetchScene();
        fetchDevice();
    }, [fetchDevice, fetchScene]);

    // PUT /rule/enable (header X-RuleUid) -> EnableRuleHttpRequest { status }
    // TODO(backend): the exact accepted `status` string values aren't
    // documented anywhere we could find (guessing 'ENABLED'/'DISABLED', which
    // mirrors openHAB's own rule status enum) - confirm with the backend team.
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

                {/* Content */}
                <div style={{ width: '100%', overflowX: 'hidden', height: '300px', overflowY: 'auto' }}>
                    {scenes.length === 0 ? (
                        <div className='alert d-flex justify-content-center align-items-center h-100'>No schedule yet to create</div>
                    ) : (
                        scenes.reduce((rows, scenesObj, index) => {
                            if (index % 2 === 0) rows.push([]);
                            rows[rows.length - 1].push(scenesObj);
                            return rows;
                        }, []).map((row, rowIndex) => (
                            <div className="row mx-0 mb-3" key={rowIndex}>
                                {row.map((scenesObj, colIndex) => (
                                    <div className="col-6" key={scenesObj.ruleUid ?? colIndex}>

                                        <div className="d-flex flex-column border rounded p-3"
                                            style={{ backgroundColor: '#ffffff', width: '100%', height: '168px' }}>

                                            <div className="d-flex justify-content-between align-items-center mb-2">

                                                <div style={{ fontSize: '14px' }}>
                                                    <span className='fw-bold'>{scenesObj.ruleName}</span> - {scenesObj.roomName}
                                                </div>

                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        checked={scenesObj.status === 'ENABLED'}
                                                        onChange={(e) => handleToggleScene(scenesObj.ruleUid, e.target.checked)}
                                                    />
                                                </div>

                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="text-muted" style={{ fontSize: '13px' }}>
                                                    {scenesObj.fromTime} to {scenesObj.toTime}
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
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

                                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">

                                                <div className='d-flex flex-column justify-content-center align-items-center bg-eaeaea rounded p-2'>
                                                    <FaRegLightbulb className='text-muted mb-1' style={{ width: '24px', height: '24px' }} />
                                                    <div className='d-flex justify-content-center align-items-center' style={{ fontSize: '12px' }}>
                                                        <FiPower className='mx-1' />
                                                        <div className='mx-1'>
                                                            {(() => {
                                                                const device = devices.find(dev =>
                                                                    dev.deviceId === scenesObj.deviceId
                                                                );
                                                                return device?.status ? 'On' : 'Off';
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='d-flex gap-1'>
                                                    {ALL_DAYS.map(({ short, full }) => {
                                                        const isActive = scenesObj.days?.includes(full);
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

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* Delete Schedule Modal */}
            {deletingScene && (
                <ModalLayout title={'Delete Schedule'}
                    msg={<span>Do you really want to delete {deletingScene.ruleName} - {deletingScene.roomName} ?</span>}
                    modal={() => setDeletingScene(null)}>
                    <div className='d-flex justify-content-around'>
                        <button type='button' className='btn btn-outline-eaeaea px-5' onClick={() => setDeletingScene(null)}>Cancel</button>
                        <button type='button' className='btn btn-dark px-5' onClick={handleDeleteScene}>Delete</button>
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