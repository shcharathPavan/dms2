const { addFarmData, displayData } = require('./app.js');

describe('Agricultural Data Collection Tests', () => {

    test('should store valid data in IndexedDB', async () => {
        const sensorReadings = "25, 30, 35";
        const cropPhotoFile = "data:image/png;base64,iVBORw0KGgo...";  // Simulated base64 image
        const farmerNote = "The crops are healthy.";
        const gpsCoordinates = "123.456";

        await addFarmData(sensorReadings, cropPhotoFile, farmerNote, gpsCoordinates);

        const transaction = db.transaction(['FarmData'], 'readonly');
        const store = transaction.objectStore('FarmData');
        const request = store.get(1);  // Get the first entry

        request.onsuccess = (event) => {
            const data = event.target.result;
            expect(data.sensorReadings).toEqual([25, 30, 35]);
            expect(data.cropPhoto).toBe(cropPhotoFile);
            expect(data.farmerNote).toBe(farmerNote);
            expect(data.gpsCoordinates).toBe(123.456);
        };
    });

    test('should handle empty or null data gracefully', async () => {
        const sensorReadings = "";
        const cropPhotoFile = null;
        const farmerNote = "";
        const gpsCoordinates = null;

        try {
            await addFarmData(sensorReadings, cropPhotoFile, farmerNote, gpsCoordinates);
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test('should retrieve data from IndexedDB', async () => {
        const transaction = db.transaction(['FarmData'], 'readonly');
        const store = transaction.objectStore('FarmData');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = (event) => {
            const data = event.target.result;
            expect(data.length).toBeGreaterThan(0);
        };
    });

    test('should store valid GPS coordinates as a number', async () => {
        const sensorReadings = "25, 30, 35";
        const cropPhotoFile = "data:image/png;base64,iVBORw0KGgo...";
        const farmerNote = "Test Note";
        const gpsCoordinates = "123.456";

        await addFarmData(sensorReadings, cropPhotoFile, farmerNote, gpsCoordinates);

        const transaction = db.transaction(['FarmData'], 'readonly');
        const store = transaction.objectStore('FarmData');
        const request = store.get(1);

        request.onsuccess = (event) => {
            const data = event.target.result;
            expect(typeof data.gpsCoordinates).toBe('number');
            expect(data.gpsCoordinates).toBe(123.456);
        };
    });

    test('should handle invalid image formats', async () => {
        const sensorReadings = "25, 30, 35";
        const cropPhotoFile = "invalid-image-format";  // Invalid image format
        const farmerNote = "Test Note";
        const gpsCoordinates = "123.456";

        try {
            await addFarmData(sensorReadings, cropPhotoFile, farmerNote, gpsCoordinates);
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});
