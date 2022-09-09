import {useOutletContext} from 'react-router-dom'
import {useEffect} from 'react'

export default function withBar(Cmp) {
    return function Wrapper(props) {
        const [rightBar, setRightBar] = useOutletContext();
        useEffect(() => {
            if(!!rightBar !== !!props.route.meta.rightBar) {
                setRightBar(() => !!props.route.meta.rightBar)
            }
        });
        return (
            <Cmp {...props}/>
        )
    }
}