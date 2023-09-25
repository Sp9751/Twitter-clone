import { useRouter } from 'next/router'
import FeedCard from '@/component/FeedCard.tsx';
import TwitterLayout from '@/component/FeedCard.tsx/Layout/TwitterLayout';
import { Tweet, User } from '@/gql/graphql';
import { useCurrentUser } from '@/hooks/user';
import type { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image';
import { BsArrowLeftShort } from 'react-icons/bs'
import { graphqlClient } from '@/clients/api';
import { getUserByIdQuery } from '@/graphql/query/user';
import { useCallback, useMemo } from 'react';
import { followUserMutation, unFollowUserMutation } from '@/graphql/mutation/user';
import { useQueryClient } from '@tanstack/react-query';

interface ServerProps {
    userInfo?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {

    const router = useRouter();
    const { user: currentUser } = useCurrentUser();
    const queryClient = useQueryClient();

    const amIFollowing = useMemo(() => {
        if (!props.userInfo) return false;
        return ((currentUser?.following?.findIndex((el) => { return el?.id === props.userInfo?.id }) ?? -1) >= 0);
    }, [currentUser?.following, props.userInfo]);

    const handleFollowUser = useCallback(async () => {
        if (!props.userInfo?.id) return;
        
        await graphqlClient.request(followUserMutation, { to: props.userInfo?.id });
        await queryClient.invalidateQueries(["Current-user"]);
        
    }, [props.userInfo?.id, queryClient]);

    const handleUnfollowUser = useCallback(async()=>{
        if (!props.userInfo?.id) return;
        
        await graphqlClient.request(unFollowUserMutation, { to: props.userInfo?.id });
        await queryClient.invalidateQueries(["Current-user"]);
        
    },[props.userInfo?.id, queryClient])

    return (
        <div>
            <TwitterLayout>
                <div>
                    <nav className='flex items-center gap-3 py-2 px-3'>
                        <BsArrowLeftShort className="text-3xl" />
                        <div>
                            {props.userInfo && <h1 className='text-lg font-bold'>{props.userInfo.firstName} {props.userInfo.lastName}</h1>}
                            <h1 className='text-sm font-bold text-slate-500'>{props.userInfo?.tweets?.length} Tweets</h1>
                        </div>
                    </nav>
                    <div className='p-4 border-b border-slate-800'>
                        {props.userInfo?.profileImageURL &&
                            <Image src={props.userInfo?.profileImageURL} alt='User-image' height={80} width={80} className='rounded-full' />
                        }
                        {props.userInfo && <h1 className='text-lg font-bold'>{props.userInfo.firstName} {props.userInfo.lastName}</h1>}
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-4 mt-1 text-sm text-gray-400'>
                                <span>{props.userInfo?.followers?.length} Follower</span>
                                  <span>{props.userInfo?.following?.length} Following</span>
                            </div>
                            {currentUser?.id !== props.userInfo?.id && (
                <>
                  {amIFollowing ? (
                    <button
                      onClick={handleUnfollowUser}
                      className="bg-white font-bold text-black px-3 py-1 rounded-full text-sm"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={handleFollowUser}
                      className="bg-white font-bold text-black px-3 py-1 rounded-full text-sm"
                    >
                      Follow
                    </button>
                  )}
                </>
              )}
                        </div>
                    </div>
                    <div>
                        {props.userInfo?.tweets?.map(tweet => <FeedCard data={tweet as Tweet} key={tweet?.id} />)}
                    </div>
                </div>
            </TwitterLayout>
        </div>
    )
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
    const id = context.query.id as string | undefined;

    if (!id) return { notFound: true, props: { userInfo: undefined } }

    const userInfo = await graphqlClient.request(getUserByIdQuery, { id })

    if (!userInfo.getUserById) {
        return { notFound: true }
    }

    return {
        props: {
            userInfo: userInfo.getUserById as User
        }
    };
}

export default UserProfilePage;