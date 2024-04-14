import React from "react";
import { UserAuth } from "../context/AuthContext";

export default function SearchDisplay() {
  const { searchedStudentsAndProspects } = UserAuth();

  return (
    <div className="grid md:grid-cols-2 gap-x-2 grid-cols-1">
      <div className="overflow-hidden rounded-lg bg-white shadow">

        <div className="px-4 py-5 sm:p-6">
          {" "}
          <div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">
                    Students
                  </h1>
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all the students that matche the criteria
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flow-root overflow-hidden">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <table className="w-full text-left">
                  <thead className="bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Name
                        <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                        <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell"
                      >
                        Info
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-right "
                      >
                        Contact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchedStudentsAndProspects?.students?.length > 0 ? (
                      searchedStudentsAndProspects?.students?.map((person) => (
                        <tr key={person.email}>
                          <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                            {person.First_Name} {person.Last_Name}
                            <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                            <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                            {person.activity === 1 ? "Active" : "Inactive"}
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {/* <Info
                              size={24}
                              className=" bg-com rounded-full text-white hover:bg-comhover"
                            /> */}!
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 text-right ">
                            <div>{person.email}</div>
                            <div>{person.Phone}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-3 py-4 text-sm text-center text-red-500"
                        >
                          This search returned no students.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          {" "}
          <div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">
                    Prospects
                  </h1>
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all the prospects that matche the criteria
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flow-root overflow-hidden">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <table className="w-full text-left">
                  <thead className="bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Name
                        <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                        <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                      </th>

                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell"
                      >
                        Info
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-right "
                      >
                        Contact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchedStudentsAndProspects?.prospects?.length > 0 ? (
                      searchedStudentsAndProspects?.prospects?.map((person) => (
                        <tr key={person.email}>
                          <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                            {person.FName} {person.LName}
                            <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                            <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                          </td>

                          <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                            {/* <Info
                              size={24}
                              className=" bg-com rounded-full text-white hover:bg-comhover"
                            /> */}
                            !
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 text-right ">
                            <div>{person.email}</div>
                            <div>{person.Phone}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-3 py-4 text-sm text-center text-red-500"
                        >
                          This search returned no prospects.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
