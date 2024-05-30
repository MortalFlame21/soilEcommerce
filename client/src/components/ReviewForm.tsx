import { Button, Form } from "react-bootstrap";
import useForm from "../utils/useForm";

function ReviewsForm() {
  const { values, handleChangeValues, handleSubmit, errors } = useForm(
    () => {},
    async () => {
      console.log("values: ", values);

      return { title: "bruh" };
    }
  );

  return (
    <div>
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
    </div>
  );
}

export default ReviewsForm;
