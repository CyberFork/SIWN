import Menu from '../components/Menu'

export default function PageLeft(props) {
    return (
        <div className={'container nav'}>
            <Menu {...props}/>
        </div>
    )
}