import {Route, Routes, useLocation, useNavigate, useParams, Navigate} from 'react-router-dom'
import {useEffect, useState} from "react";
import {connect} from 'react-redux'
import {withScrollTop} from "../hoc/withScrollTop";
import Loading from '../components/Loading'

function sync(module) {
    if(!module) return function Fake() {return null};
    return function Component (props) {
        const [Cmp, setCmp] = useState(null);
        useEffect(() => {
            async function getCmp() {
                let {default: cmp} = await module();
                if(!cmp) cmp = module;
                setCmp(() => cmp);
            }
            if(!Cmp) getCmp();
        });
        return Cmp ? <Cmp {...props}/> : <Loading visible={true}/>
    }
}

function parseQuery(search) {
    let query = search.match(/([^=&?]+)=?([^&]*)/g);
    let o = Object.create(null);
    if(query) {
        query.forEach(d => {
            let m = d.match(/([^=]+)=?(.*)/);
            o[m[1]] = m[2];
        })
    }
    return o;
}

function withStore(Component) {
    return connect(state => {
        return {store: state}
    })(Component);
}

function withRouter(Component, routeInfo) {
    return function Wrapper(props) {
        const location = useLocation();
        const route = {
            location,
            navigate: useNavigate(),
            params: useParams(),
            query: parseQuery(location.search),
            meta: routeInfo.meta,
            path: routeInfo.path,
        };
        return (
            <Component {...props} route={route}/>
        )
    }
}

function genRoutes(routes) {
    return routes.map(d => {
        if(d.redirect) return (<Route path={d.path} key={d.path} element={<Navigate to={d.redirect} replace={true}/>}/>);
        const El = withScrollTop(withRouter(withStore(sync(d.element)), {meta: d.meta || {}, path: d.path}));
        if(d.children) {
            return (
                <Route key={d.path} path={d.path} element={<El/>}>
                    {genRoutes(d.children)}
                </Route>
            )
        }
        return (<Route key={d.path} path={d.path} element={<El/>}/>)
    });
}

function RouterView(routes) {
    return (
        <Routes>
            {genRoutes(routes)}
        </Routes>
    )
}

function Router(routes) {
    Router.View = function() {
        return RouterView(routes);
    };
}

export default Router;