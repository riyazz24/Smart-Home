import axiosInstance from "./AxiosInstance";

export const ensureAgentId = async () => {
    try {
        const { data: hasAgent } = await axiosInstance.get('/agent/exist');
        if (!hasAgent) return false;

        const { data } = await axiosInstance.get('/agent/list');
        if (data.agentList && data.agentList.length > 0) {
            localStorage.setItem('agentId', data.agentList[0].agentId);
            return true;
        }
        return false;
    } catch (err) {
        console.error('Error resolving agentId:', err.response?.data?.message || err.message);
        return false;
    }
};
