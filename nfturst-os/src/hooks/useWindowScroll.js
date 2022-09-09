import {useState, useEffect, useCallback} from 'react'

export function useWindowScroll() {
    const [isBottom, setIsBottom] = useState(false);
    const targetFn = useCallback(() => {
        let tp = document.documentElement.scrollTop || document.body.scrollTop;
        setIsBottom(tp + window.innerHeight >= (document.documentElement.scrollHeight || document.body.scrollHeight) - 10);
    }, []);
    useEffect(() => {
        window.addEventListener('scroll', targetFn);
        return () => window.removeEventListener('scroll', targetFn);
    }, []);
    return isBottom;
}