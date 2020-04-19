process.env.NODE_ENV = "test";
require("../../env");
const mongoose = require("mongoose");
const Validate = require("./Validate");
const to = require("await-to-js").default;
const Form = require("../../test/Forms/SingleNumerComponent")();
const advancedNumberForm = require("../../test/Forms/ComplexNumberComponent")();
const textForm = require("../../test/Forms/SingleTextComponent")();
const mongoDB = require("../../test/mongoDB");
// Start the MongoDB database before
// calling all the tests
beforeAll(async () => {
  const mongo = await mongoDB.start();
  process.env.MONGO_URL = mongo.url;
  await mongoose.connect(mongo.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
});

test("Should validate number component", async () => {
  const wrongSubmission = { data: { number: "HELLO WORLD" } };
  const [error, submission] = await to(
    Validate.submission(Form, wrongSubmission)
  );
  expect(error.name).toBe("ValidationError");
  expect(error.details[0].message).toBe('"number" must be a number');

  const validSubmission = { data: { number: 3 } };
  const [error2, submission2] = await to(
    Validate.submission(Form, validSubmission)
  );
  expect(error2).toBe(null);
  expect(submission2.data.number).toBe(3);
});

test("Should validate required number", async () => {
  const wrongSubmission = { data: { number: undefined } };
  const [error, submission] = await to(
    Validate.submission(advancedNumberForm, wrongSubmission)
  );
  expect(error.name).toBe("ValidationError");
  expect(error.details[0].message).toBe('"number" is required');
});

test("Should validate minimum and maximum number", async () => {
  let error;
  let submission;
  const wrongSubmissionMIN = { data: { number: 4 } };
  [error, submission] = await to(
    Validate.submission(advancedNumberForm, wrongSubmissionMIN)
  );
  expect(error.name).toBe("ValidationError");
  expect(error.details[0].message).toBe(
    '"number" must be larger than or equal to 10'
  );

  const wrongSubmissionMAX = { data: { number: 100 } };
  [error, submission] = await to(
    Validate.submission(advancedNumberForm, wrongSubmissionMAX)
  );
  expect(error.name).toBe("ValidationError");
  expect(error.details[0].message).toBe(
    '"number" must be less than or equal to 20'
  );

  const rightSubmission = { data: { number: 15 } };
  [error, submission] = await to(
    Validate.submission(advancedNumberForm, rightSubmission)
  );
  expect(error).toBe(null);
  expect(submission.data.number).toBe(15);
});

test("Should validate required text", async () => {
  const wrongSubmission = { data: { text: undefined } };
  const [error, submission] = await to(
    Validate.submission(textForm, wrongSubmission)
  );
  expect(error.name).toBe("ValidationError");
  expect(error.details[0].message).toBe('"text" is required');
});

test("Should validate text Type", async () => {
  const wrongSubmission = { data: { text: 3 } };
  const [error, submission] = await to(
    Validate.submission(textForm, wrongSubmission)
  );
  expect(error.name).toBe("ValidationError");
  expect(error.details[0].message).toBe('"text" must be a string');
});

test("Should validate text min length", async () => {
  const wrongSubmission = { data: { text: "Hell" } };
  const [error, submission] = await to(
    Validate.submission(textForm, wrongSubmission)
  );
  expect(error.name).toBe("ValidationError");
  expect(error.details[0].message).toBe(
    '"text" length must be at least 5 characters long'
  );
});

test("Should validate text max length", async () => {
  const wrongSubmission = { data: { text: "Hello World long text!" } };
  const [error, submission] = await to(
    Validate.submission(textForm, wrongSubmission)
  );
  expect(error.name).toBe("ValidationError");
  expect(error.details[0].message).toBe(
    '"text" length must be less than or equal to 10 characters long'
  );
});

test("Should validate text max length on Array Submission", async () => {
  const wrongSubmission = [
    { data: { text: "Hello" } },
    { data: { text: "Hello World long text!" } }
  ];
  const [error, submission] = await to(
    Validate.submission(textForm, wrongSubmission)
  );
  expect(error.name).toBe("ValidationError");
  expect(error.details[0].message).toBe(
    '"text" length must be less than or equal to 10 characters long'
  );
  const rightSubmission = [
    { data: { text: "Hello" } },
    { data: { text: "Hello" } }
  ];
  const [error1, submission1] = await to(
    Validate.submission(textForm, rightSubmission)
  );
  expect(submission1[0].data.text).toBe("Hello");
});

test("Should validate Form type", async () => {
  const _Form = {
    ...Form,
    ...{
      type: "somerandom"
    }
  };
  const [error, form] = await to(Validate.form(_Form));
  expect(typeof error).toBe("object");
  expect(error.errors.type.name).toBe("ValidatorError");
});

test("Should return the valid Form", async () => {
  const _Form = {
    ...Form
  };
  const [error, form] = await to(Validate.form(_Form));
  expect(error).toBe(null);
  expect(typeof form).toBe("object");
  expect(form._id).toBe("5d24e91176853baf2b663a60");
});

afterAll(() => {
  mongoose.connection.close();
});
