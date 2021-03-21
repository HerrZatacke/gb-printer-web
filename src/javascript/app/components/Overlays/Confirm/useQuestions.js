import { useRef, useState } from 'react';

const useQuestions = (questionsProp) => {
  const questions = useRef(questionsProp.map((question) => ({
    ...question,
    selected: question.options.find(({ selected }) => selected).value,
  })));

  const [values, setValues] = useState(questions.current.reduce((acc, { key, selected }) => ({
    ...acc,
    [key]: selected,
  }), {}));

  return [
    questions.current,
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
