import CopyToClipboard from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { showMessage } from '../functions/shared';
import IconCopy from './Icon/IconCopy';
import { REACT_API_BASE_URL, REACT_BASE_URL } from '../constants';
import { UserAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getWebsiteCount } from '../firebase/firebaseFunctions';
import IconEye from './Icon/IconEye';

export default function PageVisits() {
    const { suid }: any = UserAuth();
    const [count, setCount] = useState(0);
    const [showCopyLink, setShowCopyLink] = useState(false);
    const scriptToCopy = `
      <script>
        fetch("${REACT_API_BASE_URL}/manual/countVisit/${suid}", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    </script>
    `;

    const handleGetCount = async () => {
        try {
            const res: any = await getWebsiteCount(suid);
            if (res.status === 404) {
                setShowCopyLink(true);
            } else if (res.status === 200) {
                console.log(res);
                setCount(res.count);
            } else {
                setCount(0);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        handleGetCount();
    }, [suid]);

    return (
        <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="badge bg-white/30">Website Visits</div>
            {/*  */}

            {showCopyLink ? (
                <div className="flex items-center justify-center gap-2 mt-2">
                    <CopyToClipboard
                        text={scriptToCopy}
                        onCopy={(text, result) => {
                            if (result) {
                                showMessage('Copied successfully! Paste it in your website');
                            }
                        }}
                    >
                        <button className=" hover:text-gray-200 mt-2 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                <path
                                    fill-rule="evenodd"
                                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                                />
                            </svg>
                            Copy Code
                        </button>
                    </CopyToClipboard>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                    </svg>
                    <div className="text-2xl font-bold "> {count} </div>
                </div>
            )}
        </div>
    );
}