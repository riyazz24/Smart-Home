import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import ModalLayout from './ModalLayout';
import { setUserData } from '../../redux/slice';
import axiosInstance from '../../util/AxiosInstance';

const INITIAL_STATE = { agentName: '', pairingCode: '' };
const cardStyle = { width: '100%', maxWidth: '450px', minHeight: '450px' };

const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 1050, overflowY: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
};

export default function PairAgentModal({ onDone }) {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [modal, setModal] = useState({ show: false, title: '', message: '', isError: false, onConfirm: null });
    const dispatch = useDispatch();
    
    const formField = [
        { name: 'agentName', label: 'Agent Name' },
        { name: 'pairingCode', label: 'Pair Code' }
    ];

    const resetForm = () => setFormData(INITIAL_STATE);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosInstance.patch('/agent/pair', formData);
            dispatch(setUserData({ agentName: formData.agentName }));
            setModal({
                show: true,
                title: 'Success',
                message: 'Pair code is correct, your device is connected with the Agent successfully',
                isError: false,
                onConfirm: () => {
                    setModal({ ...modal, show: false });
                    resetForm();
                    onDone?.();
                }
            });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'The pair code is incorrect';
            setModal({
                show: true,
                title: 'Failed',
                message: <span className='text-danger'>{errorMessage}</span>,
                isError: true,
                onConfirm: () => setModal({ ...modal, show: false }),
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={overlayStyle}>
            <div className="card shadow rounded p-4 border-0 mx-auto" style={cardStyle}>
                <h3 className='mb-3'>Pair Agent</h3>
                <p className='text-muted mb-3'>Enter the Pair code shown on the wall mount device.</p>

                <form onSubmit={handleSubmit}>
                    {formField.map((formFieldObj, index) => (
                        <React.Fragment key={index}>
                            <div className='position-relative mb-3'>
                                <label className='text-6c757d' htmlFor={formFieldObj.name}>{formFieldObj.label}</label>
                                <input className='form-control' type='text' id={formFieldObj.name} name={formFieldObj.name} value={formData[formFieldObj.name]} onChange={handleChange} required />
                            </div>
                        </React.Fragment>
                    ))}

                    <div className='mb-3'>
                        <button type='submit' disabled={submitting} className='btn btn-dark w-100'>
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Alert Modal */}
            {modal.show && (
                <ModalLayout title={modal.title} msg={modal.message} modal={modal.onConfirm} hideClose={!modal.isError}>
                    <button onClick={modal.onConfirm} className={`btn btn-dark px-3`}>
                        {modal.isError ? 'Try Again' : 'OK'}
                    </button>
                </ModalLayout>
            )}
        </div>
    );
}