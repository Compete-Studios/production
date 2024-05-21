import IconPlus from '../../../components/Icon/IconPlus';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import AddBlockModal from '../LandingPageComponents/AddBlockModal';
import Headline from '../LandingPageComponents/Headline';
import SubHeadline from '../LandingPageComponents/SubHeadline';
import { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { UserAuth } from '../../../context/AuthContext';
import SimpleForm from '../LandingPageComponents/SimpleForm';
import Image from '../LandingPageComponents/Image';

export default function BlankTemplate() {
    const { layout, setLayout }: any = UserAuth();
    const [components, setComponents] = useState<any[]>([]);
    const [indexToEdit, setIndexToEdit] = useState<number | null>(null);
    const [count, setCount] = useState(0);

    const addComponent = (component: any) => {
        setComponents([...components, { id: count, type: component }]);
        setCount(count + 1);
    };

    useEffect(() => {
        setLayout({ ...layout, components });
    }, [components]);

    const removeComponent = (index: number) => {
        setComponents(components.filter((_, i) => i !== index));
    };

    const componentOptions = (index: number, id: number, type: number) => {
        switch (type) {
            case 0:
                return <Headline numberToRemove={index} idNumber={id} removeComponent={removeComponent} />;
            case 1:
                return <SubHeadline numberToRemove={index} idNumber={id} removeComponent={removeComponent} />;
            case 2:
                return <SimpleForm />;
            case 3:
                return <Image />;
            default:
                return null;
        }
    };

    const handleSetIndexToEdit = (index: number | null) => {
        setIndexToEdit(index);
    };

    return (
        <div>           
            <ReactSortable list={components} setList={setComponents} className="grid grid-cols-2 gap-4">
                {components.map((component, index) => (
                    <div key={component.id} className={`cursor-grab ${component.width ? "col-span-1" : "col-span-full"}`} onMouseOver={() => handleSetIndexToEdit(index)} onMouseLeave={() => handleSetIndexToEdit(null)}>
                        {componentOptions(index, component.id, component.type)}
                    </div>
                ))}
            </ReactSortable>
            <div className="relative py-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                    <AddBlockModal addComponent={addComponent} />
                </div>
            </div>
        </div>
    );
}
