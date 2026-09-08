import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BillProvider } from '@/context/BillContext';
import { LandingPage } from './pages/LandingPage';
import { SplitBillPage } from './pages/SplitBillPage';
import { ReviewOCRPage } from './pages/ReviewOCRPage';
import { AddPeoplePage } from './pages/AddPeoplePage';
import { AssignItemsPage } from './pages/AssignItemsPage';
import { ShareSplitPage } from './pages/ShareSplitPage';

export const App: React.FC = () => {
  return (
    <BillProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/split" element={<SplitBillPage />} />
          <Route path="/review" element={<ReviewOCRPage />} />
          <Route path="/add-people" element={<AddPeoplePage />} />
          <Route path="/assign" element={<AssignItemsPage />} />
          <Route path="/share" element={<ShareSplitPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BillProvider>
  );
};

export default App;
