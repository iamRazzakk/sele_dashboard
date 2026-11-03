import { Button, Image } from 'antd';
import { useState } from 'react';
import Modal from '../../../modal/Modal';
import { imgUrl } from '../../../redux/api/baseApi';
import { ApprovalUser } from '../../../redux/apiSlice/approvalRequest/approval';

interface ApprovalDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    data: ApprovalUser;
    isRejectedTab: boolean;
    action?: 'approve' | 'reject';
    onApprove: (user: ApprovalUser) => void;
    onReject: (user: ApprovalUser) => void;
}

const resolveUrl = (value?: string) => {
    if (!value) return '';
    return /^https?:\/\//i.test(value) ? value : `${imgUrl}${value.startsWith('/') ? '' : '/'}${value}`;
};

const isImageFile = (url: string) => {
    const cleanUrl = url.split('?')[0].toLowerCase();
    return !cleanUrl.includes('.') || /\.(avif|gif|jpe?g|png|svg|webp)$/.test(cleanUrl);
};

function PreviewImage({ src, alt, profile = false }: { src: string; alt: string; profile?: boolean }) {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div
                className={`flex items-center justify-center rounded border bg-white text-center text-xs text-gray-400 ${profile ? 'h-32 w-32 rounded-full' : 'h-36 w-full'}`}
            >
                No image found
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={profile ? 128 : undefined}
            height={profile ? 128 : undefined}
            className={profile ? 'rounded-full object-cover' : 'h-36 rounded border object-cover'}
            onError={() => setHasError(true)}
        />
    );
}

function Documents({ label, files = [] }: { label: string; files?: string[] }) {
    return (
        <section className="mt-5">
            <h3 className="mb-2 font-semibold">{label}</h3>
            {files.length === 0 ? (
                <p className="text-sm text-gray-500">No documents provided</p>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {files.map((file, index) => {
                        const url = resolveUrl(file);
                        return isImageFile(url) ? (
                            <PreviewImage
                                key={`${file}-${index}`}
                                src={url}
                                alt={`${label} ${index + 1}`}
                            />
                        ) : (
                            <a
                                key={`${file}-${index}`}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-20 items-center justify-center rounded border bg-white font-medium text-blue-600"
                            >
                                Open document {index + 1}
                            </a>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default function ApprovalDetails({
    isOpen,
    onClose,
    data,
    isRejectedTab,
    action,
    onApprove,
    onReject,
}: ApprovalDetailsProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="max-h-[90vh] w-[min(92vw,720px)] overflow-y-auto rounded-lg bg-[#E6F2FF] p-5 sm:p-7">
                <h2 className="mb-5 text-2xl font-semibold">User Details</h2>
                <section className="flex flex-col gap-5 sm:flex-row">
                    <PreviewImage
                        src={resolveUrl(data.image)}
                        alt={data.name || 'User'}
                        profile
                    />
                    <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm sm:text-base">
                        <dt className="font-semibold">Name:</dt><dd>{data.name || 'N/A'}</dd>
                        <dt className="font-semibold">Email:</dt><dd className="break-all">{data.email || 'N/A'}</dd>
                        <dt className="font-semibold">Location:</dt><dd>{data.location || 'N/A'}</dd>
                        <dt className="font-semibold">Registered:</dt>
                        <dd>{data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}</dd>
                        <dt className="font-semibold">Email verified:</dt><dd>{data.verified ? 'Yes' : 'No'}</dd>
                    </dl>
                </section>
                <Documents label="Driving licence" files={data.drivingLicense} />
                <Documents label="Identity documents" files={data.yourID} />
                <div className="mt-7 flex flex-wrap justify-end gap-3">
                    {!isRejectedTab && (
                        <Button danger disabled={Boolean(action)} loading={action === 'reject'} onClick={() => onReject(data)}>
                            Reject User
                        </Button>
                    )}
                    <Button type="primary" disabled={Boolean(action)} loading={action === 'approve'} onClick={() => onApprove(data)}>
                        Approve User
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
