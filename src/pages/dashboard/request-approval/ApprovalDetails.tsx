import React from 'react';
import Modal from '../../../modal/Modal';
import {
    useUnApprovalUpdateMutation,
    useUpdateApprovalMutation,
} from '../../../redux/apiSlice/approvalRequest/approval';
import toast from 'react-hot-toast';
import { imgUrl } from '../../../redux/api/baseApi';
import Swal from 'sweetalert2';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        _id: string;
        image: string;
        name: string;
        email: string;
        location: string;
        createdAt: string;
        drivingLicense: string | string[];
        yourID: string | string[];
    };
}

const ApprovalDetails: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, data }) => {
    const [updateApproval] = useUpdateApprovalMutation();
    const [unApprovalUpdate] = useUpdateApprovalMutation();
    // Check if data is available to avoid rendering issues
    if (!data) {
        return null; // Or show a fallback message
    }

    const agencyDetails = [
        { label: 'User name', value: data?.name },
        { label: 'Email', value: data?.email },
        { label: 'Address', value: data?.location },
        { label: 'Joining Date', value: data?.createdAt?.slice(0, 10) },
    ];

    const handleApprove = async (id: string) => {
        const data = {
            adminApproval: true,
            isRejected: false,
        };
        try {
            const res = await updateApproval({ id, data }).unwrap();
            if (res?.message) {
                toast.success(res.message);
            } else {
                toast.error(res.message || 'user not approved');
            }
        } catch (err: any) {
            toast.error(err?.message || 'An error occurred while approving the user.');
        }
    };

    // handle delete
    const handleUnApproval = (id: string) => {
        const data = {
            adminApproval: false,
            isRejected: true,
        };

        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to reject this user!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Reject it',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await unApprovalUpdate({
                        id,
                        data,
                    }).unwrap();

                    toast.success(res?.message || 'User rejected');
                } catch (err: any) {
                    toast.error(err?.message || 'Reject failed');
                }
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-[#E6F2FF] p-5 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">User Details</h2>
                <div className="space-y-2 mt-6">
                    <section className="flex gap-6 mb-4 ">
                        <div className="border rounded">
                            {/* <span>User Image :</span> */}
                            <img
                                src={data?.image}
                                alt={data?.name}
                                className="w-40 object-cover h-40 rounded-full mt-4"
                            />
                        </div>

                        <div className="space-y-2 mt-">
                            {agencyDetails?.map((detail, index) => (
                                <div key={index} className="flex gap-5">
                                    <strong>{detail.label} : </strong>
                                    <p className="text-start">{detail.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="">
                        <span className="">Driving License:</span>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            {Array.isArray(data?.drivingLicense) && data?.drivingLicense.length > 0
                                ? data?.drivingLicense?.map((item: any, index: number) => {
                                      const imageUrl = item.startsWith('https') ? item : `${imgUrl}${item}`;
                                      return (
                                          <a key={index} href={imageUrl} target="_blank" rel="noopener noreferrer">
                                              <img
                                                  src={imageUrl}
                                                  alt={`Driving License ${index + 1}`}
                                                  className="border rounded w-full h-40 object-cover"
                                              />
                                          </a>
                                      );
                                  })
                                : 'No License'}
                        </div>
                    </section>

                    <section className="pt-4">
                        <span className="my-2">ID Card:</span>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            {Array.isArray(data?.yourID) && data?.yourID.length > 0
                                ? data.yourID?.map((item: any, index: number) => {
                                      const imageUrl = item.startsWith('https') ? item : `${imgUrl}${item}`;
                                      return (
                                          <a key={index} href={imageUrl} target="_blank" rel="noopener noreferrer">
                                              <img
                                                  key={index}
                                                  src={imageUrl}
                                                  alt={`Driving License ${index + 1}`}
                                                  className="border rounded w-full h-40 object-cover mt-1"
                                              />
                                          </a>
                                      );
                                  })
                                : 'No License'}
                        </div>
                    </section>
                </div>

                <div className="flex justify-end gap-6 mt-8">
                    <button
                        className=" text-white py-2 px-4 bg-red-600 p-2 rounded-md w-32"
                        onClick={() => handleUnApproval(data?._id)}
                    >
                        Reject
                    </button>
                    <button
                        className=" text-white py-2 px-4 bg-primary p-2 rounded-md w-32"
                        onClick={() => handleApprove(data?._id)}
                    >
                        Approved
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ApprovalDetails;
