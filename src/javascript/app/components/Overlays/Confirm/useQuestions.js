import { useState } from 'react';

const updateSelection = (question) => ({
  ...question,
  selected: question.options?.find(({ selected }) => selected)?.value || '',
});

const useQuestions = (questions) => {
  const [values, setValues] = useState(questions({}).map(updateSelection).reduce((acc, { key, selected }) => ({
    ...acc,
    [key]: selected,
  }), {}));

  return [
    questions(values),
    values,
    (key, value) => {
      setValues({
        ...values,
        [key]: value,
      });
    },
  ];
};

export default useQuestions;
