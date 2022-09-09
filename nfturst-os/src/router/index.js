const routes = [
    {
        path: '/',
        element: () => import('../pages/Layout'),
        children: [
            {
                path: '',
                element: () => import('../pages/Home'),
                meta: {rightBar: true}
            }, {
                path: 'discover',
                element: () => import('../pages/Discover')
            }, {
                path: 'about',
                element: () => import('../pages/About')
            }, {
                path: 'faq',
                element: () => import('../pages/Faq')
            }, 
            // {
            //     path: 'notifications',
            //     element: () => import('../pages/Notifications'),
            //     meta: {rightBar: true}
            // }, {
            //     path: 'bookmarks',
            //     element: () => import('../pages/Bookmarks'),
            //     meta: {rightBar: true}
            // },
             {
                path: 'u/:name',
                element: () => import('../pages/Profile'),
                meta: {rightBar: true}
            }, {
                path: 'communities',
                element: () => import('../pages/Communities'),
            }, {
                path: 'c/:hash',
                element: () => import('../pages/PostsDetail'),
                meta: {rightBar: true}
            }, {
                path: 'settings',
                element: () => import('../pages/Settings')
            }
        ]
    }, {
        path: '*',
        redirect: '/'
    }
];

export default routes;