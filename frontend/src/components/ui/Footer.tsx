import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="py-10 bg-white dark:bg-black text-black dark:text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Kinetic SparK</h1>
          <div className="text-right">
            <span className="text-sm">built by</span>
            <h1 className="flex items-center gap-1 text-md font-medium justify-end">
              <Link
                href="https://kranthi.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Kranthi Kumar Banda
              </Link>
              <FaLocationArrow  />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
