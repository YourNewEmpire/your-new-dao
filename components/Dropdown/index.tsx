import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ArrowDownIcon } from "@heroicons/react/solid";
import { IUserDao } from "../../interfaces/userdao";

// todo - could type these args
//! Rewritten for object array instead of string array
export default function Dropdown({ title, options, clickHandler }: any) {
  return (
    <div
      className="relative flex flex-col space-y-12
            justify-center items-center
            p-6 webkit-antialiased"
    >
      <Menu>
        <Menu.Button
          className="
                        flex flex-row space-x-2
                        justify-center items-center
                        p-2 xl:p-2 text-xl
                        text-center 
                        bg-th-primary-medium rounded-md
                        shadow-md hover:shadow-lg
                        transition duration-200 ease-in-out 
                        hover:text-th-primary-dark
                        w-32
                        md:w-52
                        xl:w-80
                        "
        >
          <p className=" text-sm md:text-lg xl:text-2xl truncate">
            {title ? title : "select"}
          </p>
          <ArrowDownIcon width={30} height={30} />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="
                              p-2 rounded-md text-lg
                              absolute flex flex-col top-10 
                              bg-opacity-50 bg-th-primary-dark
                              text-center
                              z-50
                              "
          >
            {options.map((item: IUserDao, index: number) => (
              <Menu.Item key={index}>
                <button
                  onClick={() => clickHandler(item)}
                  className="
                                                      rounded-md px-2
                                                      transition duration-200 ease-in-out 
                                                      hover:bg-indigo-800 hover:cursor-pointer"
                >
                  {item.address}
                </button>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
