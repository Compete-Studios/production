import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconBell from '../../components/Icon/IconBell';
import IconCaretDown from '../../components/Icon/IconCaretDown';

const textDataInit = [
    {
        TextId: 1,
        StudioId: 32,
        ToNumber: '1234567890',
        FromNumber: '0987654321',
        Body: 'Hello, this is a test message',
        CreationDate: '2022-01-01',
        SendDate: '2022-01-01',
        Opened: 0,
        TwillioId: '1234567890',
        IsOutgoing: 1,
    },
    {
        TextId: 2,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567891',
        Body: 'Hello, this is a test message',
        CreationDate: '2022-01-01',
        SendDate: '2022-01-01',
        Opened: 0,
        TwillioId: '1234567891',
        IsOutgoing: 0,
    },
    {
        TextId: 3,
        StudioId: 32,
        ToNumber: '1234567892',
        FromNumber: '0987654321',
        Body: 'This is another test message',
        CreationDate: '2022-01-02',
        SendDate: '2022-01-02',
        Opened: 1,
        TwillioId: '1234567892',
        IsOutgoing: 1,
    },
    {
        TextId: 4,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567893',
        Body: 'This is another test message',
        CreationDate: '2022-01-02',
        SendDate: '2022-01-02',
        Opened: 1,
        TwillioId: '1234567893',
        IsOutgoing: 0,
    },
    {
        TextId: 5,
        StudioId: 32,
        ToNumber: '1234567894',
        FromNumber: '0987654321',
        Body: 'Test message with a different date',
        CreationDate: '2022-01-03',
        SendDate: '2022-01-03',
        Opened: 0,
        TwillioId: '1234567894',
        IsOutgoing: 1,
    },
    {
        TextId: 6,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567895',
        Body: 'Test message with a different date',
        CreationDate: '2022-01-03',
        SendDate: '2022-01-03',
        Opened: 0,
        TwillioId: '1234567895',
        IsOutgoing: 0,
    },
    {
        TextId: 7,
        StudioId: 32,
        ToNumber: '1234567896',
        FromNumber: '0987654321',
        Body: 'Another test message',
        CreationDate: '2022-01-04',
        SendDate: '2022-01-04',
        Opened: 1,
        TwillioId: '1234567896',
        IsOutgoing: 1,
    },
    {
        TextId: 8,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567897',
        Body: 'Another test message',
        CreationDate: '2022-01-04',
        SendDate: '2022-01-04',
        Opened: 1,
        TwillioId: '1234567897',
        IsOutgoing: 0,
    },
    {
        TextId: 9,
        StudioId: 32,
        ToNumber: '1234567898',
        FromNumber: '0987654321',
        Body: 'Test message again',
        CreationDate: '2022-01-05',
        SendDate: '2022-01-05',
        Opened: 0,
        TwillioId: '1234567898',
        IsOutgoing: 1,
    },
    {
        TextId: 10,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567899',
        Body: 'Test message again',
        CreationDate: '2022-01-05',
        SendDate: '2022-01-05',
        Opened: 0,
        TwillioId: '1234567899',
        IsOutgoing: 0,
    },
    {
        TextId: 11,
        StudioId: 32,
        ToNumber: '1234567800',
        FromNumber: '0987654321',
        Body: 'Sample message',
        CreationDate: '2022-01-06',
        SendDate: '2022-01-06',
        Opened: 1,
        TwillioId: '1234567800',
        IsOutgoing: 1,
    },
    {
        TextId: 12,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567801',
        Body: 'Sample message',
        CreationDate: '2022-01-06',
        SendDate: '2022-01-06',
        Opened: 1,
        TwillioId: '1234567801',
        IsOutgoing: 0,
    },
    {
        TextId: 13,
        StudioId: 32,
        ToNumber: '1234567802',
        FromNumber: '0987654321',
        Body: 'Message example',
        CreationDate: '2022-01-07',
        SendDate: '2022-01-07',
        Opened: 0,
        TwillioId: '1234567802',
        IsOutgoing: 1,
    },
    {
        TextId: 14,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567803',
        Body: 'Message example',
        CreationDate: '2022-01-07',
        SendDate: '2022-01-07',
        Opened: 0,
        TwillioId: '1234567803',
        IsOutgoing: 0,
    },
    {
        TextId: 15,
        StudioId: 32,
        ToNumber: '1234567804',
        FromNumber: '0987654321',
        Body: 'Test data message',
        CreationDate: '2022-01-08',
        SendDate: '2022-01-08',
        Opened: 1,
        TwillioId: '1234567804',
        IsOutgoing: 1,
    },
    {
        TextId: 16,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567805',
        Body: 'Test data message',
        CreationDate: '2022-01-08',
        SendDate: '2022-01-08',
        Opened: 1,
        TwillioId: '1234567805',
        IsOutgoing: 0,
    },
    {
        TextId: 17,
        StudioId: 32,
        ToNumber: '1234567806',
        FromNumber: '0987654321',
        Body: 'Sample test message',
        CreationDate: '2022-01-09',
        SendDate: '2022-01-09',
        Opened: 0,
        TwillioId: '1234567806',
        IsOutgoing: 1,
    },
    {
        TextId: 18,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567807',
        Body: 'Sample test message',
        CreationDate: '2022-01-09',
        SendDate: '2022-01-09',
        Opened: 0,
        TwillioId: '1234567807',
        IsOutgoing: 0,
    },
    {
        TextId: 19,
        StudioId: 32,
        ToNumber: '1234567808',
        FromNumber: '0987654321',
        Body: 'Another example message',
        CreationDate: '2022-01-10',
        SendDate: '2022-01-10',
        Opened: 1,
        TwillioId: '1234567808',
        IsOutgoing: 1,
    },
    {
        TextId: 20,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567809',
        Body: 'Another example message',
        CreationDate: '2022-01-10',
        SendDate: '2022-01-10',
        Opened: 1,
        TwillioId: '1234567809',
        IsOutgoing: 0,
    },
    {
        TextId: 21,
        StudioId: 32,
        ToNumber: '1234567810',
        FromNumber: '0987654321',
        Body: 'Testing message content',
        CreationDate: '2022-01-11',
        SendDate: '2022-01-11',
        Opened: 0,
        TwillioId: '1234567810',
        IsOutgoing: 1,
    },
    {
        TextId: 22,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567811',
        Body: 'Testing message content',
        CreationDate: '2022-01-11',
        SendDate: '2022-01-11',
        Opened: 0,
        TwillioId: '1234567811',
        IsOutgoing: 0,
    },
    {
        TextId: 23,
        StudioId: 32,
        ToNumber: '1234567812',
        FromNumber: '0987654321',
        Body: 'Test text message',
        CreationDate: '2022-01-12',
        SendDate: '2022-01-12',
        Opened: 1,
        TwillioId: '1234567812',
        IsOutgoing: 1,
    },
    {
        TextId: 24,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567813',
        Body: 'Test text message',
        CreationDate: '2022-01-12',
        SendDate: '2022-01-12',
        Opened: 1,
        TwillioId: '1234567813',
        IsOutgoing: 0,
    },
    {
        TextId: 25,
        StudioId: 32,
        ToNumber: '1234567814',
        FromNumber: '0987654321',
        Body: 'Sample message for testing',
        CreationDate: '2022-01-13',
        SendDate: '2022-01-13',
        Opened: 0,
        TwillioId: '1234567814',
        IsOutgoing: 1,
    },
    {
        TextId: 26,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567815',
        Body: 'Sample message for testing',
        CreationDate: '2022-01-13',
        SendDate: '2022-01-13',
        Opened: 0,
        TwillioId: '1234567815',
        IsOutgoing: 0,
    },
    {
        TextId: 27,
        StudioId: 32,
        ToNumber: '1234567816',
        FromNumber: '0987654321',
        Body: 'Test message number 27',
        CreationDate: '2022-01-14',
        SendDate: '2022-01-14',
        Opened: 1,
        TwillioId: '1234567816',
        IsOutgoing: 1,
    },
    {
        TextId: 28,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567817',
        Body: 'Test message number 28',
        CreationDate: '2022-01-14',
        SendDate: '2022-01-14',
        Opened: 1,
        TwillioId: '1234567817',
        IsOutgoing: 0,
    },
    {
        TextId: 29,
        StudioId: 32,
        ToNumber: '1234567818',
        FromNumber: '0987654321',
        Body: 'Testing outgoing message',
        CreationDate: '2022-01-15',
        SendDate: '2022-01-15',
        Opened: 0,
        TwillioId: '1234567818',
        IsOutgoing: 1,
    },
    {
        TextId: 30,
        StudioId: 32,
        ToNumber: '0987654321',
        FromNumber: '1234567819',
        Body: 'Testing incoming message',
        CreationDate: '2022-01-15',
        SendDate: '2022-01-15',
        Opened: 0,
        TwillioId: '1234567819',
        IsOutgoing: 0,
    },
];

const textMessagesInit = [
  {
      recipients: [
          {
              type: 'student',
              name: 'John Doe',
              phoneNumber: '1234567890',
          },
          {
              type: 'student',
              name: 'Jane Doe',
              phoneNumber: '45454154544',
          },
      ],
      sendDate: '2022-01-01',
      body: 'Hello, this is a test message',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Alice Smith',
              phoneNumber: '2345678901',
          },
      ],
      sendDate: '2022-01-02',
      body: 'Test message for Alice',
      from: '1234567890',
      isOutGoing: false,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Bob Johnson',
              phoneNumber: '3456789012',
          },
          {
              type: 'student',
              name: 'Charlie Brown',
              phoneNumber: '4567890123',
          },
      ],
      sendDate: '2022-01-03',
      body: 'Message to Bob and Charlie',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'David Wilson',
              phoneNumber: '5678901234',
          },
      ],
      sendDate: '2022-01-04',
      body: 'Message to David',
      from: '6789012345',
      isOutGoing: false,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Eve Adams',
              phoneNumber: '6789012345',
          },
          {
              type: 'student',
              name: 'Frank Wright',
              phoneNumber: '7890123456',
          },
          {
              type: 'student',
              name: 'Grace Lee',
              phoneNumber: '8901234567',
          },
      ],
      sendDate: '2022-01-05',
      body: 'Message to Eve, Frank, and Grace',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Hannah Martin',
              phoneNumber: '9012345678',
          },
      ],
      sendDate: '2022-01-06',
      body: 'Message to Hannah',
      from: '2345678901',
      isOutGoing: false,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Ivy Thompson',
              phoneNumber: '1234567890',
          },
          {
              type: 'student',
              name: 'Jack White',
              phoneNumber: '3456789012',
          },
      ],
      sendDate: '2022-01-07',
      body: 'Message to Ivy and Jack',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Karen Green',
              phoneNumber: '5678901234',
          },
      ],
      sendDate: '2022-01-08',
      body: 'Message to Karen',
      from: '6789012345',
      isOutGoing: false,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Leo King',
              phoneNumber: '7890123456',
          },
          {
              type: 'student',
              name: 'Mia Scott',
              phoneNumber: '8901234567',
          },
          {
              type: 'student',
              name: 'Nina Harris',
              phoneNumber: '9012345678',
          },
          {
              type: 'student',
              name: 'Owen Clark',
              phoneNumber: '1234567890',
          },
      ],
      sendDate: '2022-01-09',
      body: 'Message to Leo, Mia, Nina, and Owen',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Paul Young',
              phoneNumber: '2345678901',
          },
      ],
      sendDate: '2022-01-10',
      body: 'Message to Paul',
      from: '3456789012',
      isOutGoing: false,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Quinn Lewis',
              phoneNumber: '4567890123',
          },
          {
              type: 'student',
              name: 'Rachel Walker',
              phoneNumber: '5678901234',
          },
      ],
      sendDate: '2022-01-11',
      body: 'Message to Quinn and Rachel',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Sam Robinson',
              phoneNumber: '6789012345',
          },
      ],
      sendDate: '2022-01-12',
      body: 'Message to Sam',
      from: '7890123456',
      isOutGoing: false,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Tina Hall',
              phoneNumber: '8901234567',
          },
          {
              type: 'student',
              name: 'Ursula Allen',
              phoneNumber: '9012345678',
          },
          {
              type: 'student',
              name: 'Vince Baker',
              phoneNumber: '1234567890',
          },
      ],
      sendDate: '2022-01-13',
      body: 'Message to Tina, Ursula, and Vince',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Wendy Carter',
              phoneNumber: '2345678901',
          },
      ],
      sendDate: '2022-01-14',
      body: 'Message to Wendy',
      from: '3456789012',
      isOutGoing: false,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Xander Foster',
              phoneNumber: '4567890123',
          },
          {
              type: 'student',
              name: 'Yara Diaz',
              phoneNumber: '5678901234',
          },
      ],
      sendDate: '2022-01-15',
      body: 'Message to Xander and Yara',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Zane Murphy',
              phoneNumber: '6789012345',
          },
      ],
      sendDate: '2022-01-16',
      body: 'Message to Zane',
      from: '7890123456',
      isOutGoing: false,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Amy Bell',
              phoneNumber: '8901234567',
          },
          {
              type: 'student',
              name: 'Brian Reed',
              phoneNumber: '9012345678',
          },
          {
              type: 'student',
              name: 'Chloe Fox',
              phoneNumber: '1234567890',
          },
      ],
      sendDate: '2022-01-17',
      body: 'Message to Amy, Brian, and Chloe',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Derek Sanders',
              phoneNumber: '2345678901',
          },
      ],
      sendDate: '2022-01-18',
      body: 'Message to Derek',
      from: '3456789012',
      isOutGoing: false,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Ella Hunter',
              phoneNumber: '4567890123',
          },
          {
              type: 'student',
              name: 'Frank Rivera',
              phoneNumber: '5678901234',
          },
      ],
      sendDate: '2022-01-19',
      body: 'Message to Ella and Frank',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Gina Perez',
              phoneNumber: '6789012345',
          },
      ],
      sendDate: '2022-01-20',
      body: 'Message to Gina',
      from: '7890123456',
      isOutGoing: false,
  },
  {
      recipients: [
          {
              type: 'student',
              name: 'Harry Mitchell',
              phoneNumber: '8901234567',
          },
          {
              type: 'student',
              name: 'Ivy Ross',
              phoneNumber: '9012345678',
          },
          {
              type: 'student',
              name: 'Jackie Peterson',
              phoneNumber: '1234567890',
          },
          {
              type: 'student',
              name: 'Kyle Morgan',
              phoneNumber: '2345678901',
          },
      ],
      sendDate: '2022-01-21',
      body: 'Message to Harry, Ivy, Jackie, and Kyle',
      from: '0987654321',
      isOutGoing: true,
  },
  {
      recipients: [
          {
              type: 'studio',
              name: 'Studio Name',
              phoneNumber: '0987654321',
          },
      ],
      sendDate: '2022-01-22',
      body: 'Studio message example',
      from: '3456789012',
      isOutGoing: false,
  }
];


const ViewTextMessages = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('View Text Messages'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    // show/hide
    const [page, setPage] = useState(1);
    const [textData, setTextData] = useState(textMessagesInit);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
    const [initialRecords, setInitialRecords] = useState(sortBy(textData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const [hideCols, setHideCols] = useState<any>(['age', 'dob', 'isActive']);

    const formatDate = (date: any) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return month + '/' + day + '/' + dt.getFullYear();
        }
        return '';
    };

    const showHideColumns = (col: any, value: any) => {
        if (hideCols.includes(col)) {
            setHideCols((col: any) => hideCols.filter((d: any) => d !== col));
        } else {
            setHideCols([...hideCols, col]);
        }
    };

    const cols = [
        { accessor: 'recipients', title: 'Recipients' },
        { accessor: 'from', title: 'Sender' },
        { accessor: 'body', title: 'Message' },
        { accessor: 'SendsendDateDate', title: 'Send Date' },
    ];

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return textData.filter((item) => {
                return (
                    item.body.toString().includes(search.toLowerCase()) ||
                    item.from.toLowerCase().includes(search.toLowerCase()) ||
                    item.recipients.some((r: any) => r.name.toLowerCase().includes(search.toLowerCase()))
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    return (
        <div>
            {/* <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3">Documentation: </span>
                <a href="https://www.npmjs.com/package/mantine-datatable" target="_blank" className="block hover:underline">
                    https://www.npmjs.com/package/mantine-datatable
                </a>
            </div> */}

            <div className="panel">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Search Message History</h5>
                    <div className="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
                        <div className="flex md:items-center md:flex-row flex-col gap-5">
                            <div className="dropdown">
                                <Dropdown
                                    placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                    btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                                    button={
                                        <>
                                            <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                                            <IconCaretDown className="w-5 h-5" />
                                        </>
                                    }
                                >
                                    <ul className="!min-w-[140px]">
                                        {cols.map((col, i) => {
                                            return (
                                                <li
                                                    key={i}
                                                    className="flex flex-col"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <div className="flex items-center px-4 py-1">
                                                        <label className="cursor-pointer mb-0">
                                                            <input
                                                                type="checkbox"
                                                                checked={!hideCols.includes(col.accessor)}
                                                                className="form-checkbox"
                                                                defaultValue={col.accessor}
                                                                onChange={(event: any) => {
                                                                    setHideCols(event.target.value);
                                                                    showHideColumns(col.accessor, event.target.checked);
                                                                }}
                                                            />
                                                            <span className="ltr:ml-2 rtl:mr-2">{col.title}</span>
                                                        </label>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="text-right">
                            <input type="text" className="form-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'sendDate',
                                title: 'Date Sent',
                                sortable: true,
                                hidden: hideCols.includes('id'),
                                render: ({ sendDate }) => formatDate(sendDate),
                            },
                            {
                                accessor: 'recipients',
                                title: 'Recipients',
                                sortable: true,
                                hidden: hideCols.includes('recipients'),
                                render: ({ recipients }) => (
                                  <>
                                  <p>({recipients?.length})</p>
                                  <div className="flex gap-1 max-w-4 break-words">
                                      {recipients.map((r: any, i: number) => (
                                          <div key={i}>{r.name},</div>
                                      ))}
                                  </div>
      ``                            </>
                                )
                            },
                            {
                                accessor: 'from',
                                title: 'Sender',
                                sortable: true,
                                hidden: hideCols.includes('from'),
                            },
                            { accessor: 'body', title: 'Message', sortable: true, hidden: hideCols.includes('body') },
                            {
                                accessor: 'from',
                                title: 'View Details',
                                titleStyle: { width: '100px' },
                                render: ({ from }) => (
                                    <div className="text-right">
                                        <button className="text-info">View</button>
                                    </div>
                                ),
                            },
                        ]}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default ViewTextMessages;
