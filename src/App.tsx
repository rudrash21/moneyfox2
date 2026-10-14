import React, { useState, useEffect } from 'react';
import { ScreenView, DeliveryAddress, SponsorInfo, OrderRecord, UserProfile } from './types';
import { Header } from './components/common/Header';
import { EditorialFooter } from './components/common/EditorialFooter';
import { TaxInvoiceModal } from './components/common/TaxInvoiceModal';

import { PublicStorefront } from './components/public/PublicStorefront';
import { ProductDetailView } from './components/shop/ProductDetailView';
import { CartOrderReview } from './components/checkout/CartOrderReview';
import { DeliveryAndSponsor } from './components/checkout/DeliveryAndSponsor';
import { UpiPaymentStep } from './components/checkout/UpiPaymentStep';
import { PaymentVerificationPending } from './components/checkout/PaymentVerificationPending';
import { ApprovedOrderGuild } from './components/checkout/ApprovedOrderGuild';

import { LoginView } from './components/auth/LoginView';
import { AdminLoginView } from './components/auth/AdminLoginView';
import { PasswordRecoveryFlow } from './components/auth/PasswordRecoveryFlow';

import { MemberTerminalLayout } from './components/member/MemberTerminalLayout';
import { AdminTerminalLayout } from './components/admin/AdminTerminalLayout';
import { StatesGalleryView } from './components/common/StatesGalleryView';

import { CURRENT_USER, INITIAL_ORDERS } from './data/mockData';
import { authService } from './lib/authService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('storefront');
  const [cartCount, setCartCount] = useState<number>(1);
  const [selectedProductId, setSelectedProductId] = useState<string>('chill-black');
  const [selectedEdition, setSelectedEdition] = useState<'noir' | 'ivory'>('noir');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('L');
  const [utrNumber, setUtrNumber] = useState<string>('429910488219');
  const [activeOrderId, setActiveOrderId] = useState<string>('ORD-MFX-99412');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>(CURRENT_USER.deliveryAddress);
  const [sponsorInfo, setSponsorInfo] = useState<SponsorInfo>({
    sponsorId: 'mf00000',
    sponsorName: 'Admin System Root',
    isValid: true,
    joinBenchInstead: false,
  });

  const [isTaxInvoiceOpen, setIsTaxInvoiceOpen] = useState<boolean>(false);
  const [invoiceOrder, setInvoiceOrder] = useState<OrderRecord>(INITIAL_ORDERS[0]);

  // Load existing Supabase user session on startup
  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      const user = await authService.getCurrentUser();
      if (isMounted && user) {
        setCurrentUser(user);
        if (user.role === 'admin') {
          // Keep currentScreen if already set or storefront
        }
      }
    };
    initAuth();

    const { data: authListener } = authService.onAuthStateChange((user) => {
      if (isMounted) {
        setCurrentUser(user);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Handle navigation
  const handleNavigate = (screen: ScreenView) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Flow handlers
  const handleSelectProductAndBuy = (productId: string, size: 'S' | 'M' | 'L' | 'XL') => {
    setSelectedProductId(productId);
    setSelectedSize(size);
    setCartCount(1);
    handleNavigate('cart-review');
  };

  const handleAddToCartAndProceed = (productId: string, size: 'S' | 'M' | 'L' | 'XL') => {
    setSelectedProductId(productId);
    setSelectedSize(size);
    setCartCount(1);
    handleNavigate('cart-review');
  };

  const handleViewProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    handleNavigate('product-detail');
  };

  const handleProceedToDelivery = () => {
    handleNavigate('delivery-sponsor');
  };

  const handleProceedToPayment = (address: DeliveryAddress, sponsor: SponsorInfo) => {
    setDeliveryAddress(address);
    setSponsorInfo(sponsor);
    handleNavigate('upi-payment');
  };

  const handlePaymentSubmitted = (utr: string, orderId?: string) => {
    setUtrNumber(utr);
    if (orderId) setActiveOrderId(orderId);
    handleNavigate('verification-pending');
  };

  const handleSimulateApprove = () => {
    handleNavigate('approved-guild');
  };

  const handleOpenTaxInvoice = (order?: OrderRecord) => {
    if (order) setInvoiceOrder(order);
    setIsTaxInvoiceOpen(true);
  };

  const handleLoginSuccess = (role: 'member' | 'admin', user?: UserProfile) => {
    if (user) setCurrentUser(user);
    if (role === 'admin') {
      handleNavigate('admin-terminal');
    } else {
      handleNavigate('member-terminal');
    }
  };

  const handleAdminLoginSuccess = (user?: UserProfile) => {
    if (user) setCurrentUser(user);
    handleNavigate('admin-terminal');
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setCurrentUser(null);
    handleNavigate('storefront');
  };

  // Check if current screen uses its own custom layout (Member & Admin terminals)
  const isTerminalLayout = currentScreen === 'member-terminal' || currentScreen === 'admin-terminal';

  return (
    <div className="min-h-screen bg-noir-950 text-parchment-100 flex flex-col font-sans selection:bg-amberfox selection:text-noir-950 overflow-x-hidden w-full max-w-full">
      {/* Top Header (Shown on public & shopping screens) */}
      {!isTerminalLayout && (
        <Header
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          cartCount={cartCount}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {currentScreen === 'storefront' && (
          <PublicStorefront
            onNavigate={handleNavigate}
            onSelectProductAndBuy={handleSelectProductAndBuy}
            onViewProductDetail={handleViewProductDetail}
          />
        )}

        {currentScreen === 'product-detail' && (
          <ProductDetailView
            onNavigate={handleNavigate}
            onAddToCartAndProceed={handleAddToCartAndProceed}
            selectedProductId={selectedProductId}
            onSelectProduct={(id) => setSelectedProductId(id)}
          />
        )}

        {currentScreen === 'cart-review' && (
          <CartOrderReview
            onNavigate={handleNavigate}
            onProceedToDelivery={handleProceedToDelivery}
            selectedSize={selectedSize}
            onUpdateSize={(s) => setSelectedSize(s)}
            selectedEdition={selectedEdition}
            selectedProductId={selectedProductId}
          />
        )}

        {currentScreen === 'delivery-sponsor' && (
          <DeliveryAndSponsor
            onNavigate={handleNavigate}
            onProceedToPayment={handleProceedToPayment}
            onBackToReview={() => handleNavigate('cart-review')}
            selectedSize={selectedSize}
          />
        )}

        {currentScreen === 'upi-payment' && (
          <UpiPaymentStep
            onNavigate={handleNavigate}
            onPaymentSubmitted={handlePaymentSubmitted}
            onBackToDelivery={() => handleNavigate('delivery-sponsor')}
            deliveryAddress={deliveryAddress}
            sponsorInfo={sponsorInfo}
            selectedSize={selectedSize}
            currentUser={currentUser}
          />
        )}

        {currentScreen === 'verification-pending' && (
          <PaymentVerificationPending
            onNavigate={handleNavigate}
            onSimulateApprove={handleSimulateApprove}
            utrNumber={utrNumber}
          />
        )}

        {currentScreen === 'approved-guild' && (
          <ApprovedOrderGuild
            onNavigate={handleNavigate}
            onOpenTaxInvoice={() => handleOpenTaxInvoice()}
            onOpenMemberDashboard={() => handleNavigate('member-terminal')}
          />
        )}

        {currentScreen === 'login' && (
          <LoginView
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={() => handleNavigate('password-recovery')}
          />
        )}

        {currentScreen === 'admin-login' && (
          <AdminLoginView
            onNavigate={handleNavigate}
            onAdminLoginSuccess={handleAdminLoginSuccess}
          />
        )}

        {currentScreen === 'password-recovery' && (
          <PasswordRecoveryFlow
            onNavigate={handleNavigate}
            onBackToLogin={() => handleNavigate('login')}
          />
        )}

        {currentScreen === 'member-terminal' && (
          <MemberTerminalLayout
            onNavigate={handleNavigate}
            onOpenInvoice={(ord) => handleOpenTaxInvoice(ord)}
            currentUser={currentUser}
            onSignOut={handleSignOut}
          />
        )}

        {currentScreen === 'admin-terminal' && (
          <AdminTerminalLayout
            onNavigate={handleNavigate}
            onPaymentApprovedNotification={() => handleNavigate('approved-guild')}
            currentUser={currentUser}
            onSignOut={handleSignOut}
          />
        )}

        {currentScreen === 'states-gallery' && (
          <StatesGalleryView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global Editorial Footer (on public & shopping flows) */}
      {!isTerminalLayout && <EditorialFooter onNavigate={handleNavigate} />}

      {/* Interactive Official Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={isTaxInvoiceOpen}
        onClose={() => setIsTaxInvoiceOpen(false)}
        orderId={invoiceOrder.orderId}
        invoiceId={invoiceOrder.invoiceId}
        date={invoiceOrder.date}
        customerName={invoiceOrder.deliveryAddress.fullName}
        customerAddress={`${invoiceOrder.deliveryAddress.apartment}, ${invoiceOrder.deliveryAddress.street}, ${invoiceOrder.deliveryAddress.city}`}
        amount={invoiceOrder.total}
      />
    </div>
  );
}
