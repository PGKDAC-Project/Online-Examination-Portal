import { getJson, setJson } from "../../utils/storage";

const ANNOUNCEMENTS_KEY = "system_announcements";

const mockAnnouncements = [
    { id: 1, title: "Maintenance Window", description: "System will be down for 2 hours.", targetRole: "All", priority: "High", date: "2025-01-20" },
    { id: 2, title: "Exam Schedule Updated", description: "React Basic Exam moved to Friday.", targetRole: "Student", targetBatch: "PG-DAC-FEB-2025", priority: "Medium", date: "2025-01-22" }
];

const getStored = () => getJson(ANNOUNCEMENTS_KEY, mockAnnouncements);
const setStored = (data) => setJson(ANNOUNCEMENTS_KEY, data);

// Helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllAnnouncements = async () => {
    await delay(300);
    return getStored();
};

export const createAnnouncement = async (data) => {
    await delay(500);
    const list = getStored();
    const newItem = {
        id: Date.now(),
        ...data,
        date: new Date().toISOString().split('T')[0]
    };
    list.unshift(newItem); // Add to top
    setStored(list);
    return newItem;
};

export const deleteAnnouncement = async (id) => {
    await delay(300);
    const list = getStored();
    const filtered = list.filter(i => i.id !== id);
    setStored(filtered);
    return true;
};
