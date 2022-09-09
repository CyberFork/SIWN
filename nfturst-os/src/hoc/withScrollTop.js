
export function withScrollTop(Cmp) {

    return function Comm(props) {
        window.scrollTo(0, 0);
        return <Cmp {...props}/>
    }
}