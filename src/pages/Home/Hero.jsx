
import screenShot from "../../assets/Screenshot.png";
import React from "react";
import { Link } from "react-router-dom";
import IconCalendar from "../../components/Icon/IconCalendar";

export default function Hero() {
  return (
    <div className="relative isolate">
      <div className="py-24 sm:py-32 lg:pb-40 bg-gradient-to-r from-primary/20 via-white to-primary/20 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="font-bold text-center tracking-tight text-gray-700 uppercase">
            Dance Studio Marketing Software
          </p>
          <div className="mx-auto max-w-2xl text-center mt-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Create a constant stream of new students
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We can show you how to organize everything while your dance studio
              grows and makes more money.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                type="button"
                className="btn btn-primary flex items-center gap-x-1.5"
              >
                Schedule Demo
                <IconCalendar className="-mr-0.5 h-5 w-5" aria-hidden="true" />
              </button>
              <Link
                to="/auth/boxed-signup"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Sign Up <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src={screenShot}
                alt="App screenshot"
                width={2432}
                height={1442}
                className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
