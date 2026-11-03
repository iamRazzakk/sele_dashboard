import { Avatar, Badge, Button, Empty, Image, Input, Pagination, Spin, Table, Tabs, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { GrCircleInformation } from 'react-icons/gr';
import { IoClose } from 'react-icons/io5';
import Swal from 'sweetalert2';
import { imgUrl } from '../../../redux/api/baseApi';
import {
    ApprovalUser,
    useGetApprovalQuery,
    useGetRejectedUsersQuery,
    useUpdateApprovalMutation,
} from '../../../redux/apiSlice/approvalRequest/approval';
import ApprovalDetails from './ApprovalDetails';

type TabKey = 'pending' | 'rejected';
type ActionType = 'approve' | 'reject';
type ActionState = { userId: string; type: ActionType } | null;
type ApiError = {
    status?: number;
    data?: { message?: string; errorMessages?: Array<{ message?: string }> };
    message?: string;
};

const PAGE_SIZE = 10;
const SORT = '-createdAt';

const resolveUrl = (value?: string) => {
    if (!value) return '';
    return /^https?:\/\//i.test(value) ? value : `${imgUrl}${value.startsWith('/') ? '' : '/'}${value}`;
};

const isImageFile = (url: string) => {
    const cleanUrl = url.split('?')[0].toLowerCase();
    return !cleanUrl.includes('.') || /\.(avif|gif|jpe?g|png|svg|webp)$/.test(cleanUrl);
};

function DocumentThumbnails({ files = [], label }: { files?: string[]; label: string }) {
    if (files.length === 0) return <span className="text-xs text-gray-400">No image found</span>;

    return (
        <Image.PreviewGroup>
            <div className="flex max-w-36 flex-wrap justify-center gap-1">
                {files.map((file, index) => {
                    const url = resolveUrl(file);
                    return isImageFile(url) ? (
                        <TablePreviewImage key={`${file}-${index}`} url={url} label={`${label} ${index + 1}`} />
                    ) : (
                        <a
                            key={`${file}-${index}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-[42px] w-[42px] items-center justify-center rounded border bg-gray-50 text-[10px] text-blue-600"
                            title={`Open ${label} ${index + 1}`}
                        >
                            File
                        </a>
                    );
                })}
            </div>
        </Image.PreviewGroup>
    );
}

function TablePreviewImage({ url, label }: { url: string; label: string }) {
    const [hasError, setHasError] = useState(false);

    if (!url || hasError) {
        return (
            <span className="flex h-[42px] w-[64px] items-center justify-center rounded border text-center text-[9px] text-gray-400">
                No image found
            </span>
        );
    }

    return (
        <Image
            src={url}
            alt={label}
            width={42}
            height={42}
            className="rounded border object-cover"
            onError={() => setHasError(true)}
        />
    );
}

function UserAvatar({ image, name, size = 40 }: { image?: string; name: string; size?: number }) {
    const [hasError, setHasError] = useState(false);
    const url = resolveUrl(image);

    if (!url || hasError) {
        return (
            <span
                className="flex shrink-0 items-center justify-center rounded-full border text-center text-[8px] leading-tight text-gray-400"
                style={{ width: size, height: size }}
            >
                No image found
            </span>
        );
    }

    return <Avatar size={size} src={url} alt={name} onError={() => { setHasError(true); return false; }} />;
}

const getErrorMessage = (error: unknown) => {
    if (typeof error !== 'object' || error === null) return 'Unable to update this user. Please try again.';
    const apiError = error as ApiError;
    return (
        apiError.data?.message ||
        apiError.data?.errorMessages?.[0]?.message ||
        apiError.message ||
        'Unable to update this user. Please try again.'
    );
};

function useDebouncedValue(value: string, delay = 400) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timeout = window.setTimeout(() => setDebouncedValue(value.trim()), delay);
        return () => window.clearTimeout(timeout);
    }, [delay, value]);
    return debouncedValue;
}

export default function RequestApproval() {
    const [activeTab, setActiveTab] = useState<TabKey>('pending');
    const [pendingPage, setPendingPage] = useState(1);
    const [rejectedPage, setRejectedPage] = useState(1);
    const [search, setSearch] = useState('');
    const [details, setDetails] = useState<ApprovalUser | null>(null);
    const [actionState, setActionState] = useState<ActionState>(null);
    const debouncedSearch = useDebouncedValue(search);

    const queryBase = useMemo(
        () => ({ limit: PAGE_SIZE, searchTerm: debouncedSearch || undefined, sort: SORT }),
        [debouncedSearch],
    );
    const pendingQuery = useGetApprovalQuery({ ...queryBase, page: pendingPage });
    const rejectedQuery = useGetRejectedUsersQuery({ ...queryBase, page: rejectedPage });
    const [updateApproval] = useUpdateApprovalMutation();

    useEffect(() => {
        setPendingPage(1);
        setRejectedPage(1);
    }, [debouncedSearch]);

    const activeQuery = activeTab === 'pending' ? pendingQuery : rejectedQuery;
    const activePage = activeTab === 'pending' ? pendingPage : rejectedPage;
    const setActivePage = activeTab === 'pending' ? setPendingPage : setRejectedPage;
    const users = activeQuery.data?.data ?? [];

    const runAction = async (user: ApprovalUser, type: ActionType) => {
        if (actionState) return;
        const approving = type === 'approve';
        const confirmation = await Swal.fire({
            title: approving ? 'Approve this user?' : 'Reject this user?',
            text: approving
                ? 'This user will be allowed to access the application.'
                : 'This user will be moved to the rejected users list and will not be able to log in.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: approving ? 'Approve User' : 'Reject User',
            cancelButtonText: 'Cancel',
            confirmButtonColor: approving ? '#1677ff' : '#d33',
            reverseButtons: true,
        });
        if (!confirmation.isConfirmed) return;

        setActionState({ userId: user._id, type });
        try {
            const response = await updateApproval({
                id: user._id,
                data: approving
                    ? { adminApproval: true, isRejected: false }
                    : { adminApproval: false, isRejected: true },
            }).unwrap();
            toast.success(response.message || (approving ? 'User approved successfully' : 'User rejected successfully'));
            setDetails(null);
            if (users.length === 1 && activePage > 1) setActivePage(activePage - 1);
        } catch (error) {
            toast.error(getErrorMessage(error));
            await Promise.all([pendingQuery.refetch(), rejectedQuery.refetch()]);
        } finally {
            setActionState(null);
        }
    };

    const columns: ColumnsType<ApprovalUser> = [
        {
            title: 'User',
            key: 'user',
            render: (_, user) => (
                <div className="flex min-w-48 items-center gap-3">
                    <UserAvatar image={user.image} name={user.name} />
                    <div><p className="font-medium">{user.name || 'N/A'}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                </div>
            ),
        },
        { title: 'Location', dataIndex: 'location', key: 'location', render: (value?: string) => value || 'N/A' },
        {
            title: 'Registered',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value?: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, user) => activeTab === 'rejected'
                ? <Tag color="error">Rejected</Tag>
                : <Tag color={user.verified ? 'success' : 'warning'}>{user.verified ? 'Email verified' : 'Unverified'}</Tag>,
        },
        {
            title: 'Driving Licence',
            key: 'drivingLicense',
            align: 'center',
            render: (_, user) => <DocumentThumbnails files={user.drivingLicense} label="Driving licence" />,
        },
        {
            title: 'Identity Document',
            key: 'yourID',
            align: 'center',
            render: (_, user) => <DocumentThumbnails files={user.yourID} label="Identity document" />,
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            render: (_, user) => {
                const rowAction = actionState?.userId === user._id ? actionState.type : undefined;
                return (
                    <div className="flex items-center gap-2">
                        <Button aria-label={`View ${user.name}`} icon={<GrCircleInformation />} onClick={() => setDetails(user)} />
                        {activeTab === 'pending' && (
                            <Button danger disabled={Boolean(rowAction)} loading={rowAction === 'reject'} onClick={() => void runAction(user, 'reject')}>Reject</Button>
                        )}
                        <Button type="primary" disabled={Boolean(rowAction)} loading={rowAction === 'approve'} onClick={() => void runAction(user, 'approve')}>Approve</Button>
                    </div>
                );
            },
        },
    ];

    const tabItems = [
        { key: 'pending', label: <span>Pending Approval <Badge count={pendingQuery.data?.meta.total ?? 0} showZero /></span> },
        { key: 'rejected', label: <span>Rejected Users <Badge count={rejectedQuery.data?.meta.total ?? 0} showZero /></span> },
    ];

    return (
        <div className="h-full overflow-y-auto pb-8">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div><h1 className="text-2xl font-semibold">User Approvals</h1><p className="text-sm text-gray-500">Review pending and rejected user accounts.</p></div>
                <Input
                    allowClear
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name or email"
                    suffix={search ? <IoClose className="cursor-pointer" onClick={() => setSearch('')} /> : null}
                    className="w-full sm:max-w-80"
                />
            </div>
            <Tabs activeKey={activeTab} items={tabItems} onChange={(key) => setActiveTab(key as TabKey)} />

            {activeQuery.isError ? (
                <div className="py-16 text-center"><p className="mb-4 text-red-600">{getErrorMessage(activeQuery.error)}</p><Button onClick={() => void activeQuery.refetch()}>Retry</Button></div>
            ) : activeQuery.isLoading || activeQuery.isFetching ? (
                <div className="flex justify-center py-20"><Spin size="large" /><span className="ml-3">Loading users...</span></div>
            ) : users.length === 0 ? (
                <Empty description={debouncedSearch ? 'No users match your search.' : activeTab === 'pending' ? 'No users are waiting for approval.' : 'No rejected users.'} />
            ) : (
                <>
                    <div className="hidden overflow-x-auto md:block">
                        <Table columns={columns} dataSource={users} rowKey="_id" pagination={false} scroll={{ x: 1200 }} />
                    </div>
                    <div className="space-y-4 md:hidden">
                        {users.map((user) => {
                            const rowAction = actionState?.userId === user._id ? actionState.type : undefined;
                            return (
                                <article key={user._id} className="rounded-xl border bg-white p-4 shadow-sm">
                                    <div className="mb-3 flex items-center gap-3"><UserAvatar image={user.image} name={user.name} size={48} /><div><h2 className="font-semibold">{user.name}</h2><p className="break-all text-sm text-gray-500">{user.email}</p></div></div>
                                    <p className="text-sm"><strong>Location:</strong> {user.location || 'N/A'}</p>
                                    <p className="mt-1 text-sm"><strong>Registered:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Button onClick={() => setDetails(user)}>View details</Button>
                                        {activeTab === 'pending' && <Button danger disabled={Boolean(rowAction)} loading={rowAction === 'reject'} onClick={() => void runAction(user, 'reject')}>Reject</Button>}
                                        <Button type="primary" disabled={Boolean(rowAction)} loading={rowAction === 'approve'} onClick={() => void runAction(user, 'approve')}>Approve</Button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                    <div className="mt-6 flex justify-center">
                        <Pagination current={activeQuery.data?.meta.page ?? activePage} pageSize={activeQuery.data?.meta.limit ?? PAGE_SIZE} total={activeQuery.data?.meta.total ?? 0} showSizeChanger={false} onChange={setActivePage} />
                    </div>
                </>
            )}

            {details && (
                <ApprovalDetails
                    data={details}
                    isOpen
                    onClose={() => setDetails(null)}
                    isRejectedTab={activeTab === 'rejected'}
                    action={actionState?.userId === details._id ? actionState.type : undefined}
                    onApprove={(user) => void runAction(user, 'approve')}
                    onReject={(user) => void runAction(user, 'reject')}
                />
            )}
        </div>
    );
}
