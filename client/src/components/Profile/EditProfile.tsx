import {
  Button,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import useForm from "../../utils/useForm";

import { AuthConsumer } from "../AuthContext";
import { useRef, useState } from "react";
import {
  editExistingUser,
  validateEdit,
  checkIfEdited,
} from "../../utils/edit";
import { toast } from "react-toastify";

type EditInputs = "username" | "email" | "password" | "hash";

const info = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-info-circle"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
  </svg>
);

function EditProfile() {
  const [isDisable, setIsDisable] = useState<Record<string, boolean>>({
    username: true,
    email: true,
    password: true,
  });
  const [isEdited, setIsEdited] = useState(false);
  const { user, login } = AuthConsumer();
  const prevValues = useRef<Record<string, string>>({});

  const [isShow, setisShow] = useState<Record<string, boolean>>({
    password: false,
    cpassword: false,
  });

  // if values is not there and it is not an empty string it falls back to user input
  const setInputValue = (i: EditInputs) => {
    if (i !== "password")
      values[i] = values[i] || values[i] == "" ? values[i] : user![i];
    else values[i] = values[i] || values[i] == "" ? values[i] : "";
    return values[i];
  };

  const setDisableInput = (i: string) => {
    // Check if an input field is opened !isDisabled[input] and trying to edit another one input != i
    let editAnotherInput = false;
    Object.keys(isDisable).forEach((input) => {
      if (!isDisable[input] && input != i) {
        editAnotherInput = true;
        errors[input] = `Save ${input} first!`;
      }
    });

    // user tried to edit another input
    if (editAnotherInput) {
      setIsDisable({ ...isDisable, [i]: !!isDisable[i] }); // force a rerender to show new error[i]
      return;
    }

    // user finished editing opened input
    prevValues.current[i] = values[i]; // save old value incase of cancelling
    if (!isDisable[i]) errors[i] = ""; // remove error msg upon close
    setIsEdited(checkIfEdited(values, user)); // check whether to edit button
    setIsDisable({ ...isDisable, [i]: !isDisable[i] }); // closes or upons
  };

  const cancelEditInput = (i: EditInputs) => {
    if (i !== "password")
      values[i] = values[i] ? prevValues.current[i] : user![i];
    // reset back to og user values or prev value edited
    else values[i] = values[i] || values[i] == "" ? values[i] : "";
    setDisableInput(i); // close the input
  };

  const canResetEditInput = (i: EditInputs) => {
    if (i !== "password") return isDisable[i] && values[i] != user![i];
    // is not editing and not same values
    else return isDisable[i] && values[i];
  };

  const resetEditInput = (i: EditInputs) => {
    if (i !== "password") values[i] = user![i]; // reset back
    else values[i] = "";
    setIsEdited(checkIfEdited(values, user)); // check whether to edit button
    setIsDisable({ ...isDisable, [i]: !!isDisable[i] }); // force a rerender removing the cancel button
  };

  const showPassword = (i: "password" | "cpassword") => {
    setisShow({ ...isShow, [i]: !isShow[i] });
  };

  const { values, errors, handleSubmit, handleChangeValues } = useForm(
    () => {
      editExistingUser(values);
      login(values.email); // "login" with new values, changes user state
      toast.info("Successfully edited profile");
      delete values.cPassword;
      delete errors.cPassword;
      setIsEdited(false);
    },
    async () => {
      return validateEdit(values, user);
    }
  );

  return (
    <>
      <h3>My profile</h3>
      <p>You joined: {user?.dateJoined.toLocaleString().slice(0, -14)}</p>
      <hr />
      <Form onSubmit={handleSubmit} className="mb-5">
        <Form.Group className="mb-3">
          <h4>Username</h4>

          <InputGroup className="mb-3">
            <Form.Control
              name="username"
              onChange={handleChangeValues}
              value={setInputValue("username")}
              placeholder="Username"
              disabled={isDisable.username}
            />
            <InputGroup.Text
              onClick={() => setDisableInput("username")}
              className="user-select-none"
            >
              {isDisable.username ? "Edit" : "Save"}
            </InputGroup.Text>

            {!isDisable.username && (
              <InputGroup.Text
                onClick={() => cancelEditInput("username")}
                className="user-select-none"
              >
                Cancel
              </InputGroup.Text>
            )}

            {canResetEditInput("username") && (
              <InputGroup.Text
                onClick={() => resetEditInput("username")}
                className="user-select-none"
              >
                Reset
              </InputGroup.Text>
            )}
          </InputGroup>
          <Form.Text className="text-danger">{errors.username || ""}</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <h4>Email</h4>
          <InputGroup className="mb-3">
            <Form.Control
              name="email"
              value={setInputValue("email")}
              onChange={handleChangeValues}
              placeholder="Enter email"
              disabled={isDisable.email}
            />
            <InputGroup.Text
              onClick={() => setDisableInput("email")}
              className="user-select-none"
            >
              {isDisable.email ? "Edit" : "Save"}
            </InputGroup.Text>

            {!isDisable.email && (
              <InputGroup.Text
                onClick={() => cancelEditInput("email")}
                className="user-select-none"
              >
                Cancel
              </InputGroup.Text>
            )}

            {canResetEditInput("email") && (
              <InputGroup.Text
                onClick={() => resetEditInput("email")}
                className="user-select-none"
              >
                Reset
              </InputGroup.Text>
            )}
          </InputGroup>
          <Form.Text className="text-danger">{errors.email || ""}</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <h4>Password</h4>
          <InputGroup className="mb-3">
            <Form.Control
              type={isShow.password ? "text" : "password"}
              name="password"
              onChange={handleChangeValues}
              value={setInputValue("password")}
              placeholder="Enter password"
              disabled={isDisable.password}
            />
            <InputGroup.Text
              onClick={() => setDisableInput("password")}
              className="user-select-none"
            >
              {isDisable.password ? "Edit" : "Save"}
            </InputGroup.Text>

            {!isDisable.password && (
              <InputGroup.Text
                onClick={() => cancelEditInput("password")}
                className="user-select-none"
              >
                Cancel
              </InputGroup.Text>
            )}

            {canResetEditInput("password") && isDisable.password && (
              <InputGroup.Text
                onClick={() => {
                  // just incase if user changes mind on password we don't want to remember these values
                  delete values.cPassword;
                  delete errors.cPassword;
                  resetEditInput("password");
                }}
                className="user-select-none"
              >
                Reset
              </InputGroup.Text>
            )}

            <InputGroup.Text
              onClick={() => {
                showPassword("password");
              }}
              className="user-select-none"
            >
              View password
            </InputGroup.Text>
          </InputGroup>
          {errors.password === "!" ? (
            <OverlayTrigger
              delay={{ show: 150, hide: 150 }}
              placement="right"
              overlay={
                <Tooltip placement="right" className="p-2">
                  <>
                    <Form.Text className="text-white d-block">
                      - Password must be &ge; 10 characters in length
                    </Form.Text>
                    <Form.Text className="text-white d-block">
                      - Has at least one lower and upper case character (A-Z,
                      a-z)
                    </Form.Text>
                    <Form.Text className="text-white d-block">
                      - Has at least one number (0-9)
                    </Form.Text>
                    <Form.Text className="text-white  d-block">
                      - Has at least one special characters (eg. _*?!)
                    </Form.Text>
                  </>
                </Tooltip>
              }
            >
              <Form.Text className="text-danger d-inline-flex align-items-center gap-1">
                {info}
                <span>Invalid password</span>
              </Form.Text>
            </OverlayTrigger>
          ) : (
            <Form.Text className="text-danger">
              {errors.password || ""}
            </Form.Text>
          )}
        </Form.Group>

        {/* show if password is not disabled or when we can reset it and when disabled (meaning password is changed) */}
        {(!isDisable.password ||
          (canResetEditInput("password") && isDisable.password)) && (
          <Form.Group className="mb-3">
            <Form.Label>Confirm password</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type={isShow.cpassword ? "text" : "password"}
                name="cPassword"
                onChange={handleChangeValues}
                value={values.cPassword || ""}
                placeholder="Confirm password"
                disabled={isDisable.password}
              />
              <InputGroup.Text
                onClick={() => {
                  showPassword("cpassword");
                }}
                className="user-select-none"
              >
                View password
              </InputGroup.Text>
            </InputGroup>
            <Form.Text className="text-danger">
              {errors.cPassword || ""}
            </Form.Text>
          </Form.Group>
        )}

        {isEdited && (
          <Button variant="primary" type="submit">
            Edit Profile
          </Button>
        )}
      </Form>
    </>
  );
}

export default EditProfile;
