import axios from 'axios';
import { useEffect, useState } from 'react';

interface Reservation {
  reservation_id: number;
  user: string;
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
  const [formData, setFormData] = useState<Partial<Reservation>>({
    check_in_status: 'Pending',
    reservation_status: 'Pending',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showCancelOption, setShowCancelOption] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      axios.get('/inventory/reservations').then((response) => {
        console.log('Response received:', response.data);
        setReservations(response.data);
      });
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

    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.reservation_id === reservationId
          ? { ...reservation, ...formData }
          : reservation
      )
    );
    setEditingReservationId(null);
  };

  const handleAddReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddForm(true);

    try {
      const time = formData.reservation_time; // Get time in HH:MM format
      const currentDate =
        formData.reservation_date || new Date().toISOString().split('T')[0];
      const isoDatetime = `${currentDate}T${time}:00Z`; // Combine into ISO format

      // Prepare payload for API
      const payload = {
        ...formData,
        reservation_time: isoDatetime,
        reservation_status: formData.reservation_status || 'Pending',
        check_in_status: formData.check_in_status || 'Pending',
      };
      console.log(payload);
      const response = await axios.post('/inventory/reservations', payload);
      const newReservation = response.data;

      console.log('New reservation:', newReservation);

      // Update state
      // fetchData();
      setReservations([...reservations, newReservation]);
      setShowAddForm(false);
      setShowCancelOption(false);
      setFormData({});
    } catch (error) {
      console.error('Error adding reservation:', error);
      alert('Failed to add reservation. Please try again.');
    }
  };

  const handleDelete = (reservationId: number) => {
    axios.delete('/inventory/reservations', {
      data: { reservation_id: reservationId },
    });
    setReservations((prevReservations) =>
      prevReservations.filter(
        (reservation) => reservation.reservation_id !== reservationId
      )
    );
  };

  return (
    <div className="inventory-container">
      {' '}
      <h1 className="inventory-title">Reservations</h1>
      <button
        className="add-button"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Cancel' : 'Add Reservation'}
      </button>
      {showAddForm && (
        <form onSubmit={handleAddReservation} className="reservation-form">
          <input
            type="text"
            name="user"
            placeholder="User"
            value={formData.user}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="customer_first_name"
            placeholder="First Name"
            value={formData.customer_first_name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="customer_last_name"
            placeholder="Last Name"
            value={formData.customer_last_name}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="reservation_date"
            value={formData.reservation_date}
            onChange={handleInputChange}
          />
          <input
            type="time"
            name="reservation_time"
            value={formData.reservation_time}
            onChange={(e) => {
              const time = e.target.value; // Keep the time in HH:MM format
              setFormData({ ...formData, reservation_time: time });
            }}
          />
          <input
            type="number"
            name="number_of_guests"
            placeholder="Guests"
            value={formData.number_of_guests}
            onChange={handleInputChange}
          />
          <textarea
            name="special_requests"
            placeholder="Special Requests"
            value={formData.special_requests || ''}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="reservation_duration"
            placeholder="Duration"
            value={formData.reservation_duration}
            onChange={handleInputChange}
          />
          <select
            name="reservation_status"
            value={formData.reservation_status || 'Pending'}
            onChange={handleInputChange}
          >
            <option value="Pending">Pending</option>
            <option value="Booked">Booked</option>
            <option value="Canceled">Canceled</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            name="check_in_status"
            value={formData.check_in_status || 'Pending'}
            onChange={handleInputChange}
          >
            <option value="Pending">Pending</option>
            <option value="Checked In">Checked In</option>
            <option value="No Show">No Show</option>
          </select>
          <button type="submit">Save</button>
        </form>
      )}
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
                    value={formData.user || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  reservation.user
                )}
              </td>
              <td>
                {editingReservationId === reservation.reservation_id ? (
                  <input
                    name="customer_first_name"
                    value={formData.customer_first_name}
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
                    value={formData.customer_last_name}
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
                    value={formData.reservation_status}
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
