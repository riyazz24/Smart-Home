import axiosInstance from './AxiosInstance';

// Mirrors the Rule endpoints used in the CRA reference app
// (YourScenesContent.js / CreateScenesContent.js / UpdateScenesContent.js).
// X-AgentId / X-HomeId are attached automatically by AxiosInstance's request
// interceptor, so callers never pass them here.

// GET /rule/list -> { ruleList: [{ ruleUid, ruleName, status, triggerJson, actionsJson }] }
export const listRules = () => axiosInstance.get('/rule/list');

// POST /rule/create -> { message }
// payload: { ruleName, triggerPayload: { type:'TIME', cronExpression, itemName:null, state:null },
//            actionPayloadList: [{ itemName, command }] }
export const createRule = (payload) => axiosInstance.post('/rule/create', payload);

// PUT /rule/enable (header X-RuleUid) -> { message }
export const enableRule = (ruleUid, status) =>
    axiosInstance.put(
        '/rule/enable',
        { status },
        { headers: { 'X-RuleUid': ruleUid } }
    );

// DELETE /rule/delete (header X-RuleUid) -> { message }
export const deleteRule = (ruleUid) =>
    axiosInstance.delete('/rule/delete', { headers: { 'X-RuleUid': ruleUid } });

// NOTE: the backend has no "update a rule's fields" endpoint - only create,
// enable/disable (status toggle), delete, and list. See CronUtil-based
// parsing below for reading a rule's real saved fields back for display.
