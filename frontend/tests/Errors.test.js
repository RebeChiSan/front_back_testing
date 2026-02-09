import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Errors from '../src/components/Errors.vue';
import * as api from '../src/services/api';

vi.mock('../src/services/api');

describe('Errors', () => {
    test('renderiza el título "Simulación de errores" correctamente', () => {
        const wrapper = mount(Errors);
        const title = wrapper.find('h2');
        expect(title.text()).toBe('Simulación de errores');
    });

    test('renderiza el botón "Run"', () => {
        const wrapper = mount(Errors);
        const button = wrapper.find('.btn-primary');
        expect(button.text()).toBe('Run');
    });

    const testCases = [
        {
            scenario: 'bad_request',
            label: 'Bad Request',
            mockResponse: {
                status: 400,
                data: {
                    status: 'error',
                    code: 'BAD_REQUEST',
                    message: 'Invalid email format'
                }
            }
        },
        {
            scenario: 'unauthorized',
            label: 'Unauthorized',
            mockResponse: {
                status: 401,
                data: {
                    status: 'error',
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            }
        },
        {
            scenario: 'forbidden',
            label: 'Forbidden',
            mockResponse: {
                status: 403,
                data: {
                    status: 'error',
                    code: 'FORBIDDEN',
                    message: 'Access denied'
                }
            }
        },
        {
            scenario: 'not_found',
            label: 'Not found',
            mockResponse: {
                status: 404,
                data: {
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Resource not found'
                }
            }
        },
        {
            scenario: 'request_timeout',
            label: 'Request Timeout',
            mockResponse: {
                status: 408,
                data: {
                    status: 'error',
                    code: 'REQUEST_TIMEOUT',
                    message: 'Request timeout'
                }
            }
        },
        {
            scenario: 'validation_error',
            label: 'Error de validación',
            mockResponse: {
                status: 422,
                data: {
                    status: 'error',
                    code: 'VALIDATION_ERROR',
                    message: 'Validation failed'
                }
            }
        },
        {
            scenario: 'internal_server_error',
            label: 'Internal Server Error',
            mockResponse: {
                status: 500,
                data: {
                    status: 'error',
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Internal server error'
                }
            }
        },
        {
            scenario: 'bad_gateway',
            label: 'Bad Gateway',
            mockResponse: {
                status: 502,
                data: {
                    status: 'error',
                    code: 'BAD_GATEWAY',
                    message: 'Bad gateway'
                }
            }
        },
        {
            scenario: 'service_unavailable',
            label: 'Service Unavailable',
            mockResponse: {
                status: 503,
                data: {
                    status: 'error',
                    code: 'SERVICE_UNAVAILABLE',
                    message: 'Service unavailable'
                }
            }
        },
        {
            scenario: 'gateway_timeout',
            label: 'Gateway Timeout',
            mockResponse: {
                status: 504,
                data: {
                    status: 'error',
                    code: 'GATEWAY_TIMEOUT',
                    message: 'Gateway timeout'
                }
            }
        },
        {
            scenario: 'excellent_latency',
            label: 'Latencia excelente',
            mockResponse: {
                status: 200,
                data: {
                    status: 'success',
                    code: 'EXCELLENT_LATENCY',
                    message: 'Response time < 100ms'
                }
            }
        },
        {
            scenario: 'normal_latency',
            label: 'Latencia normal',
            mockResponse: {
                status: 200,
                data: {
                    status: 'success',
                    code: 'NORMAL_LATENCY',
                    message: 'Response time 100-500ms'
                }
            }
        },
        {
            scenario: 'high_latency',
            label: 'Latencia alta',
            mockResponse: {
                status: 200,
                data: {
                    status: 'success',
                    code: 'HIGH_LATENCY',
                    message: 'Response time 500-2000ms'
                }
            }
        },
        {
            scenario: 'very_high_latency',
            label: 'Latencia muy alta',
            mockResponse: {
                status: 200,
                data: {
                    status: 'success',
                    code: 'VERY_HIGH_LATENCY',
                    message: 'Response time > 2000ms'
                }
            }
        }
    ];

    testCases.forEach(({ scenario, label, mockResponse }) => {
        test(`muestra la respuesta correcta para ${label}`, async () => {
            const wrapper = mount(Errors);
            api.errorsTest.mockResolvedValue(mockResponse);

            await wrapper.find('.form-select').setValue(scenario);

            await wrapper.find('.btn-primary').trigger('click');

            const statusParagraph = wrapper.find('.response-status');
            expect(statusParagraph.text()).toEqual(`Status: ${mockResponse.status}`);

            const responseContent = JSON.parse(wrapper.find('.response-data').text());
            const expectedJson = mockResponse.data;
            expect(responseContent).toEqual(expectedJson);
        });
    });

});

