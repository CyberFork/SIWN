import * as React from 'react';

import "./hoverButton.css";

export interface IAppProps {
}

export default function HoverButton(props: IAppProps) {
    return (
        <div>
            <a href="#" className='clrBlue'><span>Button</span><i></i></a>
            <a href="#" className='clrRed'><span>Button</span><i></i></a>
            <a href="#" className='clrIndigo'><span>Button</span><i></i></a>
        </div >
    );
}
