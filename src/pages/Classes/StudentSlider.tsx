'use client';

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import { getStudentInfo } from '../../functions/api';

export default function StudentSlider({open, setOpen, studentID}: any) {
    const [student, setStudent] = useState<any>(null);

    const handleGetStudent = async () => {
        const res = await getStudentInfo(studentID);
        console.log(res);
        setStudent(res);
    };

    useEffect(() => {
        handleGetStudent();
    }, [studentID]);



 
    

    return (
        <>
            {/* <button className="text-info hover:text-blue-800 flex items-center gap-1" onClick={() => setOpen(true)}>
       View Payment
            </button> */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog className="relative z-50" onClose={setOpen}>
                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Payment Information</Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none "
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <span className="absolute -inset-2.5" />
                                                            <span className="sr-only">Close panel</span>
                                                            <IconX className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative flex-1 ">
                                                <div className="divide-y divide-gray-200">
                                                    <div className="pb-6">
                                                        <div className="h-24 bg-indigo-700 sm:h-20 lg:h-28" />
                                                        <div className="-mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-16">
                                                            <div>
                                                                <div className="-m-1 flex">
                                                                    <div className="inline-flex overflow-hidden rounded-lg border-4 border-white">
                                                                        <img
                                                                            alt=""
                                                                            src="/assets/images/blankProfile.jpg"
                                                                            className="h-24 w-24 flex-shrink-0 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-6 sm:ml-6 sm:flex-1">
                                                                <div>
                                                                    <div className="flex items-center">
                                                                        <h3 className="text-xl font-bold text-gray-900 sm:text-2xl capitalize">{student?.First_Name} {student?.Last_Name}</h3>
                                                                        <span className="ml-2.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400">
                                                                            <span className="sr-only">Online</span>
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-500">{student?.email}</p>
                                                                </div>
                                                                <div className="mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0">
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1"
                                                                    >
                                                                        Message
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex w-full flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                                    >
                                                                        Call
                                                                    </button>
                                                                    <div className="ml-3 inline-flex sm:ml-0">
                                                                        <div className="relative inline-block text-left">
                                                                            <div className="relative inline-flex items-center rounded-md bg-white p-2 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                                                <span className="absolute -inset-1" />
                                                                                <span className="sr-only">Open options menu</span>
                                                                                <IconHorizontalDots aria-hidden="true" className="h-5 w-5" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="px-4 py-5 sm:px-0 sm:py-0">
                                                        <dl className="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200">
                                                            <div className="sm:flex sm:px-6 sm:py-5">
                                                                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Bio</dt>
                                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">
                                                                    <p>
                                                                        Enim feugiat ut ipsum, neque ut. Tristique mi id elementum praesent. Gravida in tempus feugiat netus enim aliquet a, quam
                                                                        scelerisque. Dictumst in convallis nec in bibendum aenean arcu.
                                                                    </p>
                                                                </dd>
                                                            </div>
                                                            <div className="sm:flex sm:px-6 sm:py-5">
                                                                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Location</dt>
                                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">New York, NY, USA</dd>
                                                            </div>
                                                            <div className="sm:flex sm:px-6 sm:py-5">
                                                                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Website</dt>
                                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">ashleyporter.com</dd>
                                                            </div>
                                                            <div className="sm:flex sm:px-6 sm:py-5">
                                                                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Birthday</dt>
                                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">
                                                                    <time dateTime="1982-06-23">June 23, 1982</time>
                                                                </dd>
                                                            </div>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
