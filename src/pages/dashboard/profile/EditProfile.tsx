import { useEffect, useState } from 'react';
import { Form, Input, ConfigProvider } from 'antd';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { BiUpload } from 'react-icons/bi';
import Button from '../../../components/shared/Button';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../../redux/apiSlice/profile/profile';
import { imgUrl } from '../../../redux/api/baseApi';
import toast from 'react-hot-toast';
import { RiUpload2Line } from 'react-icons/ri';

interface ProfileData {
    name: string;
    email: string;
    image: string | null;
}

export default function EditProfile() {
    const { data, isError } = useGetProfileQuery(undefined);
    const [updateProfile] = useUpdateProfileMutation();
    const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (data?.data) {
            form.setFieldsValue({
                name: data?.data?.name,
                email: data?.data?.email,
            });
            setPreviewUrl(data?.data?.image?.startsWith('http') ? data?.data?.image : `${imgUrl}${data?.data?.image}`);
        }
    }, [data, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onFinish = async (values: ProfileData) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);

        if (profileImage) {
            formData.append('image', profileImage);
        }

        try {
            const res = await updateProfile(formData);
            if (res?.data?.success) {
                toast.success('Profile updated successfully!');
                form.resetFields();
                navigate('/profile');
            }
        } catch {
            toast.error('Profile updated Failed!');
        }
    };

    if (isError) {
        return <span>Error loading content.</span>;
    }

    return (
        <div className="overflow-hidden">
            <div className="w-[1035px] mx-auto">
                <div className="flex items-center gap-4 font-semibold text-[20px]" onClick={() => navigate(-1)}>
                    <button className="text-xl">
                        <MdOutlineArrowBackIosNew />
                    </button>
                    <button>Edit Profile</button>
                </div>
                <div className="flex justify-between space-x-6 mt-12">
                    <div className="flex gap-4">
                        <input
                            type="file"
                            name="file"
                            id="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <div
                            className="flex justify-center items-center rounded-full cursor-pointer"
                            onClick={() => document.getElementById('file')?.click()}
                        >
                            <span className="ml-28 mt-20 absolute bg-teal-500 p-1 rounded-full">
                                <RiUpload2Line className="text-white" size={20} />
                            </span>
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="pic"
                                    className="w-32 h-32 rounded-full object-contain border"
                                />
                            ) : (
                                <div className="">
                                    <span className="">
                                        <BiUpload size={24} className="ml-10" />
                                    </span>
                                    <span className="text-[#636363]">Upload Image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <div>
                            <span className=" text-[20px] font-semibold ">Full Name</span>
                            <div className="mt-3 ">
                                <Form.Item name="name" rules={[{ required: true }]}>
                                    <Input
                                        className="h-14 bg-[#EBF4FF] hover:bg-[#EBF4FF] focus:bg-[#EBF4FF] rounded-xl border-none"
                                        placeholder="enter your contact number"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div>
                            <span className=" text-[20px] font-semibold ">Email</span>
                            <div className="mt-3 ">
                                <Form.Item name="email" rules={[{ required: true }]}>
                                    <Input
                                        className="h-14 bg-[#EBF4FF] hover:bg-[#EBF4FF] focus:bg-[#EBF4FF] rounded-xl border-none"
                                        placeholder="enter your contact number"
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="mt-6">
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Button: {
                                            defaultHoverBg: '',

                                            defaultHoverBorderColor: '',
                                            defaultActiveBorderColor: '',
                                            defaultHoverColor: '',
                                            defaultActiveColor: '',
                                        },
                                    },
                                }}
                            >
                                <Button
                                    htmlType="submit"
                                    className="w-[30%] flex justify-center items-center text-xl mt-14"
                                >
                                    Save & Change
                                </Button>
                            </ConfigProvider>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
