import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import IconSend from '../../components/Icon/IconSend';
import { UserAuth } from '../../context/AuthContext';
import { convertPhone, formatDate } from '../../functions/shared';
import { createNewInvoice, getStudentInfo, getStudioOptions, sendAText } from '../../functions/api';
import { sendIndividualEmail } from '../../functions/emails';
import { REACT_BASE_URL } from '../../constants';
import Swal from 'sweetalert2';

const invoiceInit = {
    studentId: '',
    studioId: '',
    amount: 0,
    creationDate: formatDate(new Date()),
    dueDate: formatDate(new Date()),
    reasonForInvoice: '',
    paymentId: '',
    notes: '',
};

const Invoice = () => {
    const { studioInfo, suid }: any = UserAuth();
    const [student, setStudent] = useState<any>(null);
    const [invoiceData, setInvoiceData] = useState<any>(invoiceInit);
    const [sendEmail, setSendEmail] = useState(true);
    const [sendText, setSendText] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [sending, setSending] = useState(false);

    const [studioOptions, setStudioOptions] = useState<any>([]);
 

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Create An Invoice'));
    });
    const { id }: any = useParams<{ id: string }>();
    const navigate = useNavigate();

    const unHashTheID = (hash: string) => {
        return parseInt(hash) / 548756 / parseInt(suid);
    };

    useEffect(() => {
        const studentID = unHashTheID(id);
        if (studentID) {
            // fetch student data
            getStudentInfo(studentID).then((res) => {
                if (parseInt(suid) === parseInt(res.Studio_ID)) {
                    setStudent(res);
                    setEmail(res.email);
                    setPhone(res.Phone);
                    setInvoiceData({ ...invoiceData, studentId: res.Student_id, studioId: suid });
                } else {
                    console.log('Student not found');
                    navigate('/404');
                }
            });
        } else {
            // redirect to 404
            navigate('/404');
        }
    }, [id, suid]);

    useEffect(() => {
        try {
            getStudioOptions(suid).then((res) => {
                setStudioOptions(res.recordset[0]);
            });
        } catch (error) {
            console.log(error);
        }
    }, [suid]);

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

    const handleGoBack = () => {
        navigate(-1);
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const createInvoiceURL = async (invoiceId: any) => {
        const linkForInvoice = `${REACT_BASE_URL}/pay-invoice/${invoiceId}`;
        const htmlFOrEmail = `"<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Document</title></head><body style=\"background-color: #f4f4f4; font-family: Arial, sans-serif;\"><div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\"><h2 style=\"color: #333;\">You have a new Invoice from ${studioInfo?.Studio_Name}</h2><p style=\"color: #666;\">Please go to ${linkForInvoice} to pay your invoice.</p><p style=\"color: #666;\">Best regards,<br> ${studioInfo?.Studio_Name}</p></div></body></html>"`;
        return htmlFOrEmail;
    };

    const handleSendInvoice = async () => {
        try {
            setSending(true);
            const res = await createNewInvoice(invoiceData);
            const newInvoiceLink = await createInvoiceURL(res.output.NewInvoiceId);
            const linkForInvoice = `${REACT_BASE_URL}/pay-invoice/${res.output.NewInvoiceId}`;

            const emailData = {
                to: email,
                from: studioInfo?.Contact_Email,
                subject: 'Invoice for your payment',
                html: newInvoiceLink,
                deliverytime: null,
            };
            const text = {
                to: phone,
                studioId: suid,
                message: 'You have a new invoice from ' + studioInfo?.Studio_Name + ' please go to ' + linkForInvoice + ' to pay your invoice.',
            };
            const data = {
                studioId: suid,
                email: emailData,
            };
            if (sendEmail) {
                sendIndividualEmail(data).then((res) => {
                    console.log(res);
                });
            }

            if (sendText) {
                sendAText(text).then((res) => {
                    console.log(res);
                });
            }
            setTimeout(() => {
                showMessage('Invoice Sent Successfully');
                setSending(false);
                navigate(-1);
            }, 2000);;
        } catch (error) {
            console.log(error);
            setTimeout(() => {
              showMessage('Invoice Sent Successfully');
              setSending(false);
              navigate(-1);
          }, 2000);;
        }
    };

    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/students/view-students" className="text-primary hover:underline">
                        Students
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 ">
                    <button className="text-primary hover:underline" onClick={handleGoBack}>
                        View Student
                    </button>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Invoice</span>
                </li>
            </ul>
            {sending && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary"></div>
                        </div>
                        <div className="text-center mt-4">Sending Invoice...</div>
                    </div>
                </div>
            
            )}
            <div className="flex xl:flex-row flex-col gap-2.5 mt-4">
                <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                    <div className="flex justify-between flex-wrap px-4">
                        <div className="mb-6 lg:w-1/2 w-full">
                            <div className="flex items-center text-black dark:text-white shrink-0">
                                <img src="/assets/images/logo.svg" alt="img" className="w-14" />
                            </div>
                            <div className="space-y-1 mt-6 text-gray-500 dark:text-gray-400">
                                <h2 className="text-lg font-semibold">{studioInfo?.Studio_Name}</h2>
                                <div>{studioInfo?.Contact_Address}</div>
                                <div>
                                    {studioInfo?.Contact_City} {studioInfo?.Contact_State} {studioInfo?.Contact_Zip}
                                </div>
                                <div>{studioInfo?.Contact_Email}</div>
                                <div>{convertPhone(studioInfo?.Contact_Number)}</div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full lg:max-w-fit">
                            <div className="flex items-center mt-4">
                                <label htmlFor="startDate" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">
                                    Invoice Date
                                </label>
                                <input id="startDate" type="date" value={formatDate(invoiceData?.creationDate)} name="inv-date" className="form-input lg:w-[250px] w-2/3" />
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="dueDate" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">
                                    Due Date
                                </label>
                                <input
                                    id="dueDate"
                                    type="date"
                                    name="due-date"
                                    className="form-input lg:w-[250px] w-2/3"
                                    value={formatDate(invoiceData?.dueDate)}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: formatDate(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                    <div className="mt-8 px-4">
                        <div className="flex justify-between lg:flex-row flex-col">
                            <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6">
                                <div className="text-lg">Invoice To :-</div>
                                <div className="mt-4 flex items-center">
                                    <label htmlFor="reciever-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                        Student Name
                                    </label>
                                    <input
                                        id="reciever-name"
                                        type="text"
                                        value={student?.First_Name + ' ' + student?.Last_Name}
                                        name="reciever-name"
                                        className="form-input flex-1 bg-gray-100"
                                        placeholder="Enter Name"
                                        disabled
                                    />
                                </div>
                                <div className="mt-4 flex items-center">
                                    <label htmlFor="reciever-email" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                        Email
                                    </label>
                                    <input id="reciever-email" type="email" value={student?.email} name="reciever-email" className="form-input flex-1" placeholder="Enter Email" />
                                </div>
                                <div className="mt-4 flex items-center">
                                    <label htmlFor="reciever-number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                        Phone Number
                                    </label>
                                    <input id="reciever-number" type="text" value={student?.Phone} name="reciever-number" className="form-input flex-1" placeholder="Enter Phone number" />
                                </div>
                            </div>
                            <div className="lg:w-1/2 w-full">
                                <div className="text-lg">Sender Details:</div>
                                <div className="flex items-center mt-4">
                                    <label htmlFor="acno" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                        From Email
                                    </label>
                                    <select id="acno" name="acno" className="form-select flex-1">
                                        <option value={studioOptions?.EmailFromAddress}>{studioOptions?.EmailFromAddress}</option>
                                        <option value={studioOptions?.EmailFromAddress2}>{studioOptions?.EmailFromAddress2}</option>
                                        <option value={studioOptions?.EmailFromAddress3}>{studioOptions?.EmailFromAddress3}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th className="w-1">Price</th>
                                        <th>Total</th>
                                        <th className="w-1"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length <= 0 && (
                                        <tr>
                                            <td colSpan={5} className="!text-center font-semibold">
                                                No Item Available
                                            </td>
                                        </tr>
                                    )}
                                    {items.map((item: any) => {
                                        return (
                                            <tr className="align-top" key={item.id}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-input min-w-[200px]"
                                                        placeholder="Enter Item Name"
                                                        defaultValue={item.title}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, reasonForInvoice: e.target.value })}
                                                    />
                                                    {/* <textarea className="form-textarea mt-4" placeholder="Enter Description" defaultValue={item.description}></textarea> */}
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-input w-32"
                                                        placeholder="Price"
                                                        min={0}
                                                        defaultValue={item.amount}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, amount: e.target.value })}
                                                    />
                                                </td>
                                                <td>${invoiceData.amount}</td>
                                                <td>
                                                    <button type="button" onClick={() => removeItem(item)}>
                                                        <IconX className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between sm:flex-row flex-col mt-6 px-4">
                            <div className="sm:mb-0 mb-6">
                                <button type="button" className="btn btn-primary" onClick={() => addItem()}>
                                    Add Another Item
                                </button>
                            </div>
                            <div className="sm:w-2/5">
                                <div className="flex items-center justify-between">
                                    <div>Subtotal</div>
                                    <div>${invoiceData?.amount}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 px-4">
                        <label htmlFor="notes">Notes</label>
                        <textarea id="notes" name="notes" className="form-textarea min-h-[130px]" placeholder="Notes...."></textarea>
                    </div>
                    <div className="mt-8 px-4 flex">
                        <div className="flex items-center gap-x-4">
                            <div className="flex">
                                <input type="checkbox" className="form-checkbox" 
                                checked={sendEmail}
                                id="send-email" onChange={(e) => setSendEmail(e.target.checked)} />
                                <label htmlFor="send-email">Send this invoice via email</label>
                            </div>
                            <div className="flex">
                                <input type="checkbox" className="form-checkbox" id="send-text" onChange={(e) => setSendText(e.target.checked)} />
                                <label htmlFor="send-text">Send this invoice via text</label>
                            </div>
                        </div>

                        <button type="button" className="btn btn-success ml-auto" onClick={handleSendInvoice}>
                            Send Invoice <IconSend className="ml-1 w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Invoice;
