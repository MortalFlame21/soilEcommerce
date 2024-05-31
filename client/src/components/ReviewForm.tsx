import { Button, Row, Col, Form } from "react-bootstrap";
import useForm from "../utils/useForm";
import { validateReview } from "../utils/review";
import { createReview, getProductReviews } from "../service/review";
import { AuthConsumer } from "./AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ReviewsForm({ productId }: { productId: number }) {
  const { user } = AuthConsumer();

  const [isReviewed, setIsReviewed] = useState(false);

  async function getUserReview() {
    if (!user) {
      setIsReviewed(() => false);
      return;
    }
    const userReview = await getProductReviews(productId, user?.user_id);
    setIsReviewed(() => userReview.length > 0);
  }

  useEffect(() => {
    getUserReview();
  }, [user, productId, isReviewed]);

  const createUserReview = async () => {
    if (
      await createReview(
        user!.user_id,
        productId,
        values.title,
        values.description,
        Number(values.stars)
      )
    ) {
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

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h4>Stars</h4>
          <p>AVG_STARS/5</p>
          <p>AVG_STARS_IMG (HOW MANY PEOPLE REVIEWED IT)</p>

          {/* calc avg stars */}
        </Col>
        <Col>
          <h4>Review the product</h4>
          <p>Share your thoughts with other customers!</p>

          {isReviewed ? (
            <>
              <Button onClick={() => _setShowForm()}>Edit</Button>
              <Button onClick={() => _setShowForm()}>Delete</Button>
            </>
          ) : (
            <Button onClick={() => _setShowForm()}>Write a review</Button>
          )}
        </Col>
      </Row>
      {showForm && (
        <Form
          onSubmit={handleSubmit}
          className="p-5 custom-bg-secondary rounded-3"
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
              value="5"
              name="stars"
              onChange={handleChangeValues}
            />
            <Form.Text className="text-danger">{errors.stars || ""}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={values.title || ""}
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
              value={values.description || ""}
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
}

export default ReviewsForm;
