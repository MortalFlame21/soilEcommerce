import { useEffect, useState } from "react";
import { getReviews } from "../data/repository"; // replace with the actual path

interface Review {
  id: number;
  stars: number;
  title: string;
  description: string;
  user_id: number;
  product_id: number;
  review_created: string;
  username: string;
}

function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function fetchReviews() {
      const reviewsData = await getReviews();
      setReviews(reviewsData);
    }

    fetchReviews();
  }, []);

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id}>
          <h3>{review.title}</h3>
          <p>{review.description}</p>
          <p>Stars: {review.stars}</p>
          <p>By: {review.username}</p>
        </div>
      ))}
    </div>
  );
}

export default Reviews;
