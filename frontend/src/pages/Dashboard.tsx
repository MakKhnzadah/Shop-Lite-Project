import React, { useEffect } from 'react';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { useGetUserOrdersQuery } from '../features/api/apiSlice';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { data: orders, isLoading, error, refetch } = useGetUserOrdersQuery();

  useEffect(() => {
    // Refresh orders when component mounts
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <div className="text-center py-5">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        Error loading dashboard data. Please try again later.
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Dashboard</h1>

      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Welcome, {user?.firstName || user?.username}</h5>
              <p className="card-text">
                Here you can manage your account and track your orders.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="dashboard-stat">
            <div className="dashboard-stat-title">Total Orders</div>
            <div className="dashboard-stat-value">{orders?.length || 0}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dashboard-stat">
            <div className="dashboard-stat-title">Pending Orders</div>
            <div className="dashboard-stat-value">
              {orders?.filter((order) => order.status === 'PENDING').length || 0}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dashboard-stat">
            <div className="dashboard-stat-title">Completed Orders</div>
            <div className="dashboard-stat-value">
              {orders?.filter((order) => order.status === 'DELIVERED').length || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h3>Recent Orders</h3>
          {orders && orders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            order.status === 'DELIVERED'
                              ? 'bg-success'
                              : order.status === 'CANCELLED'
                              ? 'bg-danger'
                              : 'bg-warning'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>
                        <a
                          href={`/orders/${order.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-3">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;