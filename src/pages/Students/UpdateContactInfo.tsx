import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { getStudentInfo, updateStudent } from "../../functions/api";
import IconCaretDown from "../../components/Icon/IconCaretDown";
import IconUser from "../../components/Icon/IconUser";
import IconCalendar from "../../components/Icon/IconCalendar";

const studentInfoInit = {
  studentId: "",
  fName: "",
  lName: "",
  contact1: "",
  contact2: "",
  phone: "",
  phone2: "",
  email: "",
  email2: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  birthdate: "",
  marketingMethod: "",
  notes: "",
  nextContactDate: "",
  currentPipelineStatus: "",
  firstClassDate: "",
  originalContactDate: "",
  introDate: "",
  selectedClasses: [],
  selectedPrograms: [],
  selectedWaitingLists: [],
};

export default function ViewStudent() {
  const { marketingSource, pipelineSteps, suid } = UserAuth();
  const [student, setStudent] = useState(studentInfoInit);
  const [loading, setLoading] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<any>(null)

  const navigate = useNavigate();

  const formatDate = (date: any) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().substr(0, 10);
    return formattedDate;
  };

  const getStudentInformation = async (studentId: any) => {
    setLoading(true);
    getStudentInfo(studentId)
      .then((response) => {
        const studentRes = response.recordset[0];
        setStudent({
          studentId: studentId,
          fName: studentRes.First_Name,
          lName: studentRes.Last_Name,
          contact1: studentRes.Contact1,
          contact2: studentRes.Contact2,
          phone: studentRes.Phone,
          phone2: studentRes.Phone2,
          email: studentRes.email,
          email2: studentRes.Email2,
          address: studentRes.mailingaddr,
          address2: studentRes.mailingaddr2,
          city: studentRes.city,
          state: studentRes.state,
          zip: studentRes.Zip,
          birthdate: formatDate(studentRes.Birthdate),
          marketingMethod: studentRes.MarketingMethod,
          notes: studentRes.notes,
          nextContactDate: formatDate(studentRes.NextContactDate),
          currentPipelineStatus: studentRes.StudentPipelineStatus,
          firstClassDate: formatDate(studentRes.FirstClassDate),
          originalContactDate: formatDate(studentRes.OriginalContactDate),
          introDate: formatDate(studentRes.IntroDate),
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   if (studentToEdit === null) {
  //     navigate("/students");
  //   } else {
  //     getStudentInformation(studentToEdit);
  //   }
  // }, [studentToEdit, navigate]);

  const handleEditStudent = () => {
    setLoading(true);
    updateStudent(student).then((res) => {
      if (res.status === 200) {
        setLoading(false);
        navigate("/students");
      }
    });
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <>
          <div className="pb-8">
            <div className="p-4 border-b ">
              <div className="pb-8 -mt-4">
                <nav className="sm:hidden" aria-label="Back">
                  <Link
                    to="/students"
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <IconCaretDown
                      className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    Back
                  </Link>
                </nav>
                <nav className="hidden sm:flex" aria-label="Breadcrumb">
                  <ol role="list" className="flex items-center space-x-4">
                    <li>
                      <div className="flex">
                        <Link
                          to="/students"
                          className="text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          Students
                        </Link>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <IconUser
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <Link
                          to="/students/view-student"
                          className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          Student
                        </Link>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    {student.fName} {student.lName}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-10 divide-y divide-gray-900/10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
              <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>
              </div>

              <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="px-4 py-6 sm:p-8">
                  <div className="grid max-w-2xl sm:grid-cols-6 grid-cols-1 gap-x-6 gap-y-8 ">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        First name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.fName}
                          onChange={(e) =>
                            setStudent({ ...student, fName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Last name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.lName}
                          onChange={(e) =>
                            setStudent({ ...student, lName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Contact 1
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.contact1}
                          onChange={(e) =>
                            setStudent({ ...student, contact1: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Contact 2
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.contact2}
                          onChange={(e) =>
                            setStudent({ ...student, contact2: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Street address
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="street-address"
                          id="street-address"
                          autoComplete="street-address"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.address}
                          onChange={(e) =>
                            setStudent({ ...student, address: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-1">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Ste / Apt
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="street-address"
                          id="street-address"
                          autoComplete="street-address"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.address2}
                          onChange={(e) =>
                            setStudent({ ...student, address2: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        City
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          autoComplete="address-level2"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.city}
                          onChange={(e) =>
                            setStudent({ ...student, city: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        State / Province
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="region"
                          id="region"
                          autoComplete="address-level1"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.state}
                          onChange={(e) =>
                            setStudent({ ...student, state: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        ZIP / Postal code
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="postal-code"
                          id="postal-code"
                          autoComplete="postal-code"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.zip}
                          onChange={(e) =>
                            setStudent({ ...student, zip: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Cell Phone
                      </label>
                      <div className="mt-2">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="phone"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.phone}
                          onChange={(e) =>
                            setStudent({ ...student, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="phone2"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Home Phone
                      </label>
                      <div className="mt-2">
                        <input
                          id="phone2"
                          name="phone"
                          type="tel"
                          autoComplete="phone2"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.phone2}
                          onChange={(e) =>
                            setStudent({ ...student, phone2: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.email}
                          onChange={(e) =>
                            setStudent({ ...student, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
              <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Student Record
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  For internal use only.
                </p>
              </div>

              <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="px-4 py-6 sm:p-8">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Birthday
                      </label>

                      <div className="mt-2">
                        <input
                          type="date"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.birthdate}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              birthdate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Marketing Source
                      </label>
                      <div className="mt-2">
                        <select
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.marketingMethod}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              marketingMethod: e.target.value,
                            })
                          }
                        >
                          {marketingSource &&
                            marketingSource?.map((item: any) => (
                              <option key={item.MethodId} value={item.MethodId}>
                                {item.Name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Entry Date
                      </label>
                      <div className="mt-2">
                        <input
                          type="date"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.originalContactDate}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              originalContactDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Intro Date
                      </label>
                      <div className="mt-2">
                        <input
                          type="date"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.introDate}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              introDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        First Class Date
                      </label>
                      <div className="mt-2">
                        <input
                          type="date"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.firstClassDate}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              firstClassDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Next Contact Date
                      </label>
                      <div className="mt-2">
                        <input
                          type="date"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.nextContactDate}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              nextContactDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Pipeline Status
                      </label>
                      <div className="mt-2">
                        <select
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 h-12"
                          value={student.currentPipelineStatus}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              currentPipelineStatus: e.target.value,
                            })
                          }
                        >
                          {pipelineSteps &&
                            pipelineSteps?.map((item: any) => (
                              <option
                                key={item.PipelineStepId}
                                value={item.PipelineStepId}
                              >
                                {item.StepName}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Notes
                      </label>
                      <div className="mt-2">
                        <textarea
                          rows={4}
                          name="comment"
                          id="comment"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-com sm:text-sm sm:leading-6 "
                          value={student.notes}
                          onChange={(e) =>
                            setStudent({ ...student, notes: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <Link
                        to="/students/view-student/email-history"
                        className="flex items-center text-com hover:text-comhover"
                      >
                        <IconCalendar className="text-3xl  ml-auto" />
                        View Student Email History
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end pt-12 gap-4">
              <button
                type="submit"
                className="rounded-sm bg-com px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-comhover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-com flex items-center"
                onClick={handleEditStudent}
              >
                Update Student
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
