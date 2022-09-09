import Mock from 'mockjs'
const {Random} = Mock;
Mock.setup({
    timeout: 1000,
})

Mock.mock(/\*\*\/login/, () => {
    return {
        code: 200,
        data: {
            header: Random.image(),
            address: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
            id: Random.string('number', 12, 12)
        }
    }
});

Mock.mock(/\/search/, (req) => {
    let body = JSON.parse(req.body);
    return Math.random() > 0.5 ? {
        code: 200,
        data: {
            communities: [
                {
                    image: Random.image(),
                    title: Random.title(),
                    subTitle: Random.sentence(1)
                }, {
                    image: Random.image(),
                    title: Random.title(),
                    subTitle: Random.sentence(1)
                }
            ],
            users: [
                {
                    image: Random.image(),
                    name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                    subName: Random.title(),
                }
            ],
            posts: [
                {
                    image: Random.image(),
                    title: Random.title(),
                    name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                    timestamp: Random.time('T')
                }
            ]
        }
    } : {code: 0, data: {communities: [], users: [], posts: []}}
})

Mock.mock(/\/getPostList/, req => {
    console.log(JSON.parse(req.body))
    return Math.random() > 0 ? {
        code: 200,
        data: [
            {
                type: 0,
                id: '1234567890',
                head: 'http://dummyimage.com/160x160',
                name: `test#1234567890@ethereum`,
                desc: `test bio`,
                timestamp: Random.time('T'),
                isLike: 1,
                isUnlike: 0,
                isBookmark: 1,
                title: Random.title(),
                like: Random.integer(0, 100),
                unlike: Random.integer(0, 100),
                comments: Random.integer(0, 100),
                content: `<h2>${Random.paragraph(1)}</h2>
                <p><a href="/xxxx">${Random.paragraph(1)}</a></p>
`
            }, {
                type: 1,
                id: Random.string('number', 10, 10),
                head: Random.image(),
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                desc: Random.sentence(1, 2),
                timestamp: Random.time('T'),
                title: Random.title(),
                like: Random.integer(0, 100),
                unlike: Random.integer(0, 100),
                comments: Random.integer(0, 100),
                images: [Random.image()],
                content: `<h2>${Random.paragraph(1)}</h2>
                <p><a href="/xxxx">${Random.paragraph(1)}</a></p>
`
            }, {
                type: 1,
                id: Random.string('number', 10, 10),
                head: Random.image(),
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                desc: Random.sentence(1, 2),
                timestamp: Random.time('T'),
                title: Random.title(),
                like: Random.integer(0, 100),
                unlike: Random.integer(0, 100),
                comments: Random.integer(0, 100),
                images: [Random.image(), Random.image()],
                content: `<h2>${Random.paragraph(1)}</h2>
                <p><a href="/xxxx">${Random.paragraph(1)}</a></p>
`
            }, {
                type: 1,
                id: Random.string('number', 10, 10),
                head: Random.image(),
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                desc: Random.sentence(1, 2),
                timestamp: Random.time('T'),
                title: Random.title(),
                like: Random.integer(0, 100),
                unlike: Random.integer(0, 100),
                comments: Random.integer(0, 100),
                images: [Random.image(), Random.image(), Random.image()],
                content: `<h2>${Random.paragraph(1)}</h2>
                <p><a href="/xxxx">${Random.paragraph(1)}</a></p>
`
            }, {
                type: 1,
                id: Random.string('number', 10, 10),
                head: Random.image(),
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                desc: Random.sentence(1, 2),
                timestamp: Random.time('T'),
                title: Random.title(),
                like: Random.integer(0, 100),
                unlike: Random.integer(0, 100),
                comments: Random.integer(0, 100),
                images: [Random.image(), Random.image(), Random.image(), Random.image()],
                content: `<h2>${Random.paragraph(1)}</h2>
                <p><a href="/xxxx">${Random.paragraph(1)}</a></p>
`
            }
        ]
    } : {code: 0, data: []}
})

Mock.mock(/\/getDiscoverList/, req => {
    const posts = new Array(20).fill({
        type: 0,
        head: Random.image(),
        name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
        desc: Random.sentence(1, 2),
        timestamp: Random.time('T'),
        title: Random.title(),
        like: Random.integer(0, 100),
        unlike: Random.integer(0, 100),
        comments: Random.integer(0, 100),
        content: `<h2>${Random.paragraph(1)}</h2>
                <p><a href="/xxxx">${Random.paragraph(1)}</a></p>
`
    })
    const users = new Array(20).fill({
        banner: Random.image(),
        head: Random.image(),
        name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
        desc: Random.paragraph(1)
    })
    const communities = new Array(20).fill({
        banner: Random.image(),
        head: Random.image(),
        name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
        desc: Random.paragraph(1),
        member: Random.integer(0, 100),
    })
    return {
        code: 200,
        data: {
            posts,
            users,
            communities
        }
    }
})

Mock.mock(/\/getCommunitiesList/, req => {
   let body = JSON.parse(req.body);
   console.log(body);
   let data = body.isAll ? new Array(19).fill({
       banner: Random.image(),
       head: Random.image(),
       name: Random.word(1, 2),
       member: Random.integer(0, 100),
       desc: Random.paragraph(1)
   }) : new Array(5).fill({
       banner: Random.image(),
       head: Random.image(),
       name: Random.word(1, 2),
       member: Random.integer(0, 100),
       desc: Random.paragraph(1)
   })
   return {
       code: 200,
       data,
   }
});

Mock.mock(/\/getBookmarks/, req => {
    console.log(JSON.parse(req.body))
    return Math.random() > 0.5 ? {
        code: 200,
        data: [
            {
                type: 0,
                head: Random.image(),
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                desc: Random.sentence(1, 2),
                timestamp: Random.time('T'),
                title: Random.title(),
                like: Random.integer(0, 100),
                unlike: Random.integer(0, 100),
                comments: Random.integer(0, 100),
                content: `<h2>${Random.paragraph(1)}</h2>
                <p><a href="/xxxx">${Random.paragraph(1)}</a></p>
`
            }
        ]
    } : {code: 0, data: []}
})

Mock.mock(/\/getPosts/, req => {
    console.log(JSON.parse(req.body))
    return Math.random() > 0.5 ? {
        code: 200,
        data: [
            {
                type: 0,
                head: Random.image(),
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                desc: Random.sentence(1, 2),
                timestamp: Random.time('T'),
                title: Random.title(),
                like: Random.integer(0, 100),
                unlike: Random.integer(0, 100),
                comments: Random.integer(0, 100),
                content: `<h2>${Random.paragraph(1)}</h2>
                <p><a href="/xxxx">${Random.paragraph(1)}</a></p>
`
            }
        ]
    } : {data: [], code: 200}
})

Mock.mock(/\/getNFTs/, req => {
    console.log(JSON.parse(req.body));
    return Math.random() > 0.5 ? {
        code: 200,
        data: [
            {
                title: Random.title(),
                desc: Random.sentence(1, 2),
                img: Random.image(),
                head: Random.image(),
            }
        ]
    } : {code: 0, data: []}
})

Mock.mock(/\/getRecommendNFts/, req => {
    return {
        code: 200,
        data: [
            {
                image: Random.image(),
                title: Random.title(),
                desc: Random.sentence(1, 2),
                head: Random.image(),
                owner: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
            }
        ]
    };
})

Mock.mock(/\/getProfileCommunities/, req => {
    console.log(JSON.parse(req.body))
    return Math.random() > 0.5 ? {
        code: 200,
        data: [
            {
                banner: Random.image(),
                head: Random.image(),
                name: Random.word(1, 2),
                member: Random.integer(0, 100),
                desc: Random.paragraph()
            }
        ]
    } : {data: [], code: 200}
})

// Mock.mock(/\/getCommentList/, req => {
//     return Math.random() > 0.5 ? {
//         code: 200,
//         data: [
//             {
//                 id: '1234567890',
//                 image: Random.image(),
//                 name: 'test#1234567890@etherum',
//                 timestamp: Random.time('T'),
//                 like: Random.integer(0, 100),
//                 unlike: Random.integer(0, 100),
//                 content: `${Random.sentence()} ${Random.url('http')}
//             `,
//                 children: [
//                     {
//                         image: Random.image(),
//                         name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
//                         timestamp: Random.time('T'),
//                         like: Random.integer(0, 100),
//                         unlike: Random.integer(0, 100),
//                         content: `${Random.sentence()} ${Random.url('http')}
//             `,
//                         children: [
//                             {
//                                 image: Random.image(),
//                                 name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
//                                 timestamp: Random.time('T'),
//                                 like: Random.integer(0, 100),
//                                 unlike: Random.integer(0, 100),
//                                 content: `${Random.sentence()} ${Random.url('http')}
//             `,
//                             }, {
//                                 id: '1234567890',
//                                 image: Random.image(),
//                                 name: 'test#1234567890@etherum',
//                                 timestamp: Random.time('T'),
//                                 like: Random.integer(0, 100),
//                                 unlike: Random.integer(0, 100),
//                                 content: `${Random.sentence()} ${Random.url('http')}
//             `,
//                             }
//                         ]
//                     }
//                 ]
//             }, {
//                 image: Random.image(),
//                 name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
//                 timestamp: Random.time('T'),
//                 like: Random.integer(0, 100),
//                 unlike: Random.integer(0, 100),
//                 content: `${Random.sentence()} ${Random.url('http')}
//             `,
//             }
//         ]
//     } : {
//         code: 200,
//         data: [{
//             image: Random.image(),
//             name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
//             timestamp: Random.time('T'),
//             like: Random.integer(0, 100),
//             unlike: Random.integer(0, 100),
//             content: `${Random.sentence()} ${Random.url('http')}
//             `,
//         },{
//             id: '1234567890',
//             image: Random.image(),
//             name: 'test#1234567890@etherum',
//             timestamp: Random.time('T'),
//             like: Random.integer(0, 100),
//             unlike: Random.integer(0, 100),
//             content: `${Random.sentence()} ${Random.url('http')}
//             `,
//         }]
//     }
// })

Mock.mock(/\/getPersonInfo/, () => {
    return {
        code: 200,
        data: {
            'name': Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
            'header': Random.image(),
            'bio': Random.paragraph(1),
            'following': Random.integer(0, 100),
            'followers': Random.integer(0, 100),
            'link': Random.url('http'),
            banner: Random.image()
        }
    }
})

Mock.mock(/\/getPostDetail/, () => {
    return {
        code: 200,
        data: {
            type: 1,
            head: Random.image(),
            name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
            desc: Random.sentence(1, 2),
            timestamp: Random.time('T'),
            title: Random.title(),
            like: Random.integer(0, 100),
            unlike: Random.integer(0, 100),
            comments: Random.integer(0, 100),
            images: [Random.image(), Random.image()],
            content: `<h2>${Random.paragraph()}</h2>
                <p><a href="/xxxx">${Random.paragraph()}</a></p>
`
        }
    }

});

Mock.mock(/\/getUnread/, () => {
    return {
        code: 200,
        data: 99
    }
})

Mock.mock(/\/clearUnread/, () => {
    return {
        code: 200,
        data: 0
    }
})

Mock.mock(/\/getNotifications/, req => {
    let body = JSON.parse(req.body);
    console.log(body);
    if(body.type == 0) return {
        code: 200,
        data: [
            {
                type: 0,
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                timestamp: Random.time('T'),
                contentType: 0,
            }, {
                type: 0,
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                timestamp: Random.time('T'),
                contentType: 1
            }
        ]
    }
    if(body.type == 1) return {
        code: 200,
        data: [
            {
                type: 1,
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                timestamp: Random.time('T'),
                contentType: 0,
            }, {
                type: 1,
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                timestamp: Random.time('T'),
                contentType: 1
            }
        ]
    }
    return {
        code: 200,
        data: [
            {
                type: 0,
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                timestamp: Random.time('T'),
                contentType: 0,
            }, {
                type: 0,
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                timestamp: Random.time('T'),
                contentType: 1
            }, {
                type: 1,
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                timestamp: Random.time('T'),
                contentType: 0,
            }, {
                type: 1,
                name: Random.string('lower', 6, 6) + '#' + Random.string('number', 6, 6) + '@' + Random.string('lower', 6, 8),
                timestamp: Random.time('T'),
                contentType: 1
            }
        ]
    }
})