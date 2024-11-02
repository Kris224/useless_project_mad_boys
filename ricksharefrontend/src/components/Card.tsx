import { Link } from "react-router-dom";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Trip {
  id: string;
  title: string;
  from: string;
  to: string;
  time: string;
  memberCount: number;
}

interface CardProps {
  trip: Trip;
}

const Card: React.FC<CardProps> = ({ trip }) => {
  return (
    <div
      key={trip.id}
      className="flex justify-center bg-white rounded-xl shadow-md relative">
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-xl font-bold">{trip.title}</h3>
          <div className="text-gray-600 my-2">
            <span className="text-slate-800 my-2">From: </span>
            {trip.from}
          </div>
          <div className="text-gray-600 my-2">
            <span className="text-slate-800 my-2">To: </span>
            {trip.to}
          </div>
          <div className="text-gray-600 my-2">
            <span className="text-slate-800 my-2">Time: </span>
            {trip.time}
          </div>
          <div className="text-gray-600 my-2">
            <span className="text-slate-800 my-2">members: </span>
            {trip.memberCount}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between mb-4 gap-5">
          <Link
            to="#"
            className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm">
            See more
          </Link>
          <Link
            to="#"
            className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm">
            Join Trip
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
