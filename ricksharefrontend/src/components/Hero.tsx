import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import api from "../api/api";
import { setAccessToken, setRefreshToken } from "../auth/authservice";

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/user/logout/'); // Use your axios instance here
      console.log("Logged out successfully");
      setAccessToken("")
      setRefreshToken("")
      window.location.reload()
      // Optionally, you can perform additional actions like clearing tokens or redirecting
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle error appropriately, e.g., show a message to the user
    }
  };

  return (
    <div className="bg-blue-50">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a
              href="#"
              className="-m-1.5 p-1.5">
              <span className="sr-only">Rickshare</span>
              <img
                alt=""
                src="/logo.png"
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="h-6 w-6"
              />
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <span onClick={handleLogout} className="text-sm/6 font-semibold text-gray-900">
                Logout <span aria-hidden="true">&rarr;</span>
              </span>
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a
                href="#"
                className="-m-1.5 p-1.5">
                <span className="sr-only">Rickshare</span>
                <img
                  alt=""
                  src="/logo.png"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700">
                <span className="sr-only">Close menu</span>
                <XMarkIcon
                  aria-hidden="true"
                  className="h-6 w-6"
                />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="py-6">
                    <span onClick={handleLogout} className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                      Log out
                    </span>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
}
