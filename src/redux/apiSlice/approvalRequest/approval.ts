import { api } from '../../api/baseApi';

export type ApprovalUser = {
    _id: string;
    name: string;
    email: string;
    role: string;
    location?: string;
    image?: string;
    drivingLicense?: string[];
    yourID?: string[];
    verified: boolean;
    adminApproval: boolean;
    isRejected?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type PaginationMeta = { total: number; limit: number; page: number; totalPage: number };
export type ApprovalUsersResponse = {
    success: boolean;
    statusCode?: number;
    message: string;
    meta: PaginationMeta;
    data: ApprovalUser[];
};
export type ApprovalQueryParams = {
    page: number;
    limit: number;
    searchTerm?: string;
    sort: string;
    fields?: string;
};
export type UpdateApprovalPayload = { adminApproval: boolean; isRejected: boolean };
type UpdateApprovalArgs = { id: string; data: UpdateApprovalPayload };
type UpdateApprovalResponse = {
    success: boolean;
    statusCode?: number;
    message: string;
    data: Pick<ApprovalUser, '_id' | 'adminApproval' | 'isRejected'>;
};

const approval = api.injectEndpoints({
    endpoints: (builder) => ({
        getApproval: builder.query<ApprovalUsersResponse, ApprovalQueryParams>({
            query: (params) => ({ url: '/auth/unapproved-users', method: 'GET', params }),
            providesTags: ['approval'],
        }),
        getRejectedUsers: builder.query<ApprovalUsersResponse, ApprovalQueryParams>({
            query: (params) => ({ url: '/auth/rejected-users', method: 'GET', params }),
            providesTags: ['approval'],
        }),
        updateApproval: builder.mutation<UpdateApprovalResponse, UpdateApprovalArgs>({
            query: ({ id, data }) => ({ url: `/user/user-approval/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: ['approval'],
        }),
    }),
});

export const { useGetApprovalQuery, useGetRejectedUsersQuery, useUpdateApprovalMutation } = approval;
