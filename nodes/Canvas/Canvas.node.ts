import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
	IHttpRequestMethods,
	NodeApiError,
	NodeOperationError,
	IDataObject,
	IPollFunctions,
	JsonObject,
} from 'n8n-workflow';

// Canvas API Response Interfaces
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
// These interfaces are used for documentation and type checking purposes
interface CanvasResponse extends IDataObject {
	[key: string]: any;
}

interface PaginationMetadata {
	[key: string]: string | undefined;
	next?: string;
	current?: string;
	last?: string;
	first?: string;
	previous?: string;
}

// Helper function to parse pagination headers - as a standalone function
function parseLinkHeader(header: string | undefined): PaginationMetadata {
	if (!header) return {};

	const parts = header.split(',');
	const links: PaginationMetadata = {};

	for (const part of parts) {
		const section = part.split(';');
		if (section.length !== 2) continue;

		const url = section[0].replace(/<(.*)>/, '$1').trim();
		const name = section[1].replace(/rel="(.*)"/, '$1').trim();

		links[name] = url;
	}

	return links;
}

// Course Resource Interfaces
// @ts-ignore
interface CanvasCourse extends CanvasResponse {
	id: number;
	name: string;
	account_id: number;
	uuid: string;
	start_at: string | null;
	end_at: string | null;
	created_at: string;
	course_code: string;
	default_view: string;
	root_account_id: number;
	enrollment_term_id: number;
	public_syllabus: boolean;
	public_syllabus_to_auth: boolean;
	storage_quota_mb: number;
	is_public: boolean;
	workflow_state: string;
	restrict_enrollments_to_course_dates: boolean;
}

// User Resource Interfaces
// @ts-ignore
interface CanvasUser extends CanvasResponse {
	id: number;
	name: string;
	created_at: string;
	sortable_name: string;
	short_name: string;
	sis_user_id: string | null;
	email: string;
	login_id: string;
}

// Assignment Resource Interfaces
// @ts-ignore
interface CanvasAssignment extends CanvasResponse {
	id: number;
	name: string;
	description: string;
	created_at: string;
	updated_at: string;
	due_at: string | null;
	lock_at: string | null;
	unlock_at: string | null;
	points_possible: number;
	grading_type: string;
	submission_types: string[];
	position: number;
	course_id: number;
	published: boolean;
}

// Module Resource Interfaces
// @ts-ignore
interface CanvasModule extends CanvasResponse {
	id: number;
	name: string;
	position: number;
	unlock_at: string | null;
	require_sequential_progress: boolean;
	prerequisite_module_ids: number[];
	state: string;
	completed_at: string | null;
	items_count: number;
	items?: CanvasModuleItem[];
}

interface CanvasModuleItem extends CanvasResponse {
	id: number;
	module_id: number;
	position: number;
	title: string;
	indent: number;
	type: string;
	content_id: number;
	html_url: string;
	url: string;
	page_url?: string;
	external_url?: string;
	new_tab: boolean;
	completion_requirement?: {
		type: string;
		min_score?: number;
		completed?: boolean;
	};
}

// Page Resource Interfaces
// @ts-ignore
interface CanvasPage extends CanvasResponse {
	page_id: string;
	url: string;
	title: string;
	created_at: string;
	updated_at: string;
	editing_roles: string;
	body: string;
	published: boolean;
	front_page: boolean;
	locked_for_user: boolean;
	html_url: string;
}

// Discussion Resource Interfaces
// @ts-ignore
interface CanvasDiscussion extends CanvasResponse {
	id: number;
	title: string;
	message: string;
	posted_at: string;
	last_reply_at: string;
	require_initial_post: boolean;
	discussion_type: string;
	position: number;
	allow_rating: boolean;
	only_graders_can_rate: boolean;
	sort_by_rating: boolean;
	user_name: string;
	locked: boolean;
	pinned: boolean;
	locked_for_user: boolean;
	user_can_see_posts: boolean;
	published: boolean;
	can_unpublish: boolean;
	can_lock: boolean;
}

// File Resource Interfaces
// @ts-ignore
interface CanvasFile extends CanvasResponse {
	id: number;
	folder_id: number;
	display_name: string;
	filename: string;
	'content-type': string;
	url: string;
	size: number;
	created_at: string;
	updated_at: string;
	unlock_at: string | null;
	locked: boolean;
	hidden: boolean;
	thumbnail_url: string | null;
	modified_at: string;
	mime_class: string;
}

// Announcement Resource Interfaces
// @ts-ignore
interface CanvasAnnouncement extends CanvasResponse {
	id: number;
	title: string;
	message: string;
	posted_at: string;
	delayed_post_at: string | null;
	context_code: string;
	url: string;
	html_url: string;
}

// Quiz Resource Interfaces
// @ts-ignore
interface CanvasQuiz extends CanvasResponse {
	id: number;
	title: string;
	description: string;
	quiz_type: string;
	assignment_id: number;
	time_limit: number | null;
	shuffle_answers: boolean;
	hide_results: string | null;
	show_correct_answers: boolean;
	show_correct_answers_at: string | null;
	hide_correct_answers_at: string | null;
	scoring_policy: string;
	allowed_attempts: number;
	one_question_at_a_time: boolean;
	question_count: number;
	points_possible: number;
	cant_go_back: boolean;
	access_code: string | null;
	ip_filter: string | null;
	due_at: string | null;
	lock_at: string | null;
	unlock_at: string | null;
	published: boolean;
}

// Submission Resource Interfaces
// @ts-ignore
interface CanvasSubmission extends CanvasResponse {
	id: number;
	assignment_id: number;
	user_id: number;
	submitted_at: string | null;
	grade: string | null;
	score: number | null;
	attempt: number;
	body: string | null;
	grade_matches_current_submission: boolean;
	workflow_state: string;
	late: boolean;
	missing: boolean;
	submission_type: string | null;
	graded_at: string | null;
	grader_id: number | null;
	excused: boolean;
	points_deducted: number | null;
	late_policy_status: string | null;
}

// Enrollment Resource Interfaces
// @ts-ignore
interface CanvasEnrollment extends CanvasResponse {
	id: number;
	course_id: number;
	user_id: number;
	type: string;
	created_at: string;
	updated_at: string;
	associated_user_id: number | null;
	start_at: string | null;
	end_at: string | null;
	role: string;
	role_id: number;
	enrollment_state: string;
	limit_privileges_to_course_section: boolean;
	last_activity_at: string | null;
	total_activity_time: number;
	sis_import_id: number | null;
}

// Group Resource Interfaces
// @ts-ignore
interface CanvasGroup extends CanvasResponse {
	id: number;
	name: string;
	description: string | null;
	is_public: boolean;
	followed_by_user: boolean;
	join_level: string;
	members_count: number;
	avatar_url: string | null;
	context_type: string;
	course_id: number | null;
	role: string | null;
	group_category_id: number | null;
	sis_group_id: string | null;
	sis_import_id: number | null;
	storage_quota_mb: number;
}

// Rubric Resource Interfaces
// @ts-ignore
interface CanvasRubric extends CanvasResponse {
	id: number;
	title: string;
	context_id: number;
	context_type: string;
	points_possible: number;
	free_form_criterion_comments: boolean;
	hide_score_total: boolean;
	criteria: CanvasRubricCriteria[];
}

interface CanvasRubricCriteria extends CanvasResponse {
	id: string;
	description: string;
	long_description: string;
	points: number;
	criterion_use_range: boolean;
	ratings: CanvasRubricRating[];
}

interface CanvasRubricRating extends CanvasResponse {
	id: string;
	description: string;
	long_description: string;
	points: number;
}

export class Canvas implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Canvas LMS',
		name: 'canvas',
		icon: 'file:canvas.svg',
		group: ['transform'],
		version: 1,
		subtitle:
			'={{$parameter["operation"] + ": " + $parameter["resource"] || $parameter["trigger"] + ": " + $parameter["resource"]}}',
		description: 'Work with Canvas LMS API and receive events',
		defaults: {
			name: 'Canvas LMS',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'canvasApi',
				required: true,
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Course',
						value: 'course',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Assignment',
						value: 'assignment',
					},
					{
						name: 'Module',
						value: 'module',
					},
					{
						name: 'Page',
						value: 'page',
					},
					{
						name: 'Discussion',
						value: 'discussion',
					},
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'Announcement',
						value: 'announcement',
					},
					{
						name: 'Quiz',
						value: 'quiz',
					},
					{
						name: 'Submission',
						value: 'submission',
					},
					{
						name: 'Enrollment',
						value: 'enrollment',
					},
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Rubric',
						value: 'rubric',
					},
				],
				default: 'course',
			},
			// COURSE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['course'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a course',
						action: 'Get a course',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many courses',
						action: 'Get many courses',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a course',
						action: 'Create a course',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a course',
						action: 'Update a course',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a course',
						action: 'Delete a course',
					},
				],
				default: 'getAll',
			},
			// USER OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a user',
						action: 'Get a user',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many users',
						action: 'Get many users',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a user',
						action: 'Create a user',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a user',
						action: 'Update a user',
					},
				],
				default: 'getAll',
			},
			// ASSIGNMENT OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['assignment'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an assignment',
						action: 'Get an assignment',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many assignments',
						action: 'Get many assignments',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create an assignment',
						action: 'Create an assignment',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an assignment',
						action: 'Update an assignment',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an assignment',
						action: 'Delete an assignment',
					},
				],
				default: 'getAll',
			},
			// MODULE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['module'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a module',
						action: 'Get a module',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many modules',
						action: 'Get many modules',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a module',
						action: 'Create a module',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a module',
						action: 'Update a module',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a module',
						action: 'Delete a module',
					},
				],
				default: 'getAll',
			},
			// PAGE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['page'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a page',
						action: 'Get a page',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many pages',
						action: 'Get many pages',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a page',
						action: 'Create a page',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a page',
						action: 'Update a page',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a page',
						action: 'Delete a page',
					},
				],
				default: 'getAll',
			},
			// DISCUSSION OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['discussion'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a discussion topic',
						action: 'Get a discussion topic',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many discussion topics',
						action: 'Get many discussion topics',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a discussion topic',
						action: 'Create a discussion topic',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a discussion topic',
						action: 'Update a discussion topic',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a discussion topic',
						action: 'Delete a discussion topic',
					},
				],
				default: 'getAll',
			},
			// FILE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['file'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a file',
						action: 'Get a file',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many files',
						action: 'Get many files',
					},
					{
						name: 'Upload',
						value: 'upload',
						description: 'Upload a file',
						action: 'Upload a file',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a file',
						action: 'Delete a file',
					},
				],
				default: 'getAll',
			},
			// ANNOUNCEMENT OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['announcement'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an announcement',
						action: 'Get an announcement',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many announcements',
						action: 'Get many announcements',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create an announcement',
						action: 'Create an announcement',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an announcement',
						action: 'Update an announcement',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an announcement',
						action: 'Delete an announcement',
					},
				],
				default: 'getAll',
			},
			// QUIZ OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['quiz'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a quiz',
						action: 'Get a quiz',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many quizzes',
						action: 'Get many quizzes',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a quiz',
						action: 'Create a quiz',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a quiz',
						action: 'Update a quiz',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a quiz',
						action: 'Delete a quiz',
					},
				],
				default: 'getAll',
			},
			// SUBMISSION OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['submission'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a submission',
						action: 'Get a submission',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many submissions',
						action: 'Get many submissions',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a submission',
						action: 'Create a submission',
					},
					{
						name: 'Grade',
						value: 'grade',
						description: 'Grade a submission',
						action: 'Grade a submission',
					},
				],
				default: 'getAll',
			},
			// ENROLLMENT OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['enrollment'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an enrollment',
						action: 'Get an enrollment',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many enrollments',
						action: 'Get many enrollments',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create an enrollment',
						action: 'Create an enrollment',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an enrollment',
						action: 'Delete an enrollment',
					},
				],
				default: 'getAll',
			},
			// GROUP OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['group'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a group',
						action: 'Get a group',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many groups',
						action: 'Get many groups',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a group',
						action: 'Create a group',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a group',
						action: 'Update a group',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a group',
						action: 'Delete a group',
					},
				],
				default: 'getAll',
			},
			// RUBRIC OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['rubric'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a rubric',
						action: 'Get a rubric',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many rubrics',
						action: 'Get many rubrics',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a rubric',
						action: 'Create a rubric',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a rubric',
						action: 'Update a rubric',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a rubric',
						action: 'Delete a rubric',
					},
				],
				default: 'getAll',
			},
			// ID field for operations that need it
			{
				displayName: 'Course ID',
				name: 'courseId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						resource: ['course'],
					},
				},
				required: true,
				description: 'ID of the course',
			},
			{
				displayName: 'Course ID',
				name: 'courseId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['getAll', 'create'],
						resource: [
							'assignment',
							'module',
							'page',
							'discussion',
							'file',
							'announcement',
							'quiz',
						],
					},
				},
				required: true,
				description: 'ID of the course',
			},
			{
				displayName: 'Course ID',
				name: 'courseId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						resource: ['assignment', 'module', 'page', 'discussion', 'announcement', 'quiz'],
					},
				},
				required: true,
				description: 'ID of the course',
			},
			{
				displayName: 'Assignment ID',
				name: 'assignmentId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						resource: ['assignment'],
					},
				},
				required: true,
				description: 'ID of the assignment',
			},
			{
				displayName: 'Module ID',
				name: 'moduleId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						resource: ['module'],
					},
				},
				required: true,
				description: 'ID of the module',
			},
			{
				displayName: 'Page ID',
				name: 'pageId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						resource: ['page'],
					},
				},
				required: true,
				description: 'ID of the page',
			},
			{
				displayName: 'Discussion ID',
				name: 'discussionId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						resource: ['discussion'],
					},
				},
				required: true,
				description: 'ID of the discussion topic',
			},
			{
				displayName: 'File ID',
				name: 'fileId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'delete'],
						resource: ['file'],
					},
				},
				required: true,
				description: 'ID of the file',
			},
			{
				displayName: 'Announcement ID',
				name: 'announcementId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						resource: ['announcement'],
					},
				},
				required: true,
				description: 'ID of the announcement',
			},
			{
				displayName: 'Quiz ID',
				name: 'quizId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						resource: ['quiz'],
					},
				},
				required: true,
				description: 'ID of the quiz',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update'],
						resource: ['user'],
					},
				},
				required: true,
				description: 'ID of the user',
			},
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						resource: ['group'],
					},
				},
				required: true,
				description: 'ID of the group',
			},
			{
				displayName: 'Rubric ID',
				name: 'rubricId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
						resource: ['rubric'],
					},
				},
				required: true,
				description: 'ID of the rubric',
			},
			{
				displayName: 'Enrollment ID',
				name: 'enrollmentId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'delete'],
						resource: ['enrollment'],
					},
				},
				required: true,
				description: 'ID of the enrollment',
			},
			// Fields for submission operations
			{
				displayName: 'Course ID',
				name: 'courseId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['submission'],
					},
				},
				required: true,
				description: 'ID of the course',
			},
			{
				displayName: 'Assignment ID',
				name: 'assignmentId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['submission'],
					},
				},
				required: true,
				description: 'ID of the assignment',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'grade'],
						resource: ['submission'],
					},
				},
				required: true,
				description: 'ID of the user',
			},
			// Fields for assignment creation
			{
				displayName: 'Assignment Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['assignment'],
					},
				},
				required: true,
				description: 'Name of the assignment',
			},
			{
				displayName: 'Assignment Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['assignment'],
					},
				},
				description: 'Description of the assignment',
			},
			{
				displayName: 'Points Possible',
				name: 'pointsPossible',
				type: 'number',
				default: 100,
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['assignment'],
					},
				},
				description: 'Maximum points possible for the assignment',
			},
			{
				displayName: 'Due Date',
				name: 'dueAt',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['assignment'],
					},
				},
				description: 'Due date for the assignment',
			},
			// Fields for course operations
			{
				displayName: 'Course Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['course'],
					},
				},
				required: true,
				description: 'Name of the course',
			},
			{
				displayName: 'Course Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['course'],
					},
				},
				description: 'Description of the course',
			},
			{
				displayName: 'Start Date',
				name: 'startAt',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['course'],
					},
				},
				description: 'Course start date',
			},
			{
				displayName: 'End Date',
				name: 'endAt',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['course'],
					},
				},
				description: 'Course end date',
			},
			// Fields for user operations
			{
				displayName: 'User Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['user'],
					},
				},
				required: true,
				description: 'User full name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['user'],
					},
				},
				required: true,
				description: 'User email address',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['user'],
					},
				},
				description: 'User password (only for creation)',
			},
			// Fields for assignment update
			{
				displayName: 'Assignment Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['update'],
						resource: ['assignment'],
					},
				},
				required: true,
				description: 'Name of the assignment',
			},
			{
				displayName: 'Assignment Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['update'],
						resource: ['assignment'],
					},
				},
				description: 'Description of the assignment',
			},
			{
				displayName: 'Points Possible',
				name: 'pointsPossible',
				type: 'number',
				default: 100,
				displayOptions: {
					show: {
						operation: ['update'],
						resource: ['assignment'],
					},
				},
				description: 'Maximum points possible for the assignment',
			},
			{
				displayName: 'Due Date',
				name: 'dueAt',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						operation: ['update'],
						resource: ['assignment'],
					},
				},
				description: 'Due date for the assignment',
			},
			// Fields for module creation and update
			{
				displayName: 'Module Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['module'],
					},
				},
				required: true,
				description: 'Name of the module',
			},
			{
				displayName: 'Module Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['module'],
					},
				},
				description: 'Description of the module',
			},
			// Fields for page creation and update
			{
				displayName: 'Page Title',
				name: 'title',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['page'],
					},
				},
				required: true,
				description: 'Title of the page',
			},
			{
				displayName: 'Page Content',
				name: 'body',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['page'],
					},
				},
				required: true,
				description: 'HTML content of the page',
			},
			// Fields for discussion creation and update
			{
				displayName: 'Discussion Title',
				name: 'title',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['discussion'],
					},
				},
				required: true,
				description: 'Title of the discussion topic',
			},
			{
				displayName: 'Discussion Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['discussion'],
					},
				},
				required: true,
				description: 'Message body of the discussion topic',
			},
			// Fields for file upload
			{
				displayName: 'File Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['upload'],
						resource: ['file'],
					},
				},
				required: true,
				description: 'Name of the file to upload',
			},
			{
				displayName: 'File Content',
				name: 'file',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['upload'],
						resource: ['file'],
					},
				},
				required: true,
				description: 'Content of the file to upload',
			},
			// Fields for announcement creation and update
			{
				displayName: 'Announcement Title',
				name: 'title',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['announcement'],
					},
				},
				required: true,
				description: 'Title of the announcement',
			},
			{
				displayName: 'Announcement Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['announcement'],
					},
				},
				required: true,
				description: 'Message body of the announcement',
			},
			// Fields for quiz creation and update
			{
				displayName: 'Quiz Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['quiz'],
					},
				},
				required: true,
				description: 'Name of the quiz',
			},
			{
				displayName: 'Quiz Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['quiz'],
					},
				},
				description: 'Description of the quiz',
			},
			{
				displayName: 'Due Date',
				name: 'dueAt',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['quiz'],
					},
				},
				description: 'Due date for the quiz',
			},
			// Fields for submission creation
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['submission'],
					},
				},
				required: true,
				description: 'ID of the user creating the submission',
			},
			{
				displayName: 'Submission Content',
				name: 'body',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['submission'],
					},
				},
				required: true,
				description: 'Content of the submission',
			},
			// Fields for submission grading
			{
				displayName: 'Grade',
				name: 'grade',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['grade'],
						resource: ['submission'],
					},
				},
				required: true,
				description: 'Grade to assign to the submission (e.g., "A", "B", "95", etc.)',
			},
			// Fields for enrollment creation
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['enrollment'],
					},
				},
				required: true,
				description: 'ID of the user to enroll',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{
						name: 'Student',
						value: 'StudentEnrollment',
					},
					{
						name: 'Teacher',
						value: 'TeacherEnrollment',
					},
					{
						name: 'TA',
						value: 'TaEnrollment',
					},
					{
						name: 'Observer',
						value: 'ObserverEnrollment',
					},
					{
						name: 'Designer',
						value: 'DesignerEnrollment',
					},
				],
				default: 'StudentEnrollment',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['enrollment'],
					},
				},
				required: true,
				description: 'Role to assign to the user in this course',
			},
			// Fields for group creation and update
			{
				displayName: 'Group Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['group'],
					},
				},
				required: true,
				description: 'Name of the group',
			},
			{
				displayName: 'Group Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['group'],
					},
				},
				description: 'Description of the group',
			},
			// Fields for rubric creation and update
			{
				displayName: 'Rubric Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['rubric'],
					},
				},
				required: true,
				description: 'Name of the rubric',
			},
			{
				displayName: 'Rubric Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
						resource: ['rubric'],
					},
				},
				description: 'Description of the rubric',
			},
			// Add filtering options for "getAll" operations
			// Filters for courses
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['course'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Enrollment Type',
						name: 'enrollment_type',
						type: 'options',
						options: [
							{
								name: 'Teacher',
								value: 'teacher',
							},
							{
								name: 'Student',
								value: 'student',
							},
							{
								name: 'TA',
								value: 'ta',
							},
							{
								name: 'Observer',
								value: 'observer',
							},
							{
								name: 'Designer',
								value: 'designer',
							},
						],
						default: 'teacher',
						description: 'Filter courses by the type of user enrollment',
					},
					{
						displayName: 'Include Completed Courses',
						name: 'include_completed',
						type: 'boolean',
						default: false,
						description: 'Whether to include completed courses',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'options',
						options: [
							{
								name: 'Available',
								value: 'available',
							},
							{
								name: 'Completed',
								value: 'completed',
							},
							{
								name: 'Unpublished',
								value: 'unpublished',
							},
							{
								name: 'All',
								value: 'all',
							},
						],
						default: 'available',
						description: 'Filter by course state',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 50,
						description: 'Max number of results to return',
					},
				],
			},
			// Filters for assignments
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['assignment'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Assignment Group ID',
						name: 'assignment_group_id',
						type: 'string',
						default: '',
						description: 'Filter by assignment group ID',
					},
					{
						displayName: 'Include Submission History',
						name: 'include',
						type: 'multiOptions',
						options: [
							{
								name: 'Submission History',
								value: 'submission_history',
							},
							{
								name: 'Assignment Visibility',
								value: 'assignment_visibility',
							},
							{
								name: 'Overrides',
								value: 'overrides',
							},
							{
								name: 'Observed Users',
								value: 'observed_users',
							},
						],
						default: [],
						description: 'Include additional assignment data',
					},
					{
						displayName: 'Order By',
						name: 'order_by',
						type: 'options',
						options: [
							{
								name: 'Position',
								value: 'position',
							},
							{
								name: 'Name',
								value: 'name',
							},
							{
								name: 'Due Date',
								value: 'due_at',
							},
						],
						default: 'position',
						description: 'Order of returned assignments',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 50,
						description: 'Max number of results to return',
					},
				],
			},
			// Filters for modules
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['module'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Include Module Items',
						name: 'include',
						type: 'options',
						options: [
							{
								name: 'Items',
								value: 'items',
							},
							{
								name: 'Content Details',
								value: 'content_details',
							},
						],
						default: 'items',
						description: 'Include additional module data',
					},
					{
						displayName: 'Search Term',
						name: 'search_term',
						type: 'string',
						default: '',
						description: 'Search term to filter modules by name',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 50,
						description: 'Max number of results to return',
					},
				],
			},
			// TRIGGER OPERATIONS
			{
				displayName: 'Trigger',
				name: 'trigger',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['course'],
					},
				},
				options: [
					{
						name: 'New Course',
						value: 'newCourse',
						description: 'Trigger when a new course is created',
						action: 'Trigger when a new course is created',
					},
					{
						name: 'Course Updated',
						value: 'courseUpdated',
						description: 'Trigger when a course is updated',
						action: 'Trigger when a course is updated',
					},
				],
				default: 'newCourse',
			},
			{
				displayName: 'Trigger',
				name: 'trigger',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['assignment'],
					},
				},
				options: [
					{
						name: 'New Assignment',
						value: 'newAssignment',
						description: 'Trigger when a new assignment is created',
						action: 'Trigger when a new assignment is created',
					},
					{
						name: 'New Submission',
						value: 'newSubmission',
						description: 'Trigger when a new submission is made',
						action: 'Trigger when a new submission is made',
					},
				],
				default: 'newAssignment',
			},
			{
				displayName: 'Trigger',
				name: 'trigger',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['announcement'],
					},
				},
				options: [
					{
						name: 'New Announcement',
						value: 'newAnnouncement',
						description: 'Trigger when a new announcement is created',
						action: 'Trigger when a new announcement is created',
					},
				],
				default: 'newAnnouncement',
			},
			{
				displayName: 'Course ID',
				name: 'courseId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['assignment', 'announcement'],
						trigger: ['newAssignment', 'newSubmission', 'newAnnouncement'],
					},
				},
				required: true,
				description: 'ID of the course to monitor',
			},
			{
				displayName: 'Polling Interval',
				name: 'pollingInterval',
				type: 'options',
				options: [
					{
						name: 'Every 5 Minutes',
						value: '5',
					},
					{
						name: 'Every 10 Minutes',
						value: '10',
					},
					{
						name: 'Every 15 Minutes',
						value: '15',
					},
					{
						name: 'Every 30 Minutes',
						value: '30',
					},
					{
						name: 'Every Hour',
						value: '60',
					},
				],
				default: '15',
				description: 'How often to poll the Canvas API',
				displayOptions: {
					show: {
						resource: ['course', 'assignment', 'announcement'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// For each item, make an API call based on the resource and operation
		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let endpoint = '';
				let method: IHttpRequestMethods = 'GET';
				const body: { [key: string]: any } = {};
				const qs: IDataObject = {};

				// Handle different resources and operations
				if (resource === 'course') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						endpoint = '/api/v1/courses';
						method = 'GET';

						// Get additional fields for filtering
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
							{},
						) as IDataObject;

						// Add query parameters for filtering
						if (additionalFields.enrollment_type) {
							qs.enrollment_type = additionalFields.enrollment_type as string;
						}

						if (additionalFields.include_completed) {
							qs.include_completed = additionalFields.include_completed as boolean;
						}

						if (additionalFields.state) {
							qs.state = additionalFields.state as string;
						}

						if (additionalFields.limit) {
							qs.per_page = additionalFields.limit as number;
						} else {
							qs.per_page = 25; // Default limit
						}
					} else if (operation === 'create') {
						endpoint = '/api/v1/courses';
						method = 'POST';

						// Build course data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						const startAt = this.getNodeParameter('startAt', i) as string;
						const endAt = this.getNodeParameter('endAt', i) as string;

						body.course = {
							name,
							description,
						};

						if (startAt) {
							body.course.start_at = startAt;
						}

						if (endAt) {
							body.course.end_at = endAt;
						}
					} else if (operation === 'update') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}`;
						method = 'PUT';

						// Build course data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						const startAt = this.getNodeParameter('startAt', i) as string;
						const endAt = this.getNodeParameter('endAt', i) as string;

						body.course = {
							name,
							description,
						};

						if (startAt) {
							body.course.start_at = startAt;
						}

						if (endAt) {
							body.course.end_at = endAt;
						}
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}`;
						method = 'DELETE';
					}
				} else if (resource === 'user') {
					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						endpoint = `/api/v1/users/${userId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						endpoint = '/api/v1/users';
						method = 'GET';
					} else if (operation === 'create') {
						endpoint = '/api/v1/users';
						method = 'POST';

						// Build user data
						const name = this.getNodeParameter('name', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const password = this.getNodeParameter('password', i) as string;

						body.user = {
							name,
							email,
						};

						if (password) {
							body.user.password = password;
						}
					} else if (operation === 'update') {
						const userId = this.getNodeParameter('userId', i) as string;
						endpoint = `/api/v1/users/${userId}`;
						method = 'PUT';

						// Build user data
						const name = this.getNodeParameter('name', i) as string;
						const email = this.getNodeParameter('email', i) as string;

						body.user = {
							name,
							email,
						};
					}
				} else if (resource === 'assignment') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const assignmentId = this.getNodeParameter('assignmentId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/assignments/${assignmentId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/assignments`;
						method = 'GET';

						// Get additional fields for filtering
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
							{},
						) as IDataObject;

						// Add query parameters for filtering
						if (additionalFields.assignment_group_id) {
							qs.assignment_group_id = additionalFields.assignment_group_id as string;
						}

						if (additionalFields.include) {
							qs.include = additionalFields.include as string[];
						}

						if (additionalFields.order_by) {
							qs.order_by = additionalFields.order_by as string;
						}

						if (additionalFields.limit) {
							qs.per_page = additionalFields.limit as number;
						} else {
							qs.per_page = 25; // Default limit
						}
					} else if (operation === 'create') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/assignments`;
						method = 'POST';

						// Build assignment data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						const pointsPossible = this.getNodeParameter('pointsPossible', i) as number;
						const dueAt = this.getNodeParameter('dueAt', i) as string;

						body.assignment = {
							name,
							description,
							points_possible: pointsPossible,
						};

						if (dueAt) {
							body.assignment.due_at = dueAt;
						}
					} else if (operation === 'update') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const assignmentId = this.getNodeParameter('assignmentId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/assignments/${assignmentId}`;
						method = 'PUT';

						// Build assignment data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						const pointsPossible = this.getNodeParameter('pointsPossible', i) as number;
						const dueAt = this.getNodeParameter('dueAt', i) as string;

						body.assignment = {
							name,
							description,
							points_possible: pointsPossible,
						};

						if (dueAt) {
							body.assignment.due_at = dueAt;
						}
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const assignmentId = this.getNodeParameter('assignmentId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/assignments/${assignmentId}`;
						method = 'DELETE';
					}
				} else if (resource === 'module') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const moduleId = this.getNodeParameter('moduleId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/modules/${moduleId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/modules`;
						method = 'GET';

						// Get additional fields for filtering
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
							{},
						) as IDataObject;

						// Add query parameters for filtering
						if (additionalFields.include) {
							qs.include = additionalFields.include as string;
						}

						if (additionalFields.search_term) {
							qs.search_term = additionalFields.search_term as string;
						}

						if (additionalFields.limit) {
							qs.per_page = additionalFields.limit as number;
						} else {
							qs.per_page = 25; // Default limit
						}
					} else if (operation === 'create') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/modules`;
						method = 'POST';

						// Build module data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;

						body.module = {
							name,
							description,
						};
					} else if (operation === 'update') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const moduleId = this.getNodeParameter('moduleId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/modules/${moduleId}`;
						method = 'PUT';

						// Build module data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;

						body.module = {
							name,
							description,
						};
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const moduleId = this.getNodeParameter('moduleId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/modules/${moduleId}`;
						method = 'DELETE';
					}
				} else if (resource === 'page') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const pageId = this.getNodeParameter('pageId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/pages/${pageId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/pages`;
						method = 'GET';
					} else if (operation === 'create') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/pages`;
						method = 'POST';

						// Build page data
						const title = this.getNodeParameter('title', i) as string;
						const pageBody = this.getNodeParameter('body', i) as string;

						body.page = {
							title,
							body: pageBody,
						};
					} else if (operation === 'update') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const pageId = this.getNodeParameter('pageId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/pages/${pageId}`;
						method = 'PUT';

						// Build page data
						const title = this.getNodeParameter('title', i) as string;
						const pageBody = this.getNodeParameter('body', i) as string;

						body.page = {
							title,
							body: pageBody,
						};
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const pageId = this.getNodeParameter('pageId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/pages/${pageId}`;
						method = 'DELETE';
					}
				} else if (resource === 'discussion') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const discussionId = this.getNodeParameter('discussionId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/discussion_topics/${discussionId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/discussion_topics`;
						method = 'GET';
					} else if (operation === 'create') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/discussion_topics`;
						method = 'POST';

						// Build discussion data
						const title = this.getNodeParameter('title', i) as string;
						const message = this.getNodeParameter('message', i) as string;

						body.discussion_topic = {
							title,
							message,
						};
					} else if (operation === 'update') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const discussionId = this.getNodeParameter('discussionId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/discussion_topics/${discussionId}`;
						method = 'PUT';

						// Build discussion data
						const title = this.getNodeParameter('title', i) as string;
						const message = this.getNodeParameter('message', i) as string;

						body.discussion_topic = {
							title,
							message,
						};
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const discussionId = this.getNodeParameter('discussionId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/discussion_topics/${discussionId}`;
						method = 'DELETE';
					}
				} else if (resource === 'file') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const fileId = this.getNodeParameter('fileId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/files/${fileId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/files`;
						method = 'GET';
					} else if (operation === 'upload') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/files`;
						method = 'POST';

						// Build file data
						const name = this.getNodeParameter('name', i) as string;
						const file = this.getNodeParameter('file', i) as string;

						body.file = {
							name,
							content: file,
						};
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const fileId = this.getNodeParameter('fileId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/files/${fileId}`;
						method = 'DELETE';
					}
				} else if (resource === 'announcement') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const announcementId = this.getNodeParameter('announcementId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/announcements/${announcementId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/announcements`;
						method = 'GET';
					} else if (operation === 'create') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/announcements`;
						method = 'POST';

						// Build announcement data
						const title = this.getNodeParameter('title', i) as string;
						const message = this.getNodeParameter('message', i) as string;

						body.announcement = {
							title,
							message,
						};
					} else if (operation === 'update') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const announcementId = this.getNodeParameter('announcementId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/announcements/${announcementId}`;
						method = 'PUT';

						// Build announcement data
						const title = this.getNodeParameter('title', i) as string;
						const message = this.getNodeParameter('message', i) as string;

						body.announcement = {
							title,
							message,
						};
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const announcementId = this.getNodeParameter('announcementId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/announcements/${announcementId}`;
						method = 'DELETE';
					}
				} else if (resource === 'quiz') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const quizId = this.getNodeParameter('quizId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/quizzes/${quizId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/quizzes`;
						method = 'GET';
					} else if (operation === 'create') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/quizzes`;
						method = 'POST';

						// Build quiz data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						const dueAt = this.getNodeParameter('dueAt', i) as string;

						body.quiz = {
							name,
							description,
						};

						if (dueAt) {
							body.quiz.due_at = dueAt;
						}
					} else if (operation === 'update') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const quizId = this.getNodeParameter('quizId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/quizzes/${quizId}`;
						method = 'PUT';

						// Build quiz data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						const dueAt = this.getNodeParameter('dueAt', i) as string;

						body.quiz = {
							name,
							description,
						};

						if (dueAt) {
							body.quiz.due_at = dueAt;
						}
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const quizId = this.getNodeParameter('quizId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/quizzes/${quizId}`;
						method = 'DELETE';
					}
				} else if (resource === 'submission') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const assignmentId = this.getNodeParameter('assignmentId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/assignments`;
						method = 'GET';
					} else if (operation === 'create') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const assignmentId = this.getNodeParameter('assignmentId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions`;
						method = 'POST';

						// Build submission data
						const userId = this.getNodeParameter('userId', i) as string;
						const submissionBody = this.getNodeParameter('body', i) as string;

						body.submission = {
							user_id: userId,
							body: submissionBody,
						};
					} else if (operation === 'grade') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const assignmentId = this.getNodeParameter('assignmentId', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}/update_grades`;
						method = 'PUT';

						// Build grade data
						const grade = this.getNodeParameter('grade', i) as string;

						body.grade = {
							grade,
						};
					}
				} else if (resource === 'enrollment') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const enrollmentId = this.getNodeParameter('enrollmentId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/enrollments/${enrollmentId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/enrollments`;
						method = 'GET';
					} else if (operation === 'create') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/enrollments`;
						method = 'POST';

						// Build enrollment data
						const userId = this.getNodeParameter('userId', i) as string;
						const role = this.getNodeParameter('role', i) as string;

						body.enrollment = {
							user_id: userId,
							role,
						};
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const enrollmentId = this.getNodeParameter('enrollmentId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/enrollments/${enrollmentId}`;
						method = 'DELETE';
					}
				} else if (resource === 'group') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const groupId = this.getNodeParameter('groupId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/groups/${groupId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/groups`;
						method = 'GET';
					} else if (operation === 'create') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/groups`;
						method = 'POST';

						// Build group data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;

						body.group = {
							name,
							description,
						};
					} else if (operation === 'update') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const groupId = this.getNodeParameter('groupId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/groups/${groupId}`;
						method = 'PUT';

						// Build group data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;

						body.group = {
							name,
							description,
						};
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const groupId = this.getNodeParameter('groupId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/groups/${groupId}`;
						method = 'DELETE';
					}
				} else if (resource === 'rubric') {
					if (operation === 'get') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const rubricId = this.getNodeParameter('rubricId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/rubrics/${rubricId}`;
						method = 'GET';
					} else if (operation === 'getAll') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/rubrics`;
						method = 'GET';
					} else if (operation === 'create') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/rubrics`;
						method = 'POST';

						// Build rubric data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;

						body.rubric = {
							name,
							description,
						};
					} else if (operation === 'update') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const rubricId = this.getNodeParameter('rubricId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/rubrics/${rubricId}`;
						method = 'PUT';

						// Build rubric data
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;

						body.rubric = {
							name,
							description,
						};
					} else if (operation === 'delete') {
						const courseId = this.getNodeParameter('courseId', i) as string;
						const rubricId = this.getNodeParameter('rubricId', i) as string;
						endpoint = `/api/v1/courses/${courseId}/rubrics/${rubricId}`;
						method = 'DELETE';
					}
				}

				// Make API call
				if (endpoint && method) {
					try {
						const credentials = await this.getCredentials('canvasApi');

						// For 'getAll' operations, handle pagination
						if (operation === 'getAll') {
							let responseData: CanvasResponse[] = [];
							let hasNextPage = true;
							let nextPageUrl: string | undefined;

							do {
								const options: IRequestOptions = {
									method,
									uri: nextPageUrl || `${credentials.url}${endpoint}`,
									headers: {
										Authorization: `Bearer ${credentials.accessToken}`,
										'Content-Type': 'application/json',
									},
									qs: nextPageUrl ? undefined : qs, // Don't add qs if using nextPageUrl
									body,
									json: true,
									resolveWithFullResponse: true, // Get full response for headers
								};

								// Make the API request
								try {
									const response = await this.helpers.requestWithAuthentication.call(
										this,
										'canvasApi',
										options,
									);

									// Parse link header for pagination information - use the standalone function
									const links = parseLinkHeader(response.headers.link);
									nextPageUrl = links.next;
									hasNextPage = !!nextPageUrl;

									// Add the response data
									const data = response.body as unknown as CanvasResponse[];
									if (Array.isArray(data)) {
										responseData = [...responseData, ...data];
									} else {
										responseData.push(data as unknown as CanvasResponse);
									}
								} catch (error) {
									throw new NodeApiError(this.getNode(), error as JsonObject);
								}
							} while (hasNextPage);

							// Add all data to return array
							returnData.push({
								json: {
									data: responseData,
								} as IDataObject,
							});
						} else {
							// For non-getAll operations
							const options: IRequestOptions = {
								method,
								uri: `${credentials.url}${endpoint}`,
								headers: {
									Authorization: `Bearer ${credentials.accessToken}`,
									'Content-Type': 'application/json',
								},
								qs,
								body,
								json: true,
							};

							// Make the API request
							try {
								const responseData = await this.helpers.requestWithAuthentication.call(
									this,
									'canvasApi',
									options,
								);

								returnData.push({
									json: {
										data: responseData,
									} as IDataObject,
								});
							} catch (error) {
								throw new NodeApiError(this.getNode(), error as JsonObject);
							}
						}
					} catch (error) {
						// More informative error message with operation details
						throw new NodeOperationError(
							this.getNode(),
							`Error in "${resource}" operation "${operation}": ${error.message}`,
							{ itemIndex: i },
						);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const resource = this.getNodeParameter('resource') as string;
		const credentials = await this.getCredentials('canvasApi');

		let endpoint = '';
		const qs: IDataObject = {};
		const returnData: INodeExecutionData[] = [];

		// Get the timestamp of the last execution
		const lastTimeSuccessful = this.getNodeParameter('__lastTimeSuccessful', 0) as
			| string
			| undefined;
		const lastExecutionTimestamp = lastTimeSuccessful
			? new Date(lastTimeSuccessful).getTime()
			: undefined;

		// Set query params based on last execution time if available
		if (lastExecutionTimestamp) {
			const lastExecutionDate = new Date(lastExecutionTimestamp);
			// Format to ISO string and encode for URL
			qs.created_since = encodeURIComponent(lastExecutionDate.toISOString());
		}

		// Handle different resources
		if (resource === 'course') {
			const trigger = this.getNodeParameter('trigger') as string;

			if (trigger === 'newCourse') {
				endpoint = '/api/v1/courses';
				qs.per_page = 100;

				// Filter to only include active courses
				qs.state = 'available';
			}
		} else if (resource === 'assignment') {
			const trigger = this.getNodeParameter('trigger') as string;
			const courseId = this.getNodeParameter('courseId') as string;

			if (trigger === 'newAssignment') {
				endpoint = `/api/v1/courses/${courseId}/assignments`;
				qs.per_page = 100;
			} else if (trigger === 'newSubmission') {
				endpoint = `/api/v1/courses/${courseId}/students/submissions`;
				qs.per_page = 100;
				qs.include = ['assignment'];
			}
		} else if (resource === 'announcement') {
			const trigger = this.getNodeParameter('trigger') as string;
			const courseId = this.getNodeParameter('courseId') as string;

			if (trigger === 'newAnnouncement') {
				endpoint = `/api/v1/courses/${courseId}/announcements`;
				qs.per_page = 100;
			}
		}

		if (!endpoint) {
			// If no endpoint was set, no data to fetch
			return null;
		}

		try {
			// Make the API request
			let allResults: CanvasResponse[] = [];
			let hasNextPage = true;
			let nextPageUrl: string | undefined;

			do {
				const options: IRequestOptions = {
					method: 'GET',
					uri: nextPageUrl || `${credentials.url}${endpoint}`,
					headers: {
						Authorization: `Bearer ${credentials.accessToken}`,
						'Content-Type': 'application/json',
					},
					qs: nextPageUrl ? undefined : qs, // Don't add qs if using nextPageUrl
					json: true,
					resolveWithFullResponse: true, // Get full response for headers
				};

				try {
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'canvasApi',
						options,
					);

					// Parse link header for pagination information using the standalone function
					const links = parseLinkHeader(response.headers.link);
					nextPageUrl = links.next;
					hasNextPage = !!nextPageUrl;

					// Process the data based on resource and trigger type
					const data = response.body;

					// Make sure we have an array (some endpoints return objects, others arrays)
					const resultsArray = Array.isArray(data) ? data : [data];

					// Filter results if needed based on timestamps
					if (lastExecutionTimestamp) {
						const filteredResults = resultsArray.filter((item: CanvasResponse) => {
							// Different resources use different timestamp fields
							let itemTimestamp;
							if (resource === 'course') {
								itemTimestamp = item.created_at;
							} else if (resource === 'assignment') {
								itemTimestamp =
									this.getNodeParameter('trigger') === 'newAssignment'
										? item.created_at
										: item.submitted_at;
							} else if (resource === 'announcement') {
								itemTimestamp = item.posted_at;
							}

							if (!itemTimestamp) return false;

							// Compare timestamps
							const itemDate = new Date(itemTimestamp as string).getTime();
							return itemDate > lastExecutionTimestamp;
						});

						allResults = [...allResults, ...filteredResults];
					} else {
						// If this is the first run, just take the most recent items
						allResults = [...allResults, ...resultsArray.slice(0, 10)];
					}
				} catch (error) {
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			} while (hasNextPage);

			// Return the data if there's anything to return
			if (allResults.length === 0) {
				return null;
			}

			// Convert the data to n8n format
			for (const item of allResults) {
				returnData.push({
					json: item,
				});
			}

			return [returnData];
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Failed to poll Canvas API',
			});
		}
	}
}
