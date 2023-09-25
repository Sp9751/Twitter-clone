import { useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";
import Image from 'next/image'
import React, { useCallback, useMemo } from "react";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface TwitterSideBarButton {
    title: string;
    icon: React.ReactNode;
    Link: string
}

interface TwitterLayoutProps {
    children: React.ReactNode
}

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {

    const { user } = useCurrentUser();
    const queryClient = useQueryClient();

    const SidebarMenuItems: TwitterSideBarButton[] = useMemo(() => [
        {
            title: 'Home',
            icon: <BiHomeCircle />,
            Link: '/'
        },
        {
            title: 'Explore',
            icon: <BiHash />,
            Link: '/'
        },
        {
            title: 'Notification',
            icon: <BsBell />,
            Link: '/'
        },
        {
            title: 'Messages',
            icon: <BsEnvelope />,
            Link: '/'
        },
        {
            title: 'Bookmarks',
            icon: <BsBookmark />,
            Link: '/'
        },
        {
            title: 'Twitter Blue',
            icon: <BiMoney />,
            Link: '/'
        },
        {
            title: 'Profile',
            icon: <BiUser />,
            Link: `/${user?.id}`
        },
        {
            title: 'More Option',
            icon: <SlOptions />,
            Link: '/'
        }
    ], [user?.id])

    const handleLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
        const googleToken = cred.credential;
        if (!googleToken) { return toast.error(`Google Token not Found`) }

        const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, { token: googleToken })

        toast.success('Verified Success')
        console.log(verifyGoogleToken)

        if (verifyGoogleToken) {
            window.localStorage.setItem("__twitter_token", verifyGoogleToken)
        }

        await queryClient.invalidateQueries(["Current-user"])

    }, [queryClient])

    // console.log(user?.firstName,user?.lastName);

    return (
        <div>
            <div className=' grid grid-cols-12 h-screen w-screen sm:px-56'>
                <div className='col-span-2 sm:col-span-3 pt-4 flex sm:justify-end pr-4 relative'>
                    <div>
                        <div className='text-2xl h-fit w-fit hover:bg-gray-600 rounded-full p-1.5 cursor-default transition-all'>
                            <BsTwitter />
                        </div>
                        <div className='mt-2 text-[1rem] font-semibold pr-4'>
                            <ul>
                                {SidebarMenuItems.map(items => <Link href={items.Link} className='flex justify-start items-center gap-3 hover:bg-gray-800 rounded-full px-3 py-2 w-fit cursor-pointer' key={items.title}><span>{items.icon}</span><span className="hidden sm:inline">{items.title}</span></Link>)}
                            </ul>
                            <div className='mt-5 sm:mt-2 px-3'>
                                <button className='hidden sm:block bg-[#1d9bf0] font-semibold rounded-full px-2 py-1 w-full mx-4'>Tweet</button>
                                <button className='block sm:hidden bg-[#1d9bf0] font-semibold rounded-full px-2 py-1 w-full'>
                                    <BsTwitter />
                                </button>
                            </div>
                        </div>
                    </div>
                    {user && <div className='absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full'>
                        {user && user.profileImageURL && (<Image className='rounded-full' src={user?.profileImageURL} alt='Profile' height={30} width={30} />)}
                        <div>
                            <h3 className='text-sm sm:text-sm'>{user.firstName}{user.lastName}</h3>
                        </div>
                    </div>}
                </div>
                <div className='col-span-10 sm:col-span-6 border-r-[1px] border-l-[1px] border-gray-600 overflow-scroll'>
                    {props.children}
                </div>
                <div className='col-span-0 sm:col-span-3 p-3'>
                    {!user ? (<div className='p-5 bg-slate-700 rounded-lg'>
                        <h1 className='my-2 text-[1.2rem]'>New To Twitter</h1>
                        <GoogleLogin onSuccess={handleLoginWithGoogle} />
                    </div>) : <div className='px-1 py-2 w-full bg-slate-800 rounded-lg'>
                        <h1 className='my-2 font-bold text-[1.1rem] mb-5'>User may you know</h1>
                        {
                            user?.recommendedUsers?.map(el => {
                                return (
                                    <div className="flex items-center gap-2 mt-2" key={el?.id}>
                                        {el?.profileImageURL && <Image className="rounded-full" src={el?.profileImageURL} alt="User-image" height={50} width={50} />}
                                        <div className="">
                                            <div className="text-lg">
                                                {el?.firstName}
                                                {el?.lastName}
                                            </div>
                                            <Link href={`/${el?.id}`} className="bg-white text-black text-sm px-3 py-1 rounded-lg w-full">View</Link>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default TwitterLayout