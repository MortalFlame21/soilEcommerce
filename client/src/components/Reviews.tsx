import StarRating from "./StarRating";
import { getProductReviews } from "../service/review";
import { useEffect, useState } from "react";

interface Review {
  id: number;
  stars: number;
  title: string;
  description: string;
  user_id: number;
  product_id: number;
  review_created: string;
}

interface ReviewsProps {
  productId: number;
}

function Reviews({ productId }: ReviewsProps) {
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    getProductReviews(productId, undefined).then((reviews) => {
      setUserReviews(reviews);
    });
  }, [productId]);

  console.log(userReviews);

  function ReviewCards({ review }: { review: Review }) {
    return (
      <div className="rounded-1" style={{ backgroundColor: "#cde9d7" }}>
        <StarRating rating={review.stars} />
        <div className="d-flex justify-content-between">
          <div>
            <h5>{review.title}</h5>
            <p>{review.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {userReviews.map((review) => (
        <ReviewCards key={review.id} review={review} />
      ))}
    </div>
  );
}

export default Reviews;
