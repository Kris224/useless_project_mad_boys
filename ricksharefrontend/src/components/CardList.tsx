import React from "react";
import Card from "../components/Card";
function CardList() {
  const dumbTrip = {
    id: "fjsd90",
    title: "awesome",
    from: "olavakode",
    to: "railway station",
    time: "10:00pm",
    memberCount: 3,
  };
  return (
    <>
      <section className="bg-blue-50 px-4 py-10 px-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center"></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card trip={dumbTrip} />
            <Card trip={dumbTrip} />
            <Card trip={dumbTrip} />
            <Card trip={dumbTrip} />
            <Card trip={dumbTrip} />
            <Card trip={dumbTrip} />
          </div>
        </div>
      </section>
    </>
  );
}

export default CardList;
