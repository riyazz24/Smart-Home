import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '@fontsource/roboto/500.css';

const customStyle = { color: '#00000080', fontFamily: 'roboto', fontWeight: '500', fontSize: '24px', lineHeight: '100%', letterSpacing: '0' };

export default function Indicator() {
    const labelMap = {
        'faq_feedback': 'FAQ & Feedback'
    };

    const location = useLocation();
    const agentName = useSelector((state) => state.user.agentName);
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

    const formatLabel = (segment) => {
        const decoded = decodeURIComponent(segment);
        return labelMap[decoded] || toTitleCase(decoded.replace(/_/g, ' '));
    };

    // On the /agent route, show the paired Agent's name as a second breadcrumb
    // segment (e.g. "Agent › My Agent"), the same way Room pages show
    // "Room › Hall". Falls back to just "Agent" until a name is available.
    const isAgentRoute = pathSegments[0]?.toLowerCase() === 'dashboard';
    const secondSegmentLabel = isAgentRoute ? agentName : (pathSegments[1] ? formatLabel(pathSegments[1]) : null);

    return (
        <>
            <div style={{ boxShadow: '0px 0px 24.7px 0px #00000026', borderRadius: '8px' }} className="bg-ffffff px-5 py-4 mb-3">
                <div style={{ ...customStyle }}>
                    <>
                        <span style={{ color: formatLabel(pathSegments[0]) === 'Home' ? '#000000' : '#00000080', fontWeight: '500' }}>
                            {formatLabel(pathSegments[0])}
                        </span>
                        {/* {secondSegmentLabel && (
                            <>
                                &nbsp;›&nbsp;
                                <span style={{ color: '#000000' }}>{secondSegmentLabel}</span>
                            </>
                        )} */}
                    </>
                </div>
            </div>
        </>
    );
};