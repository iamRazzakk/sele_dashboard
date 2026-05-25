import { ConfigProvider, Table } from 'antd';
import { useState } from 'react';
import { useGetApprovalQuery } from '../../../redux/apiSlice/approvalRequest/approval';

import { GrCircleInformation } from 'react-icons/gr';
import ApprovalDetails from './ApprovalDetails';
import { imgUrl } from '../../../redux/api/baseApi';

export default function RequestApproval() {
    const { data } = useGetApprovalQuery(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    const [details, setDetails] = useState<any | null>(null);

    console.log('approval data', data);

    return (
        <>
            <div className="rounded-lg mt-2 ">
                <ConfigProvider>
                    <Table
                        bordered={false}
                        dataSource={data?.data}
                        pagination={{
                            pageSize,
                            onChange: (page) => setCurrentPage(page),
                            position: ['bottomCenter'],
                        }}
                        className="cursor-pointer font-outfit"
                        rowKey={(record) => record?.id || record?.id || Math.random().toString()}
                    >
                        <Table.Column
                            title={<div className="">Serial ID</div>}
                            render={(_, __, index) => (
                                <p className="ml-7">{(currentPage - 1) * pageSize + index + 1}</p>
                            )}
                        />
                        <Table.Column
                            title={<span className="text-white text-center block">User Name</span>}
                            dataIndex="name"
                            key="username"
                            className="text-center"
                        />

                        <Table.Column
                            title={<span className="text-white text-center block">Email</span>}
                            dataIndex="email"
                            className="text-center"
                        />

                        <Table.Column
                            title={<span className="text-white text-center block">Driving License</span>}
                            dataIndex="drivingLicense"
                            key="license"
                            className="text-center"
                            render={(_, record) => {
                                console.log('record', record);

                                return (
                                    <div className="flex items-center justify-center font-semibold ">
                                        {record?.drivingLicense[0] ? (
                                            <img
                                                src={
                                                    record?.drivingLicense[0]?.startsWith('http')
                                                        ? `${record?.drivingLicense[0]}`
                                                        : `${imgUrl}${record?.drivingLicense[0]}`
                                                }
                                                alt={record.name}
                                                className="w-16 h-14 object-cover"
                                            />
                                        ) : (
                                            <p>No Image</p>
                                        )}
                                    </div>
                                );
                            }}
                        />

                        <Table.Column
                            title={<span className="text-white text-center block">Status</span>}
                            dataIndex="status"
                            key="status"
                            className="text-center"
                            render={(_, record) => (
                                <div className="flex items-center justify-center font-semibold">
                                    <span className="text-nowrap bg-[#F17600] rounded-2xl text-white py-1 px-3">
                                        {record?.adminApproval === true && record?.isReject === true
                                            ? 'Pending'
                                            : record?.isReject === true
                                              ? 'Rejected'
                                              : record?.adminApproval === true
                                                ? 'Approved'
                                                : 'Pending'}
                                    </span>
                                </div>
                            )}
                        />

                        <Table.Column
                            title={<div className="">Action</div>}
                            dataIndex="action"
                            key="action"
                            align="center"
                            render={(_, record) => (
                                <div className="flex py-2 items-center justify-center">
                                    <GrCircleInformation size={22} onClick={() => setDetails(record)} />
                                </div>
                            )}
                        />
                    </Table>
                </ConfigProvider>
            </div>

            {/*  */}

            {/* user modal */}
            {details && (
                // @ts-ignore
                <ApprovalDetails data={details} isOpen={!!details} onClose={() => setDetails(null)} />
            )}
        </>
    );
}
