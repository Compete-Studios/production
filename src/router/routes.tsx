import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoutes';

const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const RegisterBoxed = lazy(() => import('../pages/Authentication/RegisterBoxed'));
const Error = lazy(() => import('../components/Error'));
const HomeMain = lazy(() => import('../pages/Home/HomeMain'));

const Overview = lazy(() => import('../pages/Overview'));
const SearchPayments = lazy(() => import('../pages/Payments/SearchPayments'));
const QuickPay = lazy(() => import('../pages/Payments/QuickPay'));
const LatePaymentPipeline = lazy(() => import('../pages/Payments/LatePaymentPipeline'));
const ViewPaymentInfo = lazy(() => import('../pages/Payments/ViewPaymentInfo'));
const PrintReciept = lazy(() => import('../pages/Payments/PrintReciept'));
const EmailReceipt = lazy(() => import('../pages/Payments/EmailReceipt'));
const RefundReciept = lazy(() => import('../pages/Payments/RefundReciept'));
const EditLatePayementPipelineStep = lazy(() => import('../pages/Payments/EditLatePayementPipelineStep'));
const ReorderPaymentSteps = lazy(() => import('../pages/Payments/ReorderPaymentSteps'));
const AddNewPipelineStep = lazy(() => import('../pages/Payments/AddNewPipelineStep'));
const ViewInvoices = lazy(() => import('../pages/Payments/ViewInvoices'));
const ViewInvoice = lazy(() => import('../pages/Payments/ViewInvoice'));
const PayInvoice = lazy(() => import('../pages/Payments/PayInvoice'));
const ExisitingBillingAccounts = lazy(() => import('../pages/Payments/ExisitingBillingAccounts'));

const ViewClasses = lazy(() => import('../pages/Classes/ViewClasses'));
const ViewRoster = lazy(() => import('../pages/Classes/ViewRoster'));
const ViewStaff = lazy(() => import('../pages/Staff/ViewStaff'));
const AddStaff = lazy(() => import('../pages/Staff/AddStaff'));
const ViewStaffMember = lazy(() => import('../pages/Staff/ViewStaffMember'));
const EditStaffMember = lazy(() => import('../pages/Staff/EditStaffMember'));
const EmailStaffMember = lazy(() => import('../pages/Staff/EmailStaffMember'));
const SendTextToStaffMember = lazy(() => import('../pages/Staff/SendTextToStaffMember'));
const EmailAllStaff = lazy(() => import('../pages/Staff/EmailAllStaff'));
const TextAllStaff = lazy(() => import('../pages/Staff/TextAllStaff'));
const AddToEmailLIst = lazy(() => import('../pages/Staff/AddToEmailLIst'));
const SearchStaff = lazy(() => import('../pages/Staff/SearchStaff'));
const Attendance = lazy(() => import('../pages/Classes/Attendance'));
const Rooms = lazy(() => import('../pages/Classes/Rooms'));
const WaitingLists = lazy(() => import('../pages/Classes/WaitingLists'));
const Programs = lazy(() => import('../pages/Classes/Programs'));
const Ranks = lazy(() => import('../pages/Classes/Ranks'));
const BarcodeAttendance = lazy(() => import('../pages/Classes/BarcodeAttendance'));
const PrintableRoll = lazy(() => import('../pages/Classes/PrintableRoll'));
const StealthAttendance = lazy(() => import('../pages/Classes/StealthAttendance'));
const AddRoom = lazy(() => import('../pages/Classes/AddRoom'));
const EditRoom = lazy(() => import('../pages/Classes/EditRoom'));
const WaitingListRoster = lazy(() => import('../pages/Classes/WaitingListRoster'));
const EditWaitingList = lazy(() => import('../pages/Classes/EditWaitingList'));
const AddWaitingList = lazy(() => import('../pages/Classes/AddWaitingList'));
const AddPrograms = lazy(() => import('../pages/Classes/AddPrograms'));
const ViewProgramRoster = lazy(() => import('../pages/Classes/ViewProgramRoster'));
const EditProgram = lazy(() => import('../pages/Classes/EditProgram'));
const AddNewRank = lazy(() => import('../pages/Classes/AddNewRank'));
const StudentsInRank = lazy(() => import('../pages/Classes/StudentsInRank'));
const EditRank = lazy(() => import('../pages/Classes/EditRank'));
const AddStudent = lazy(() => import('../pages/Students/AddStudent'));
const ViewStudent = lazy(() => import('../pages/Students/ViewStudent'));
const ViewStudents = lazy(() => import('../pages/Students/ViewStudents'));
const SearchStudents = lazy(() => import('../pages/Students/SearchStudents'));
const StudentPipeline = lazy(() => import('../pages/Students/StudentPipeline'));
const StudentsQuickPay = lazy(() => import('../pages/Students/StudentsQuickPay'));
const Invoice = lazy(() => import('../pages/Students/Invoice'));
const DeleteStudent = lazy(() => import('../pages/Students/DeleteStudent'));
const UpdateContactInfo = lazy(() => import('../pages/Students/UpdateContactInfo'));
const UpdateBilling = lazy(() => import('../pages/Students/UpdateBilling'));
const ViewActivePaymentSchedules = lazy(() => import('../pages/Students/ViewActivePaymentSchedules'));
const UpdateAdditionalInfo = lazy(() => import('../pages/Students/UpdateAdditionalInfo'));
const ViewPaymentHistory = lazy(() => import('../pages/Students/ViewPaymentHistory'));
const ViewEmailHistory = lazy(() => import('../pages/Students/ViewEmailHistory'));
const EmailStudent = lazy(() => import('../pages/Students/EmailStudent'));
const TextStudent = lazy(() => import('../pages/Students/TextStudent'));
const UpdateBarcode = lazy(() => import('../pages/Students/UpdateBarcode'));
const SendWaiver = lazy(() => import('../pages/Students/SendWaiver'));
const EditStudent = lazy(() => import('../pages/Students/EditStudent'));
const EmailList = lazy(() => import('../pages/Students/EmailList'));
const TextList = lazy(() => import('../pages/Students/TextList'));
const AddToEmailList = lazy(() => import('../pages/Students/AddToEmailList'));
const ViewStudentsInPipeline = lazy(() => import('../pages/Students/ViewStudentsInPipeline'));
const EditPipelineStep = lazy(() => import('../pages/Students/EditPipelineStep'));
const AddPipelineStep = lazy(() => import('../pages/Students/AddPipelineStep'));
const AddPaymentSchedule = lazy(() => import('../pages/Students/AddPaymentSchedule'));
const AddABillingAccount = lazy(() => import('../pages/Students/AddABillingAccount'));
const FinishedAddingAccountOptions = lazy(() => import('../pages/Students/FinishedAddingAccountOptions'));



const Methods = lazy(() => import('../pages/Marketing/Methods'));
const FacebookAddCreator = lazy(() => import('../pages/Marketing/FacebookAddCreator'));
const EditMethod = lazy(() => import('../pages/Marketing/EditMethod'));
const AddNewMethod = lazy(() => import('../pages/Marketing/AddNewMethod'));
const DailySchedule = lazy(() => import('../pages/Marketing/DailySchedule'));
const ViewEmails = lazy(() => import('../pages/Marketing/ViewEmails'));
const ViewTextMessages = lazy(() => import('../pages/Marketing/ViewTextMessages'));
const CaptureForms = lazy(() => import('../pages/Marketing/CaptureForms'));
const Waivers = lazy(() => import('../pages/Marketing/Waivers'));
const StudentPortal = lazy(() => import('../pages/Marketing/StudentPortal'));
const ViewNewsLetters = lazy(() => import('../pages/Marketing/ViewNewsLetters'));
const NewsLetterDetails = lazy(() => import('../pages/Marketing/NewsLetterDetails'));
const EmailLists = lazy(() => import('../pages/Marketing/EmailLists'));
const ViewEmailListInfo = lazy(() => import('../pages/Marketing/ViewEmailListInfo'));
const CreateNewsLetter = lazy(() => import('../pages/Marketing/CreateNewsLetter'));
const CreateNewMailingList = lazy(() => import('../pages/Marketing/CreateNewMailingList'));
const CreateCaptureForms = lazy(() => import('../pages/Marketing/CreateCaptureForms'));
const UpdateCaptureForms = lazy(() => import('../pages/Marketing/UpdateCaptureForms'));
const ViewPerformanceState = lazy(() => import('../pages/Marketing/ViewPerformanceState'));
const AddAPerformance = lazy(() => import('../pages/Marketing/AddAPerformance'));
const NumbersInPerformance = lazy(() => import('../pages/Marketing/NumbersInPerformance'));
const StudentsInPerformance = lazy(() => import('../pages/Marketing/StudentsInPerformance'));
const EditNumbersInPerformance = lazy(() => import('../pages/Marketing/EditNumbersInPerformance'));
const AddANumberInPerformance = lazy(() => import('../pages/Marketing/AddANumberInPerformance'));
const EditPerformance = lazy(() => import('../pages/Marketing/EditPerformance'));

const TodoList = lazy(() => import('../pages/Tools/TodoList'));
const Notes = lazy(() => import('../pages/Tools/Notes'));
const PerformancePlanner = lazy(() => import('../pages/Tools/PerformancePlanner'));
const Calendar = lazy(() => import('../pages/Tools/Calendar'));
const Chat = lazy(() => import('../pages/Tools/Chat'));
const Mailbox = lazy(() => import('../pages/Tools/Mailbox'));

const ViewProspects = lazy(() => import('../pages/Prospects/ViewProspects'));
const AddProspect = lazy(() => import('../pages/Prospects/AddProspect'));
const SearchDisplay = lazy(() => import('../pages/SearchDisplay'));
const ProspectPipeline = lazy(() => import('../pages/Prospects/ProspectPipeline'));
const ViewProspectsInPipeline = lazy(() => import('../pages/Prospects/ViewProspectsInPipeline'));
const EditProspectPipelineStep = lazy(() => import('../pages/Prospects/EditProspectPipelineStep'));
const ReorderPipelineSteps = lazy(() => import('../pages/Prospects/ReorderPipelineSteps'));
const AddNewProspectPipelineStep = lazy(() => import('../pages/Prospects/AddNewProspectPipelineStep'));
const EmailPipelineStep = lazy(() => import('../pages/Prospects/EmailPipelineStep'));
const TextPipelineStep = lazy(() => import('../pages/Prospects/TextPipelineStep'));
const AddProspectsToEmailList = lazy(() => import('../pages/Prospects/AddProspectsToEmailList'));
const ActivateAsStudent = lazy(() => import('../pages/Prospects/ActivateAsStudent'));
const ViewProspect = lazy(() => import('../pages/Prospects/ViewProspect'));


const routes = [
    //Authentication
    {
        path: '/auth/signin',
        element: <LoginBoxed />,
        layout: 'blank',
    },
    {
        path: '/',
        element: <HomeMain />,
        layout: 'blank',
    },
    {
        path: '/auth/boxed-signup',
        element: <RegisterBoxed />,
        layout: 'blank',
    },
    //payments
    {
        path: '/payments/search-payments',
        element: <SearchPayments />,
    },
    {
        path: '/payments/quick-pay',
        element: <QuickPay />,
    },
    {
        path: '/payments/late-payment-pipeline',
        element: <LatePaymentPipeline />,
    },
    {
        path: '/payments/view-invoices',
        element: <ViewInvoices />,
    },
    {
        path: '/payments/:id/:suid/billing-accounts',
        element: <ExisitingBillingAccounts />,
    },
    {
        path: '/payments/view-payment-info',
        element: <ViewPaymentInfo />,
    },
    {
        path: '/payments/view-payment-info/print-receipt',
        element: <PrintReciept />,
    },
    {
        path: '/payments/view-payment-info/email-receipt',
        element: <EmailReceipt />,
    },
    {
        path: '/payments/view-payment-info/refund-receipt',
        element: <RefundReciept />,
    },
    {
        path: '/payments/late-payment-pipeline/view-payments',
        element: <ViewPaymentInfo />,
    },
    {
        path: '/payments/late-payment-pipeline/edit-late-pipeline-step',
        element: <EditLatePayementPipelineStep />,
    },
    {
        path: '/payments/late-payment-pipeline/reorder-payment-steps',
        element: <ReorderPaymentSteps />,
    },
    {
        path: '/payments/late-payment-pipeline/add-new-pipeline-step',
        element: <AddNewPipelineStep />,
    },
    {
        path: '/payments/view-invoice/:id/:suid',
        element: <ViewInvoice />,
    },

    //classes
    {
        path: '/classes/view-classes',
        element: <ViewClasses />,
    },
    {
        path: '/classes/view-roster/:classId/:uid',
        element: <ViewRoster />,
    },
    {
        path: '/classes/attendance',
        element: <Attendance />,
    },
    {
        path: '/classes/rooms',
        element: <Rooms />,
    },
    {
        path: '/classes/waiting-lists',
        element: <WaitingLists />,
    },
    {
        path: '/classes/programs',
        element: <Programs />,
    },
    {
        path: '/classes/ranks',
        element: <Ranks />,
    },
    {
        path: '/classes/barcode-attendance',
        element: <BarcodeAttendance />,
    },
    {
        path: '/classes/printable-roll',
        element: <PrintableRoll />,
    },
    {
        path: '/classes/stealth-attendance',
        element: <StealthAttendance />,
    },
    {
        path: '/classes/add-room',
        element: <AddRoom />,
    },
    {
        path: '/classes/edit-room',
        element: <EditRoom />,
    },
    {
        path: '/classes/waiting-list-enrollment',
        element: <WaitingListRoster />,
    },
    {
        path: '/classes/edit-waiting-list',
        element: <EditWaitingList />,
    },
    {
        path: '/classes/add-waiting-list',
        element: <AddWaitingList />,
    },
    {
        path: '/classes/add-program',
        element: <AddPrograms />,
    },
    {
        path: '/classes/view-program-roster',
        element: <ViewProgramRoster />,
    },
    {
        path: '/classes/edit-program',
        element: <EditProgram />,
    },
    {
        path: '/classes/add-new-rank',
        element: <AddNewRank />,
    },
    {
        path: '/classes/students-in-rank',
        element: <StudentsInRank />,
    },
    {
        path: '/classes/edit-rank',
        element: <EditRank />,
    },

    //staff
    {
        path: '/staff/view-staff',
        element: <ViewStaff />,
    },
    {
        path: '/staff/add-staff',
        element: <AddStaff />,
    },
    {
        path: '/staff/view-staff-member',
        element: <ViewStaffMember />,
    },
    {
        path: '/staff/edit-staff-member',
        element: <EditStaffMember />,
    },
    {
        path: '/staff/email-staff-member',
        element: <EmailStaffMember />,
    },
    {
        path: '/staff/text-staff-member',
        element: <SendTextToStaffMember />,
    },
    {
        path: '/staff/email-all-staff',
        element: <EmailAllStaff />,
    },
    {
        path: '/staff/text-all-staff',
        element: <TextAllStaff />,
    },
    {
        path: '/staff/add-to-email-list-all-staff',
        element: <AddToEmailLIst />,
    },
    {
        path: '/staff/search-staff',
        element: <SearchStaff />,
    },

    //students
    {
        path: '/students/view-students',
        element: <ViewStudents />,
    },
    {
        path: '/students/add-student',
        element: <AddStudent />,
    },
    {
        path: '/students/add-billing-account/:id',
        element: <AddABillingAccount />,
    },
    {
        path: '/students/view-student/:uid/:studioid',
        element: <ViewStudent />,
    },
    {
        path: '/students/search-students',
        element: <SearchStudents />,
    },
    {
        path: '/students/:id/finish-billing-setup-options',
        element: <FinishedAddingAccountOptions />,
    },
    {
        path: '/students/student-pipeline',
        element: <StudentPipeline />,
    },
    {
        path: '/students/quick-pay',
        element: <StudentsQuickPay />,
    },
    {
        path: '/students/invoice/:id',
        element: <Invoice />,
    },
    {
        path: '/students/delete-student',
        element: <DeleteStudent />,
    },
    {
        path: '/students/update-contact-info',
        element: <UpdateContactInfo />,
    },
    {
        path: '/students/update-billing',
        element: <UpdateBilling />,
    },
    {
        path: '/students/view-active-payment-schedules',
        element: <ViewActivePaymentSchedules />,
    },
    {
        path: '/students/:id/add-payment-schedules',
        element: <AddPaymentSchedule />,
    },
    {
        path: '/students/update-additional-info',
        element: <UpdateAdditionalInfo />,
    },
    {
        path: '/students/view-payment-history',
        element: <ViewPaymentHistory />,
    },
    {
        path: '/students/vew-student-email-history',
        element: <ViewEmailHistory />,
    },
    {
        path: '/students/email-student',
        element: <EmailStudent />,
    },
    {
        path: '/students/text-student',
        element: <TextStudent />,
    },
    {
        path: '/students/update-barcode',
        element: <UpdateBarcode />,
    },
    {
        path: '/students/send-waiver',
        element: <SendWaiver />,
    },
    {
        path: '/students/edit-student',
        element: <EditStudent />,
    },
    {
        path: '/students/email-list-students',
        element: <EmailList />,
    },
    {
        path: '/students/text-list-all-students',
        element: <TextList />,
    },
    {
        path: '/students/add-to-email-list-all-students',
        element: <AddToEmailList />,
    },
    {
        path: '/students/view-students-in-pipeline/:id/:stud',
        element: <ViewStudentsInPipeline />,
    },
    {
        path: '/students/edit-pipeline-step/:id/:stud',
        element: <EditPipelineStep />,
    },
    {
        path: '/students/add-pipeline-step',
        element: <AddPipelineStep />,
    },

    //prospects

    {
        path: '/prospects/view-prospects',
        element: <ViewProspects />,
    },
    {
        path: '/prospects/add-prospect',
        element: <AddProspect />,
    },
    {
        path: '/prospects/view-prospect',
        element: <ViewProspect />,
    },
    {
        path: '/prospects/prospect-pipeline',
        element: <ProspectPipeline />,
    },
    {
        path: '/prospects/view-prospects-in-pipeline',
        element: <ViewProspectsInPipeline />,
    },
    {
        path: '/prospects/edit-pipeline-step',
        element: <EditProspectPipelineStep />,
    },
    {
        path: '/prospects/reorder-pipeline-steps',
        element: <ReorderPipelineSteps />,
    },
    {
        path: '/prospects/add-new-pipeline-step',
        element: <AddNewProspectPipelineStep />,
    },
    {
        path: '/prospects/email-pipeline-list',
        element: <EmailPipelineStep />,
    },
    {
        path: '/prospects/text-pipeline-list',
        element: <TextPipelineStep />,
    },
    {
        path: '/prospects/add-to-email-list',
        element: <AddProspectsToEmailList />,
    },
    {
        path: '/prospects/activate-as-student',
        element: <ActivateAsStudent />,
    },
    //dashboard
    {
        path: '/dashboard',
        element: <Overview />,
    },
    //facebook
    {
        path: '/facebook-add-creator',
        element: <FacebookAddCreator />,
    },
    //marketing
    {
        path: '/marketing/marketing-methods',
        element: <Methods />,
    },
    {
        path: '/marketing/edit-method',
        element: <EditMethod />,
    },
    {
        path: '/marketing/add-new-method',
        element: <AddNewMethod />,
    },
    {
        path: '/marketing/view-daily-schedule',
        element: <DailySchedule />,
    },
    {
        path: '/marketing/view-emails',
        element: <ViewEmails />,
    },
    {
        path: '/marketing/view-text-messages',
        element: <ViewTextMessages />,
    },
    {
        path: '/marketing/capture-forms',
        element: <CaptureForms />,
    },
    {
        path: '/marketing/waivers',
        element: <Waivers />,
    },
    {
        path: '/marketing/student-portal',
        element: <StudentPortal />,
    },
    {
        path: '/marketing/view-news-letters',
        element: <ViewNewsLetters />,
    },
    {
        path: '/marketing/news-letter-details',
        element: <NewsLetterDetails />,
    },
    {
        path: '/marketing/email-lists',
        element: <EmailLists />,
    },
    {
        path: '/marketing/view-email-list-info',
        element: <ViewEmailListInfo />,
    },
    {
        path: '/marketing/create-news-letter',
        element: <CreateNewsLetter />,
    },
    {
        path: '/marketing/create-new-mailing-list',
        element: <CreateNewMailingList />,
    },
    {
        path: '/marketing/create-capture-form',
        element: <CreateCaptureForms />,
    },
    {
        path: '/marketing/update-capture-form',
        element: <UpdateCaptureForms />,
    },
    {
        path: '/marketing/view-performance-stats',
        element: <ViewPerformanceState />,
    },
    //performances
    {
        path: '/performances/add-a-performance',
        element: <AddAPerformance />,
    },
    {
        path: '/performances/numbers-in-performance',
        element: <NumbersInPerformance />,
    },
    {
        path: '/performances/students-in-performance',
        element: <StudentsInPerformance />,
    },
    {
        path: '/performances/edit-numbers-in-performance',
        element: <EditNumbersInPerformance />,
    },
    {
        path: '/performances/add-number-in-performance',
        element: <AddANumberInPerformance />,
    },
    {
        path: '/performances/edit-performance',
        element: <EditPerformance />,
    },

    //other
    {
        path: '/search',
        element: <SearchDisplay />,
    },
    //tools
    {
        path: '/apps/todolist',
        element: <TodoList />,
    },

    {
        path: '/apps/performance-planner',
        element: <PerformancePlanner />,
    },
    {
        path: '/apps/calendar',
        element: <Calendar />,
    },
    {
        path: '/apps/chat',
        element: <Chat />,
    },
    {
        path: '/apps/mailbox',
        element: <Mailbox />,
    },
    //oldRoutes
    {
        path: '/pay-invoice/:invoiceID',
        element: <PayInvoice />,
        layout: 'blank',
    },

    //errors
    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
