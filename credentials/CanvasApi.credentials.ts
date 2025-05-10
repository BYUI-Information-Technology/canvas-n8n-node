import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CanvasApi implements ICredentialType {
	name = 'canvasApi';
	displayName = 'Canvas LMS API';
	documentationUrl = 'https://canvas.instructure.com/doc/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'url',
			type: 'string',
			default: 'https://canvas.instructure.com',
			placeholder: 'https://your-canvas-instance.instructure.com',
			description: 'The URL of your Canvas LMS instance',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The access token for the Canvas LMS API',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/v1/users/self',
			method: 'GET',
		},
	};
}
