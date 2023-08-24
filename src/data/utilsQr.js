// Takes user data and converts it into a compressed JSON to make QR efficient
// Compress by storing only course names, no information
import {API_LINK, ENDPOINTS} from "./utilsServer";

export function userDataToQr(userData) {
    return {
        name: userData.name,
        courses: userData.courses.map(e => e.name)
    };
}

export function qrToUserData(qrJson) {
    let courses = qrJson.courses;
    courses.map(section => fetchSectionData(section))
    return {
        name: qrJson.name,
        courses: courses
    };
}

async function fetchSectionData(section) {
    const response = await fetch(API_LINK + ENDPOINTS.sectionInfo + section);
    return await response.json();
}