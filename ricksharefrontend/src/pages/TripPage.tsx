import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

interface Member {
  id: string;
  name: string;
}

interface Trip {
  id: string;
  name: string;
  starting: string;
  destination: string;
  date: string;
  time: string;
  created_by: string;
  members: Member[];
  is_member: boolean;
}

const TripPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await api.get(`/app/trip-card/${tripId}`); // Adjusted endpoint for fetching trip details
        setTrip(response.data.response);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError("Failed to load trip details.");
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleRemoveMember = async (memberId: string) => {
    if (trip) {
      try {
        await api.delete(`/api/app/trip-card/${tripId}/remove/${memberId}`); // Adjusted endpoint for member removal
        setTrip((prevTrip) => ({
          ...prevTrip!,
          members: prevTrip!.members.filter((member) => member.id !== memberId),
        }));
      } catch (err) {
        console.error("Error removing member:", err);
        setError("Failed to remove member.");
      }
    }
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
    return {
      formattedDate: date.toLocaleDateString(), // Format the date
      formattedTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) // Format the time to 12-hour format
    };
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!trip) {
    return <div>Loading...</div>; // Placeholder while loading
  }

  const { formattedDate, formattedTime } = formatDateTime(trip.date, trip.time);
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{trip.name}</h1>
      <p className="text-lg text-gray-700">
        {trip.starting} <span className="font-bold">→</span> {trip.destination}
      </p>
      <p className="text-gray-600">Date: {formattedDate}</p>
      <p className="text-gray-600">Time: {formattedTime}</p>

      <h3 className="text-lg font-semibold mt-6">Members:</h3>
      {trip.members.length > 0 ? (
        <ul className="list-disc list-inside">
          {trip.members.map((member) => (
            <li key={member.id} className="text-gray-800 flex items-center">
              {member.name}
              {trip.created_by === member.id && (
                <span className="ml-2 text-yellow-500" role="img" aria-label="crown">👑</span> // Crown symbol for owner
              )}
              {trip.created_by === member.id ? null : (
                <button 
                  onClick={() => handleRemoveMember(member.id)} 
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No members in this trip.</p>
      )}
    </div>
  );
};

export default TripPage;
