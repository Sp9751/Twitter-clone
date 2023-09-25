import { graphql } from "@/gql"


export const followUserMutation = graphql(
    `#graphql
    mutation FollowUser($to: ID!) {
        followUser(to: $to)
      }
    `
)

export const unFollowUserMutation = graphql(
    `
    mutation unFollowUser($to: ID!) {
        unfollowUser(to: $to)
      }
    `
)