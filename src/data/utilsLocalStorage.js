// Takes user data and returns true if there's at least two people to start matching / meeting
export default function hasCoursesAndFriends(userData) {
    return userData.courses
        && userData.friends
        && userData.courses.length > 0
        && userData.friends.length > 0;
}