import React, { useState, Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from 'react-bootstrap/Tooltip';
import QRCode from 'react-qr-code';
import QrScanner from 'qr-scanner';
import Cookies from 'universal-cookie';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

class CourseMatcher extends Component {

  state = {
    userErrorMessage: "",
    friendsErrorMessage: "",
    userName: "User",
    userCourses: "",
    viewCoursesText: "No loaded sections",
    timetablesText: [],
    timetablesPlaceholder: <tr><td colSpan="2" className='table-secondary help-text text-muted text-center'><em><small>
      After you scan your friends' QR codes, their names will be displayed here.
    </small></em></td></tr>,

    courseFiles: [],
    courses: [{}],       //Courses reading array. Will have courseList, file, student

    submittedFile: false,
    submitted: false,

    coursesTableText: <tr></tr>,
    sectionsTableText: <tr></tr>,
    meetTableText: "",

    modalDisplay: false,
    modalHeader: "",
    closeQRButton: "",
    QRScannerWidth: "0",
    qrCodeValue: "",
    qrScanner: "",

    nameCookie: "",
    courseCookie: ""
  }

  //Load cookies

  componentDidMount() {
    this.loadCookies();
    this.state.meetTableText = this.generateMeetTable();
  }

  //------------Basic table functions

  handleDeleteRow = (e) => {
    let currentRow = e.target.closest("tr");
    let newCourses = this.state.courses;
    newCourses.splice(currentRow.rowIndex, 1);
    this.updatePlaceholder();
    this.setState(prevState => ({
      courses: newCourses,
      submitted: false
    }));
    currentRow.remove();
  }

  handleChangeName = (e) => {
    this.setState({ userName: e.target.value })
  }

  updatePlaceholder = () => {
    if (!this.state.courses[1])
      this.setState({
        timetablesPlaceholder: <tr><td colSpan="2" className='table-secondary help-text text-muted  text-center'><em><small>
          After you scan your friends' QR codes, their names will be displayed here.
        </small></em></td></tr>
      });
    else
      this.setState({ timetablesPlaceholder: "" });
  }

  //------------Upload and submit button functions

  handleUpload = (e) => {
    let file = e.target.files[0];
    let newCourses = [];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      newCourses[0] = { file: reader.result };
    };
    reader.onerror = function () {
      console.log(reader.error);
    };
    this.setState(prevState => ({
      courseFiles: newCourses
    }));
  }

  handleSubmitFile = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({ submittedFile: true });
      this.readCourses();
      this.saveCookies(this.state.courses[0].key, this.state.courses[0].courseList);
      let newUserCourses = this.state.courses[0].courseList.map(e => " " + e);
      this.setState({
        userCourses: String(newUserCourses),
        viewCoursesText: "✓ " + newUserCourses.length + " loaded sections"
      });
    }
  }

  handleSubmit = () => {
    if (this.isTableValid()) {
      this.setState({ submitted: true });
      this.displayOnTable("courses", [""]);
      this.displayOnTable("sections", [""]);
    }
  }

  readCourses = () => {
    let splitFiles = this.state.courseFiles.map(e => e.file.split('\n'))
    let index = splitFiles[0].findIndex(e => e.includes("BEGIN:VEVENT"));
    splitFiles = splitFiles[0].slice(index);
    console.log(index, splitFiles);
    let newCourses = this.state.courses;

    //Read courses one by one
    let extractedCourses = splitFiles.filter(e => e.includes("SUMMARY:"))
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(e => e.substring(8, 20));

    //Read times that student is in class
    let extractedClassDays = splitFiles.filter(e => e.includes("BYDAY"))
      .map(e => e.slice(e.lastIndexOf("BYDAY") + 6).replace("\r", ""));
    let extractedClassStartTimes = splitFiles.filter(e => e.includes("DTSTART;"))
      .map(e => ((+e.substring(40, 42)) * 60) + (+e.substring(42, 44)));
    let extractedClassEndTimes = splitFiles.filter(e => e.includes("DTEND;"))
      .map(e => ((+e.substring(38, 40)) * 60) + (+e.substring(40, 42)));

    let extractedClassTimes = extractedClassDays.map((e, i) =>
      e.concat(extractedClassStartTimes[i].toString(), extractedClassEndTimes[i].toString()))

    console.log(extractedClassTimes);

    newCourses[0] = {
      key: this.state.userName,
      courseList: extractedCourses,
      classTimes: extractedClassTimes
    }

    //Change state of courses data
    this.setState({
      courses: newCourses
    });
  }

  saveCookies = (name, courseList) => {
    let nameCookie;
    let courseCookie;
    let expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 10)
    if (this.state.nameCookie == "" || this.state.courseCookie == "") {
      nameCookie = new Cookies();
      courseCookie = new Cookies();
      nameCookie.set('name', name, { path: '/', expires: expiryDate });
      courseCookie.set('courseList', courseList, { path: '/', expires: expiryDate });
    }
    else {
      nameCookie = this.state.nameCookie;
      courseCookie = this.state.courseCookie;
      nameCookie.set('name', name, { path: '/', expires: expiryDate });
      courseCookie.set('courseList', courseList, { path: '/', expires: expiryDate });
    }
    this.setState({ nameCookie: nameCookie, courseCookie: courseCookie });
    console.log(nameCookie.get('name'));
    console.log(courseCookie.get('courseList'));
  }

  loadCookies = () => {
    let nameCookie = new Cookies();
    let courseCookie = new Cookies();
    try {
      let userCourses = courseCookie.get('courseList')
      let newCourses = this.state.courses;
      nameCookie = nameCookie.get('name');
      newCourses[0] = { key: nameCookie, courseList: userCourses };
      userCourses = userCourses.map(e => " " + e)
      this.setState({
        userName: nameCookie,
        userCourses: String(userCourses),
        viewCoursesText: "✓ " + userCourses.length + " loaded sections",
        courses: newCourses,
        submittedFile: true
      });
      document.getElementById('user-name').value = nameCookie;
    } catch (e) {
      console.log("No cookies were loaded.");
    }
  }

  //------------Course matching functions

  handleView = (view) => {
    switch (view) {
      case "courses": this.displayOnTable("courses", this.findSameCourses());
        break;
      case "sections": this.displayOnTable("sections", this.findSameSections());
        break;
      default: break;
    }
  }

  findSameCourses = () => {
    let sameCourses = []; //Same courses array. Will have courseName, courseMates
    //vvv Major loop da loop to record same sections and courses
    //Loop for each student
    for (let i = 0; i < this.state.courses.length; i++) {
      //Loop for each course in this student's timetable
      for (let a = 0; a < this.state.courses[i].courseList.length; a++) {
        let currentSectionName = this.state.courses[i].courseList[a];
        let currentCourseFriends = [this.state.courses[i].key];
        //Loop for next students to check if they have the course
        for (let j = i + 1; j < this.state.courses.length; j++) {
          if (this.state.courses[j].courseList.map(e => e.substring(0, 8))
            .indexOf(currentSectionName.substring(0, 8)) >= 0)
            currentCourseFriends.push(this.state.courses[j].key);
        }
        //If there are common occurences found, add to sameCourses
        if (currentCourseFriends.length > 1 && //Check if this is not a duplicate of a previous match record
          sameCourses.map(e => { return (e.key === currentSectionName.substring(0, 8)) }).every(e => e === false))
          sameCourses.push({ key: currentSectionName.substring(0, 8), friends: currentCourseFriends });
      }
    }

    sameCourses.sort(function (a, b) {
      return (a.key < b.key) ? -1 : (a.key > b.key) ? 1 : 0;
    });

    return sameCourses;
  }

  findSameSections = () => {
    let sameSections = []; //Same sections array. Will have sectionName, sectionfriends
    //vvv Major loop da loop to record same sections and courses
    //Loop for each student
    for (let i = 0; i < this.state.courses.length; i++) {
      //Loop for each course in this student's timetable
      for (let a = 0; a < this.state.courses[i].courseList.length; a++) {
        let currentSectionName = this.state.courses[i].courseList[a];
        let currentSectionFriends = [this.state.courses[i].key];
        //Loop for next students to check if they have the course
        for (let j = i + 1; j < this.state.courses.length; j++) {
          if (this.state.courses[j].courseList.indexOf(currentSectionName) >= 0)
            currentSectionFriends.push(this.state.courses[j].key);
        }
        //If there are common occurences found, add to sameSections
        if (currentSectionFriends.length > 1 && //Check if this is not a duplicate of a previous match record
          sameSections.map(e => { return (e.key === currentSectionName) }).every(e => e === false))
          sameSections.push({ key: currentSectionName, friends: currentSectionFriends });
      }
    }

    sameSections.sort(function (a, b) {
      return (a.key < b.key) ? -1 : (a.key > b.key) ? 1 : 0;
    });

    return sameSections;
  }

  isFormValid = () => {
    let newErrorMessage = "";
    if (!document.getElementById("user-name").value.trim())
      newErrorMessage = "Please fill in your name.";
    if (document.getElementById("user-file").files.length < 1)
      newErrorMessage = "Please upload your file.";
    this.displayErrorMessage("user", newErrorMessage);
    if (newErrorMessage != "")
      return false;

    return true;
  }

  isTableValid = () => {
    let courses = this.state.courses;
    let newErrorMessage = "";
    if (courses.length < 2)
      newErrorMessage = "You need to have at least two files to start matching.";
    if (new Set(courses.map(e => e.key)).size !== courses.length || new Set(courses.map(e => e.courseList)).size !== courses.length)
      newErrorMessage = "There are duplicate names or files."
    this.displayErrorMessage("friends", newErrorMessage);

    if (newErrorMessage != "")
      return false;

    return true;
  }

  //-------------QR Code functions

  handleQrCode = () => {
    if (!this.state.submittedFile)
      return;
    this.setState({
      modalDisplay: true,
      modalHeader: this.state.userName + "'s Timetable QR Code",
      qrCodeValue: JSON.stringify(this.state.courses[0])
    });
  }

  handleScanQRCode = () => {
    this.setState({
      QRScannerWidth: "100%",
      closeQRButton: <button type="button" class="btn-close" aria-label="Close" onClick={this.handleStopQR}
        style={{ position: 'absolute', top: 10, right: 10 }} />
    })

    if (this.state.qrScanner == "") {
      let qrScanner = new QrScanner(
        document.getElementById("qr-video"),
        result => this.processQRCode(result, qrScanner),
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true
        }
      );
      this.setState({ qrScanner: qrScanner });
      qrScanner.start();
    }
    else
      this.state.qrScanner.start();
  }

  processQRCode = (result, qrScanner) => {
    if (!this.isQRValid(result.data))
      return;

    //Add scanned QR code to courses array
    let currentCourses = this.state.courses;
    let newTimetablesText = this.state.timetablesText;
    let addedCourse = JSON.parse(result.data);
    currentCourses.push(addedCourse);
    newTimetablesText[0] = "";
    newTimetablesText.push(<tr><td>{this.randomEmoji()} {addedCourse.key}</td>
      <td><button className="btn btn-outline-danger btn-sm deleteBtn" onClick={(e) => this.handleDeleteRow(e)}>X</button></td></tr>);
    this.setState({
      courses: currentCourses,
      timetablesText: newTimetablesText,
      submitted: false
    });

    //Update placeholder text
    this.updatePlaceholder();

    //Stop video after done
    if (this.state.qrScanner != "") {
      this.setState({ QRScannerWidth: 0, closeQRButton: "" });
      this.state.qrScanner.stop()
    };
  }

  isQRValid = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      this.setState({ errorMessage: "This isn't a valid course QR Code!" });
      return false;
    }
    let data = JSON.parse(str);
    if (!data.key || !data.courseList)
      return false;

    return true;
  }

  handleStopQR = () => {
    if (this.state.qrScanner != "") {
      this.state.qrScanner.stop();
      this.setState({ QRScannerWidth: 0, closeQRButton: "" })
    }
  }

  handleHideModal = () => {
    this.setState({ modalDisplay: false });
  }

  //------------When to meet functions

  generateMeetTable = () => {
    let meetTableText = [];
    let startTime = new Date();
    startTime.setHours(8);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    let endTime = new Date();
    endTime.setHours(22);
    endTime.setMinutes(0);
    endTime.setSeconds(0);

    // Loop through the time range
    for (let currentTime = startTime; currentTime <= endTime; currentTime.setMinutes(currentTime.getMinutes() + 30)) {
      if (currentTime.getMinutes() == 0) {
        let options = { hour: '2-digit', minute: '2-digit', hour12: false };
        let currentLocaleTime = currentTime.toLocaleTimeString([], options)
        meetTableText.push(<tr>
          <th scope='row'>{currentLocaleTime}</th>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>)
      } else {
        meetTableText.push(<tr>
          <td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>)
      }
    }

    return meetTableText;
  }

  //------------Table display functions

  displayErrorMessage = (element, message) => {
    switch (element) {
      case "user": this.setState({ userErrorMessage: message }); break;
      case "friends": this.setState({ friendsErrorMessage: message }); break;
      default: break;
    }
  }

  displayOnTable = (table, text) => {
    for (let i = 0; i < text.length; i++) {
      document.getElementById(table).innerHTML +=
        `<tr><td>${text[i].key}</td><td>${text[i].friends.toString().replaceAll(",", ", ")}</td></tr>`;
    }
  }

  randomEmoji = () => {
    var emojis = [
      '😄', '😃', '😀', '😊', '☺', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '👿', '😮', '😬', '😐', '😕', '😯', '😶', '😇', '😏', '😑', '👲', '👳', '👮', '👷', '💂', '👶', '👦', '👧', '👨', '👩', '👴', '👵', '👱', '👼', '👸', '😺', '😸', '😻', '😽', '😼', '🙀', '😿', '😹', '😾', '👹', '👺', '🙈', '🙉', '🙊', '💀', '👽', '💩', '🔥', '✨', '🌟', '💫', '💥', '💢', '💦', '💧', '💤', '💨', '👂', '👀', '👃', '👅', '👄', '👍', '👎', '👌', '👊', '✊', '✌', '👋', '✋', '👐', '👆', '👇', '👉', '👈', '🙌', '🙏', '☝', '👏', '💪', '🚶', '🏃', '💃', '👫', '👪', '👬', '👭', '💏', '💑', '👯', '🙆', '🙅', '💁', '🙋', '💆', '💇', '💅', '👰', '🙎', '🙍', '🙇', '🎩', '👑', '👒', '👟', '👞', '👡', '👠', '👢', '👕', '👔', '👚', '👗', '🎽', '👖', '👘', '👙', '💼', '👜', '👝', '👛', '👓', '🎀', '🌂', '💄', '💛', '💙', '💜', '💚', '❤', '💔', '💗', '💓', '💕', '💖', '💞', '💘', '💌', '💋', '💍', '💎', '👤', '👥', '💬', '👣', '💭', '🐶', '🐺', '🐱', '🐭', '🐹', '🐰', '🐸', '🐯', '🐨', '🐻', '🐷', '🐽', '🐮', '🐗', '🐵', '🐒', '🐴', '🐑', '🐘', '🐼', '🐧', '🐦', '🐤', '🐥', '🐣', '🐔', '🐍', '🐢', '🐛', '🐝', '🐜', '🐞', '🐌', '🐙', '🐚', '🐠', '🐟', '🐬', '🐳', '🐋', '🐄', '🐏', '🐀', '🐃', '🐅', '🐇', '🐉', '🐎', '🐐', '🐓', '🐕', '🐖', '🐁', '🐂', '🐲', '🐡', '🐊', '🐫', '🐪', '🐆', '🐈', '🐩', '🐾', '💐', '🌸', '🌷', '🍀', '🌹', '🌻', '🌺', '🍁', '🍃', '🍂', '🌿', '🌾', '🍄', '🌵', '🌴', '🌲', '🌳', '🌰', '🌱', '🌼', '🌐', '🌞', '🌝', '🌚', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌜', '🌛', '🌙', '🌍', '🌎', '🌏', '🌋', '🌌', '🌠', '⭐', '☀', '⛅', '☁', '⚡', '☔', '❄', '⛄', '🌀', '🌁', '🌈', '🌊', '🎍', '💝', '🎎', '🎒', '🎓', '🎏', '🎆', '🎇', '🎐', '🎑', '🎃', '👻', '🎅', '🎄', '🎁', '🎋', '🎉', '🎊', '🎈', '🎌', '🔮', '🎥', '📷', '📹', '📼', '💿', '📀', '💽', '💾', '💻', '📱', '☎', '📞', '📟', '📠', '📡', '📺', '📻', '🔊', '🔉', '🔈', '🔇', '🔔', '🔕', '📢', '📣', '⏳', '⌛', '⏰', '⌚', '🔓', '🔒', '🔏', '🔐', '🔑', '🔎', '💡', '🔦', '🔆', '🔅', '🔌', '🔋', '🔍', '🛁', '🛀', '🚿', '🚽', '🔧', '🔩', '🔨', '🚪', '🚬', '💣', '🔫', '🔪', '💊', '💉', '💰', '💴', '💵', '💷', '💶', '💳', '💸', '📲', '📧', '📥', '📤', '✉', '📩', '📨', '📯', '📫', '📪', '📬', '📭', '📮', '📦', '📝', '📄', '📃', '📑', '📊', '📈', '📉', '📜', '📋', '📅', '📆', '📇', '📁', '📂', '✂', '📌', '📎', '✒', '✏', '📏', '📐', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📚', '📖', '🔖', '📛', '🔬', '🔭', '📰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🎻', '🎺', '🎷', '🎸', '👾', '🎮', '🃏', '🎴', '🀄', '🎲', '🎯', '🏈', '🏀', '⚽', '⚾', '🎾', '🎱', '🏉', '🎳', '⛳', '🚵', '🚴', '🏁', '🏇', '🏆', '🎿', '🏂', '🏊', '🏄', '🎣', '☕', '🍵', '🍶', '🍼', '🍺', '🍻', '🍸', '🍹', '🍷', '🍴', '🍕', '🍔', '🍟', '🍗', '🍖', '🍝', '🍛', '🍤', '🍱', '🍣', '🍥', '🍙', '🍘', '🍚', '🍜', '🍲', '🍢', '🍡', '🍳', '🍞', '🍩', '🍮', '🍦', '🍨', '🍧', '🎂', '🍰', '🍪', '🍫', '🍬', '🍭', '🍯', '🍎', '🍏', '🍊', '🍋', '🍒', '🍇', '🍉', '🍓', '🍑', '🍈', '🍌', '🍐', '🍍', '🍠', '🍆', '🍅', '🌽', '🏠', '🏡', '🏫', '🏢', '🏣', '🏥', '🏦', '🏪', '🏩', '🏨', '💒', '⛪', '🏬', '🏤', '🌇', '🌆', '🏯', '🏰', '⛺', '🏭', '🗼', '🗾', '🗻', '🌄', '🌅', '🌃', '🗽', '🌉', '🎠', '🎡', '⛲', '🎢', '🚢', '⛵', '🚤', '🚣', '⚓', '🚀', '✈', '💺', '🚁', '🚂', '🚊', '🚉', '🚞', '🚆', '🚄', '🚅', '🚈', '🚇', '🚝', '🚋', '🚃', '🚎', '🚌', '🚍', '🚙', '🚘', '🚗', '🚕', '🚖', '🚛', '🚚', '🚨', '🚓', '🚔', '🚒', '🚑', '🚐', '🚲', '🚡', '🚟', '🚠', '🚜', '💈', '🚏', '🎫', '🚦', '🚥', '⚠', '🚧', '🔰', '⛽', '🏮', '🎰', '♨', '🗿', '🎪', '🎭', '📍', '🚩', '⬆', '⬇', '⬅', '➡', '🔠', '🔡', '🔤', '↗', '↖', '↘', '↙', '↔', '↕', '🔄', '◀', '▶', '🔼', '🔽', '↩', '↪', 'ℹ', '⏪', '⏩', '⏫', '⏬', '⤵', '⤴', '🆗', '🔀', '🔁', '🔂', '🆕', '🆙', '🆒', '🆓', '🆖', '📶', '🎦', '🈁', '🈯', '🈳', '🈵', '🈴', '🈲', '🉐', '🈹', '🈺', '🈶', '🈚', '🚻', '🚹', '🚺', '🚼', '🚾', '🚰', '🚮', '🅿', '♿', '🚭', '🈷', '🈸', '🈂', 'Ⓜ', '🛂', '🛄', '🛅', '🛃', '🉑', '㊙', '㊗', '🆑', '🆘', '🆔', '🚫', '🔞', '📵', '🚯', '🚱', '🚳', '🚷', '🚸', '⛔', '✳', '❇', '❎', '✅', '✴', '💟', '🆚', '📳', '📴', '🅰', '🅱', '🆎', '🅾', '💠', '➿', '♻', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔯', '🏧', '💹', '💲', '💱', '©', '®', '™', '〽', '〰', '🔝', '🔚', '🔙', '🔛', '🔜', '❌', '⭕', '❗', '❓', '❕', '❔', '🔃', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '✖', '➕', '➖', '➗', '♠', '♥', '♣', '♦', '💮', '💯', '✔', '☑', '🔘', '🔗', '➰', '🔱', '🔲', '🔳', '◼', '◻', '◾', '◽', '▪', '▫', '🔺', '⬜', '⬛', '⚫', '⚪', '🔴', '🔵', '🔻', '🔶', '🔷', '🔸', '🔹'
    ];

    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  render() {

    return (
      <div className="App">
        <div className="row m-4 justify-content-around">
          <div className='col-md-5 p-0 mb-4'>
            <div className="card">
              <div className="card-body">
                <h5 className='card-title'>Upload your Timetable</h5>
                <div className="m-1">
                  <p><small className="card-text help-text text-muted">Find your Timetable on your <a href='https://ssc.adm.ubc.ca/sscportal' rel='noreferrer' target="_blank">SSC</a>,
                    then click <em>Download your schedule to your calendar software</em>. Upload it here, then hit Submit.</small></p>
                </div>
                <div className="m-1 mb-2">
                  <div className="row mb-3">
                    <div className="col-5">
                      <input type="text" id="user-name" className="form-control" placeholder="Your name" onChange={(e) => this.handleChangeName(e)} />
                    </div>
                    <div className="col-7">
                      <input type="file" id='user-file' accept=".ics" className="form-control" onChange={(e) => this.handleUpload(e)} />
                    </div>
                  </div>
                  <div className="row m-1">
                    <button className="btn btn-outline-primary" onClick={this.handleSubmitFile}>Submit</button>
                  </div>
                </div>
                <p><small className="card-text help-text text-muted">Use the button below to share your Timetable QR code with your friends.</small></p>
                <div className="btn-group d-flex px-2 mb-2">
                  <button className='btn btn-outline-secondary' style={{ pointerEvents: "none" }}>
                    {this.state.viewCoursesText}
                  </button>
                  <Button variant="primary" onClick={this.handleQrCode} disabled={!this.state.submittedFile}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-qr-code mb-1" viewBox="0 0 16 16">
                      <path d="M2 2h2v2H2V2Z" />
                      <path d="M6 0v6H0V0h6ZM5 1H1v4h4V1ZM4 12H2v2h2v-2Z" />
                      <path d="M6 10v6H0v-6h6Zm-5 1v4h4v-4H1Zm11-9h2v2h-2V2Z" />
                      <path d="M10 0v6h6V0h-6Zm5 1v4h-4V1h4ZM8 1V0h1v2H8v2H7V1h1Zm0 5V4h1v2H8ZM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8H6Zm0 0v1H2V8H1v1H0V7h3v1h3Zm10 1h-1V7h1v2Zm-1 0h-1v2h2v-1h-1V9Zm-4 0h2v1h-1v1h-1V9Zm2 3v-1h-1v1h-1v1H9v1h3v-2h1Zm0 0h3v1h-2v1h-1v-2Zm-4-1v1h1v-2H7v1h2Z" />
                      <path d="M7 12h1v3h4v1H7v-4Zm9 2v2h-3v-1h2v-1h1Z" />
                    </svg>
                    <span> Share your Timetable</span>
                  </Button>
                  <Modal show={this.state.modalDisplay} onHide={this.handleHideModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>{this.state.modalHeader}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div style={{
                        height: "auto",
                        margin: "0 auto",
                        padding: "1rem",
                        maxWidth: 300,
                        width: "100%"
                      }}>
                        <QRCode
                          size={4000}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          value={this.state.qrCodeValue}
                          viewBox={`0 0 256 256`}
                        />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <small className="text-muted">Show this QR code to a friend who can scan it right now, or take a screenshot and share it with them through social media and messaging apps!</small>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 p-0 mb-4">
            <div className="card">
              <div className="card-body">
                <div style={{ position: "relative" }}>
                  <h5 className='card-title'>Add your friends' Timetables</h5>
                  <Button variant='primary' style={{ position: "absolute", top: 0, right: 0 }} onClick={this.handleScanQRCode}>
                    <span>+ </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-qr-code-scan mb-1" viewBox="0 0 16 16">
                      <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z" />
                      <path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z" />
                      <path d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z" />
                      <path d="M9 2h5v5H9V2Zm1 1v3h3V3h-3ZM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8Zm2 2H9V9h1v1Zm4 2h-1v1h-2v1h3v-2Zm-4 2v-1H8v1h2Z" />
                      <path d="M12 9h2V8h-2v1Z" />
                    </svg>
                  </Button>
                </div>
                <div className="m-1">
                  <p><small className="card-text help-text text-muted">Scan your friends' Timetable QR codes, then hit Submit.</small></p>
                </div>
                <div style={{ position: 'relative', height: this.state.QRScannerWidth }}>
                  <video style={{ width: this.state.QRScannerWidth }}
                    id="qr-video" disablePictureInPicture playsInline />
                  {this.state.closeQRButton}
                </div>
                <table className="table mb-4">
                  <thead>
                    <tr>
                      <th className='col-11'>Name</th>
                      <th className='col-1'></th>
                    </tr>
                  </thead>
                  <tbody id="timetablesTable">{this.state.timetablesText}</tbody>
                  <tfoot>
                    {this.state.timetablesPlaceholder}
                    <tr>
                      <td colSpan={2}><p className='text-danger'>{this.state.friendsErrorMessage}</p></td>
                    </tr>
                  </tfoot>
                </table>
                <div className='row m-1'>
                  <button className="btn btn-outline-primary" onClick={this.handleSubmit}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="view-table" className="fixed col-11 col-md-9 p-0 mx-auto">
          <Tab.Container defaultActiveKey="tab-4">
            <Row>
              <Col md={3} className="mb-3">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="tab-1">
                      ...
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-2" onClick={() => this.handleView("courses")} disabled={!this.state.submitted}>
                      📚 Courses in common
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-3" onClick={() => this.handleView("sections")} disabled={!this.state.submitted}>
                      🧑‍🏫 Sections in common
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-4" onClick={() => this.handleView("meet")}>
                      🕒 When to meet
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="tab-1">
                    <div className="card bg-secondary text-light">
                      <div className="card-body">
                        <small>
                          <em>
                            After uploading your files, click Submit and press one of the buttons to the left of this box. The information you need will be displayed here.
                          </em>
                        </small>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-2">
                    <div className="card">
                      <div className="card-body">
                        <table className='table'>
                          <thead>
                            <tr>
                              <th className='col-md-4'>📚 Course</th>
                              <th className='col-md-8'>👫 Friends</th>
                            </tr>
                          </thead>
                          <tbody id="courses"></tbody>
                        </table>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-3">
                    <div className="card">
                      <div className="card-body">
                        <table className='table'>
                          <thead>
                            <tr>
                              <th className='col-md-4'>🧑‍🏫 Section</th>
                              <th className='col-md-8'>👫 Friends</th>
                            </tr>
                          </thead>
                          <tbody id="sections"></tbody>
                        </table>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="card">
                          <div className="card-body">
                            <table className='table table-sm meet-table'>
                              <thead>
                                <th></th>
                                <th scope='col'>Mon</th>
                                <th scope='col'>Tue</th>
                                <th scope='col'>Wed</th>
                                <th scope='col'>Thu</th>
                                <th scope='col'>Fri</th>
                              </thead>
                              <tbody>
                                {this.state.meetTableText}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div >
    );
  }
}

export default CourseMatcher;