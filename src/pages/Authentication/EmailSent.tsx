import { Link } from 'react-router-dom';
import logo from '../../assets/icon.png';
import IconArrowForward from '../../components/Icon/IconArrowForward';

export default function EmailSent() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex flex-wrap max-w-lg justify-center mb-5">
                <div className="border border-gray-500/20 rounded-md shadow-[rgb(31_45_61_/_10%)_0px_2px_10px_1px] dark:shadow-[0_2px_11px_0_rgb(6_8_24_/_39%)] p-6 pt-12 mt-8 relative">
                    <div className="bg-primary absolute text-white-light ltr:left-6 rtl:right-6 -top-8 w-16 h-16 rounded-md flex items-center justify-center mb-5 mx-auto">
                        <img src={logo} alt="logo" className="w-12 h-12" />
                    </div>
                    <h5 className="text-dark text-lg font-semibold mb-3.5 dark:text-white-light">Password Reset Email Sent</h5>
                    <p className="text-white-dark text-[15px]  mb-3.5">We have sent you an email with instructions on how to reset your password. Please check your inbox.</p>
                    <Link
                        to="/auth/signin"
                     type="button" className="text-primary font-semibold hover:underline group">
                        Login <IconArrowForward className="w-4 h-4 inline-block group-hover:ltr:ml-2 group-hover:rtl:mr-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
