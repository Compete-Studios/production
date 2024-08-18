import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { getStudioOptions } from "../../functions/api";
import { Link } from "react-router-dom";

export default function Account() {
  const { suid, studioInfo }: any = UserAuth();
  const [options, setOptions] = useState([]);
  const [emailWorking, setEmailWorking] = useState(false);
  const [phoneWorking, setPhoneWorking] = useState(false);
  const [paySimpleID, setPaySimpleID] = useState(false);

  useEffect(() => {
    getStudioOptions(suid)
      .then((res) => {
        console.log("res", res);
        if (res && res.recordset && res.recordset.length > 0) {
          setOptions(res.recordset[0]);
          if (
            res.recordset[0].EmailFromAddress &&
            res.recordset[0].EmailFromAddress2 &&
            res.recordset[0].EmailFromAddress3
          ) {
            setEmailWorking(true);
          }
          if (res.recordset[0].TextFromNumber) {
            setPhoneWorking(true);
          }
          if (studioInfo?.PaysimpleCustomerId > 0) {
            setPaySimpleID(true);
          }
        } else {
          // Handle case where recordset is undefined or empty
          // You can set default values or perform any other necessary actions
          console.error("Recordset is undefined or empty");
          setOptions([]);
        }
      })
      .catch((error) => {
        // Handle error if the promise is rejected
        console.error("Error fetching studio options:", error);
        setOptions([]);
      });
  }, [suid]);

  console.log("options", options);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Account Status</h2>
          <p className="text-muted-foreground">
            Welcome to your Account Status Center. From here you'll be able to
            set up and manage your email oprions, text-messaging, billing, and
            more.
          </p>
        </div>
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
                      Task
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell"
                    >
                      Status
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
                  <tr
                    className={`${paySimpleID ? "bg-success-light" : "bg-danger-light"}`}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      Studio Billing
                    </td>
                    <td
                      className={`whitespace-nowrap px-3 py-4 text-sm hidden sm:table-cell ${
                        paySimpleID ? "text-com" : "text-alert"
                      }`}
                    >
                      {paySimpleID ? "Working" : "Needs Input"}
                    </td>

                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        to="/manage-account"
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                  <tr
                    className={`${phoneWorking ? "bg-success-light" : "bg-danger-light"}`}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      Text Messaging
                    </td>
                    <td
                      className={`whitespace-nowrap px-3 py-4 text-sm hidden sm:table-cell ${
                        phoneWorking ? "text-com" : "text-alert"
                      }`}
                    >
                      {phoneWorking ? "Working" : "Needs Input"}
                    </td>

                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        to="/studios/text-settings"
                        type="button"
                        className="text-emerald-600 hover:text-emerlad-900"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                  <tr
                    className={`${emailWorking ? "bg-success-light" : "bg-danger-light"}`}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      Email Settings
                    </td>
                    <td
                      className={`whitespace-nowrap px-3 py-4 text-sm hidden sm:table-cell ${
                        emailWorking ? "text-com" : "text-alert"
                      }`}
                    >
                      {emailWorking ? "Working" : "Needs Input"}
                    </td>

                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        to="/studios/email-settings"
                        type="button"
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
