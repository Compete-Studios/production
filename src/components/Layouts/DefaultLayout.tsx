import { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import App from '../../App';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import Footer from './Footer';
import Header from './Header';
import Setting from './Setting';
import Sidebar from './Sidebar';
import Portals from '../../components/Portals';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReportIssue from '../ReportIssue';
import './loader.css';

const DefaultLayout = ({ children }: PropsWithChildren) => {
    const { isLoggedIn, showLoader, setShowLoader }: any = UserAuth();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const [showTopButton, setShowTopButton] = useState(false);

    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const onScrollHandler = () => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            setShowTopButton(true);
        } else {
            setShowTopButton(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', onScrollHandler);
        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            screenLoader[0].classList.add('animate__fadeOut');
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }
        return () => {
            window.removeEventListener('onscroll', onScrollHandler);
        };
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth/signin');
        }
    }, [isLoggedIn]);

    return (
        <App>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative">
                {/* sidebar menu overlay */}
                <div className={`${(!themeConfig.sidebar && 'hidden') || ''} fixed inset-0 bg-[black]/60 z-50 lg:hidden`} onClick={() => dispatch(toggleSidebar())}></div>
                {/* screen loader */}
                {/* {showLoader && (
                    <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                        <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                            <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                                <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                            </path>
                            <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                                <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                            </path>
                        </svg>
                    </div>
                )} */}
                {showLoader && (
                    /* From Uiverse.io by Nawsome */
                    <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                        <div className="socket">
                            <div className="gel center-gel">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c1 r1">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c2 r1">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c3 r1">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c4 r1">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c5 r1">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c6 r1">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>

                            <div className="gel c7 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>

                            <div className="gel c8 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c9 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c10 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c11 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c12 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c13 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c14 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c15 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c16 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c17 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c18 r2">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c19 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c20 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c21 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c22 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c23 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c24 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c25 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c26 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c28 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c29 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c30 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c31 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c32 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c33 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c34 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c35 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c36 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                            <div className="gel c37 r3">
                                <div className="hex-brick h1"></div>
                                <div className="hex-brick h2"></div>
                                <div className="hex-brick h3"></div>
                            </div>
                        </div>
                        <h3 className="text-center text-xl font-bold text-black dark:text-white-dark">Loading...</h3>
                    </div>
                )}
                <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-50">
                    {showTopButton && (
                        <button type="button" className="btn btn-outline-primary rounded-full p-2 animate-pulse bg-[#fafafa] dark:bg-[#060818] dark:hover:bg-primary" onClick={goToTop}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* BEGIN APP SETTING LAUNCHER */}
                <Setting />
                {/* END APP SETTING LAUNCHER */}

                <div className={`${themeConfig.navbar} main-container text-black dark:text-white-dark min-h-screen bg-black-light dark:bg-black-dark-light`}>
                    {/* BEGIN SIDEBAR */}
                    <Sidebar />
                    {/* END SIDEBAR */}

                    <div className="main-content flex flex-col min-h-screen">
                        {/* BEGIN TOP NAVBAR */}
                        <Header />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <Suspense>
                            <div className={`${themeConfig.animation} p-6 animate__animated`}>
                                {children}
                                <ReportIssue />
                            </div>
                        </Suspense>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        <Footer />
                        {/* END FOOTER */}
                        <Portals />
                    </div>
                </div>
            </div>
        </App>
    );
};

export default DefaultLayout;
