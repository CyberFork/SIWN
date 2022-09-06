/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { LoginRequestData } from '../store/LoginStore'
import web3Store from '../store/Web3Store'
import { shortAddress } from '../utils/Web3Utils'

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    const [str, setStr] = useState("")
    const [sigDataList, setSigDataList] = useState<LoginRequestData[]>()
    const ref = useRef(str)
    useEffect(() => {
        const sigDataListStr: string = localStorage.getItem("sigDataList") ?? ""
        if (!sigDataListStr) return
        if (ref.current === sigDataListStr) return
        ref.current = sigDataListStr

        const _sigDataList: LoginRequestData[] = JSON.parse(sigDataListStr)
        setSigDataList(_sigDataList)
    }, [
        localStorage.getItem("sigDataList")
    ])
    return (
        <Menu as="div" className="relative inline-block text-left z-40">
            <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border  border-clrNeon shadow-sm px-4 py-2 bg-clrBg text-sm font-bold text-clrText  hover:bg-clrBgHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    change account
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {sigDataList?.map((m, i) => (
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                        onClick={()=>{web3Store.setAccount(m?.userAddress??"")}}
                                    >
                                        {shortAddress(m?.userAddress??"")}
                                    </a>
                                )}
                            </Menu.Item>
                        ))}

                        {/* <form method="POST" action="#">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        type="submit"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block w-full text-left px-4 py-2 text-sm'
                                        )}
                                    >
                                        Sign out
                                    </button>
                                )}
                            </Menu.Item>
                        </form> */}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
