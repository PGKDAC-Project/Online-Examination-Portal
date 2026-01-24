import { mockBatches } from "../../components/AdminPages/mockAdminData";
import { getJson, setJson } from "../../utils/storage";

const BATCHES_KEY = "admin_batches";

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredBatches = () => {
    return getJson(BATCHES_KEY, mockBatches);
};

const setStoredBatches = (batches) => {
    setJson(BATCHES_KEY, batches);
};

export const getAllBatches = async () => {
    await delay(300);
    return getStoredBatches();
};

export const createBatch = async (batchData) => {
    await delay(500);
    const batches = getStoredBatches();

    // Strict Entity Compliance Check
    // Batch: batchName, startDate, endDate
    if (!batchData.batchName || !batchData.startDate || !batchData.endDate) {
        throw new Error("Missing required fields: batchName, startDate, endDate");
    }

    const newBatch = {
        id: Date.now(),
        ...batchData,
        createdOn: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };

    batches.push(newBatch);
    setStoredBatches(batches);
    return newBatch;
};

export const updateBatch = async (id, batchData) => {
    await delay(500);
    const batches = getStoredBatches();
    const index = batches.findIndex(b => b.id === id);
    if (index === -1) throw new Error("Batch not found");

    const updatedBatch = {
        ...batches[index],
        ...batchData,
        lastUpdated: new Date().toISOString()
    };

    batches[index] = updatedBatch;
    setStoredBatches(batches);
    return updatedBatch;
};

export const deleteBatch = async (id) => {
    await delay(500);
    const batches = getStoredBatches();
    const filtered = batches.filter(b => b.id !== id);
    setStoredBatches(filtered);
    return true;
};
