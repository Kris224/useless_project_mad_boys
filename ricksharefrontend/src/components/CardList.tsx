import React, { useEffect, useState } from "react";
import Card from "../components/Card"; // Assume Card component is defined elsewhere
import api from "../api/api"; // Import your API instance

interface Trip {
  id: string;
  name: string;
  starting: string;
  destination: string;
  date: string;
  time: string;
  created_by: string;
  members: { id: string; name: string }[];
  is_member: boolean;
  member_count: number;
  current_user: string;
}

const CardList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTrip, setNewTrip] = useState({
    name: "",
    starting: "",
    destination: "",
    date: "",
    time: ""
  });

  useEffect(() => {
    const fetchTrips = async () => {
        try {
            const response = await api.get("/app/trip-card/");
            const tripsData = response.data.response.map((trip: Trip) => ({
                ...trip,
                members: trip.members || [], // Ensure members is an array
            }));
            setTrips(tripsData);
        } catch (err) {
            console.error("Error fetching trips:", err);
            setError("Failed to load trips.");
        }
    };

    fetchTrips();
}, [showModal]);

  const handleJoin = async (tripId: string) => {
    try {
      const response = await api.post(`/app/trip-card/${tripId}/join/`);
      const newMember = response.data.member;

      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === tripId
            ? { ...trip, is_member: true, members: [...trip.members, newMember] }
            : trip
        )
      );

      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      await wait(500);
    } catch (error) {
      console.error("Error joining trip:", error);
    }
  };

  const handleCreateTrip = async () => {
    try {
        const response = await api.post("/app/trip-card/", newTrip);
        const newTripData = { ...response.data.response, members: response.data.response.members || [] };
        setTrips([...trips, newTripData]); 
        setShowModal(false);
    } catch (error) {
        console.error("Error creating trip:", error);
    }
};

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <section className="bg-blue-50 px-4 py-10 mt-10">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card 
              key={trip.id} 
              trip={trip} 
              handleJoin={() => handleJoin(trip.id)} 
            />
          ))}
        </div>

        {/* Add New Trip Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg">
          Add New Trip
        </button>

        {/* Modal for Adding a New Trip */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-xl font-bold mb-4">Add New Trip</h3>
              
              <input
                type="text"
                placeholder="Trip Name"
                className="w-full p-2 mb-3 border rounded"
                value={newTrip.name}
                onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Starting Point"
                className="w-full p-2 mb-3 border rounded"
                value={newTrip.starting}
                onChange={(e) => setNewTrip({ ...newTrip, starting: e.target.value })}
              />
              <input
                type="text"
                placeholder="Destination"
                className="w-full p-2 mb-3 border rounded"
                value={newTrip.destination}
                onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
              />
              <input
                type="date"
                className="w-full p-2 mb-3 border rounded"
                value={newTrip.date}
                onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
              />
              <input
                type="time"
                className="w-full p-2 mb-4 border rounded"
                value={newTrip.time}
                onChange={(e) => setNewTrip({ ...newTrip, time: e.target.value })}
              />

              <button
                onClick={handleCreateTrip}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg mb-2">
                Create Trip
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CardList;
