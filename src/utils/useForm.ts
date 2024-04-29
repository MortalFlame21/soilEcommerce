import React, { useEffect, useState } from "react";

function useForm(
  success: () => void = () => {},
  validate: (v: Record<string, string>) => Record<string, string> = ({}) => {
    return {};
  }
) {
  const [values, setValues] = useState<Record<string, string>>({}); // the form field values
  const [errors, setErrors] = useState<Record<string, string>>({}); // the form field errors
  const [isSubmitted, setSumbitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(validate(values));
    setSumbitted(true);
  };

  // need this as it queues the update if in handleSumbit
  useEffect(() => {
    if (isSubmitted && Object.keys(errors).length === 0) success();
  }, [errors]);

  const handleChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return { values, handleChangeValues, handleSubmit, errors };
}

export default useForm;
