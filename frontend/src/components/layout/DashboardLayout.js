import Layout from './Layout';

export default function DashboardLayout({ InsideContent }) {
    return (
        <>
            <Layout activePage={'Agent'}>

                {/* Inside Content */}
                <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    <InsideContent />
                </div>

            </Layout>
        </>
    );
};