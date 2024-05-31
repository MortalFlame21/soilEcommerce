import { Button, Row, Col, Form } from "react-bootstrap";
import useForm from "../utils/useForm";
import { validateReview } from "../utils/review";
import {
  createReview,
  updateReview,
  getProductReviews,
  Review,
} from "../service/review";
import { AuthConsumer } from "./AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StarRating from "./StarRating";

interface ReviewsFormProps {
  productId: number;
  onUpdate: () => void;
  reload: boolean;
}

const ReviewsForm: React.FC<ReviewsFormProps> = ({
  productId,
  onUpdate,
  reload,
}) => {
  const { user } = AuthConsumer();

  const [stars, setStars] = useState(0);
  const [isReviewed, setIsReviewed] = useState(false);
  const [userReview, setUserReview] = useState<Review | undefined>(undefined);

  async function getUserReview() {
    if (!user) {
      setIsReviewed(() => false);
      return;
    }
    const _userReview = await getProductReviews(productId, user?.user_id);
    setIsReviewed(() => _userReview.length > 0);
    setUserReview(() => (_userReview.length > 0 ? _userReview[0] : undefined));

    const _userReviews = await getProductReviews(productId);
    setStars(
      () =>
        // sum / tot = avg
        _userReviews.reduce((acc, rev) => acc + rev.stars, 0) /
          _userReviews.length || 0
    );
  }

  async function createOrUpdateReview() {
    let result;
    if (isReviewed) {
      result = await updateReview(
        user!.user_id,
        productId,
        values.title,
        values.description,
        Number(values.stars)
      );
    } else {
      result = await createReview(
        user!.user_id,
        productId,
        values.title,
        values.description,
        Number(values.stars)
      );
    }

    if (result) {
      onUpdate(); // call the onUpdate function
      return true;
    }
    return false;
  }

  useEffect(() => {
    getUserReview();
  }, [user, productId, isReviewed, reload, getUserReview]);

  // getting all the reviews
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    getProductReviews(productId, undefined).then((reviews) => {
      setUserReviews(reviews);
    });
  }, [productId, onUpdate, isReviewed]);

  const createUserReview = async () => {
    if (await createOrUpdateReview()) {
      toast.success("Review written!");
      setShowForm(false);
    } else {
      toast.warning("Internal server error!");
    }
  };

  const { values, handleChangeValues, handleSubmit, errors } = useForm(
    createUserReview,
    validateReview
  );

  const [showForm, setShowForm] = useState(false);

  const _setShowForm = () => {
    if (!user) {
      toast.warning("Login to write a review!");
      return;
    }
    setShowForm(() => !showForm);
  };

  const setInputValue = (i: "title" | "description") => {
    if (!userReview) return values[i];
    return (values[i] =
      values[i] || values[i] == "" ? values[i] : userReview[i]);
  };

  return (
    <>
      <Row className="mb-4">
        <h3 className="mb-4">Reviews</h3>
        <Col>
          <div className="text-center">
            <h4>{stars}/5</h4>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <StarRating rating={stars} />
              <p className="m-0 mx-1"> ({userReviews.length})</p>
            </div>
          </div>
        </Col>
        <Col>
          <h4>Review the product</h4>
          <p>Share your thoughts with other customers!</p>

          <div className="d-flex gap-1">
            <Button variant="success" onClick={() => _setShowForm()}>
              {isReviewed ? "Edit your review" : "Write a review"}
            </Button>
          </div>
        </Col>
      </Row>
      {showForm && (
        <Form
          onSubmit={handleSubmit}
          className="p-5 custom-bg-secondary rounded-3 mb-4"
        >
          <Form.Group className="mb-3">
            <Form.Label>Stars</Form.Label>
            <Form.Check
              type="radio"
              label="1"
              value="1"
              name="stars"
              onChange={handleChangeValues}
            />
            <Form.Check
              type="radio"
              label="2"
              value="2"
              name="stars"
              onChange={handleChangeValues}
            />
            <Form.Check
              type="radio"
              label="3"
              value={3}
              name="stars"
              onChange={handleChangeValues}
            />
            <Form.Check
              type="radio"
              label="4"
              value={4}
              name="stars"
              onChange={handleChangeValues}
            />
            <Form.Check
              type="radio"
              label="5"
              value={5}
              name="stars"
              onChange={handleChangeValues}
            />
            <Form.Text className="text-danger">{errors.stars || ""}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={setInputValue("title")}
              onChange={handleChangeValues}
              placeholder="Enter title"
            />
            <Form.Text className="text-danger">{errors.title || ""}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows={5}
              value={setInputValue("description")}
              onChange={handleChangeValues}
              placeholder="Enter description"
            />
            <Form.Text className="text-danger">
              {errors.description || ""}
            </Form.Text>
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="w-100 custom-btn-primary"
          >
            Submit
          </Button>
        </Form>
      )}
    </>
  );
};

export default ReviewsForm;
