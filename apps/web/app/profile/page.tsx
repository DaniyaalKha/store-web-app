'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/Profile';
import EditProfileModal from '../components/EditProfileModal';
import OrderListOrder from '../components/OrderListOrder';
import { Button } from '@/components/ui/button';
import styles from './profile.module.css';
import { useAuth } from '@/lib/use-auth';

interface Order {
  id: string;
  date: string;
  orderNumber: string;
  status: string;
  total: string;
  products?: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
  orderTime?: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, refreshSession } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'customer')) {
      // redirect to home if not authenticated
      router.push('/');
    }
  }, [user, loading, router]);

  // initialise user profile from auth user
  useEffect(() => {
    if (user) {
      setUserProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
      });
    }
  }, [user]);

  // fetch user's orders
  useEffect(() => {
    if (user && !loading) {
      fetchOrders();
    }
  }, [user, loading]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await fetch('/api/user/orders', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders);
      setFilteredOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderTime || order.date);
        return orderDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderTime || order.date);
        return orderDate <= end;
      });
    }

    setFilteredOrders(filtered);
  };

  const handleFilterClick = () => {
    filterOrders();
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleProfileUpdate = async (
    profile: UserProfile,
    currentPassword?: string,
    newPassword?: string
  ) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          ...(currentPassword && { currentPassword }),
          ...(newPassword && { newPassword }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      const data = await response.json();
      setUserProfile(profile);
      
      // refresh session to get updated user data
      await refreshSession();
      
      setIsEditModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* profile container */}
          {userProfile && (
            <>
              <Profile
                firstName={userProfile.firstName}
                lastName={userProfile.lastName}
                onEditClick={() => setIsEditModalOpen(true)}
              />
              
              <EditProfileModal
                isOpen={isEditModalOpen}
                user={userProfile}
                onConfirm={handleProfileUpdate}
                onClose={() => setIsEditModalOpen(false)}
              />
            </>
          )}

          {/* orders container */}
          <section className={styles.container}>
            <h1 className={styles.heading}>My Orders</h1>

            {/* date range filter */}
            <div className={styles.dateFilterContainer}>
              <div className={styles.dateFilterGroup}>
                <label htmlFor="startDate" className={styles.dateLabel}>
                  Start Date:
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={styles.dateInput}
                />
              </div>
              <div className={styles.dateFilterGroup}>
                <label htmlFor="endDate" className={styles.dateLabel}>
                  End Date:
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={styles.dateInput}
                />
              </div>
              <Button className={styles.filterButton} onClick={handleFilterClick}>
                Filter
              </Button>
            </div>

            {/* orders list */}
            {isLoadingOrders ? (
              <p className={styles.loadingText}>Loading orders...</p>
            ) : filteredOrders.length > 0 ? (
              <div className={styles.ordersContainer}>
                {filteredOrders.map((order) => (
                  <OrderListOrder
                    key={order.id}
                    order={order}
                    isExpanded={expandedOrders[order.id] || false}
                    onToggleExpand={toggleOrderExpand}
                  />
                ))}
              </div>
            ) : (
              <p className={styles.noOrdersText}>No orders found</p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
