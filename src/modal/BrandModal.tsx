import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { useCreateBrandMutation, useUpdateBrandMutation } from '../redux/apiSlice/brand/brand';
import { Form, Input } from 'antd';
import { BiUpload } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { imgUrl } from '../redux/api/baseApi';

interface AddEditBrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

interface category {
    name: string;
    image: string;
}

const AddEditBrandModal = ({ isOpen, onClose, data }: AddEditBrandModalProps) => {
    const [updateCategory] = useUpdateBrandMutation();
    const [createBrand] = useCreateBrandMutation();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (data && data._id) {
            form.setFieldsValue({
                name: data.brandName,
            });
            setPreviewUrl(data?.logo?.startsWith('http') ? data?.logo : `${imgUrl}${data?.logo}`);
        } else {
            form.setFieldsValue({
                name: '',
                image: '',
            });
        }
    }, [form, data]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onFinish = async (values: category) => {
        const formData = new FormData();
        formData.append('brandName', values.name);

        if (profileImage) {
            formData.append('logo', profileImage);
        }

        try {
            if (data?._id) {
                const res = await updateCategory({ id: data._id, data: formData }).unwrap();

                if (res?.success) {
                    toast.success(res.message || 'Update successful');
                } else {
                    throw new Error(res?.message || 'Update failed');
                }
            } else {
                const res = await createBrand(formData).unwrap();

                if (res?.success) {
                    toast.success(res.message || 'Create successful');
                } else {
                    throw new Error(res?.message || 'Create failed');
                }
            }

            onClose();
        } catch (error: any) {
            toast.error('Error:', error);
            toast.error(error.message || 'Operation failed');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-[#E6F2FF] p-6 rounded-lg shadow-lg w-[500px] h-[550px]">
                <h2 className="text-2xl  mb-4">{data?._id ? 'Edit' : 'Add New Brand'}</h2>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    {/* Fuel */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <span className="text-[20px] font-semibold ">Full Name</span>
                            <Form.Item name="name" rules={[{ required: true }]}>
                                <Input
                                    type="text"
                                    placeholder="Enter your fuel category"
                                    className="w-full h-12 bg-[#fcfdfd] rounded-lg px-4 focus:outline-none border-black mt-3"
                                />
                            </Form.Item>
                        </div>

                        <div>
                            <label htmlFor="carType" className="block text-xl font-medium mb-2">
                                Brand Logo
                            </label>
                            <div className="flex gap-4 mt-6">
                                <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    multiple
                                    accept="image/jpeg,image/png"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <div
                                    className="flex justify-center items-center  cursor-pointer bg-white w-full h-48"
                                    onClick={() => document.getElementById('file')?.click()}
                                >
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="pic"
                                            className="w-full h-56 object-cover object-center"
                                        />
                                    ) : (
                                        <div className="">
                                            <span className="">
                                                <BiUpload size={24} className="ml-8" />
                                            </span>
                                            <span className="text-[#636363]">Upload Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg mt-12">
                        Submit
                    </button>
                </Form>
            </div>
        </Modal>
    );
};

export default AddEditBrandModal;
