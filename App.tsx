

import React, { useState, Suspense, useEffect, createContext, useContext, useMemo } from 'react';
import { type ActivePage, type LoggedInUser, type Guru, type CallType, type Post, type Theme, type CommissionRecord, type BankDetails, type FeedbackRecord, type StoredUser, type CallRecord } from './types';
import BottomNav from './components/BottomNav';
import Spinner from './components/Spinner';
import { APP_OWNER_USERNAME } from './constants';
import BankDetailsModal from './components/BankDetailsModal';

// --- LOCALIZATION SETUP ---

const translations = {
  en: {
    // App General
    appName: 'GyanSetu',
    close: 'Close',
    cancel: 'Cancel',
    submit: 'Submit',
    
    // Header & Sidenav
    headerTitleHindi: 'ज्ञानसेतु',
    headerTitle: 'GyanSetu',
    openMenu: 'Open navigation menu',
    menuTitle: 'GyanSetu Menu',
    language: 'Language',
    support: 'Support',
    contactUs: 'Contact Us',
    copyright: 'Copyright',
    ownerDashboard: 'Owner Dashboard',

    // Theme
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',

    // Copyright Modal
    appCopyrightDesc: '📜 App Copyright Description',
    copyrightLine1: '© 2025 GYAN SETU. All Rights Reserved.',
    copyrightLine2: 'This application and its contents, including but not limited to the design, logo, graphics, text, and software code, are the intellectual property of RG Creation.',
    copyrightLine3: 'Unauthorized copying, distribution, modification, or use of any part of this application without prior written permission is strictly prohibited and may result in legal action.',
    copyrightLine4: 'This app is protected under applicable copyright laws and international treaties.',
    copyrightLine5: 'All trademarks and registered trademarks are the property of their respective owners.',
    copyrightExample: 'Example:',
    copyrightExampleText: '© 2025 GyanSetu. All Rights Reserved. GyanSetu and its associated content are the exclusive property of Raam and KUSHAL JOSHI Innovations. Any reproduction or redistribution of part or all of the contents in any form is prohibited without permission.',
    
    // Feedback Modal
    appFeedback: 'App Feedback',
    feedbackPlaceholder: 'Tell us what you think...',

    // Owner Dashboard
    ownerDashboardWelcome: 'Welcome, App Owner.',
    ownerDashboardDesc: 'This panel is exclusively for you. Future updates will include app analytics and management tools.',
    ownerDashboardComingSoon: 'Stay tuned for more features!',
    ownerTotalCommission: 'Total Commission Earned',
    ownerTotalTransactions: 'Total Transactions',
    ownerBankDetails: 'Receiving Bank Details',
    ownerCommissionHistory: 'Commission History',
    ownerTotalPaid: 'Total Paid',
    ownerCommission: 'Commission',
    ownerNoBankDetails: 'No bank details added. Add your details to receive payouts.',
    ownerNoCommissions: 'No commissions recorded yet.',
    ownerAnalytics: 'App Analytics',
    ownerUserManagement: 'User Management',
    ownerAppReviews: 'App Reviews',
    ownerSettings: 'Settings',
    ownerTotalUsers: 'Total Users',
    ownerGurus: 'Gurus',
    ownerShishyas: 'Shishyas',
    ownerTotalPosts: 'Total Posts',
    ownerTotalCalls: 'Total Calls',
    ownerRevenueOverview: 'Revenue Overview',
    ownerAllUsers: 'All Users',
    ownerUserRole: 'Role',
    ownerUserEmail: 'Email',
    ownerNoUsers: 'No other users found.',
    ownerNoFeedback: 'No feedback has been submitted yet.',
    ownerFeedbackDate: 'Date',
    ownerFeedbackContent: 'Feedback',
    
    // Auth Page
    authWelcome: 'Welcome Back',
    authLoginPrompt: 'Login to continue your journey of wisdom.',
    authIdentifierPlaceholder: 'Email, Username or Mobile',
    authPasswordPlaceholder: 'Password',
    authLoginButton: 'Login',
    authLoggingInButton: 'Logging in...',
    authForgotPasswordLink: 'Forgot Password?',
    authNoAccountPrompt: "Don't have an account?",
    authSignUpLink: 'Sign Up',
    authJoinTitle: 'Join GyanSetu',
    authChoosePath: 'Choose your path.',
    authRoleGuru: 'I am a Guru',
    authRoleGuruDesc: 'Share your wisdom.',
    authRoleShishya: 'I am a Shishya',
    authRoleShishyaDesc: 'Seek knowledge.',
    authNextButton: 'Next',
    authHaveAccountPrompt: 'Already have an account?',
    authCreateAccountTitle: 'Create Your Account',
    authFirstNamePlaceholder: 'First Name',
    authLastNamePlaceholder: 'Last Name',
    authEmailPlaceholder: 'Email',
    authUsernamePlaceholder: 'Username',
    authMobilePlaceholder: 'Mobile Number',
    authConfirmPasswordPlaceholder: 'Confirm Password',
    authCreateAccountButton: 'Create Account',
    authCreatingAccountButton: 'Creating Account...',
    authForgotPasswordTitle: 'Forgot Password',
    authForgotPasswordPrompt: 'Enter your registered email or mobile to receive an OTP.',
    authSendOTPButton: 'Send OTP',
    authSendingOTPButton: 'Sending...',
    authResetPasswordTitle: 'Reset Password',
    authOTPSentPrompt: 'An OTP has been sent to {identifier}.',
    authOTPPlaceholder: 'Enter 6-digit OTP',
    authNewPasswordPlaceholder: 'New Password',
    authResetPasswordButton: 'Reset Password',
    authResettingPasswordButton: 'Resetting...',
    errorInvalidCredentials: 'Invalid credentials. Please try again.',
    errorPasswordsNoMatch: 'Passwords do not match.',
    errorPasswordTooShort: 'Password must be at least 6 characters long.',
    errorEmailExists: 'An account with this email already exists.',
    errorUsernameExists: 'This username is already taken.',
    errorMobileExists: 'An account with this mobile number already exists.',
    errorSelectRole: 'Please select a role.',

    // Bottom Nav
    navHome: 'Home',
    navSearch: 'Discover',
    navCreate: 'Create',
    navProfile: 'Profile',

    // Home Page
    homeWelcome: 'Welcome to GyanSetu!',
    homeCommunityStart: 'Looks like our community is just getting started.',
    homeNoWisdom: 'No wisdom has been shared yet.',
    homeDiscoverGurus: 'Discover Gurus',
    homeFeaturedGurus: 'Featured Gurus',
    homeCreatePrompt: '{firstName}, what wisdom will you share today?',
    homeCreateArticle: 'Article',
    homeCreateVideo: 'Video',
    homeCreateImage: 'Image',

    // Post Card
    postGyanShort: 'Gyan Short',
    postAnubhavArticle: 'Anubhav Article',
    postImagePost: 'Image Post',
    postReadMore: 'Read More...',
    postGurudakshina: 'Gurudakshina',

    // Discover Page
    discoverTitle: 'Find your Guru',
    discoverSubtitle: 'Connect with experienced individuals to gain wisdom.',
    discoverSearchPlaceholder: 'Search for expertise, name...',
    discoverSortBy: 'Sort by:',
    discoverSortDefault: 'Default',
    discoverSortRating: 'Rating',
    discoverSortExpertise: 'Expertise',
    discoverViewProfile: 'View Profile',
    discoverNoGurusTitle: 'No Gurus Found',
    discoverNoGurusSubtitle: "We're constantly growing our community of Gurus.",
    discoverNoGurusPrompt: 'Please check back later!',
    
    // Create Page
    createTitle: 'Share your Gyan',
    createSubtitle: 'What wisdom will you share today?',
    createTypeArticle: '✍️ Article',
    createTypeVideo: '🎬 Video',
    createTypeImage: '🖼️ Image',
    createFieldTitle: 'Title',
    createFieldTitlePlaceholder: 'A catchy title for your Gyan...',
    createFieldContent: 'Your Wisdom (Content)',
    createFieldContentPlaceholder: 'Write your article here...',
    createFieldMediaUpload: 'Upload {mediaType}',
    createFieldMediaImage: 'Image',
    createFieldMediaVideo: 'Video',
    createFieldMediaUploadFile: 'Upload a file',
    createFieldMediaDragDrop: 'or drag and drop',
    createFieldMediaFileType: 'PNG, JPG, GIF, MP4 up to 10MB',
    createFieldCaption: 'Caption',
    createFieldCaptionPlaceholder: 'Describe your media...',
    createPostButton: 'Share Gyan',
    
    // Profile Page
    profileRecommendedGurus: 'Recommended Gurus',
    profileFollow: 'Follow',
    profileEditProfile: 'Edit Profile',
    profileFirstName: 'First Name',
    profileLastName: 'Last Name',
    profileUsername: 'Username',
    profileExpertise: 'Expertise',
    profileBio: 'Bio',
    profileSaveChanges: 'Save Changes',
    callVideo: 'Video',
    callVoice: 'Voice',
    profileBankDetailsTitle: 'Bank & Payment Details',
    profileBankDetailsEdit: 'Edit Details',
    profileBankDetailsPrompt: 'Add your bank details to receive Gurudakshina.',
    profileBankDetailsAdd: 'Add Details',
    profileMyGyan: 'My Gyan',
    profileMyActivity: 'My Activity',
    profileCallHistory: 'Call History',
    profileNoPosts: "You haven't shared any Gyan yet.",
    profileNoCalls: 'You have no call history.',
    profileActivityPlaceholder: 'Your activity will appear here.',
    profileLogout: 'Logout',
    
    // Bank Details Modal
    bankAccountHolder: 'Account Holder Name',
    bankAccountHolderPlaceholder: 'e.g. Asha Sharma',
    bankAccountNumber: 'Account Number',
    bankAccountNumberPlaceholder: 'e.g. 123456789012',
    bankIFSC: 'IFSC Code',
    bankIFSCPlaceholder: 'e.g. HDFC0001234',
    bankUPI: 'UPI ID',
    bankUPIPlaceholder: 'e.g. asha.sharma@okhdfcbank',
    bankSaveButton: 'Save Details',
    
    // Gurudakshina Modal
    dakshinaTitle: 'Send Gurudakshina to',
    dakshinaAmountPrompt: 'Select or enter an amount (₹)',
    dakshinaCustomAmountPlaceholder: 'Or enter custom amount',
    dakshinaPayButton: 'Pay using UPI App',
    dakshinaOr: '- or -',
    dakshinaScanPrompt: 'Scan QR to pay',
    dakshinaQRGeneration: 'Enter an amount to generate QR',
    
    // Call Page & Premium Modal
    callWith: '{callType} call with',
    premiumTitle: 'Free time is over!',
    premiumMessage: 'Continue this insightful conversation by upgrading to GyanSetu Premium. Unlock unlimited call time with all Gurus.',
    premiumGoPremium: 'Go Premium',
    premiumEndCall: 'End Call',
    callCameraOff: 'Camera Off',
    networkGood: 'Good',
    callDuration: 'Duration',
  },
  hi: {
    appName: 'ज्ञानसेतु',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    submit: 'प्रस्तुत करें',
    headerTitleHindi: 'ज्ञानसेतु',
    headerTitle: 'GyanSetu',
    openMenu: 'नेविगेशन मेनू खोलें',
    menuTitle: 'ज्ञानसेतु मेनू',
    language: 'भाषा',
    support: 'सहायता',
    contactUs: 'संपर्क करें',
    copyright: 'कॉपीराइट',
    ownerDashboard: 'मालिक डैशबोर्ड',
    theme: 'थीम',
    themeLight: 'लाइट',
    themeDark: 'डार्क',
    themeSystem: 'सिस्टम',
    appCopyrightDesc: '📜 ऐप कॉपीराइट विवरण',
    copyrightLine1: '© 2025 ज्ञान सेतु। सर्वाधिकार सुरक्षित।',
    copyrightLine2: 'यह एप्लिकेशन और इसकी सामग्री, जिसमें डिज़ाइन, लोगो, ग्राफिक्स, टेक्स्ट और सॉफ्टवेयर कोड शामिल हैं, लेकिन इन्हीं तक सीमित नहीं है, आरजी क्रिएशन की बौद्धिक संपदा है।',
    copyrightLine3: 'पूर्व लिखित अनुमति के बिना इस एप्लिकेशन के किसी भी हिस्से की अनधिकृत प्रतिलिपि, वितरण, संशोधन या उपयोग सख्त वर्जित है और इसके परिणामस्वरूप कानूनी कार्रवाई हो सकती है।',
    copyrightLine4: 'यह ऐप लागू कॉपीराइट कानूनों और अंतरराष्ट्रीय संधियों के तहत संरक्षित है।',
    copyrightLine5: 'सभी ट्रेडमार्क और पंजीकृत ट्रेडमार्क उनके संबंधित स्वामियों की संपत्ति हैं।',
    copyrightExample: 'उदाहरण:',
    copyrightExampleText: '© 2025 ज्ञानसेतु। सर्वाधिकार सुरक्षित। ज्ञानसेतु और इसकी संबंधित सामग्री राम और कुशल जोशी इनोवेशन की विशेष संपत्ति है। अनुमति के बिना किसी भी रूप में सामग्री के सभी या किसी भी हिस्से का पुनरुत्पादन या पुनर्वितरण निषिद्ध है।',
    appFeedback: 'ऐप प्रतिक्रिया',
    feedbackPlaceholder: 'हमें बताएं कि आप क्या सोचते हैं...',
    ownerDashboardWelcome: 'स्वागत है, ऐप ओनर।',
    ownerDashboardDesc: 'यह पैनल विशेष रूप से आपके लिए है। भविष्य के अपडेट में ऐप एनालिटिक्स और प्रबंधन उपकरण शामिल होंगे।',
    ownerDashboardComingSoon: 'अधिक सुविधाओं के लिए बने रहें!',
    ownerTotalCommission: 'कुल कमीशन अर्जित',
    ownerTotalTransactions: 'कुल लेनदेन',
    ownerBankDetails: 'बैंक विवरण प्राप्त करना',
    ownerCommissionHistory: 'कमीशन इतिहास',
    ownerTotalPaid: 'कुल भुगतान',
    ownerCommission: 'कमीशन',
    ownerNoBankDetails: 'कोई बैंक विवरण नहीं जोड़ा गया। भुगतान प्राप्त करने के लिए अपना विवरण जोड़ें।',
    ownerNoCommissions: 'अभी तक कोई कमीशन दर्ज नहीं किया गया है।',
    ownerAnalytics: 'ऐप एनालिटिक्स',
    ownerUserManagement: 'उपयोगकर्ता प्रबंधन',
    ownerAppReviews: 'ऐप समीक्षाएं',
    ownerSettings: 'सेटिंग्स',
    ownerTotalUsers: 'कुल उपयोगकर्ता',
    ownerGurus: 'गुरु',
    ownerShishyas: 'शिष्य',
    ownerTotalPosts: 'कुल पोस्ट',
    ownerTotalCalls: 'कुल कॉल',
    ownerRevenueOverview: 'राजस्व अवलोकन',
    ownerAllUsers: 'सभी उपयोगकर्ता',
    ownerUserRole: 'भूमिका',
    ownerUserEmail: 'ईमेल',
    ownerNoUsers: 'कोई अन्य उपयोगकर्ता नहीं मिला।',
    ownerNoFeedback: 'अभी तक कोई प्रतिक्रिया प्रस्तुत नहीं की गई है।',
    ownerFeedbackDate: 'तारीख',
    ownerFeedbackContent: 'प्रतिक्रिया',
    authWelcome: 'वापसी पर स्वागत है',
    authLoginPrompt: 'ज्ञान की अपनी यात्रा जारी रखने के लिए लॉगिन करें।',
    authIdentifierPlaceholder: 'ईमेल, उपयोगकर्ता नाम या मोबाइल',
    authPasswordPlaceholder: 'पासवर्ड',
    authLoginButton: 'लॉग इन करें',
    authLoggingInButton: 'लॉग इन हो रहा है...',
    authForgotPasswordLink: 'पासवर्ड भूल गए?',
    authNoAccountPrompt: 'खाता नहीं है?',
    authSignUpLink: 'साइन अप करें',
    authJoinTitle: 'ज्ञानसेतु से जुड़ें',
    authChoosePath: 'अपना रास्ता चुनें।',
    authRoleGuru: 'मैं एक गुरु हूँ',
    authRoleGuruDesc: 'अपना ज्ञान साझा करें।',
    authRoleShishya: 'मैं एक शिष्य हूँ',
    authRoleShishyaDesc: 'ज्ञान की तलाश करें।',
    authNextButton: 'अगला',
    authHaveAccountPrompt: 'पहले से ही एक खाता है?',
    authCreateAccountTitle: 'अपना खाता बनाएं',
    authFirstNamePlaceholder: 'पहला नाम',
    authLastNamePlaceholder: 'अंतिम नाम',
    authEmailPlaceholder: 'ईमेल',
    authUsernamePlaceholder: 'उपयोगकर्ता नाम',
    authMobilePlaceholder: 'मोबाइल नंबर',
    authConfirmPasswordPlaceholder: 'पासवर्ड की पुष्टि करें',
    authCreateAccountButton: 'खाता बनाएं',
    authCreatingAccountButton: 'खाता बना रहा है...',
    authForgotPasswordTitle: 'पासवर्ड भूल गए',
    authForgotPasswordPrompt: 'ओटीपी प्राप्त करने के लिए अपना पंजीकृत ईमेल या मोबाइल दर्ज करें।',
    authSendOTPButton: 'ओटीपी भेजें',
    authSendingOTPButton: 'भेज रहा है...',
    authResetPasswordTitle: 'पासवर्ड रीसेट',
    authOTPSentPrompt: '{identifier} पर एक ओटीपी भेजा गया है।',
    authOTPPlaceholder: '6-अंकीय ओटीपी दर्ज करें',
    authNewPasswordPlaceholder: 'नया पासवर्ड',
    authResetPasswordButton: 'पासवर्ड रीसेट',
    authResettingPasswordButton: 'रीसेट हो रहा है...',
    errorInvalidCredentials: 'अमान्य क्रेडेंशियल। कृपया पुन: प्रयास करें।',
    errorPasswordsNoMatch: 'पासवर्ड मेल नहीं खाते।',
    errorPasswordTooShort: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।',
    errorEmailExists: 'इस ईमेल से एक खाता पहले से मौजूद है।',
    errorUsernameExists: 'यह उपयोगकर्ता नाम पहले ही लिया जा चुका है।',
    errorMobileExists: 'इस मोबाइल नंबर से एक खाता पहले से मौजूद है।',
    errorSelectRole: 'कृपया एक भूमिका चुनें।',
    navHome: 'होम',
    navSearch: 'खोजें',
    navCreate: 'बनाएं',
    navProfile: 'प्रोफ़ाइल',
    homeWelcome: 'ज्ञानसेतु में आपका स्वागत है!',
    homeCommunityStart: 'ऐसा लगता है कि हमारा समुदाय अभी शुरू हो रहा है।',
    homeNoWisdom: 'अभी तक कोई ज्ञान साझा नहीं किया गया है।',
    homeDiscoverGurus: 'गुरुओं की खोज करें',
    homeFeaturedGurus: 'विशेष रुप से प्रदर्शित गुरु',
    homeCreatePrompt: '{firstName}, आज आप कौन सा ज्ञान साझा करेंगे?',
    homeCreateArticle: 'लेख',
    homeCreateVideo: 'वीडियो',
    homeCreateImage: 'छवि',
    postGyanShort: 'ज्ञान शॉर्ट',
    postAnubhavArticle: 'अनुभव लेख',
    postImagePost: 'छवि पोस्ट',
    postReadMore: 'और पढ़ें...',
    postGurudakshina: 'गुरुदक्षिणा',
    discoverTitle: 'अपने गुरु को खोजें',
    discoverSubtitle: 'ज्ञान प्राप्त करने के लिए अनुभवी व्यक्तियों से जुड़ें।',
    discoverSearchPlaceholder: 'विशेषज्ञता, नाम खोजें...',
    discoverSortBy: 'इसके अनुसार क्रमबद्ध करें:',
    discoverSortDefault: 'डिफ़ॉल्ट',
    discoverSortRating: 'रेटिंग',
    discoverSortExpertise: 'विशेषज्ञता',
    discoverViewProfile: 'प्रोफ़ाइल देखें',
    discoverNoGurusTitle: 'कोई गुरु नहीं मिला',
    discoverNoGurusSubtitle: 'हम लगातार अपने गुरुओं के समुदाय को बढ़ा रहे हैं।',
    discoverNoGurusPrompt: 'कृपया बाद में वापस देखें!',
    createTitle: 'अपना ज्ञान साझा करें',
    createSubtitle: 'आज आप कौन सा ज्ञान साझा करेंगे?',
    createTypeArticle: '✍️ लेख',
    createTypeVideo: '🎬 वीडियो',
    createTypeImage: '🖼️ छवि',
    createFieldTitle: 'शीर्षक',
    createFieldTitlePlaceholder: 'आपके ज्ञान के लिए एक आकर्षक शीर्षक...',
    createFieldContent: 'आपका ज्ञान (सामग्री)',
    createFieldContentPlaceholder: 'अपना लेख यहाँ लिखें...',
    createFieldMediaUpload: '{mediaType} अपलोड करें',
    createFieldMediaImage: 'छवि',
    createFieldMediaVideo: 'वीडियो',
    createFieldMediaUploadFile: 'एक फ़ाइल अपलोड करें',
    createFieldMediaDragDrop: 'या खींचें और छोड़ें',
    createFieldMediaFileType: 'पीएनजी, जेपीजी, जीआईएफ, एमपी4 10एमबी तक',
    createFieldCaption: 'कैप्शन',
    createFieldCaptionPlaceholder: 'अपने मीडिया का वर्णन करें...',
    createPostButton: 'ज्ञान साझा करें',
    profileRecommendedGurus: 'अनुशंसित गुरु',
    profileFollow: 'फॉलो करें',
    profileEditProfile: 'प्रोफ़ाइल संपादित करें',
    profileFirstName: 'पहला नाम',
    profileLastName: 'अंतिम नाम',
    profileUsername: 'उपयोगकर्ता नाम',
    profileExpertise: 'विशेषज्ञता',
    profileBio: 'बायो',
    profileSaveChanges: 'बदलाव सहेजें',
    callVideo: 'वीडियो',
    callVoice: 'वॉयस',
    profileBankDetailsTitle: 'बैंक और भुगतान विवरण',
    profileBankDetailsEdit: 'विवरण संपादित करें',
    profileBankDetailsPrompt: 'गुरुदक्षिणा प्राप्त करने के लिए अपने बैंक विवरण जोड़ें।',
    profileBankDetailsAdd: 'विवरण जोड़ें',
    profileMyGyan: 'मेरा ज्ञान',
    profileMyActivity: 'मेरी गतिविधि',
    profileCallHistory: 'कॉल इतिहास',
    profileNoPosts: 'आपने अभी तक कोई ज्ञान साझा नहीं किया है।',
    profileNoCalls: 'आपका कोई कॉल इतिहास नहीं है।',
    profileActivityPlaceholder: 'आपकी गतिविधि यहाँ दिखाई देगी।',
    profileLogout: 'लॉग आउट',
    bankAccountHolder: 'खाता धारक का नाम',
    bankAccountHolderPlaceholder: 'उदा. आशा शर्मा',
    bankAccountNumber: 'खाता संख्या',
    bankAccountNumberPlaceholder: 'उदा. 123456789012',
    bankIFSC: 'आईएफएससी कोड',
    bankIFSCPlaceholder: 'उदा. HDFC0001234',
    bankUPI: 'यूपीआई आईडी',
    bankUPIPlaceholder: 'उदा. asha.sharma@okhdfcbank',
    bankSaveButton: 'विवरण सहेजें',
    dakshinaTitle: 'को गुरुदक्षिणा भेजें',
    dakshinaAmountPrompt: 'एक राशि चुनें या दर्ज करें (₹)',
    dakshinaCustomAmountPlaceholder: 'या कस्टम राशि दर्ज करें',
    dakshinaPayButton: 'यूपीआई ऐप का उपयोग करके भुगतान करें',
    dakshinaOr: '- या -',
    dakshinaScanPrompt: 'भुगतान करने के लिए क्यूआर स्कैन करें',
    dakshinaQRGeneration: 'क्यूआर उत्पन्न करने के लिए राशि दर्ज करें',
    callWith: '{callType} कॉल',
    premiumTitle: 'मुफ्त समय समाप्त हो गया!',
    premiumMessage: 'ज्ञानसेतु प्रीमियम में अपग्रेड करके इस ज्ञानवर्धक बातचीत को जारी रखें। सभी गुरुओं के साथ असीमित कॉल समय अनलॉक करें।',
    premiumGoPremium: 'प्रीमियम पर जाएं',
    premiumEndCall: 'कॉल समाप्त करें',
    callCameraOff: 'कैमरा बंद',
    networkGood: 'अच्छा',
    callDuration: 'अवधि',
  },
  kn: {
    appName: 'ಜ್ಞಾನಸೇತು',
    close: 'ಮುಚ್ಚಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    submit: 'ಸಲ್ಲಿಸಿ',
    headerTitleHindi: 'ज्ञानसेतु',
    headerTitle: 'GyanSetu',
    openMenu: 'ನ್ಯಾವಿಗೇಷನ್ ಮೆನು ತೆರೆಯಿರಿ',
    menuTitle: 'ಜ್ಞಾನಸೇತು ಮೆನು',
    language: 'ಭಾಷೆ',
    support: 'ಬೆಂಬಲ',
    contactUs: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
    copyright: 'ಕೃತಿಸ್ವಾಮ್ಯ',
    ownerDashboard: 'ಮಾಲೀಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    theme: 'ಥೀಮ್',
    themeLight: 'ಲೈಟ್',
    themeDark: 'ಡಾರ್ಕ್',
    themeSystem: 'ಸಿಸ್ಟಮ್',
    appCopyrightDesc: '📜 ಅಪ್ಲಿಕೇಶನ್ ಕೃತಿಸ್ವಾಮ್ಯ ವಿವರಣೆ',
    copyrightLine1: '© 2025 ಜ್ಞಾನ ಸೇತು. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    copyrightLine2: 'ಈ ಅಪ್ಲಿಕೇಶನ್ ಮತ್ತು ಅದರ ವಿಷಯಗಳು, ವಿನ್ಯಾಸ, ಲೋಗೋ, ಗ್ರಾಫಿಕ್ಸ್, ಪಠ್ಯ ಮತ್ತು ಸಾಫ್ಟ್‌ವೇರ್ ಕೋಡ್ ಸೇರಿದಂತೆ, ಆದರೆ ಸೀಮಿತವಾಗಿಲ್ಲ, ಇವು ಆರ್‌ಜಿ ಕ್ರಿಯೇಷನ್‌ನ ಬೌದ್ಧಿಕ ಆಸ್ತಿಯಾಗಿದೆ.',
    copyrightLine3: 'ಪೂರ್ವ ಲಿಖಿತ ಅನುಮತಿಯಿಲ್ಲದೆ ಈ ಅಪ್ಲಿಕೇಶನ್‌ನ ಯಾವುದೇ ಭಾಗವನ್ನು ಅನಧಿಕೃತವಾಗಿ ನಕಲಿಸುವುದು, ವಿತರಿಸುವುದು, ಮಾರ್ಪಡಿಸುವುದು ಅಥವಾ ಬಳಸುವುದು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ ಮತ್ತು ಕಾನೂನು ಕ್ರಮಕ್ಕೆ ಕಾರಣವಾಗಬಹುದು.',
    copyrightLine4: 'ಈ ಅಪ್ಲಿಕೇಶನ್ ಅನ್ವಯವಾಗುವ ಕೃತಿಸ್ವಾಮ್ಯ ಕಾನೂನುಗಳು ಮತ್ತು ಅಂತರರಾಷ್ಟ್ರೀಯ ಒಪ್ಪಂದಗಳ ಅಡಿಯಲ್ಲಿ ರಕ್ಷಿಸಲ್ಪಟ್ಟಿದೆ.',
    copyrightLine5: 'ಎಲ್ಲಾ ಟ್ರೇಡ್‌ಮಾರ್ಕ್‌ಗಳು ಮತ್ತು ನೋಂದಾಯಿತ ಟ್ರೇಡ್‌ಮಾರ್ಕ್‌ಗಳು ಆಯಾ ಮಾಲೀಕರ ಆಸ್ತಿಯಾಗಿದೆ.',
    copyrightExample: 'ಉದಾಹರಣೆ:',
    copyrightExampleText: '© 2025 ಜ್ಞಾನಸೇತು. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಜ್ಞಾನಸೇತು ಮತ್ತು ಅದರ ಸಂಬಂಧಿತ ವಿಷಯಗಳು ರಾಮ್ ಮತ್ತು ಕುಶಲ್ ಜೋಶಿ ಇನ್ನೋವೇಶನ್ಸ್‌ನ ವಿಶೇಷ ಆಸ್ತಿಯಾಗಿದೆ. ಅನುಮತಿಯಿಲ್ಲದೆ ಯಾವುದೇ ರೂಪದಲ್ಲಿ ವಿಷಯಗಳ ಎಲ್ಲಾ ಅಥವಾ ಯಾವುದೇ ಭಾಗವನ್ನು ಪುನರುತ್ಪಾದಿಸುವುದು ಅಥವಾ ಮರುವಿತರಣೆ ಮಾಡುವುದು ನಿಷೇಧಿಸಲಾಗಿದೆ.',
    appFeedback: 'ಅಪ್ಲಿಕೇಶನ್ ಪ್ರತಿಕ್ರಿಯೆ',
    feedbackPlaceholder: 'ನಿಮ್ಮ ಅನಿಸಿಕೆಗಳನ್ನು ನಮಗೆ ತಿಳಿಸಿ...',
    ownerDashboardWelcome: 'ಸ್ವಾಗತ, ಅಪ್ಲಿಕೇಶನ್ ಮಾಲೀಕರೆ.',
    ownerDashboardDesc: 'ಈ ಪ್ಯಾನೆಲ್ ನಿಮಗಾಗಿ ಪ್ರತ್ಯೇಕವಾಗಿದೆ. ಭವಿಷ್ಯದ ನವೀಕರಣಗಳು ಅಪ್ಲಿಕೇಶನ್ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ನಿರ್ವಹಣಾ ಸಾಧನಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತವೆ.',
    ownerDashboardComingSoon: 'ಹೆಚ್ಚಿನ ವೈಶಿಷ್ಟ್ಯಗಳಿಗಾಗಿ ನಿರೀಕ್ಷಿಸಿ!',
    ownerTotalCommission: 'ಗಳಿಸಿದ ಒಟ್ಟು ಕಮಿಷನ್',
    ownerTotalTransactions: 'ಒಟ್ಟು ವಹಿವಾಟುಗಳು',
    ownerBankDetails: 'ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಸ್ವೀಕರಿಸಲಾಗುತ್ತಿದೆ',
    ownerCommissionHistory: 'ಕಮಿಷನ್ ಇತಿಹಾಸ',
    ownerTotalPaid: 'ಒಟ್ಟು ಪಾವತಿಸಲಾಗಿದೆ',
    ownerCommission: 'ಕಮಿಷನ್',
    ownerNoBankDetails: 'ಯಾವುದೇ ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ. ಪಾವತಿಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.',
    ownerNoCommissions: 'ಇನ್ನೂ ಯಾವುದೇ ಕಮಿಷನ್‌ಗಳನ್ನು ದಾಖಲಿಸಲಾಗಿಲ್ಲ.',
    ownerAnalytics: 'ಅಪ್ಲಿಕೇಶನ್ ಅನಾಲಿಟಿಕ್ಸ್',
    ownerUserManagement: 'ಬಳಕೆದಾರ ನಿರ್ವಹಣೆ',
    ownerAppReviews: 'ಅಪ್ಲಿಕೇಶನ್ ವಿಮರ್ಶೆಗಳು',
    ownerSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    ownerTotalUsers: 'ಒಟ್ಟು ಬಳಕೆದಾರರು',
    ownerGurus: 'ಗುರುಗಳು',
    ownerShishyas: 'ಶಿಷ್ಯರು',
    ownerTotalPosts: 'ಒಟ್ಟು ಪೋಸ್ಟ್‌ಗಳು',
    ownerTotalCalls: 'ಒಟ್ಟು ಕರೆಗಳು',
    ownerRevenueOverview: 'ಆದಾಯದ ಅವಲೋಕನ',
    ownerAllUsers: 'ಎಲ್ಲಾ ಬಳಕೆದಾರರು',
    ownerUserRole: 'ಪಾತ್ರ',
    ownerUserEmail: 'ಇಮೇಲ್',
    ownerNoUsers: 'ಬೇರೆ ಯಾವುದೇ ಬಳಕೆದಾರರು ಕಂಡುಬಂದಿಲ್ಲ.',
    ownerNoFeedback: 'ಇನ್ನೂ ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಲಾಗಿಲ್ಲ.',
    ownerFeedbackDate: 'ದಿನಾಂಕ',
    ownerFeedbackContent: 'ಪ್ರತಿಕ್ರಿಯೆ',
    authWelcome: 'ಮರಳಿ ಸ್ವಾಗತ',
    authLoginPrompt: 'ನಿಮ್ಮ ಜ್ಞಾನದ ಪ್ರಯಾಣವನ್ನು ಮುಂದುವರಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ.',
    authIdentifierPlaceholder: 'ಇಮೇಲ್, ಬಳಕೆದಾರಹೆಸರು ಅಥವಾ ಮೊಬೈಲ್',
    authPasswordPlaceholder: 'ಪಾಸ್ವರ್ಡ್',
    authLoginButton: 'ಲಾಗಿನ್ ಮಾಡಿ',
    authLoggingInButton: 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...',
    authForgotPasswordLink: 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ?',
    authNoAccountPrompt: 'ಖಾತೆ ಇಲ್ಲವೇ?',
    authSignUpLink: 'ಸೈನ್ ಅಪ್ ಮಾಡಿ',
    authJoinTitle: 'ಜ್ಞಾನಸೇತು ಸೇರಿ',
    authChoosePath: 'ನಿಮ್ಮ ಮಾರ್ಗವನ್ನು ಆರಿಸಿ.',
    authRoleGuru: 'ನಾನೊಬ್ಬ ಗುರು',
    authRoleGuruDesc: 'ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.',
    authRoleShishya: 'ನಾನೊಬ್ಬ ಶಿಷ್ಯ',
    authRoleShishyaDesc: 'ಜ್ಞಾನವನ್ನು ಹುಡುಕಿ.',
    authNextButton: 'ಮುಂದೆ',
    authHaveAccountPrompt: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
    authCreateAccountTitle: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ',
    authFirstNamePlaceholder: 'ಮೊದಲ ಹೆಸರು',
    authLastNamePlaceholder: 'ಕೊನೆಯ ಹೆಸರು',
    authEmailPlaceholder: 'ಇಮೇಲ್',
    authUsernamePlaceholder: 'ಬಳಕೆದಾರಹೆಸರು',
    authMobilePlaceholder: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    authConfirmPasswordPlaceholder: 'ಪಾಸ್ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
    authCreateAccountButton: 'ಖಾತೆ ರಚಿಸಿ',
    authCreatingAccountButton: 'ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...',
    authForgotPasswordTitle: 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ',
    authForgotPasswordPrompt: 'ಒಟಿಪಿ ಪಡೆಯಲು ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ನಮೂದಿಸಿ.',
    authSendOTPButton: 'ಒಟಿಪಿ ಕಳುಹಿಸಿ',
    authSendingOTPButton: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
    authResetPasswordTitle: 'ಪಾಸ್ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ',
    authOTPSentPrompt: '{identifier} ಗೆ ಒಟಿಪಿ ಕಳುಹಿಸಲಾಗಿದೆ.',
    authOTPPlaceholder: '6-ಅಂಕಿಯ ಒಟಿಪಿ ನಮೂದಿಸಿ',
    authNewPasswordPlaceholder: 'ಹೊಸ ಪಾಸ್ವರ್ಡ್',
    authResetPasswordButton: 'ಪಾಸ್ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ',
    authResettingPasswordButton: 'ಮರುಹೊಂದಿಸಲಾಗುತ್ತಿದೆ...',
    errorInvalidCredentials: 'ಅಮಾನ್ಯವಾದ ರುಜುವಾತುಗಳು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    errorPasswordsNoMatch: 'ಪಾಸ್ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.',
    errorPasswordTooShort: 'ಪಾಸ್ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು.',
    errorEmailExists: 'ಈ ಇಮೇಲ್‌ನೊಂದಿಗೆ ಈಗಾಗಲೇ ಖಾತೆ ಇದೆ.',
    errorUsernameExists: 'ಈ ಬಳಕೆದಾರಹೆಸರು ಈಗಾಗಲೇ ಬಳಕೆಯಲ್ಲಿದೆ.',
    errorMobileExists: 'ಈ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಈಗಾಗಲೇ ಖಾತೆ ಇದೆ.',
    errorSelectRole: 'ದಯವಿಟ್ಟು ಒಂದು ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    navHome: 'ಮುಖಪುಟ',
    navSearch: 'ಶೋಧಿಸಿ',
    navCreate: 'ರಚಿಸಿ',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    homeWelcome: 'ಜ್ಞಾನಸೇತುಗೆ ಸ್ವಾಗತ!',
    homeCommunityStart: 'ನಮ್ಮ ಸಮುದಾಯ ಈಗಷ್ಟೇ ಪ್ರಾರಂಭವಾದಂತಿದೆ.',
    homeNoWisdom: 'ಇನ್ನೂ ಯಾವುದೇ ಜ್ಞಾನವನ್ನು ಹಂಚಿಕೊಂಡಿಲ್ಲ.',
    homeDiscoverGurus: 'ಗುರುಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    homeFeaturedGurus: 'ವೈಶಿಷ್ಟ್ಯಗೊಳಿಸಿದ ಗುರುಗಳು',
    homeCreatePrompt: '{firstName}, ಇಂದು ನೀವು ಯಾವ ಜ್ಞಾನವನ್ನು ಹಂಚಿಕೊಳ್ಳುವಿರಿ?',
    homeCreateArticle: 'ಲೇಖನ',
    homeCreateVideo: 'ವೀಡಿಯೊ',
    homeCreateImage: 'ಚಿತ್ರ',
    postGyanShort: 'ಜ್ಞಾನ ಶಾರ್ಟ್',
    postAnubhavArticle: 'ಅನುಭವ ಲೇಖನ',
    postImagePost: 'ಚಿತ್ರ ಪೋಸ್ಟ್',
    postReadMore: 'ಇನ್ನಷ್ಟು ಓದಿ...',
    postGurudakshina: 'ಗುರುದಕ್ಷಿಣೆ',
    discoverTitle: 'ನಿಮ್ಮ ಗುರುವನ್ನು ಹುಡುಕಿ',
    discoverSubtitle: 'ಜ್ಞಾನವನ್ನು ಪಡೆಯಲು ಅನುಭವಿ ವ್ಯಕ್ತಿಗಳೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.',
    discoverSearchPlaceholder: 'ಪರಿಣತಿ, ಹೆಸರು ಹುಡುಕಿ...',
    discoverSortBy: 'ವಿಂಗಡಿಸಿ:',
    discoverSortDefault: 'ಡೀಫಾಲ್ಟ್',
    discoverSortRating: 'ರೇಟಿಂಗ್',
    discoverSortExpertise: 'ಪರಿಣತಿ',
    discoverViewProfile: 'ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ',
    discoverNoGurusTitle: 'ಯಾವುದೇ ಗುರುಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    discoverNoGurusSubtitle: 'ನಾವು ನಮ್ಮ ಗುರುಗಳ ಸಮುದಾಯವನ್ನು ನಿರಂತರವಾಗಿ ಬೆಳೆಸುತ್ತಿದ್ದೇವೆ.',
    discoverNoGurusPrompt: 'ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ!',
    createTitle: 'ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',
    createSubtitle: 'ಇಂದು ನೀವು ಯಾವ ಜ್ಞಾನವನ್ನು ಹಂಚಿಕೊಳ್ಳುವಿರಿ?',
    createTypeArticle: '✍️ ಲೇಖನ',
    createTypeVideo: '🎬 ವೀಡಿಯೊ',
    createTypeImage: '🖼️ ಚಿತ್ರ',
    createFieldTitle: 'ಶೀರ್ಷಿಕೆ',
    createFieldTitlePlaceholder: 'ನಿಮ್ಮ ಜ್ಞಾನಕ್ಕಾಗಿ ಆಕರ್ಷಕ ಶೀರ್ಷಿಕೆ...',
    createFieldContent: 'ನಿಮ್ಮ ಜ್ಞಾನ (ವಿಷಯ)',
    createFieldContentPlaceholder: 'ನಿಮ್ಮ ಲೇಖನವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
    createFieldMediaUpload: '{mediaType} ಅಪ್ಲೋಡ್ ಮಾಡಿ',
    createFieldMediaImage: 'ಚಿತ್ರ',
    createFieldMediaVideo: 'ವೀಡಿಯೊ',
    createFieldMediaUploadFile: 'ಫೈಲ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ',
    createFieldMediaDragDrop: 'ಅಥವಾ ಎಳೆದು ಬಿಡಿ',
    createFieldMediaFileType: 'PNG, JPG, GIF, MP4 10MB ವರೆಗೆ',
    createFieldCaption: 'ಶೀರ್ಷಿಕೆ',
    createFieldCaptionPlaceholder: 'ನಿಮ್ಮ ಮಾಧ್ಯಮವನ್ನು ವಿವರಿಸಿ...',
    createPostButton: 'ಜ್ಞಾನ ಹಂಚಿಕೊಳ್ಳಿ',
    profileRecommendedGurus: 'ಶಿಫಾರಸು ಮಾಡಲಾದ ಗುರುಗಳು',
    profileFollow: 'ಅನುಸರಿಸಿ',
    profileEditProfile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
    profileFirstName: 'ಮೊದಲ ಹೆಸರು',
    profileLastName: 'ಕೊನೆಯ ಹೆಸರು',
    profileUsername: 'ಬಳಕೆದಾರಹೆಸರು',
    profileExpertise: 'ಪರಿಣತಿ',
    profileBio: 'ಬಯೋ',
    profileSaveChanges: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    callVideo: 'ವೀಡಿಯೊ',
    callVoice: 'ಧ್ವನಿ',
    profileBankDetailsTitle: 'ಬ್ಯಾಂಕ್ ಮತ್ತು ಪಾವತಿ ವಿವರಗಳು',
    profileBankDetailsEdit: 'ವಿವರಗಳನ್ನು ಸಂಪಾದಿಸಿ',
    profileBankDetailsPrompt: 'ಗುರುದಕ್ಷಿಣೆ ಸ್ವೀಕರಿಸಲು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.',
    profileBankDetailsAdd: 'ವಿವರಗಳನ್ನು ಸೇರಿಸಿ',
    profileMyGyan: 'ನನ್ನ ಜ್ಞಾನ',
    profileMyActivity: 'ನನ್ನ ಚಟುವಟಿಕೆ',
    profileCallHistory: 'ಕರೆ ಇತಿಹಾಸ',
    profileNoPosts: 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಜ್ಞಾನವನ್ನು ಹಂಚಿಕೊಂಡಿಲ್ಲ.',
    profileNoCalls: 'ನಿಮ್ಮಲ್ಲಿ ಯಾವುದೇ ಕರೆ ಇತಿಹಾಸವಿಲ್ಲ.',
    profileActivityPlaceholder: 'ನಿಮ್ಮ ಚಟುವಟಿಕೆ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.',
    profileLogout: 'ಲಾಗ್ ಔಟ್',
    bankAccountHolder: 'ಖಾತೆದಾರರ ಹೆಸರು',
    bankAccountHolderPlaceholder: 'ಉದಾ. ಆಶಾ ಶರ್ಮಾ',
    bankAccountNumber: 'ಖಾತೆ ಸಂಖ್ಯೆ',
    bankAccountNumberPlaceholder: 'ಉದಾ. 123456789012',
    bankIFSC: 'ಐಎಫ್‌ಎಸ್‌ಸಿ ಕೋಡ್',
    bankIFSCPlaceholder: 'ಉದಾ. HDFC0001234',
    bankUPI: 'ಯುಪಿಐ ಐಡಿ',
    bankUPIPlaceholder: 'ಉದಾ. asha.sharma@okhdfcbank',
    bankSaveButton: 'ವಿವರಗಳನ್ನು ಉಳಿಸಿ',
    dakshinaTitle: 'ಗೆ ಗುರುದಕ್ಷಿಣೆ ಕಳುಹಿಸಿ',
    dakshinaAmountPrompt: 'ಮೊತ್ತವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ನಮೂದಿಸಿ (₹)',
    dakshinaCustomAmountPlaceholder: 'ಅಥವಾ ಕಸ್ಟಮ್ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ',
    dakshinaPayButton: 'ಯುಪಿಐ ಆಪ್ ಬಳಸಿ ಪಾವತಿಸಿ',
    dakshinaOr: '- ಅಥವಾ -',
    dakshinaScanPrompt: 'ಪಾವತಿಸಲು ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    dakshinaQRGeneration: 'ಕ್ಯೂಆರ್ ರಚಿಸಲು ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ',
    callWith: '{callType} ಕರೆ',
    premiumTitle: 'ಉಚಿತ ಸಮಯ ಮುಗಿದಿದೆ!',
    premiumMessage: 'ಜ್ಞಾನಸೇತು ಪ್ರೀಮಿಯಂಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡುವ ಮೂಲಕ ಈ ಒಳನೋಟವುಳ್ಳ ಸಂಭಾಷಣೆಯನ್ನು ಮುಂದುವರಿಸಿ. ಎಲ್ಲಾ ಗುರುಗಳೊಂದಿಗೆ ಅನಿಯಮಿತ ಕರೆ ಸಮಯವನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಿ.',
    premiumGoPremium: 'ಪ್ರೀಮಿಯಂಗೆ ಹೋಗಿ',
    premiumEndCall: 'ಕರೆ ಕೊನೆಗೊಳಿಸಿ',
    callCameraOff: 'ಕ್ಯಾಮೆರಾ ಆಫ್',
    networkGood: 'ಉತ್ತಮ',
    callDuration: 'ಅವಧಿ',
  },
  es: { appName: 'GyanSetu (ES)', close: 'Cerrar (ES)', /* Placeholder */ },
  ta: { appName: 'GyanSetu (TA)', close: 'மூடு (TA)', /* Placeholder */ },
  te: { appName: 'GyanSetu (TE)', close: 'మూసివేయి (TE)', /* Placeholder */ },
  bn: { appName: 'GyanSetu (BN)', close: 'বন্ধ করুন (BN)', /* Placeholder */ },
};

// Fill missing keys for placeholder languages from English
// FIX: The original translations object has properties with different shapes,
// which causes TypeScript type inference issues. Casting to `any` allows
// for dynamically populating the partial translation objects.
['es', 'ta', 'te', 'bn'].forEach(lang => {
  const langKey = lang as keyof typeof translations;
  const mutableTranslations = translations as any;
  
  if (!mutableTranslations[langKey]) {
    mutableTranslations[langKey] = { appName: '', close: '' }; // Ensure object exists
  }

  Object.keys(translations.en).forEach(key => {
    const typedKey = key as TranslationKey;
    if (!mutableTranslations[langKey][typedKey]) {
      mutableTranslations[langKey][typedKey] = translations.en[typedKey];
    }
  });
});


type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, replacements?: { [key: string]: string | number }) => string;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

// --- LAZY LOADED PAGES ---
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DiscoverPage = React.lazy(() => import('./pages/DiscoverPage'));
const CreatePage = React.lazy(() => import('./pages/CreatePage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const CallPage = React.lazy(() => import('./pages/CallPage'));
const GurudakshinaModal = React.lazy(() => import('./components/GurudakshinaModal'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));

// --- INLINE ICONS ---
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.704 4.343a9 9 0 0110.592 0M9.5 21a9 9 0 01-4.657-16.657" />
    </svg>
);
const FeedbackIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);
const CopyrightIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const OwnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);
const SunIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" /></svg>;
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const SystemIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

// --- LOCALIZED INLINE COMPONENTS ---
const CopyrightModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLocalization();
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 animate-fadeIn relative">
                <h2 className="text-2xl font-bold text-deepBlue-900 dark:text-gray-100 mb-4">{t('appCopyrightDesc')}</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm max-h-[60vh] overflow-y-auto pr-2">
                    <p><strong>{t('copyrightLine1')}</strong></p>
                    <p>{t('copyrightLine2')}</p>
                    <p>{t('copyrightLine3')}</p>
                    <p>{t('copyrightLine4')}</p>
                    <p>{t('copyrightLine5')}</p>
                    <hr className="my-3 dark:border-gray-600"/>
                    <p><strong>{t('copyrightExample')}</strong></p>
                    <p>{t('copyrightExampleText')}</p>
                </div>
                <div className="flex justify-end pt-4 mt-4 border-t dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-semibold">{t('close')}</button>
                </div>
            </div>
        </div>
    );
};

const FeedbackModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLocalization();
    const [feedback, setFeedback] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback.trim()) {
            try {
                const feedbacksJson = localStorage.getItem('gyansetu-feedbacks');
                const feedbacks: FeedbackRecord[] = feedbacksJson ? JSON.parse(feedbacksJson) : [];
                const newFeedback: FeedbackRecord = {
                    id: `feedback_${Date.now()}`,
                    feedbackText: feedback.trim(),
                    timestamp: new Date().toISOString()
                };
                feedbacks.unshift(newFeedback);
                localStorage.setItem('gyansetu-feedbacks', JSON.stringify(feedbacks));
                alert('Thank you for your feedback!');
                onClose();
            } catch (err) {
                console.error("Failed to save feedback", err);
                alert("Could not submit feedback, please try again.");
            }
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-fadeIn relative">
                <h2 className="text-2xl font-bold text-deepBlue-900 dark:text-gray-100 mb-4">{t('appFeedback')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={5} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm" 
                        placeholder={t('feedbackPlaceholder')}
                    />
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">{t('cancel')}</button>
                        <button type="submit" className="px-6 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-semibold">{t('submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OwnerDashboardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLocalization();
    const [activeTab, setActiveTab] = useState('analytics');

    // Data states
    const [stats, setStats] = useState({ totalUsers: 0, gurus: 0, shishyas: 0, posts: 0, calls: 0 });
    const [allUsers, setAllUsers] = useState<StoredUser[]>([]);
    const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
    const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
    const [ownerBankDetails, setOwnerBankDetails] = useState<BankDetails | null>(null);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);

    useEffect(() => {
        try {
            const usersJson = localStorage.getItem('gyansetu-users');
            const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];
            const postsJson = localStorage.getItem('gyansetu-posts');
            const posts: Post[] = postsJson ? JSON.parse(postsJson) : [];
            const callsJson = localStorage.getItem('gyansetu-call-history');
            const calls: CallRecord[] = callsJson ? JSON.parse(callsJson) : [];
            const feedbacksJson = localStorage.getItem('gyansetu-feedbacks');
            const feedbacks: FeedbackRecord[] = feedbacksJson ? JSON.parse(feedbacksJson) : [];
            const commissionsJson = localStorage.getItem('gyansetu-commissions');
            const commissions: CommissionRecord[] = commissionsJson ? JSON.parse(commissionsJson) : [];
            const bankDetailsJson = localStorage.getItem('gyansetu-owner-bank-details');
            const bankDetails: BankDetails | null = bankDetailsJson ? JSON.parse(bankDetailsJson) : null;
            
            setAllUsers(users);
            setFeedbacks(feedbacks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            setCommissions(commissions);
            setOwnerBankDetails(bankDetails);
            setStats({
                totalUsers: users.length,
                gurus: users.filter(u => u.role === 'guru').length,
                shishyas: users.filter(u => u.role === 'shishya').length,
                posts: posts.length,
                calls: calls.length,
            });
        } catch (e) {
            console.error("Failed to load owner dashboard data", e);
        }
    }, []);

    const totalCommission = useMemo(() => {
        return commissions.reduce((sum, record) => sum + record.commissionAmount, 0);
    }, [commissions]);

    const handleSaveBankDetails = (details: BankDetails) => {
        try {
            localStorage.setItem('gyansetu-owner-bank-details', JSON.stringify(details));
            setOwnerBankDetails(details);
            setIsBankModalOpen(false);
            alert("Bank details have been saved successfully.");
        } catch (e) {
            console.error("Failed to save owner bank details", e);
            alert("Could not save bank details.");
        }
    };

    const formatDate = (isoString: string) => new Date(isoString).toLocaleString();
    const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
    
    const TabButton: React.FC<{ tabName: string; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${activeTab === tabName ? 'bg-white dark:bg-gray-700 text-saffron-600 dark:text-saffron-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
            {label}
        </button>
    );

    const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg flex items-center gap-4">
            <div className="p-3 rounded-full bg-saffron-100 dark:bg-saffron-900 text-saffron-600 dark:text-saffron-300">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
            </div>
        </div>
    );

    const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
    const PostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    const CallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;

    return (
        <>
            {isBankModalOpen && (
                <BankDetailsModal 
                    initialDetails={ownerBankDetails}
                    onSave={handleSaveBankDetails}
                    onClose={() => setIsBankModalOpen(false)}
                />
            )}
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-6 animate-fadeIn relative max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-gray-700">
                         <h2 className="text-2xl font-bold text-deepBlue-900 dark:text-gray-100">{t('ownerDashboard')}</h2>
                         <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold">&times;</button>
                    </div>
                    
                    <div className="flex border-b border-gray-200 dark:border-gray-700 -mx-6 px-6">
                        <TabButton tabName="analytics" label={t('ownerAnalytics')} />
                        <TabButton tabName="users" label={t('ownerUserManagement')} />
                        <TabButton tabName="reviews" label={t('ownerAppReviews')} />
                        <TabButton tabName="settings" label={t('ownerSettings')} />
                    </div>

                    <div className="flex-grow overflow-y-auto pt-6 pr-2">
                        {activeTab === 'analytics' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <StatCard title={t('ownerTotalUsers')} value={stats.totalUsers} icon={<UsersIcon />} />
                                    <StatCard title={t('ownerGurus')} value={stats.gurus} icon={<OwnerIcon className="h-6 w-6"/>} />
                                    <StatCard title={t('ownerShishyas')} value={stats.shishyas} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12.5l4-2.222m-4 2.222V20m0-7.5l4 2.222M23 12.5l-4-2.222m4 2.222V20m0-7.5l-4 2.222M12 22v-7.5M7.5 15l-3-1.667" /></svg>} />
                                    <StatCard title={t('ownerTotalPosts')} value={stats.posts} icon={<PostIcon />} />
                                    <StatCard title={t('ownerTotalCalls')} value={stats.calls} icon={<CallIcon />} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{t('ownerRevenueOverview')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
                                            <p className="text-sm font-medium text-green-800 dark:text-green-300">{t('ownerTotalCommission')}</p>
                                            <p className="text-3xl font-bold text-green-900 dark:text-green-200">{formatCurrency(totalCommission)}</p>
                                        </div>
                                        <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">{t('ownerTotalTransactions')}</p>
                                            <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">{commissions.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'users' && (
                             <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">{t('ownerAllUsers')}</h3>
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden border dark:border-gray-700">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                         <thead className="bg-gray-100 dark:bg-gray-800">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('ownerUserRole')}</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('ownerUserEmail')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                                            {allUsers.filter(u => u.username !== APP_OWNER_USERNAME).map(user => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">{user.role}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {allUsers.filter(u => u.username !== APP_OWNER_USERNAME).length === 0 && <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">{t('ownerNoUsers')}</p>}
                                </div>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{t('ownerAppReviews')}</h3>
                                <div className="space-y-3">
                                    {feedbacks.length > 0 ? feedbacks.map(fb => (
                                        <div key={fb.id} className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border dark:border-gray-700">
                                            <p className="text-sm text-gray-800 dark:text-gray-200">{fb.feedbackText}</p>
                                            <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-2">{formatDate(fb.timestamp)}</p>
                                        </div>
                                    )) : <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">{t('ownerNoFeedback')}</p>}
                                </div>
                            </div>
                        )}
                        {activeTab === 'settings' && (
                             <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{t('ownerBankDetails')}</h3>
                                    <button onClick={() => setIsBankModalOpen(true)} className="text-sm bg-deepBlue-100 dark:bg-deepBlue-900 text-deepBlue-800 dark:text-deepBlue-200 px-3 py-1 rounded-full hover:bg-deepBlue-200 dark:hover:bg-deepBlue-800 font-semibold">
                                        {ownerBankDetails ? t('profileBankDetailsEdit') : t('profileBankDetailsAdd')}
                                    </button>
                                </div>
                                {ownerBankDetails ? (
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <p><strong>Holder:</strong> {ownerBankDetails.accountHolder}</p>
                                        <p><strong>Account:</strong> ****{ownerBankDetails.accountNumber.slice(-4)}</p>
                                        <p><strong>IFSC:</strong> {ownerBankDetails.ifsc}</p>
                                        <p><strong>UPI:</strong> {ownerBankDetails.upiId}</p>
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{t('ownerNoBankDetails')}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};


const SideNav: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onFeedbackClick: () => void; 
    onCopyrightClick: () => void;
    onOwnerDashboardClick: () => void; 
    theme: Theme; 
    onThemeChange: (theme: Theme) => void;
    currentUser: LoggedInUser | null;
}> = ({ isOpen, onClose, onFeedbackClick, onCopyrightClick, onOwnerDashboardClick, theme, onThemeChange, currentUser }) => {
    const { t, language, setLanguage } = useLocalization();
    
    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as Language);
    };

    return (
        <div 
            className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div 
                className={`relative h-full w-80 bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-deepBlue-900 dark:text-gray-100 mb-8">{t('menuTitle')}</h2>
                    <nav className="flex flex-col space-y-2">
                       <div className="flex items-center text-lg text-gray-700 dark:text-gray-300">
                            <GlobeIcon className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400"/>
                            <select value={language} onChange={handleLanguageChange} className="bg-transparent flex-1 focus:outline-none appearance-none">
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                                <option value="es">Spanish</option>
                                <option value="kn">Kannada</option>
                                <option value="ta">Tamil</option>
                                <option value="te">Telugu</option>
                                <option value="bn">Bengali</option>
                            </select>
                       </div>
                       <a href="https://whatsapp.com/channel/0029VbBXkkMCxoAyzASG1F0Y" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-700 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-saffron-400 p-2 rounded-md">{t('support')}</a>
                       <a href="mailto:gabittukaram@gmail.com" className="text-lg text-gray-700 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-saffron-400 p-2 rounded-md">{t('contactUs')}</a>
                       <button onClick={onFeedbackClick} className="text-lg text-gray-700 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-saffron-400 p-2 rounded-md text-left flex items-center">
                            <FeedbackIcon className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400"/> {t('appFeedback')}
                       </button>
                       <button onClick={onCopyrightClick} className="text-lg text-gray-700 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-saffron-400 p-2 rounded-md text-left flex items-center">
                            <CopyrightIcon className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400"/> {t('copyright')}
                       </button>
                       
                       {currentUser?.username === APP_OWNER_USERNAME && (
                           <button onClick={onOwnerDashboardClick} className="text-lg text-gray-700 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-saffron-400 p-2 rounded-md text-left flex items-center">
                                <OwnerIcon className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400"/> {t('ownerDashboard')}
                           </button>
                       )}

                       <div className="pt-4 mt-4 border-t dark:border-gray-700">
                           <h3 className="px-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('theme')}</h3>
                           <div className="mt-2 flex justify-around items-center bg-gray-100 dark:bg-gray-900 rounded-full p-1">
                               <button onClick={() => onThemeChange('light')} className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`} aria-label={t('themeLight')}>
                                   <SunIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                               </button>
                               <button onClick={() => onThemeChange('dark')} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`} aria-label={t('themeDark')}>
                                   <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                               </button>
                               <button onClick={() => onThemeChange('system')} className={`p-2 rounded-full transition-colors ${theme === 'system' ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`} aria-label={t('themeSystem')}>
                                   <SystemIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                               </button>
                           </div>
                       </div>
                       
                       <div className="flex space-x-4 pt-4 border-t dark:border-gray-700 mt-4">
                           <a href="https://whatsapp.com/channel/0029VbBXkkMCxoAyzASG1F0Y" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-deepBlue-700 dark:hover:text-deepBlue-400">WhatsApp</a>
                           <a href="https://www.instagram.com/tukaram_gabit1234/tagged/" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-deepBlue-700 dark:hover:text-deepBlue-400">Instagram</a>
                       </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP PROVIDER ---
const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('gyansetu-language') as Language) || 'en');

  useEffect(() => {
    localStorage.setItem('gyansetu-language', language);
  }, [language]);

  const t = useMemo<(key: TranslationKey, replacements?: { [key: string]: string | number; }) => string>(() => (key, replacements) => {
    let text = translations[language]?.[key] || translations.en[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            text = text.replace(`{${rKey}}`, String(replacements[rKey]));
        });
    }
    return text;
  }, [language]);

  const localizationContextValue = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LocalizationContext.Provider value={localizationContextValue}>
      <AppContent />
    </LocalizationContext.Provider>
  );
};


// --- APP CONTENT & LOGIC ---
const AppContent: React.FC = () => {
  const { t } = useLocalization();
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [callInfo, setCallInfo] = useState<{ guru: Guru; type: CallType } | null>(null);
  const [dakshinaTarget, setDakshinaTarget] = useState<{ guru: Guru; post: Post } | null>(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isCopyrightModalOpen, setIsCopyrightModalOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('gyansetu-theme') as Theme) || 'system');

  useEffect(() => {
    localStorage.setItem('gyansetu-theme', theme);
    const root = window.document.documentElement;

    const applyTheme = () => {
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };
    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme]);

  useEffect(() => {
    const savedUserJson = localStorage.getItem('gyansetu-session');
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson) as LoggedInUser;
        setCurrentUser(savedUser);
      } catch (error) {
        console.error("Failed to parse saved user session", error);
        localStorage.removeItem('gyansetu-session');
      }
    }
    setIsAuthLoading(false);
  }, []);

  const startCall = (guru: Guru, type: CallType) => setCallInfo({ guru, type });
  const endCall = () => setCallInfo(null);
  const openDakshinaModal = (post: Post) => setDakshinaTarget({ guru: post.guru, post });
  const closeDakshinaModal = () => setDakshinaTarget(null);

  const handleLogout = () => {
    localStorage.removeItem('gyansetu-session');
    setCurrentUser(null);
    setActivePage('home');
  };
  
  const handleAuthSuccess = (user: LoggedInUser) => {
    setCurrentUser(user);
    setActivePage('home');
  };

  if (isAuthLoading) return <Spinner />;

  if (!currentUser) {
    return (
      <Suspense fallback={<Spinner />}>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </Suspense>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage currentUser={currentUser} openDakshinaModal={openDakshinaModal} setActivePage={setActivePage} />;
      case 'discover': return <DiscoverPage startCall={startCall} />;
      case 'create': return currentUser.role === 'guru' ? <CreatePage currentUser={currentUser as Guru} /> : <HomePage currentUser={currentUser} openDakshinaModal={openDakshinaModal} setActivePage={setActivePage} />;
      case 'profile': return <ProfilePage currentUser={currentUser} startCall={startCall} openDakshinaModal={openDakshinaModal} onLogout={handleLogout} />;
      default: return <HomePage currentUser={currentUser} openDakshinaModal={openDakshinaModal} setActivePage={setActivePage}/>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-deepBlue-950 font-sans">
      <SideNav 
        isOpen={isSideNavOpen} 
        onClose={() => setIsSideNavOpen(false)}
        onFeedbackClick={() => { setIsFeedbackModalOpen(true); setIsSideNavOpen(false); }} 
        onCopyrightClick={() => { setIsCopyrightModalOpen(true); setIsSideNavOpen(false); }}
        onOwnerDashboardClick={() => { setIsOwnerModalOpen(true); setIsSideNavOpen(false); }}
        theme={theme}
        onThemeChange={setTheme}
        currentUser={currentUser}
      />
      {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} />}
      {isCopyrightModalOpen && <CopyrightModal onClose={() => setIsCopyrightModalOpen(false)} />}
      {isOwnerModalOpen && <OwnerDashboardModal onClose={() => setIsOwnerModalOpen(false)} />}

      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-deepBlue-900 dark:text-gray-100">
            {t('headerTitleHindi')} <span className="text-saffron-600 dark:text-saffron-400">{t('headerTitle')}</span>
          </h1>
          <button 
            onClick={() => setIsSideNavOpen(true)}
            className="p-2 rounded-full text-deepBlue-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={t('openMenu')}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24 page-transition" key={activePage}>
        <Suspense fallback={<Spinner />}>
          {renderPage()}
        </Suspense>
      </main>

      {callInfo && (
        <Suspense fallback={<Spinner />}>
          <CallPage guru={callInfo.guru} type={callInfo.type} onEndCall={endCall} currentUser={currentUser} />
        </Suspense>
      )}

      {dakshinaTarget && (
        <Suspense fallback={<Spinner />}>
          <GurudakshinaModal 
            guru={dakshinaTarget.guru} 
            post={dakshinaTarget.post} 
            onClose={closeDakshinaModal} 
            currentUser={currentUser}
          />
        </Suspense>
      )}

      {!callInfo && <BottomNav activePage={activePage} setActivePage={setActivePage} userRole={currentUser.role} />}
    </div>
  );
};

export default App;