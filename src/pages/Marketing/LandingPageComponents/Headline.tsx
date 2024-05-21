import React, { useEffect, useState } from 'react';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconEdit from '../../../components/Icon/IconEdit';
import { UserAuth } from '../../../context/AuthContext';

interface HeadlineProps {
    numberToRemove: any;
    idNumber: number;
    removeComponent: (index: number) => void;
}

export default function Headline({ numberToRemove, removeComponent, idNumber }: HeadlineProps) {
    const { layout, setLayout }: any = UserAuth();
    const [headline, setHeadline] = useState('Main Headline');
    const [displayMenu, setDisplayMenu] = useState(false);

    useEffect(() => {
        const data = {
            data: headline,
            id: idNumber,
        };
        setLayout({ ...layout, [idNumber]: data });
    }, [headline, idNumber]);

    return (
        <div onMouseEnter={() => setDisplayMenu(true)} onMouseLeave={() => setDisplayMenu(false)}>
            <div>
                {displayMenu ? (
                    <div>
                        <input
                            type="text"
                            value={headline}
                            defaultValue={'Main Headline'}
                            className="form-input w-full text-center text-3xl font-bold cursor-grab"
                            onChange={(e) => setHeadline(e.target.value)}
                            autoFocus
                        />
                        <div className="flex pb-3">
                            <div className="ml-auto flex items-center gap-3">
                                <button className="text-danger flex items-center gap-1 hover:text-red-800" onClick={() => removeComponent(numberToRemove)}>
                                    <IconTrashLines className="h-5 w-5" aria-hidden="true" />
                                    Delete Block
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`${displayMenu && 'border border-danger'} `}>
                        <h1 className="text-3xl font-bold text-center">{headline}</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
