import { useState } from "react";
import Reviews from "./Reviews";
import ReviewsForm from "./ReviewForm";

interface ReviewContainerProps {
  productID: number;
}

function ReviewContainer({ productID }: ReviewContainerProps) {
  const [reload, setReload] = useState(false);

  const handleUpdate = () => {
    setReload(!reload);
  };

  return (
    <>
      <ReviewsForm productId={productID} onUpdate={handleUpdate} />
      <Reviews productId={productID} reload={reload} />
    </>
  );
}

export default ReviewContainer;
