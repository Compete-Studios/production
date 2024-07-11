import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Fragment, Suspense, useEffect, useState } from 'react';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconCalendar from '../../components/Icon/IconCalendar';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import { UserAuth } from '../../context/AuthContext';
import {
  dropStudentFromClass,
  dropStudentFromProgram,
  dropStudentFromWaitingList,
  dropStudent,
  getClassesByStudentId,
  getPaymentScheduleByID,
  getPaymentSchedulesForCustomer,
  getPaysimpleCustomerIdFromStudentId,
  getProgramsByStudentId,
  getRankByStudentId,
  getStudentBillingAccounts,
  getStudentCustomBarcodeId,
  getStudentInfo,
  getWaitingListsByStudentId,
  updateStudentByColumn,
  updateStudentNotes,
} from '../../functions/api';
import IconUser from '../../components/Icon/IconUser';
import AddNoteModal from './AddNoteModal';
import IconTrash from '../../components/Icon/IconTrash';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconPlus from '../../components/Icon/IconPlus';
import StudentsQuickPay from './StudentsQuickPay';
import { convertPhone, showMessage, showWarningMessage, unHashTheID } from '../../functions/shared';
import { formatDate } from '@fullcalendar/core';
import { getAllCustomerPaymentAccounts } from '../../functions/payments';
import UpdateContactPopUp from './UpdateContactPopUp';
import UpdateAdditionalPopUp from './UpdateAdditionalPopUp';
import AddCardModal from './AddCardModal';
import AddBankModal from './AddBankModal';
import AddStudentToClass from '../Classes/AddStudentToClass';
import AddStudentToProgram from '../Classes/AddStudenToProgram';
import AddStudentToWaitingList from '../Classes/AddStudentToWaitingList';
import SendQuickText from './buttoncomponents/SendQuickText';
import SendQuickEmail from './buttoncomponents/SendQuickEmail';
import ViewStudentActionItem from './ViewStudentActionItem';
import { Tab } from '@headlessui/react';
import SendQuickWaiver from './buttoncomponents/SendQuickWaiver';
import IconEdit from '../../components/Icon/IconEdit';
import IconEye from '../../components/Icon/IconEye';
import ViewPaymentMethods from './ViewPaymentMethods';
import BillingInfoUpdate from './components/BillingInfoUpdate';
import Hashids from 'hashids';

interface UpdateValues {
  [key: string]: any;
}

const updateValuesInit = {
  First_Name: false,
  Last_Name: false,
  email: false,
  Contact1: false,
  Contact2: false,
  mailingaddr: false,
  city: false,
  state: false,
  Zip: false,
  nextContactDate: false,
  IntroDate: false,
  Birthdate: false,
  MarketingMethod: false,
  FirstClassDate: false,
  StudentPipelineStatus: false,
};

const DeleteStudent: React.FC = () => {
  const { suid, marketingSources, pipelineSteps, studioOptions, studioInfo }: any = UserAuth();
  const [billingLoading, setBillingLoading] = useState<boolean>(true);
  const [updateClasses, setUpdateClasses] = useState<boolean>(false);
  const [paymentsLoading, setPaymentsLoading] = useState<boolean>(true);
  const [toUpdate, setToUpdate] = useState<UpdateValues>(updateValuesInit);
  const [update, setUpdate] = useState<boolean>(false);
  const [student, setStudent] = useState<any>({});
  const [paySimpleInfo, setPaySimpleInfo] = useState<any>({});
  const [billingInfo, setBillingInfo] = useState<any>({});
  const [updateNotes, setUpdateNotes] = useState(false);
  const [barcode, setBarcode] = useState<any>(null);
  const [displayedSource, setDisplayedSource] = useState<any>(null);
  const [classes, setClasses] = useState<any>([]);
  const [programs, setPrograms] = useState<any>([]);
  const [waitingLists, setWaitingLists] = useState<any>([]);
  const [rank, setRank] = useState<any>(null);
  const [hasCards, setHasCards] = useState<boolean>(false);
  const [paymentSchedules, setPaymentSchedules] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [pipeline, setPipeline] = useState<any>([]);
  const [updateBilling, setUpdateBilling] = useState<boolean>(false);
  const hashids = new Hashids();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Profile'));
  });
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
  const { uid, studioid } = useParams<{ uid: string; studioid: any }>();

  const navigate = useNavigate();

  const handleGoToPayments = () => {
    const newID = parseInt(student?.Student_id) * parseInt(suid);
    navigate(`/students/${newID}/finish-billing-setup-options`);
  };

  const handleGoToPaymentSchedules = () => {
    const newID = parseInt(student?.Student_id) * parseInt(suid);
    navigate(`/students/${newID}/add-payment-schedules`);
  };

  const getPaySimpleInformation = async (studentID: any) => {
    try {
      const response = await getStudentBillingAccounts(studentID);
      if (response.recordset.length > 0) {
        setPaySimpleInfo(response.recordset[0].PaysimpleCustomerId);
        getAllCustomerPaymentAccounts(response.recordset[0]?.PaysimpleCustomerId, suid).then((response) => {
          if (response?.Response?.CreditCardAccounts?.length > 0 || response?.Response?.AchAccounts?.length > 0) {
            setHasCards(true);
          } else {
            setHasCards(false);
          }
        });
      } else {
        setPaySimpleInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const pipeliner = pipelineSteps.find((step: any) => step.PipelineStepId === parseInt(student?.StudentPipelineStatus));
    setPipeline(pipeliner);
  }, [student]);

  const handleDeactivateStudent = async () => {
    try {
      const result = await axios.post('/api/student/deactivate', {
        studentId: student.contactInfo.id
      });

      if (result.data.success) {
        setMessage('Student successfully deleted. You will be redirected momentarily.');
        setTimeout(() => {
          navigate('/students');
        }, 3000);
      } else {
        setMessage(result.data.message);
      }
    } catch (error) {
      setMessage('Error deactivating student. Please try again.');
    }
  };

  return (
    <div>
      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}
      {student && (
        <div className="lg:flex lg:items-start gap-4 mt-4">
          {/* CONTACT INFO */}
          <div className="panel p-0 lg:min-w-80 lg:max-w-96 divide-y divide-y-zinc-600 ">
            <div className="flex items-start justify-between mb-5 p-4">
              <div>
                <div className="font-semibold text-2xl">
                  {student.contactInfo.First_Name} {student.contactInfo.Last_Name}
                </div>
                <p className="font-normal text-sm">{student.contactInfo.email}</p>
                <p className="font-normal text-sm">{student.contactInfo.phone}</p>
                <p className="font-normal text-sm">{student.contactInfo.phone2}</p>
                <div>
                  <p className={`font-normal text-md mt-4 ${student.contactInfo.active ? 'text-success' : 'text-danger'}`}>
                    {student.contactInfo.active ? 'Active' : 'Inactive'}
                  </p>
                  {!student.contactInfo.active && (
                    <button
                      className="mt-2 px-4 py-2 bg-red-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-red-700 focus:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300 ease-in-out"
                      onClick={handleDeactivateStudent}
                    >
                      Deactivate Student
                    </button>
                  )}
                </div>
                <p className="font-normal text-xs">Next Contact Date: {student.contactInfo.NextContactDate}</p>
                <p className="font-normal text-xs">Created: {student.contactInfo.EntryDate}</p>
                <p className={`font-normal text-xs ${student.contactInfo.rank ? 'text-success' : 'text-danger'}`}>Rank: {student.contactInfo.rank}</p>
                <p className={`font-normal text-xs ${student.contactInfo.barcode ? 'text-success' : 'text-danger'}`}>Barcode ID: {student.contactInfo.barcode}</p>
                <p className="font-normal text-xs">
                  Pipeline Step: <span className={`font-normal text-xs ${student.contactInfo.pipelineStep ? 'text-success' : 'text-danger'}`}>{student.contactInfo.pipelineStep}</span>
                </p>
              </div>
            </div>
            {/* Add more sections as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteStudent;
