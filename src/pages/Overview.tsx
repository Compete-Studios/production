import { useEffect } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';

import { setPageTitle } from '../store/themeConfigSlice';

import Pipelines from './Marketing/Pipelines';

import { UserAuth } from '../context/AuthContext';



const Overview = () => {
    const { suid } = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });
  

  

    return (
        <div>
            {/* <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Sales</span>
                </li>
            </ul> */}
            <Pipelines />
        </div>
    );
};

export default Overview;
