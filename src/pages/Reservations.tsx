import axios from 'axios';
import { useEffect, useState } from 'react';

interface User {
  user_id: number;
  name: string;
  email: string;
  phone_number: string;
}

interface Reservation {
  reservation_id: number;
  user: User;
  customer_first_name: string;
  customer_last_name: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  special_requests: string | null;
  reservation_duration: number;
  reservation_status: string;
  check_in_status: string;
  notes: string | null;
}

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editingReservationId, setEditingReservationId] = useState<
    number | null
  >(null);
  const [formData, setFormData] = useState<Partial<Reservation>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const fetchData = async () => {
    setLoading(true);
    try {
      axios
        .get('/inventory/reservations')
        .then((response) => setReservations(response.data));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservationId(reservation.reservation_id);
    setFormData(reservation);
  };

  const handleSave = (reservationId: number) => {
    axios.put('/inventory/reservations', {
      reservation_id: reservationId,
      ...formData,
    });
    setEditingReservationId(null);
    fetchData();
  };

  const handleDelete = (reservationId: number) => {
    axios.delete('/inventory/reservations', {
      data: { reservation_id: reservationId },
    });
  };

  return (
    <div>
      <h1>Reservations</h1>
      <button>Add Reservation</button>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Customer First Name</th>
            <th>Customer Last Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Number of Guests</th>
            <th>Special Requests</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation: Reservation) => (
            <tr key={reservation.reservation_id}>
              <td>{reservation.reservation_id}</td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <input
                    type="text"
                    name="user"
                    value={formData.user?.name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  reservation.user.name
                )}
              </td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <input
                    name="customer_first_name"
                    value={formData.customer_first_name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  reservation.customer_first_name
                )}
              </td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <input
                    type="text"
                    name="customer_last_name"
                    value={formData.customer_last_name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  reservation.customer_last_name
                )}
              </td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <input
                    type="date"
                    name="reservation_date"
                    value={formData.reservation_date || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  reservation.reservation_date
                )}
              </td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <input
                    type="datetime-local"
                    name="reservation_time"
                    value={formData.reservation_time || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  reservation.reservation_time
                )}
              </td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <input
                    type="number"
                    name="number_of_guests"
                    value={formData.number_of_guests || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  reservation.number_of_guests
                )}
              </td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <input
                    type="number"
                    name="reservation_duration"
                    value={formData.reservation_duration || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  reservation.reservation_duration
                )}
              </td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <select
                    name="reservation_status"
                    value={formData.reservation_status || ''}
                    onChange={handleInputChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Booked">Booked</option>
                    <option value="Canceled">Canceled</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  reservation.reservation_status
                )}
              </td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <select
                    name="check_in_status"
                    value={formData.check_in_status || ''}
                    onChange={handleInputChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Checked In">Checked In</option>
                    <option value="No Show">No Show</option>
                  </select>
                ) : (
                  reservation.check_in_status
                )}
              </td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <>
                    <button
                      onClick={() => handleSave(reservation.reservation_id)}
                    >
                      Save
                    </button>
                    <button onClick={() => setEditingReservationId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(reservation)}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.reservation_id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
