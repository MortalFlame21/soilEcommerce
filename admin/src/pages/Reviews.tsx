import { useState, useEffect } from "react";
import gql from "graphql-tag";
import { getReviews } from "../data/repository";
import client from "../apollo/client.js";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  // Load reviews.
  useEffect(() => {
    async function loadReviews() {
      const currentReviews = await getReviews();
      setReviews(currentReviews);
    }
    loadReviews();
  }, []);

  // Setup subscription.
  useEffect(() => {
    // Subscribe to the GraphQL latest_reviews subscription.
    const subscription = client
      .subscribe({
        query: gql`
          subscription {
            latest_reviews {
              id
              title
              description
              stars
              username
            }
          }
        `,
      })
      .subscribe({
        next: (payload) => {
          const newReview = payload.data.latest_reviews;

          // Ignore the new review if it already exists.
          for (const x of reviews) {
            if (newReview.id === x.id) return;
          }

          // Add new review.
          setReviews([...reviews, newReview]);
        },
      });

    // Unsubscribe from the subscription when the effect unmounts.
    return () => {
      subscription.unsubscribe();
    };
  }, [reviews]);

  return (
    <div>
      <h1>Reviews</h1>
      <div>
        {reviews.length === 0 ? (
          <span className="text-muted">No reviews have been submitted.</span>
        ) : (
          reviews.map((x) => (
            <div
              key={x.id}
              className="border my-3 p-3"
              style={{ whiteSpace: "pre-wrap" }}
            >
              <p>
                <strong>Stars:</strong> {x.stars}
              </p>
              <p>
                <strong>Title:</strong> {x.title}
              </p>
              <p>
                <strong>Description:</strong> {x.description}
              </p>
              <p>
                <strong>Username:</strong> {x.username}
              </p>
              <p>
                <strong>Date:</strong> {x.date}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
