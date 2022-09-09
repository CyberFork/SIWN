import withBar from '../hoc/withBar'
import { Collapse,  } from 'antd';
const { Panel } = Collapse;

function Faq(props) {
    return (
        <div className={'container faq'}>
            <div className="title">FAQ</div>
            <Collapse
                accordion={true}
                defaultActiveKey={['1']}
                expandIconPosition="end"
            >
                <Panel header="This is panel header 1" key="1">
                    <div className="content">some ...</div>
                </Panel>
                <Panel header="This is panel header 2" key="2">
                    <div className="content">some ...</div>
                </Panel>
                <Panel header="This is panel header 3" key="3">
                    <div className="content">some ...</div>
                </Panel>
            </Collapse>
        </div>
    )
}

export default withBar(Faq)