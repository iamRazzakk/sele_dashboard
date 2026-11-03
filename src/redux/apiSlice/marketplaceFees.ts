import { api } from '../api/baseApi';

export interface MarketplaceFees {
    guest_fee_percentage: number;
    host_fee_percentage: number;
}

interface MarketplaceFeesRecord extends MarketplaceFees {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

interface MarketplaceFeesResponse {
    success: boolean;
    message: string;
    data: MarketplaceFeesRecord;
}

const marketplaceFees = api.injectEndpoints({
    endpoints: (builder) => ({
        getMarketplaceFees: builder.query<MarketplaceFeesResponse, void>({
            query: () => ({
                url: '/marketplace-fees',
                method: 'GET',
            }),
            providesTags: ['marketplaceFees'],
        }),
        updateMarketplaceFees: builder.mutation<MarketplaceFeesResponse, MarketplaceFees>({
            query: (data) => ({
                url: '/marketplace-fees',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['marketplaceFees'],
        }),
    }),
});

export const { useGetMarketplaceFeesQuery, useUpdateMarketplaceFeesMutation } = marketplaceFees;
