
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { searchProspects } from "../../functions/api";
import { convertPhone } from "../../functions/shared";

const initDisplay = {
  FName: false,
  LName: false,
  Email: false,
  marketingSource: false,
  Phone: false,
  Active: false,
  Address: false,
  Notes: false,
  City: false,
  Zip: false,
  Program: false,
  StartDate: false,
  CancellationDate: false,
};

const initValues = {
  First_Name: "",
  Last_Name: "",
  activity: "",
  Email: "",
  Phone: "",
  MailingAddr: "",
  City: "",
  State: "",
  Zip: "",
  NotesContain: "",
  MarketingMethod: "",
  EntryDate: "",
  OriginalContactDate: "",
  FirstClassDate: "",
  CancellationDate: "",
};

export default function ViewProspects() {
  const { suid, setStudentToEdit } = UserAuth();

  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [display, setDisplay] = useState(initDisplay);
  const [values, setValues] = useState(initValues);

  const searchParams = {
    studioId: suid,
    first_name: display.FName ? values.First_Name : undefined,
    last_name: display.LName ? values.Last_Name : undefined,
    email: display.Email ? values.Email : undefined,

    phone: display.Phone ? values.Phone : undefined,

    city: display.City ? values.City : undefined,
    zip: display.Zip ? values.Zip : undefined,
  };

  // Filter out the properties with undefined values
  const filteredSearchParams = Object.fromEntries(
    Object.entries(searchParams).filter(([_, value]) => value !== undefined)
  );

  const handleSearch = (e: any) => {
    e.preventDefault();
    try {
      searchProspects(filteredSearchParams).then((response) => {
        setDisplayedStudents(response.recordset);
       
      });
    } catch (error) {
      console.error(error);
      setDisplayedStudents([]);
    }
  };
  const navigate = useNavigate();

  const handleStudentToEdit = (id: any) => {
    setStudentToEdit(id);
    navigate("/students/view-student");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 panel">
      <div className="sm:flex sm:items-center ">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Search Prospects
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Select the checkbox next to the criteria you wish to use to search
            for a student. To narrow a search, select more criteria. Not
            selecting any criteria will result in a list of all students for
            your studio stored in the database.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-x-2">
          <div className="flex h-6 items-center">
            <input
              id="fname"
              aria-describedby="comments-description"
              className="form-checkbox"
              name="fname"
              type="checkbox"
              onClick={() =>
                setDisplay({
                  ...display,
                  FName: !display.FName,
                })
              }
            />
          </div>
          <label
            htmlFor="first-name"
            
          >
            First name
          </label>
          {display.FName && (
            <input
              type="text"
              name="first-name"
              id="first-name"
              className="form-input"
              onChange={(e) =>
                setValues({ ...values, First_Name: e.target.value })
              }
            />
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex h-6 items-center">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="form-checkbox"
              onClick={() =>
                setDisplay({
                  ...display,
                  LName: !display.LName,
                })
              }
            />
          </div>
          <label
            htmlFor="last-name"
          >
            Last name
          </label>
          {display.LName && (
            <input
              type="text"
              name="last-name"
              id="last-name"
              className="form-input"
              onChange={(e) =>
                setValues({ ...values, Last_Name: e.target.value })
              }
            />
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex h-6 items-center">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="form-checkbox"
              onClick={() =>
                setDisplay({
                  ...display,
                  Email: !display.Email,
                })
              }
            />
          </div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900 whitespace-nowrap"
          >
            Email
          </label>
          {display.Email && (
            <input
              type="text"
              name="email"
              id="email"
              className="form-input"
              onChange={(e) => setValues({ ...values, Email: e.target.value })}
            />
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex h-6 items-center">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="form-checkbox"
              onClick={() =>
                setDisplay({
                  ...display,
                  Phone: !display.Phone,
                })
              }
            />
          </div>
          <label
            htmlFor="phone"
          >
            Phone
          </label>
          {display.Phone && (
            <input
              type="text"
              name="phone"
              className="form-input"
              id="phone"
              onChange={(e) => setValues({ ...values, Phone: e.target.value })}
            />
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex h-6 items-center">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="form-checkbox"
              onClick={() =>
                setDisplay({
                  ...display,
                  City: !display.City,
                })
              }
            />
          </div>
          <label
            htmlFor="city"
          >
            City
          </label>
          {display.City && (
            <input
              type="text"
              name="city"
              id="city"
              className="form-input"
              onChange={(e) => setValues({ ...values, City: e.target.value })}
            />
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex h-6 items-center">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="form-checkbox"
              onClick={() =>
                setDisplay({
                  ...display,
                  Zip: !display.Zip,
                })
              }
            />
          </div>
          <label
            htmlFor="zip"
          >
            Zip
          </label>
          {display.Zip && (
            <input
              type="text"
              name="zip"
              id="zip"
              className="form-input"
              onChange={(e) => setValues({ ...values, Zip: e.target.value })}
            />
          )}
        </div>
      </div>
      <div className="mt-6 ">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 "
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell"
                    >
                      Phone
                    </th>

                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {displayedStudents?.length > 0 ?
                    displayedStudents?.map((person: any) => (
                      <tr key={person.ProspectId}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {person.FName} {person.LName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell">
                          {person.Email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell">
                          {convertPhone(person.Phone)}
                        </td>

                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            className="text-com hover:text-indigo-900"
                            onClick={() =>
                              handleStudentToEdit(person.Student_id)
                            }
                          >
                            View<span className="sr-only">, {person.name}</span>
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a
                            href="#"
                            className="text-alert hover:text-alerthover"
                          >
                            Delete
                            <span className="sr-only">, {person.name}</span>
                          </a>
                        </td>
                      </tr>
                    )) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4 text-sm font-medium text-gray-900"
                      >
                        No prospects found
                      </td>
                    </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
          {/* <nav
            className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {endIndex > students?.length ? students?.length : endIndex}
                </span>{" "}
                of <span className="font-medium">{students?.length}</span>{" "}
                results
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
              <button
                className="relative inline-flex items-center rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 bg-white"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <button
                href="#"
                className="relative ml-3 inline-flex items-center rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 bg-white"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </nav> */}
        </div>
      </div>
    </div>
  );
}
