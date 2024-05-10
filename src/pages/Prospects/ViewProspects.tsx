
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { searchProspects } from "../../functions/api";
import { convertPhone, hashTheID } from "../../functions/shared";

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
  const { suid, setStudentToEdit }: any = UserAuth();

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

 

  const handleViewProspect= (id: any) => {
    const hashedStudentId = hashTheID(id);
    const hashedSUID = hashTheID(suid);
    navigate(`/prospects/view-prospect/${hashedStudentId}/${hashedSUID}`);
};

  return (
    <div className="panel p-0">
      <div className="px-5">
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
            className=" whitespace-nowrap"
            
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
      </div>
      <div className="mt-8 ">
        
            <div className="table-responsive">
              <table className="table-striped">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                    >
                      Name
                    </th>
                    <th
                    >
                      Email
                    </th>
                    <th
                    >
                      Phone
                    </th>

                    <th
                    className="text-right"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {displayedStudents?.length > 0 ?
                    displayedStudents?.map((person: any) => (
                      <tr key={person.ProspectId}>
                        <td className="">
                        {person.LName}, {person.FName} 
                        </td>
                        <td className="">
                          {person.Email}
                        </td>
                        <td className="">
                          {convertPhone(person.Phone)}
                        </td>

                        
                        <td className="text-right flex items-center justify-end gap-2">
                        <button
                            className="btn btn-info"
                            onClick={() => handleViewProspect(person.ProspectId)}
                          >
                            View<span className="sr-only">, {person.name}</span>
                          </button>
                          <button
                            className="btn btn-danger"
                          >
                            Delete
                            <span className="sr-only">, {person.name}</span>
                          </button>
                          <button
                            className="btn btn-warning"
                          >
                            Activate as Student
                            <span className="sr-only">, {person.name}</span>
                          </button>
                        </td>
                      </tr>
                    )) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center "
                      >
                        No prospects found
                      </td>
                    </tr>
                    )}
                </tbody>
              </table>
            </div>
          
         
       
      </div>
    </div>
  );
}
