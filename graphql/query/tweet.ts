import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`#graphql
    query GetAllTweets {
        getAllTweets {
            id
            content
            imageURL
            author {
                firstName
                lastName
                profileImageURL
                id
            }
        }
    }
`);

export const getSignURLForTweetQuery = graphql(`
query GetSignedURL($imageName: String!, $imageType: String!) {
    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
  }
`)