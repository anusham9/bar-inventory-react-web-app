import axios from 'axios';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

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

  return <div>Notifications</div>;
}
