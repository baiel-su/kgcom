import Image from "next/image";
import Link from "next/link";
import React from "react";

const services = [
  {
    href: "/ramadan/iftar",
    src: "/iftar.png",
    alt: "Iftar Logo",
    label: "Iftars",
    width: 100,
    height: 100,
  },
  {
    href: "/catering/stores",
    src: "/catering.png",
    alt: "Catering Logo",
    label: "Food Stores",
    width: 180,
    height: 180,
  },
];

const Services = () => {
  return (
    <div className="p-4">
      <ul className="grid grid-cols-2 gap-4">
        {services.map((service, index) => (
          <li
            key={index}
            className=" border-2 p-4 rounded-lg"
          >
            <Link href={service.href}>
              <div className="">
                <span>{service.label}</span>
                <div className="mt-6">
                  <Image
                    src={service.src}
                    alt={service.alt}
                    width={service.width}
                    height={service.height}
                    className="text-start m-auto"
                  />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
