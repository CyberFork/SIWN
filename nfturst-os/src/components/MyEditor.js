import { Editable ,withReact, Slate, useSlate, ReactEditor} from 'slate-react'
import { createEditor ,Transforms ,Editor, Element as SlateElement , Range, Point, Text} from 'slate'
import {withHistory} from 'slate-history'
import {useMemo, useCallback, useState} from 'react'
import {UnorderedListOutlined, OrderedListOutlined, DisconnectOutlined, LinkOutlined, SmileOutlined} from '@ant-design/icons'
import {Button} from 'antd'
import Emoji from './Emoji'
import {useEffect} from 'react'

function nodesToHTML(node) {
    if (Text.isText(node)) {
        return node.text
    }
    const children = node.children.map(n => nodesToHTML(n)).join('')
    switch (node.type) {
        case 'h1':
            return `<h1>${children}</h1>`
        case 'h2':
            return `<h2>${children}</h2>`
        case 'ul':
            return `<ul>${children}</ul>`
        case 'ol':
            return `<ol>${children}</ol>`
        case 'li':
            return `<li>${children}</li>`
        case 'p':
            return `<p>${children}</p>`
        case 'a':
            return `<a href="${node.url}" target="_blank" rel="noopener">${children}</a>`
        default:
            return children
    }
}

export function getHTML(nodes) {
    if(nodes)
        return nodes.map(d => nodesToHTML(d)).join('');
    else 
        return null
}

function htmlToNode(el) {
    if (el.nodeType === 3) {
        return {text: el.textContent}
    }

    const children = Array.from(el.childNodes)
        .map(node => htmlToNode(node))
        .flat();

    if (children.length === 0) {
        children.push({text: ''})
    }

    switch (el.nodeName) {
        case 'H1':
            return {type: 'h1', children}
        case 'H2':
            return {type: 'h2', children}
        case 'P':
            return {type: 'p', children}
        case 'A':
            return {type: 'a', children, url: el.href};
        case 'UL':
            return {type: 'ul', children}
        case 'OL':
            return {type: 'ol', children}
        case 'LI':
            return {type: 'li', children}
        default:
            return children
    }
}

export function parseHTML(html) {
    let d = new DOMParser().parseFromString(html, 'text/html');
    return Array.from(d.body.children).map(el => htmlToNode(el));
}

const CustomEditor = {
    h1: editor => toggleBlock(editor, 'h1'),
    h2: editor => toggleBlock(editor, 'h2'),
    ul: editor => toggleBlock(editor, 'ul'),
    ol: editor => toggleBlock(editor, 'ol'),
    link: (editor, url) => {
        if (!url) return
        insertLink(editor, url)
    },
    unlink: (e, editor) => {
        e.preventDefault()
        if (isLinkActive(editor)) {
            unwrapLink(editor)
        }
    },
    insert: (editor, v) => {
        editor.insertText(v)
    }
};
const LIST_TYPES = ['ol', 'ul'];

const withInlines = editor => {
    const { isInline } = editor

    editor.isInline = element =>
        ['a'].includes(element.type) || isInline(element)

    return editor
}
const insertLink = (editor, url) => {
    if (editor.selection) {
        wrapLink(editor, url)
    }
}
const unwrapLink = editor => {
    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'a',
    })
}
const wrapLink = (editor, url) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor)
    }
    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link = {
        type: 'a',
        url,
        children: isCollapsed ? [{ text: url }] : [],
    }
    if (isCollapsed) {
        Transforms.insertNodes(editor, link)
    } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
    }
}
const isLinkActive = editor => {
    const [link] = Editor.nodes(editor, {
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'a',
    })
    return !!link
}
const withChecklists = editor => {
    const { deleteBackward } = editor

    editor.deleteBackward = (...args) => {
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
            const [match] = Editor.nodes(editor, {
                match: n =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    n.type === 'li',
            })

            if (match) {
                const [, path] = match
                const start = Editor.start(editor, path)

                if (Point.equals(selection.anchor, start)) {
                    const newProperties = {
                        type: 'p',
                    }
                    Transforms.setNodes(editor, newProperties, {
                        match: n =>
                            !Editor.isEditor(n) &&
                            SlateElement.isElement(n) &&
                            n.type === 'li'
                    })
                    Transforms.liftNodes(editor);
                    return
                }
            }
        }

        deleteBackward(...args)
    }

    return editor
}
const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(
        editor,
        format
    );
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n => {
            return !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                LIST_TYPES.includes(n.type)
        },
        split: true,
    });
    let newProperties = {
        type: isActive ? 'p' : isList ? 'li' : format,
    };
    Transforms.setNodes(editor, newProperties)
    if (!isActive && isList) {
        const block = { type: format}
        Transforms.wrapNodes(editor, block)
    }
}

function isBlockActive(editor, format, blockType='type') {
    const { selection } = editor;
    if (!selection) return false;
    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n[blockType] === format,
        })
    );
    return !!match
}

const Leaf = props => {
    return (
        <span {...props.attributes}>{props.children}</span>
    )
};

function InputLink(props) {
    return (
        props.visible ? <div className="link-input">
            <input type="text" value={props.value} onChange={e => props.onChange(e.target.value)} autoFocus={true} onBlur={props.close}/>
            <Button type="primary" shape="round" onMouseDown={props.onSubmit}>Submit</Button>
        </div> : null
    )
}

export function removeEmptyNode(nodes, parent = null) {
    for(let i = nodes.length - 1; i >= 0; i--) {
        let node = nodes[i];
        if(node.text === '') {
            parent.children.splice(i, 1);
        } else if(node.children) {
            removeEmptyNode(node.children, node);
            if(node.children.length === 0) {
                delete node.children;
                if(parent) parent.children.splice(i, 1);
                else nodes.splice(i, 1);
            }
        }
    }
    return nodes;
}

function MyEditor(props) {
    const editor = useMemo(() => withReact(withInlines(withChecklists(withHistory(createEditor())))), []);
    const [visible, setVisible] = useState(false);
    const [visibleInputLink, setVisibleInputLink] = useState(false);
    const [url, setUrl] = useState('');
    const valueChange = props.onChange || function() {};
    const [value, setValue] = useState(props.value || [{type: 'p', children: [{ text: '' }]}]);

    editor.children = value;

    useEffect(() => {
        setValue(props.value || [{type: 'p', children: [{ text: '' }]}]);
        return () => editor.selection = null;
    }, [props.value]);

    function toggleClose(e) {
        e.preventDefault();
        setVisible(!visible);
    }

    function onChange(value) {
        const isAstChange = editor.operations.some(op => 'set_selection' !== op.type);
        if (isAstChange) {
            valueChange(value);
            setValue(value);
        }
    }

    function Toolbar() {
        const editor = useSlate();

        function handle(e, type) {
            e.preventDefault();
            CustomEditor[type](editor);
        }

        return (
            <div className="menu">
                <SmileOutlined onMouseDown={toggleClose}/>
                <span className={isBlockActive(editor, 'h1')?'active':null} onMouseDown={e => handle(e, 'h1')}>H1</span>
                <span className={isBlockActive(editor, 'h2')?'active':null} onMouseDown={e => handle(e, 'h2')}>H2</span>
                <UnorderedListOutlined className={isBlockActive(editor, 'ul')?'active':null} onMouseDown={e => handle(e, 'ul')}/>
                <OrderedListOutlined className={isBlockActive(editor, 'ol')?'active':null} onMouseDown={e => handle(e, 'ol')}/>
                <LinkOutlined className={isLinkActive(editor)?'active':null} onMouseDown={showLinkInput}/>
                <DisconnectOutlined className={isLinkActive(editor)?'active':null} onMouseDown={e => CustomEditor.unlink(e,editor)}/>
            </div>
        )
    }

    const showLinkInput = e => {
        const [link] = Editor.nodes(editor, {
            match: n =>
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'a',
        })
        if(link) {
            setUrl(link[0].url);
            Transforms.select(editor, link[1]);
        } else setUrl('');
        e.preventDefault();
        setVisibleInputLink(!visibleInputLink);
    };

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'h1':
                return <h1 {...props.attributes}>{props.children}</h1>
            case 'h2':
                return <h2 {...props.attributes}>{props.children}</h2>
            case 'ul':
                return <ul {...props.attributes}>{props.children}</ul>
            case 'ol':
                return <ol {...props.attributes}>{props.children}</ol>
            case 'li':
                return <li {...props.attributes}>{props.children}</li>
            case 'a':
                return <a href={props.element.url} {...props.attributes}>{props.children}</a>
            default:
                return <p {...props.attributes}>{props.children}</p>
        }
    }, [])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    return (
        <div className="my-editor">
            <Slate editor={editor} value={value}
                   onChange={onChange}>
                <Toolbar/>
                <Editable
                    className="editor"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={event => {
                    }}
                />
            </Slate>
            <Emoji onChange={v => {CustomEditor.insert(editor, v);setVisible(false);ReactEditor.focus(editor)}} visible={visible} onClose={setVisible} close={()=>setVisible(false)}/>
            <InputLink value={url} close={() => setVisibleInputLink(false)} visible={visibleInputLink} onChange={setUrl} onSubmit={e => {
                e.preventDefault();
                CustomEditor.link(editor, url);
                setVisibleInputLink(false);
                ReactEditor.focus(editor);
            }}/>
        </div>
    )
}

export default MyEditor;