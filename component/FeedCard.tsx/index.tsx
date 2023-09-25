import React from 'react'
import Image from 'next/image'
import { BiMessageRounded, BiUpload } from 'react-icons/bi'
import { FaRetweet } from 'react-icons/fa'
import { AiOutlineHeart } from 'react-icons/ai'
import { Tweet } from '@/gql/graphql'
import Link from 'next/link'

interface FeedCardProps {
    data: Tweet
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
    const { data } = props
    return (
        <div className='hover'>
            <div className='Feed'>
                <div className='Feed-L'>
                    {data.author?.profileImageURL && <Image className='rounded-full' src={data.author.profileImageURL} alt='User-image' height={30} width={30} />}
                </div>
                <div className='Feed-R'>
                    <h5>
                        <Link href={`/${data.author?.id}`}>
                            {data.author?.firstName} {data.author?.lastName}
                        </Link>
                    </h5>
                    <p>{data.content}</p>
                    {
                        data.imageURL && <Image src={data.imageURL} alt='image' width={250} height={250}/>
                    }
                    <div className=' px-4 Feed-B'>
                        <div>
                            <BiMessageRounded />
                        </div>
                        <div>
                            <FaRetweet />
                        </div>
                        <div>
                            <AiOutlineHeart />
                        </div>
                        <div>
                            <BiUpload />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedCard