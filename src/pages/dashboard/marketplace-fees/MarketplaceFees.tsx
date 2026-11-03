import { Button, Form, InputNumber } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../../../components/shared/Loading';
import {
    MarketplaceFees as MarketplaceFeesPayload,
    useGetMarketplaceFeesQuery,
    useUpdateMarketplaceFeesMutation,
} from '../../../redux/apiSlice/marketplaceFees';

interface FeeFormValues {
    guestFeePercentage: number;
    hostFeePercentage: number;
}

interface ApiError {
    data?: { message?: string };
    message?: string;
}

const decimalToPercentage = (value: number) => Number((value * 100).toFixed(10));
const percentageToDecimal = (value: number) => Number((value / 100).toFixed(10));

const getErrorMessage = (error: unknown, fallback = 'Unable to update marketplace fees.') => {
    if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        return apiError.data?.message || apiError.message || fallback;
    }
    return fallback;
};

export default function MarketplaceFees() {
    const [form] = Form.useForm<FeeFormValues>();
    const [savedValues, setSavedValues] = useState<FeeFormValues | null>(null);
    const { data, error: fetchError, isLoading, isFetching, isError, refetch } = useGetMarketplaceFeesQuery();
    const [updateMarketplaceFees, { isLoading: isSubmitting }] = useUpdateMarketplaceFeesMutation();
    const values = Form.useWatch([], form);

    useEffect(() => {
        if (!data?.data) return;

        const nextValues = {
            guestFeePercentage: decimalToPercentage(data.data.guest_fee_percentage),
            hostFeePercentage: decimalToPercentage(data.data.host_fee_percentage),
        };
        form.setFieldsValue(nextValues);
        setSavedValues(nextValues);
    }, [data, form]);

    const hasChanges = useMemo(() => {
        if (!savedValues || !values) return false;
        return (
            values.guestFeePercentage !== savedValues.guestFeePercentage ||
            values.hostFeePercentage !== savedValues.hostFeePercentage
        );
    }, [savedValues, values]);

    const preview = useMemo(() => {
        const guestFee = Number(values?.guestFeePercentage);
        const hostFee = Number(values?.hostFeePercentage);
        const validGuestFee = Number.isFinite(guestFee) && guestFee >= 0 && guestFee <= 100 ? guestFee : 0;
        const validHostFee = Number.isFinite(hostFee) && hostFee >= 0 && hostFee <= 100 ? hostFee : 0;

        return {
            guestPays: 100 + validGuestFee,
            hostReceives: 100 - validHostFee,
            platformFees: validGuestFee + validHostFee,
        };
    }, [values]);

    const onFinish = async (formValues: FeeFormValues) => {
        if (!hasChanges) return;

        const payload: MarketplaceFeesPayload = {
            guest_fee_percentage: percentageToDecimal(formValues.guestFeePercentage),
            host_fee_percentage: percentageToDecimal(formValues.hostFeePercentage),
        };

        try {
            const response = await updateMarketplaceFees(payload).unwrap();
            const updatedValues = {
                guestFeePercentage: decimalToPercentage(response.data.guest_fee_percentage),
                hostFeePercentage: decimalToPercentage(response.data.host_fee_percentage),
            };
            form.setFieldsValue(updatedValues);
            setSavedValues(updatedValues);
            toast.success(response.message || 'Marketplace fees updated successfully');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    if (isLoading || (isFetching && !data)) return <Loading />;

    if (isError || !data?.data) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="rounded-xl bg-[#EBF4FF] p-8 text-center">
                    <p className="mb-4 text-lg font-medium">
                        {getErrorMessage(fetchError, 'Unable to load marketplace fees.')}
                    </p>
                    <Button type="primary" onClick={() => void refetch()} loading={isFetching}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto pb-10">
            <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-[#333333]">Marketplace Fees</h1>
                <p className="mt-2 text-sm leading-6 text-[#757575]">
                    Guest Platform Fee is added to the renter’s vehicle subtotal. Host Commission Fee is deducted from
                    the host’s vehicle subtotal.
                </p>

                <Form form={form} layout="vertical" onFinish={onFinish} className="mt-8">
                    <div className="grid gap-5 md:grid-cols-2">
                        <Form.Item
                            label="Guest Platform Fee (%)"
                            name="guestFeePercentage"
                            rules={[
                                { required: true, message: 'Guest Platform Fee is required.' },
                                { type: 'number', min: 0, max: 100, message: 'Enter a value from 0 to 100.' },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                max={100}
                                step={0.1}
                                precision={4}
                                className="w-full"
                                size="large"
                                placeholder="0"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Host Commission Fee (%)"
                            name="hostFeePercentage"
                            rules={[
                                { required: true, message: 'Host Commission Fee is required.' },
                                { type: 'number', min: 0, max: 100, message: 'Enter a value from 0 to 100.' },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                max={100}
                                step={0.1}
                                precision={4}
                                className="w-full"
                                size="large"
                                placeholder="0"
                            />
                        </Form.Item>
                    </div>

                    <div className="mb-7 rounded-xl bg-[#EBF4FF] p-5">
                        <h2 className="mb-3 font-semibold text-[#333333]">Preview for a $100 vehicle subtotal</h2>
                        <div className="space-y-2 text-sm text-[#555555]">
                            <div className="flex justify-between gap-4">
                                <span>Guest pays before insurance</span>
                                <strong>${preview.guestPays.toFixed(2)}</strong>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span>Host receives</span>
                                <strong>${preview.hostReceives.toFixed(2)}</strong>
                            </div>
                            <div className="flex justify-between gap-4 border-t border-blue-200 pt-2">
                                <span>Platform fees</span>
                                <strong>${preview.platformFees.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={isSubmitting}
                        disabled={isSubmitting || !hasChanges}
                    >
                        Save Changes
                    </Button>
                </Form>
            </div>
        </div>
    );
}
