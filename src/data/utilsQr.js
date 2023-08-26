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
    const qrJson = JSON.parse(qrString);
    let courses = qrJson.courses;
    courses = courses.map(e => ({name: e, location: "", classTimes: [], notFetched: true}))
    const sectionData = await fetchSections(courses);
    console.log("promised data", sectionData);
    return {
        name: qrJson.name,
        courses: sectionData
    }
}

async function fetchSections(sections, recursionCount = 0) {
    if (recursionCount >= 4) {
        // TODO: error toast
        console.error("Recursion limit reached. Returning data as is.");
        return sections;
    }

    const sectionPromises = sections.map(async section => {
        if (section.notFetched) {
            const sectionURL = section.name.replaceAll(" ", "-");
            await new Promise(resolve => setTimeout(resolve, 1000));
            const sectionInfo = await fetchSectionInfo(sectionURL, section);
            return sectionInfo;
        } else {
            return section;
        }
    });
    const sectionData = await Promise.all(sectionPromises);
    if (sectionData.some(section => section.notFetched)) {
        return fetchSections(sectionData, recursionCount + 1);
    } else {
        return sectionData;
    }
}

async function fetchSectionInfo(sectionURL, section) {
    try {
        const response = await fetch(API_LINK + ENDPOINTS.sectionInfo + sectionURL);
        return await response.json();
    } catch (e) {
        return section;
    }
}