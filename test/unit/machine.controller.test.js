const httpMocks = require('node-mocks-http');
const { describe, it, expect, afterEach } = require('@jest/globals');

jest.mock('../../src/services/machine.service');

const machineController = require('../../src/controllers/machine.controller');
const machineService = require('../../src/services/machine.service');

const mockedFindAllMachines = jest.spyOn(machineService, 'findAllMachines');
const mockedAddMachine = jest.spyOn(machineService, 'addMachine');
const mockedModifyMachine = jest.spyOn(machineService, 'modifyMachine');
const mockedRemoveMachine = jest.spyOn(machineService, 'removeMachine');

const mockMachineArray = [
    { id: 1, asset_code: 'M-001', name: 'Torno Central', location: 'Planta A' },
    { id: 2, asset_code: 'M-002', name: 'Fresadora CNC', location: 'Planta A' }
];

const mockMachineToRegister = {
    asset_code: 'M-003',
    name: 'Máquina de Soldar',
    location: 'Planta B',
    status: 'operational',
    downtime_hourly_cost: 30
};

const mockMachineResponse = {
    id: 3,
    ...mockMachineToRegister
};

afterEach(() => {
    jest.clearAllMocks();
});

describe('Unit Test - Machine Controller', () => {

    it('GET /api/machines should get a machine list', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/api/machines'
        });

        const mockedMachineList = jest.fn(async () => {
            return mockMachineArray;
        });
        mockedFindAllMachines.mockImplementation(mockedMachineList);

        await machineController.getAllMachines(request, response);

        expect(mockedFindAllMachines).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toEqual(200);
        expect(response._isEndCalled()).toBeTruthy();
        
        const responseData = response._getJSONData();
        expect(responseData.success).toBe(true);
        expect(responseData.data.length).toEqual(2);
        expect(responseData.data[0].asset_code).toEqual('M-001');
    });

    it('POST /api/machines should register a new machine', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/machines',
            body: mockMachineToRegister
        });

        
        const mockedRegisterResponse = jest.fn(async () => {
            return mockMachineResponse;
        });
        mockedAddMachine.mockImplementation(mockedRegisterResponse);
        
        const mockedFindAssetCode = jest.spyOn(machineService, 'findMachineByAssetCode').mockResolvedValue(null);

        await machineController.createMachine(request, response);

        expect(mockedAddMachine).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toEqual(201);
        expect(response._isEndCalled()).toBeTruthy();

        const responseData = response._getJSONData();
        expect(responseData.success).toBe(true);
        expect(responseData.data.id).toEqual(3);
        expect(responseData.data.name).toEqual('Máquina de Soldar');
        expect(responseData.data.asset_code).toEqual('M-003');
    });

    it('GET /api/machines should handle error if service fails', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({ method: 'GET', url: '/api/machines' });

        mockedFindAllMachines.mockRejectedValue(new Error('DB Error'));

        await machineController.getAllMachines(request, response);

        expect(response.statusCode).toEqual(500);
        expect(response._getJSONData().success).toBe(false);
    });

    it('POST /api/machines should handle duplicate asset_code error', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({ method: 'POST', url: '/api/machines', body: mockMachineToRegister });

        jest.spyOn(machineService, 'findMachineByAssetCode').mockResolvedValue(mockMachineToRegister);

        await machineController.createMachine(request, response);

        expect(response.statusCode).toEqual(400);
        expect(response._getJSONData().success).toBe(false);
    });

    it('PUT /api/machines/:id should update a machine successfully', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'PUT',
            url: '/api/machines/1',
            params: { id: 1 },
            body: { name: 'Updated Machine' }
        });

        mockedModifyMachine.mockResolvedValue({ id: 1, name: 'Updated Machine' });

        await machineController.updateMachine(request, response);

        expect(response.statusCode).toEqual(200);
        expect(response._getJSONData().success).toBe(true);
    });

    it('PUT /api/machines/:id should handle error during update', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'PUT',
            url: '/api/machines/99',
            params: { id: 99 },
            body: { name: 'Updated Machine' }
        });

        mockedModifyMachine.mockRejectedValue({ status: 404, message: 'Not Found' });

        await machineController.updateMachine(request, response);

        expect(response.statusCode).toEqual(404);
        expect(response._getJSONData().success).toBe(false);
    });

    it('DELETE /api/machines/:id should delete a machine successfully', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'DELETE',
            url: '/api/machines/1',
            params: { id: 1 }
        });

        mockedRemoveMachine.mockResolvedValue(true);

        await machineController.deleteMachine(request, response);

        expect(response.statusCode).toEqual(200);
        expect(response._getJSONData().success).toBe(true);
    });

    it('DELETE /api/machines/:id should handle error during deletion', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'DELETE',
            url: '/api/machines/99',
            params: { id: 99 }
        });

        mockedRemoveMachine.mockRejectedValue({ status: 404, message: 'Not Found' });

        await machineController.deleteMachine(request, response);

        expect(response.statusCode).toEqual(404);
        expect(response._getJSONData().success).toBe(false);
    });
});
