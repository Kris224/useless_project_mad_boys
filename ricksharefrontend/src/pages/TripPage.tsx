import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api"; // Import your API instance

interface Member {
    id: string;
    name: string;
}

interface TripDetail {
    id: string;
    name: string;
    starting: string;
    destination: string;
    date: string;
    time: string;
    created_by: string;
    members: Member[];
    is_member: boolean;
    current_user: string;
}

const TripDetails: React.FC = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const [trip, setTrip] = useState<TripDetail | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const response = await api.get(`/app/trip-card/${tripId}/`);
                setTrip(response.data.response);
            } catch (err) {
                console.error("Error fetching trip details:", err);
                setError("Failed to load trip details.");
            }
        };

        fetchTripDetails();
    }, [tripId]);

    const formatTime12Hour = (time: string) => {
        const [hour, minute] = time.split(":");
        const date = new Date();
        date.setHours(parseInt(hour));
        date.setMinutes(parseInt(minute));
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            await api.post(`/app/trip-card/${tripId}/remove/${memberId}/`);
            setTrip((prevTrip) => {
                if (prevTrip) {
                    return {
                        ...prevTrip,
                        members: prevTrip.members.filter((member) => member.id !== memberId),
                    };
                }
                return prevTrip;
            });
        } catch (error) {
            console.error("Error removing member:", error);
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!trip) {
        return <div>Loading...</div>;
    }

    return (
        <section className="bg-blue-50 px-4 py-10">
            <div className="container-xl lg:container m-auto">
                <h2 className="text-3xl font-bold text-indigo-500 mb-6">{trip.name}</h2>
                <p><strong>Starting:</strong> {trip.starting}</p>
                <p><strong>Destination:</strong> {trip.destination}</p>
                <p><strong>Date:</strong> {new Date(trip.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                })}</p>
                <p><strong>Time:</strong> {formatTime12Hour(trip.time)}</p>

                <h3 className="text-2xl font-semibold mt-6">Members</h3>
                <ul className="mt-4">
                    {trip.members.map((member) => (
                        <li key={member.id} className="flex items-center justify-between">
                            <span className={member.id === trip.created_by ? "font-bold" : ""}>
                                {member.name} {member.id === trip.created_by && "(Owner)"}
                            </span>
                            {trip.current_user == trip.created_by && member.id !== trip.created_by && (
                                <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="text-red-500">
                                    Remove
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default TripDetails;
