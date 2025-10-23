import { post, get, patch, del } from "../common/client";
import type { PaginatedData, PaginationParams } from "../common/types";
import type {
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  Question,
  Answer,
} from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  QUESTIONS_BY_COURSE: (courseId: string) => `/questions/courses/${courseId}`,
  QUESTION_BY_ID: (questionId: string) => `/questions/${questionId}`,
  ANSWERS_BY_QUESTION: (questionId: string) =>
    `/questions/${questionId}/answers`,
  ANSWER_BY_ID: (answerId: string) => `/questions/answers/${answerId}`,
} as const;

// ============================================
// Question API Functions
// ============================================

/**
 * Create a question for a course
 *
 * Requires authentication. Only enrolled students can ask questions.
 *
 * @param courseId - Course ID
 * @param data - Question data
 * @returns Created question
 *
 * @example
 * ```ts
 * const question = await createQuestion('course_id', {
 *   title: 'How to implement authentication?',
 *   content: 'I am trying to implement JWT authentication...'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not enrolled in the course
 */
const createQuestion = async (
  courseId: string,
  data: CreateQuestionRequest
): Promise<Question> => {
  return post<Question, CreateQuestionRequest>(
    ENDPOINTS.QUESTIONS_BY_COURSE(courseId),
    data
  );
};

/**
 * Get questions for a course with pagination
 *
 * Public endpoint - no authentication required
 *
 * @param courseId - Course ID
 * @param params - Pagination parameters
 * @returns Paginated list of questions
 *
 * @example
 * ```ts
 * const { items, pagination } = await getQuestionsByCourse('course_id', {
 *   page: 1,
 *   pageSize: 10
 * });
 * ```
 */
const getQuestionsByCourse = async (
  courseId: string,
  params?: PaginationParams
): Promise<PaginatedData<Question>> => {
  return get<PaginatedData<Question>>(ENDPOINTS.QUESTIONS_BY_COURSE(courseId), {
    params,
  });
};

/**
 * Get question by ID
 *
 * Public endpoint - no authentication required
 *
 * @param questionId - Question ID
 * @returns Question details
 *
 * @example
 * ```ts
 * const question = await getQuestionById('question_id');
 * ```
 *
 * @throws {ApiErrorResponse} 404 Not Found - Question not found
 */
const getQuestionById = async (questionId: string): Promise<Question> => {
  return get<Question>(ENDPOINTS.QUESTION_BY_ID(questionId));
};

/**
 * Update a question
 *
 * Requires authentication. Only the question author can update.
 *
 * @param questionId - Question ID
 * @param updates - Question update data
 * @returns Updated question
 *
 * @example
 * ```ts
 * const updated = await updateQuestion('question_id', {
 *   title: 'Updated title',
 *   content: 'Updated content...'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not the author
 * @throws {ApiErrorResponse} 404 Not Found - Question not found
 */
const updateQuestion = async (
  questionId: string,
  updates: UpdateQuestionRequest
): Promise<Question> => {
  return patch<Question, UpdateQuestionRequest>(
    ENDPOINTS.QUESTION_BY_ID(questionId),
    updates
  );
};

/**
 * Delete a question
 *
 * Requires authentication. Only the question author can delete.
 *
 * @param questionId - Question ID
 *
 * @example
 * ```ts
 * await deleteQuestion('question_id');
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not the author
 * @throws {ApiErrorResponse} 404 Not Found - Question not found
 */
const deleteQuestion = async (questionId: string): Promise<void> => {
  return del(ENDPOINTS.QUESTION_BY_ID(questionId));
};

// ============================================
// Answer API Functions
// ============================================

/**
 * Create an answer for a question
 *
 * Requires authentication. Enrolled students and instructors can answer.
 *
 * @param questionId - Question ID
 * @param data - Answer data
 * @returns Created answer
 *
 * @example
 * ```ts
 * const answer = await createAnswer('question_id', {
 *   content: 'Here is how you implement JWT authentication...'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not enrolled or not instructor
 */
const createAnswer = async (
  questionId: string,
  data: CreateAnswerRequest
): Promise<Answer> => {
  return post<Answer, CreateAnswerRequest>(
    ENDPOINTS.ANSWERS_BY_QUESTION(questionId),
    data
  );
};

/**
 * Get answers for a question
 *
 * Public endpoint - no authentication required
 *
 * @param questionId - Question ID
 * @returns Array of answers
 *
 * @example
 * ```ts
 * const answers = await getAnswersByQuestion('question_id');
 * ```
 */
const getAnswersByQuestion = async (questionId: string): Promise<Answer[]> => {
  return get<Answer[]>(ENDPOINTS.ANSWERS_BY_QUESTION(questionId));
};

/**
 * Update an answer
 *
 * Requires authentication. Only the answer author can update.
 *
 * @param answerId - Answer ID
 * @param updates - Answer update data
 * @returns Updated answer
 *
 * @example
 * ```ts
 * const updated = await updateAnswer('answer_id', {
 *   content: 'Updated answer content...'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not the author
 */
const updateAnswer = async (
  answerId: string,
  updates: UpdateAnswerRequest
): Promise<Answer> => {
  return patch<Answer, UpdateAnswerRequest>(
    ENDPOINTS.ANSWER_BY_ID(answerId),
    updates
  );
};

/**
 * Delete an answer
 *
 * Requires authentication. Only the answer author can delete.
 *
 * @param answerId - Answer ID
 *
 * @example
 * ```ts
 * await deleteAnswer('answer_id');
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not the author
 */
const deleteAnswer = async (answerId: string): Promise<void> => {
  return del(ENDPOINTS.ANSWER_BY_ID(answerId));
};

// ============================================
// Questions API Object
// ============================================

/**
 * Questions & Answers API client object
 *
 * Provides an alternative object-based API for Q&A operations
 *
 * @example
 * ```ts
 * import { questionsApi } from '@/lib/api/questions/api';
 *
 * // Questions
 * const question = await questionsApi.questions.create('course_id', { ... });
 * const { items } = await questionsApi.questions.getByCourse('course_id');
 * const single = await questionsApi.questions.getById('question_id');
 * await questionsApi.questions.update('question_id', { ... });
 * await questionsApi.questions.delete('question_id');
 *
 * // Answers
 * const answer = await questionsApi.answers.create('question_id', { ... });
 * const answers = await questionsApi.answers.getByQuestion('question_id');
 * await questionsApi.answers.update('answer_id', { ... });
 * await questionsApi.answers.delete('answer_id');
 * ```
 */
export const questionsApi = {
  questions: {
    create: createQuestion,
    getByCourse: getQuestionsByCourse,
    getById: getQuestionById,
    update: updateQuestion,
    delete: deleteQuestion,
  },
  answers: {
    create: createAnswer,
    getByQuestion: getAnswersByQuestion,
    update: updateAnswer,
    delete: deleteAnswer,
  },
} as const;

export default questionsApi;
