import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        // baseUrl: 'http://10.10.26.159:5003/api/v1',
        baseUrl: 'https://api.selerental.com/api/v1',

        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: () => ({}),
    tagTypes: ['user', 'brand', 'profile', 'agency', 'approval', 'notification', 'marketplaceFees'],
});

// export const imgUrl = 'http://10.10.26.159:5003';
export const imgUrl = 'https://api.selerental.com';
