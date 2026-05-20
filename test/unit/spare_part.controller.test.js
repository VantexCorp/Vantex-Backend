const httpMocks = require('node-mocks-http');
const { describe, it, expect, afterEach } = require('@jest/globals');

jest.mock('../../src/services/spare_part.service');

const sparePartController = require('../../src/controllers/spare_part.controller');
const sparePartService = require('../../src/services/spare_part.service');

const mockedGetAllSpareParts = jest.spyOn(sparePartService, 'getAllSparePart');
const mockedAddSparePart = jest.spyOn(sparePartService, 'addSparePart');
const mockedFindSparePartBelowMinimumStock = jest.spyOn(sparePartService, 'findSparePartBelowMinimumStock');
const mockedModifySparePart = jest.spyOn(sparePartService, 'modifySparePart');
const mockedRemoveSparePart = jest.spyOn(sparePartService, 'removeSparePart');
const mockedFindSparePartById = jest.spyOn(sparePartService, 'findSparePartById');

afterEach(() => {
    jest.clearAllMocks();
});

describe('Unit Test - Spare Part Controller', () => {

    it('GET /api/spare-parts should get a spare part list', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/api/spare-parts',
            query: {}
        });

        const mockDataArray = [{ id: 1, sku: 'PART-001', name: 'Tornillo M8' }];
        mockedGetAllSpareParts.mockImplementation(async () => mockDataArray);

        await sparePartController.getAllSparePart(request, response);

        expect(mockedGetAllSpareParts).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toEqual(200);
        
        const responseData = response._getJSONData();
        expect(responseData.success).toBe(true);
        expect(responseData.data.length).toEqual(1);
        expect(responseData.data[0].sku).toEqual('PART-001');
    });

    it('GET /api/spare-parts/stock/low should get low stock parts', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/api/spare-parts/stock/low'
        });

        const mockLowStockData = [{ id: 2, sku: 'PART-002', name: 'Rodamiento A', current_stock: 2, minimum_stock: 5 }];
        mockedFindSparePartBelowMinimumStock.mockImplementation(async () => mockLowStockData);

        await sparePartController.getLowStockSpareParts(request, response);

        expect(mockedFindSparePartBelowMinimumStock).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toEqual(200);

        const responseData = response._getJSONData();
        expect(responseData.success).toBe(true);
        expect(responseData.data[0].current_stock).toBeLessThan(responseData.data[0].minimum_stock);
    });

    it('POST /api/spare-parts should register a new spare part', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/spare-parts',
            body: {
                sku: 'PART-999',
                name: 'Válvula de presión',
                current_stock: 10,
                minimum_stock: 5,
                unit_price: 15.50
            }
        });

        const mockResponseData = { id: 99, ...request.body };
        mockedAddSparePart.mockImplementation(async () => mockResponseData);
        jest.spyOn(sparePartService, 'findSparePartBySku').mockResolvedValue(null);

        await sparePartController.createSparePart(request, response);

        expect(mockedAddSparePart).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toEqual(201);
        
        const responseData = response._getJSONData();
        expect(responseData.success).toBe(true);
        expect(responseData.data.sku).toEqual('PART-999');
        expect(responseData.data.id).toEqual(99);
    });

    it('GET /api/spare-parts should handle error', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({ method: 'GET', url: '/api/spare-parts' });
        mockedGetAllSpareParts.mockRejectedValue(new Error('DB error'));
        await sparePartController.getAllSparePart(request, response);
        expect(response.statusCode).toEqual(500);
        expect(response._getJSONData().success).toBe(false);
    });

    it('POST /api/spare-parts should handle duplicate sku error', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({ method: 'POST', url: '/api/spare-parts', body: { sku: 'PART-999' } });
        jest.spyOn(sparePartService, 'findSparePartBySku').mockResolvedValue({ id: 1, sku: 'PART-999' });
        await sparePartController.createSparePart(request, response);
        expect(response.statusCode).toEqual(400);
        expect(response._getJSONData().success).toBe(false);
    });

    it('PUT /api/spare-parts/:id should update a spare part successfully', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'PUT', url: '/api/spare-parts/1', params: { id: 1 }, body: { name: 'Updated Part' }
        });
        mockedModifySparePart.mockResolvedValue({ id: 1, name: 'Updated Part' });
        await sparePartController.updateSparePart(request, response);
        expect(response.statusCode).toEqual(200);
        expect(response._getJSONData().success).toBe(true);
    });

    it('PUT /api/spare-parts/:id should handle error during update', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({
            method: 'PUT', url: '/api/spare-parts/99', params: { id: 99 }, body: { name: 'Updated Part' }
        });
        mockedModifySparePart.mockRejectedValue({ status: 404, message: 'Not Found' });
        await sparePartController.updateSparePart(request, response);
        expect(response.statusCode).toEqual(404);
        expect(response._getJSONData().success).toBe(false);
    });

    it('DELETE /api/spare-parts/:id should delete a spare part successfully', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({ method: 'DELETE', url: '/api/spare-parts/1', params: { id: 1 } });
        mockedFindSparePartById.mockResolvedValue({ id: 1 });
        mockedRemoveSparePart.mockResolvedValue(true);
        await sparePartController.deleteSparePart(request, response);
        expect(response.statusCode).toEqual(200);
        expect(response._getJSONData().success).toBe(true);
    });

    it('DELETE /api/spare-parts/:id should handle not found error', async () => {
        const response = httpMocks.createResponse();
        const request = httpMocks.createRequest({ method: 'DELETE', url: '/api/spare-parts/99', params: { id: 99 } });
        mockedFindSparePartById.mockResolvedValue(null);
        await sparePartController.deleteSparePart(request, response);
        expect(response.statusCode).toEqual(404);
        expect(response._getJSONData().success).toBe(false);
    });
});
