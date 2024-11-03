import { Link } from "react-router-dom";

interface Trip {
  id: string;
  name: string;
  starting: string;
  destination: string;
  date: string;
  time: string;
  created_by: string;
  is_member: boolean;
  member_count: number;
  current_user: string;
}

interface CardProps {
  trip: Trip;
  handleJoin: () => void;
}

const formatTime12Hour = (time: string | undefined) => {
  if (!time) return "N/A"; // Return a default value if time is undefined
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

const Card: React.FC<CardProps> = ({ trip, handleJoin }) => {
  return (
    <div
      key={trip.id}
      className="justify-center bg-white rounded-xl shadow-md relative">
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-center">{trip.name}</h3>
          <div className="text-gray-600 my-2 text-xl text-center">
            {trip.starting} <span className="font-extrabold text-3xl">→</span> {trip.destination}
          </div>
          <p className="text-center"><strong></strong> {new Date(trip.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                })}</p>
          <div className="grid grid-cols-2">
          

          <div className="text-gray-600 my-2">
            <span className="text-slate-800 my-2">Time: </span>
            {formatTime12Hour(trip.time)}
          </div>
          <div className="text-gray-600 text-end pt-1">
            {trip.member_count}/4
          </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-end mb-4 gap-5">
          {trip.created_by==trip.current_user || trip.is_member ? (
            <Link
              to={`/trip/${trip.id}`}
              className="h-[36px] bg-indigo-400 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm">
              See Details
            </Link>
          ) : (
      
              trip.member_count < 4 && (
                <span
                  onClick={handleJoin}
                  className="h-[36px] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-center text-sm cursor-pointer">
                  Join Trip
                </span>
              
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
