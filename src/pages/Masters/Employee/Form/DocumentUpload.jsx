import React, { useState } from 'react';
import { FiTrash2, FiUploadCloud, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../../../store/themeStore';
import PDFPreviewModal from '../../../../components/Modals/PDFPreviewModal';

const DocumentUpload = ({ formData, setFormData, onNext, onPrevious }) => {
    const theme = useThemeStore((state) => state.theme);
    const [files, setFiles] = useState({
        profilePhoto: null,
        aadhaarCard: null,
        panCard: null,
        passbook: null
    });
    const [dragOver, setDragOver] = useState(null);
    const [selectedPDF, setSelectedPDF] = useState(null);
    const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type based on document type
            if (fileType === 'profilePhoto') {
                if (!file.type.startsWith('image/')) {
                    alert('Please upload only image files for profile photo');
                    return;
                }
            } else {
                // For Aadhaar, PAN, and Passbook
                const isImage = file.type.startsWith('image/');
                const isPDF = file.type === 'application/pdf';
                
                if (!isImage && !isPDF) {
                    alert('Please upload only images or PDF files');
                    return;
                }
            }

            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }

            setFiles(prevFiles => ({
                ...prevFiles,
                [fileType]: file
            }));
        }
    };

    const handleDrop = (e, fileType) => {
        e.preventDefault();
        setDragOver(null);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setFiles((prevFiles) => ({
                ...prevFiles,
                [fileType]: file,
            }));
        }
    };

    const handleRemoveFile = (fileType) => {
        setFiles((prevFiles) => ({
            ...prevFiles,
            [fileType]: null,
        }));
    };

    const renderUploadZone = (fileType, label, description, isRequired) => {
        const file = files[fileType];
        const isDraggedOver = dragOver === fileType;

        return (
            <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                theme === 'light'
                    ? 'bg-white shadow-sm hover:shadow-md'
                    : 'bg-gray-800 shadow-none'
                } ${
                isDraggedOver
                    ? theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-purple-500 bg-purple-900/20'
                    : file
                        ? theme === 'light' ? 'border-blue-500/50' : 'border-green-500/50'
                        : 'border-dashed border-gray-300 dark:border-gray-600'
                }`}>
                <div className="flex gap-6">
                    {/* Upload Zone */}
                    <div className="flex-1">
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(fileType);
                            }}
                            onDragLeave={() => setDragOver(null)}
                            onDrop={(e) => handleDrop(e, fileType)}
                            className="relative"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, fileType)}
                                className="hidden"
                                id={fileType}
                            />
                            <label
                                htmlFor={fileType}
                                className="block cursor-pointer"
                            >
                                <div className="space-y-4">
                                    <div className={`flex flex-col items-center justify-center p-6 rounded-lg transition-colors ${
                                        isDraggedOver
                                            ? theme === 'light' ? 'bg-blue-100' : 'bg-purple-900/30'
                                            : theme === 'light' 
                                                ? 'bg-gray-100 hover:bg-gray-200'
                                                : 'bg-gray-700/50'
                                        }`}>
                                        <FiUploadCloud className={`w-10 h-10 mb-2 ${
                                            isDraggedOver 
                                                ? theme === 'light' ? 'text-blue-500' : 'text-purple-500'
                                                : theme === 'light'
                                                    ? 'text-gray-700'
                                                    : 'text-gray-400'
                                            }`} />
                                        <div className="text-sm text-center">
                                            <span className={theme === 'light' ? 'text-blue-600' : 'text-purple-400'}>Click to upload</span>
                                            {' '}<span className={theme === 'light' ? 'text-gray-700' : 'text-gray-400'}>or drag and drop</span>
                                        </div>
                                        <p className={`text-xs mt-1 ${
                                            theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                                        }`}>
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Document Requirements */}
                        <div className="mt-4 space-y-2">
                            <h4 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'
                                }`}>
                                Requirements:
                            </h4>
                            <ul className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
                                <li className="flex items-center gap-1">
                                    <FiCheckCircle className={theme === 'light' ? 'text-blue-500' : 'text-green-500'} />
                                    Clear, readable image
                                </li>
                                <li className="flex items-center gap-1">
                                    <FiCheckCircle className={theme === 'light' ? 'text-blue-500' : 'text-green-500'} />
                                    File size less than 5MB
                                </li>
                                <li className="flex items-center gap-1">
                                    <FiCheckCircle className={theme === 'light' ? 'text-blue-500' : 'text-green-500'} />
                                    JPG, PNG formats accepted
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Preview Zone */}
                    <div className="w-1/3 min-w-[120px]">
                        <h4 className={`text-xs font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                            Preview
                        </h4>
                        <AnimatePresence mode="wait">
                            {renderPreview(file, label)}
                        </AnimatePresence>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {file ? file.name : 'No file selected'}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderPreview = (file, label) => {
        if (!file) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 
                   dark:border-gray-600 flex items-center justify-center"
                >
                    <FiFile className="w-8 h-8 text-gray-400" />
                </motion.div>
            );
        }

        if (file.type === 'application/pdf') {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group aspect-square"
                >
                    <div className="w-full h-full rounded-lg border dark:border-gray-600 
                        bg-gray-50 dark:bg-gray-700 flex flex-col items-center justify-center">
                        <FiFile className="w-12 h-12 text-gray-400 mb-2" />
                        <button
                            onClick={() => {
                                setSelectedPDF(file);
                                setIsPDFModalOpen(true);
                            }}
                            className={`px-3 py-1.5 ${theme === 'light' ? 'bg-blue-600' : 'bg-purple-600'} text-white rounded-lg text-sm`}
                        >
                            Preview PDF
                        </button>
                    </div>
                    <button
                        onClick={() => handleRemoveFile(fileType)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 text-white 
                     opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
            >
                <div className="aspect-square">
                    <img
                        src={URL.createObjectURL(file)}
                        alt={label}
                        className="w-full h-full object-cover rounded-lg border dark:border-gray-600"
                    />
                </div>
                <button
                    onClick={() => handleRemoveFile(fileType)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 text-white 
                   opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <FiTrash2 className="w-4 h-4" />
                </button>
            </motion.div>
        );
    };

    // Add this function to check if all required files are uploaded
    const areAllRequiredFilesUploaded = () => {
        return files.profilePhoto && files.aadhaarCard && files.panCard;
    };

    return (
        <>
            <div className="max-w-7xl mx-auto space-y-8 px-4">
                <div>
                    <h3 className={`text-xl font-semibold mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        Document Upload
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Please upload clear, readable documents in the specified format
                    </p>
                </div>

                {/* Flex Container for 2x2 Layout */}
                <div className="flex flex-wrap gap-6">
                    {/* Profile Photo */}
                    <div className="flex-1 basis-[calc(50%-12px)] min-w-[300px]">
                        {renderUploadZone(
                            'profilePhoto',
                            'Profile Photo',
                            'Upload a recent passport-size photograph (Image only)',
                            true
                        )}
                    </div>

                    {/* Aadhaar Card */}
                    <div className="flex-1 basis-[calc(50%-12px)] min-w-[300px]">
                        {renderUploadZone(
                            'aadhaarCard',
                            'Aadhaar Card',
                            'Upload front side of your Aadhaar card (Image or PDF)',
                            true
                        )}
                    </div>

                    {/* PAN Card */}
                    <div className="flex-1 basis-[calc(50%-12px)] min-w-[300px]">
                        {renderUploadZone(
                            'panCard',
                            'PAN Card',
                            'Upload front side of your PAN card (Image or PDF)',
                            true
                        )}
                    </div>

                    {/* Passbook */}
                    <div className="flex-1 basis-[calc(50%-12px)] min-w-[300px]">
                        {renderUploadZone(
                            'passbook',
                            'Bank Passbook',
                            'Upload first page of passbook (Image or PDF)',
                            false
                        )}
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className={`w-4 h-4 rounded border-gray-300 ${theme === 'light' ? 'text-blue-600 focus:ring-blue-500' : 'text-purple-600 focus:ring-purple-500'}`}
                        />
                        <label 
                            htmlFor="terms" 
                            className="text-sm text-gray-600 dark:text-gray-300"
                        >
                            I confirm that all the uploaded documents are valid and authentic
                        </label>
                    </div>

                    {/* Show error message if required files are missing */}
                    {!areAllRequiredFilesUploaded() && (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                            <FiAlertCircle className="w-4 h-4" />
                            <span>Please upload all required documents</span>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            onClick={onNext}
                            disabled={!acceptedTerms || !areAllRequiredFilesUploaded()}
                            className={`w-full max-w-xs px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2
                            ${acceptedTerms && areAllRequiredFilesUploaded()
                                ? theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700'}`}
                        >
                            Proceed to Review
                        </button>
                    </div>
                </div>
            </div>

            <PDFPreviewModal
                isOpen={isPDFModalOpen}
                onClose={() => setIsPDFModalOpen(false)}
                file={selectedPDF}
            />
        </>
    );
};

export default DocumentUpload; 