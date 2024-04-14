import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import IconDownload from '../../components/Icon/IconDownload';
import IconEye from '../../components/Icon/IconEye';
import IconSend from '../../components/Icon/IconSend';
import IconSave from '../../components/Icon/IconSave';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { UserAuth } from '../../context/AuthContext';

const AddStaff = () => {
    const { classes } = UserAuth();
    const dispatch = useDispatch();
    const [date1, setDate1] = useState<any>('2000-07-05');
    const [options, setOptions] = useState([{ value: 'class1', label: 'Class 1' }]);

    useEffect(() => {;
        const newClassObj = classes.map((st: any) => {
            return { value: st.ClassId, label: st.Name };
        });
        setOptions(newClassObj);
    }, [classes]);

    useEffect(() => {
        dispatch(setPageTitle('Add Staff'));
    });
    const currencyList = ['USD - US Dollar', 'GBP - British Pound', 'IDR - Indonesian Rupiah', 'INR - Indian Rupee', 'BRL - Brazilian Real', 'EUR - Germany (Euro)', 'TRY - Turkish Lira'];

    const [items, setItems] = useState<any>([
        {
            id: 1,
            title: '',
            description: '',
            rate: 0,
            quantity: 0,
            amount: 0,
        },
    ]);

    const addItem = () => {
        let maxId = 0;
        maxId = items?.length ? items.reduce((max: number, character: any) => (character.id > max ? character.id : max), items[0].id) : 0;

        setItems([...items, { id: maxId + 1, title: '', description: '', rate: 0, quantity: 0, amount: 0 }]);
    };

    const removeItem = (item: any = null) => {
        setItems(items.filter((d: any) => d.id !== item.id));
    };

    const changeQuantityPrice = (type: string, value: string, id: number) => {
        const list = items;
        const item = list.find((d: any) => d.id === id);
        if (type === 'quantity') {
            item.quantity = Number(value);
        }
        if (type === 'price') {
            item.amount = Number(value);
        }
        setItems([...list]);
    };

    return (
        <div className="flex xl:flex-row flex-col gap-2.5">
            <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                <div className="mt-8 px-4">
                    <div className="flex justify-between lg:flex-row flex-col">
                        <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                            <div className="text-lg">Add a Staff Member</div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-first-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    First Name
                                </label>
                                <input id="reciever-first-name" type="text" name="reciever-first-name" className="form-input flex-1" placeholder="Enter First Name" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-last-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Last Name
                                </label>
                                <input id="reciever-last-name" type="text" name="reciever-last-name" className="form-input flex-1" placeholder="Enter Last Name" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-email" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Email
                                </label>
                                <input id="reciever-email" type="email" name="reciever-email" className="form-input flex-1" placeholder="Enter Email" />
                            </div>

                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Phone Number
                                </label>
                                <input id="reciever-number" type="text" name="reciever-number" className="form-input flex-1" placeholder="Enter Phone number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="city" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Birthday
                                </label>
                                <Flatpickr value={date1} options={{ dateFormat: 'm-d-Y', position: 'auto right' }} className="form-input flex-1" onChange={(date) => setDate1(date)} />
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <div className="text-lg">Address Information</div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-address" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Address
                                </label>
                                <input id="reciever-address" type="text" name="reciever-address" className="form-input flex-1" placeholder="Enter Address" />
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="city" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    City
                                </label>
                                <input id="city" type="text" name="city" className="form-input flex-1" placeholder="City" />
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="state" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    State
                                </label>
                                <input id="state" type="text" name="state" className="form-input flex-1" placeholder="State" />
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="zip" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Zip Code
                                </label>
                                <input id="zip" type="text" name="zip" className="form-input flex-1" placeholder="Enter Zip Code" />
                            </div>
                            <div className="flex items-center mt-4 relative">
                            <label htmlFor="zip" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Select Classes
                                </label>
                                <Select placeholder="Select staff" className="flex-1" options={options} isMulti />
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <label htmlFor="notes">Notes</label>
                        <textarea id="notes" name="notes" className="form-textarea min-h-[130px]" placeholder="Notes...."></textarea>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="flex justify-between sm:flex-row flex-col mt-6 px-4">
                        <div className="sm:mb-0 mb-6 ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => addItem()}>
                                Add Staff
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStaff;
