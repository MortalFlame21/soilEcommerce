import { request, gql } from "graphql-request";

// --- Constants ----------------------------------------------------------------------------------
const GRAPH_QL_URL = "http://localhost:4000/graphql";

// --- Reviews -----------------------------------------------------------------------------------
async function getReviews() {
  const query = gql`
    {
      all_reviews {
        id
        stars
        title
        description
        user_id
        product_id
        review_created
        username
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);
  //@ts-expect-error for idk
  return data.all_reviews;
}

export { getReviews };
