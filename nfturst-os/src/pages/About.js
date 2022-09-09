import withBar from '../hoc/withBar'

function About(props) {
    return (
        <div className={'container about-page'}>
            <div className="title">About NFTrust</div>
        </div>
    )
}

export default withBar(About)