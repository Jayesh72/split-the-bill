import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { BillProgressStepper } from '@/components/split/BillProgressStepper';
import { SplitHeader } from '@/components/split/SplitHeader';
import { UploadDropzone } from '@/components/split/UploadDropzone';
import { PrivacyNotice } from '@/components/split/PrivacyNotice';
import { OCRScannerCard } from '@/components/split/OCRScannerCard';
import { SplitFeatureCards } from '@/components/split/SplitFeatureCards';

export const SplitBillPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleReplacePhoto = () => {
    setFiles([]);
  };

  const handleContinue = () => {
    navigate('/review');
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          {/* Progress Stepper */}
          <BillProgressStepper />

          {/* Page Heading */}
          <SplitHeader />

          {/* Main 2-Column Upload & Live Scanner Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            {/* Left Column: Upload Dropzone + Privacy Notice (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <UploadDropzone
                files={files}
                onFilesChange={setFiles}
              />
              <PrivacyNotice />
            </div>

            {/* Right Column: Dynamic Live OCR Scanner Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <OCRScannerCard
                files={files}
                onReplacePhoto={handleReplacePhoto}
                onContinue={handleContinue}
              />
            </div>
          </div>

          {/* Bottom Feature Cards */}
          <SplitFeatureCards />
        </main>
      </div>

      <Footer />
    </div>
  );
};
