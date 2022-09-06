import { MailIcon, PhoneIcon } from "@heroicons/react/solid";
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { ChildrenContext } from "../pages/NfGate";
import { wait } from "../utils/viewUtils";
import { debounce } from "lodash";
import React from "react";
import { HookCallbacks } from "async_hooks";

const people = [
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper1@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://img.seadn.io/files/0701898f2a1790aae9839d5270a4440d.png?h=1024&w=1024&auto=format",
  },
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper2@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://img.seadn.io/files/6a2236be9b0e49c3fdcb2172bfbf9ed3.png?h=1024&w=1024&auto=format",
  },
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper3@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://img.seadn.io/files/788672085076be2d87b9263f7b971889.png?h=1024&w=1024&auto=format",
  },
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper4@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://img.seadn.io/files/8917c999db93adfaab125ce9d7fb50d5.png?h=1024&w=1024&auto=format",
  },
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper5@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://img.seadn.io/files/49c1698ab33bc26fb36c38e29f80e2ab.png?h=1024&w=1024&auto=format",
  },
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper5@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://img.seadn.io/files/185d82e41942df9d8872d2325119e51f.png?h=1024&w=1024&auto=format",
  },
];

export default function NFTList() {

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {people.map((person, index) => (
        <li
          key={index}
          className={`col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200 }`}
        >
          <div className="flex-1 flex flex-col p-8">
            <img
              className="w-32 h-32 flex-shrink-0 mx-auto rounded-full"
              src={person.imageUrl}
              alt=""
            />
            <h3 className="mt-6 text-gray-900 text-sm font-medium">
              {person.name}
            </h3>
            <dl className="mt-1 flex-grow flex flex-col justify-between">
              <dt className="sr-only">Title</dt>
              <dd className="text-gray-500 text-sm">{person.title}</dd>
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  {person.role}
                </span>
              </dd>
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="w-0 flex-1 flex">
                <a
                  href={`mailto:${person.email}`}
                  className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                >
                  <MailIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="ml-3">Email</span>
                </a>
              </div>
              <div className="-ml-px w-0 flex-1 flex">
                <a
                  href={`tel:${person.telephone}`}
                  className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                >
                  <PhoneIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="ml-3">Call</span>
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
