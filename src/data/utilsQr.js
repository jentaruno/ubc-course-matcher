// Takes user data and converts it into a compressed JSON to make QR efficient
// Compress by storing only course names, no information
import {API_LINK, ENDPOINTS} from "./utilsServer";

export function isQRValid(qrString) {
    // TODO: u can do better than this
    let data;
    try {
        data = JSON.parse(qrString);
        if (!data.name || !data.courses) {
            throw new Error("Invalid JSON");
        }
        return (data.name && data.courses);
    } catch (e) {
        return false;
    }
}

export function userDataToQr(userData) {
    return {
        name: userData.name,
        courses: userData.courses.map(e => e.name)
    };
}

export async function qrToUserData(qrString) {
    // TODO: move settimeout here
    const qrJson = JSON.parse(qrString);
    let courses = qrJson.courses;
    const sectionPromises = courses.map(section => fetchSectionData(section));
    const sectionData = await Promise.all(sectionPromises);
    return {
        name: qrJson.name,
        courses: sectionData.filter(e => e !== null)
    }
}

async function fetchSectionData(section) {
    const sectionURL = section.replaceAll(" ", "-");
    try {
        // TODO: make sure this delay works always
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch(API_LINK + ENDPOINTS.sectionInfo + sectionURL);
        return await response.json();
    } catch (e) {
        return {name: section, location: "", classTimes: [], notFetched: true};
    }
}