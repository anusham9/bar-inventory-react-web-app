import axios from 'axios';
import { useEffect, useState } from 'react';
import { CiRead } from 'react-icons/ci';
import { CiUnread } from 'react-icons/ci';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  //write a check to see if the user role is manager
  useEffect(() => {
    axios
      .get('/inventory/notifications')
      .then((response) => {
        console.log(response.data);
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error('Cannot get notifications: ', error);
      });
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Product</th>
            <th>Manager</th>
            <th>Amount to be Ordered</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.notification_no}>
              <td>{notification.notification_timestamp}</td>
              <td>{notification.product}</td>
              <td>{notification.manager}</td>
              <td>{notification.amount_needed_to_be_reordered}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
