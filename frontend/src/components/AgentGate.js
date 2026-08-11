import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../util/AxiosInstance';
import PairAgentModal from './layout/PairAgentModal';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/slice';
/**
 * Wraps every authenticated page (via Layout.js) and makes pairing an Agent
 * mandatory. Until GET /agent/exist returns true, the underlying page is
 * rendered behind a non-dismissable PairAgentModal overlay, so the user
 * cannot reach any other page or app feature (the overlay intercepts all
 * clicks and there is no close button on the modal itself).
 */
export default function AgentGate({ children }) {
    const [checking, setChecking] = useState(true);
    const [hasAgent, setHasAgent] = useState(true);
    const dispatch = useDispatch();

    const refreshAgentId = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/agent/list');
            if (data.agentList && data.agentList.length > 0) {
                localStorage.setItem('agentId', data.agentList[0].agentId);
                
                if (data.agentList[0].agentName) {
                    dispatch(setUserData({ agentName: data.agentList[0].agentName}))
                }
            }
        } catch (err) {
            console.error('Error fetching agent list:', err.response?.data?.message || err.message);
        }
    }, []);

    const checkAgentExists = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/agent/exist');
            setHasAgent(!!data);
            if (data) {
                await refreshAgentId();
            }
        } catch (err) {
            // If we can't confirm an agent exists, fail safe and require pairing.
            setHasAgent(false);
        } finally {
            setChecking(false);
        }
    }, [refreshAgentId]);

    useEffect(() => {
        checkAgentExists();
    }, [checkAgentExists]);

    const handlePaired = () => {
        checkAgentExists();
    };

    if (checking) {
        return null;
    }

    return (
        <>
            {children}
            {!hasAgent && <PairAgentModal onDone={handlePaired} />}
        </>
    );
}
