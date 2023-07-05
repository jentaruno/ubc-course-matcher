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
    timetablesText: [],
    timetablesPlaceholder: <tr><td colSpan="2" className='table-secondary help-text text-muted text-center'><em><small>
      After you scan your friends' QR codes, their names will be displayed here.
    </small></em></td></tr>,

    meetTableText: ``,

    courseFiles: [],
    courses: [{}],       //Courses reading array. Will have key (student name), courseList, classTimes
    tooltips: {},
    term: "",

    userSubmitState: { disabled: false, color: "primary", text: "Submit" },
    shareQRCodeState: { disabled: true, color: "outline-primary" },
    timetablesSubmitState: { color: "outline-primary", text: "Submit" },
    pillsState: {
      disabled: true,
      text: "After uploading your files, click Submit and press one of the buttons under Info. The information you need will be displayed here."
    },
    activeTab: "tab-1",

    modalDisplay: false,
    modalHeader: "",
    closeQRButton: "",
    QRScannerWidth: "0",
    qrCodeValue: "",
    qrScanner: "",

    nameCookie: "",
    courseCookie: "",
    classTimesCookie: ""
  }

  //Load cookies

  componentDidMount() {
    this.loadCookies();
    this.generateTooltips();
    this.state.meetTableText = this.generateMeetTable();
  }

  //------------Basic table functions

  handleDeleteRow = (e) => {
    let currentRow = e.target.closest("tr");
    let newCourses = this.state.courses;
    newCourses.splice(currentRow.rowIndex, 1);
    this.updatePlaceholder();
    this.setState({ courses: newCourses });
    this.nextButton(2);
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
    this.setState({
      courseFiles: newCourses,
      userErrorMessage: ""
    });
    this.nextButton(0);
  }

  handleSubmitFile = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.readCourses();
      this.saveCookies(this.state.courses[0].key, this.state.courses[0].courseList, this.state.courses[0].classTimes);
      let newUserCourses = this.state.courses[0].courseList.map(e => " " + e);
      this.setState({ userCourses: String(newUserCourses) });
      this.generateTooltips();
      this.nextButton(1);
    }
  }

  handleSubmit = () => {
    if (this.isTableValid()) {
      this.generateTooltips();
      this.nextButton(3);
    }
  }

  handleHoverSubmit = (e) => {
    e.target.innerHTML = "Submit";
  }

  handleOutSubmit = (e) => {
    e.target.innerHTML = this.state.timetablesSubmitState.text
  }

  readCourses = () => {
    let splitFiles = this.state.courseFiles.map(e => e.file.split('BEGIN:VEVENT'));
    let currentTermFiles = this.sliceCurrentTerm(splitFiles[0]);
    let newCourses = this.state.courses;

    //Read courses one by one
    let extractedCourses = currentTermFiles.filter(e => e.includes("SUMMARY"))
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(e => e.substring(8, 20));

    //Read times that student is in class
    let extractedClassDays = currentTermFiles.filter(e => e.includes("BYDAY"))
      .map(e => e.slice(e.lastIndexOf("BYDAY") + 6).replace("\r", "")).map((e) => this.dayToNum(e));
    let extractedClassStartTimes = currentTermFiles.filter(e => e.includes("DTSTART;"))
      .map(e => e.substring(40, 42) + ":" + e.substring(42, 44));
    let extractedClassEndTimes = currentTermFiles.filter(e => e.includes("DTEND;"))
      .map(e => e.substring(38, 40) + ":" + e.substring(40, 42));

    let extractedClassTimes = extractedClassDays.map((e, i) =>
      e + extractedClassStartTimes[i].toString() + "-" + extractedClassEndTimes[i].toString())
      .filter((v, i, a) => a.indexOf(v) === i);

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

  sliceCurrentTerm = (splitFile) => {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let winter = splitFile.filter(e => e.includes("UNTIL=" + currentYear));
    let fall = splitFile.filter(e => e.includes("UNTIL=" + (currentYear + 1)));
    if (winter.length > 0) {
      this.setState({ term: "Winter" });
      let winterCourses = [];
      for (let i = 0; i < winter.length; i++) {
        winter[i].split("\n").map(e => winterCourses.push(e));
      }
      return winterCourses;
    } else {
      this.setState({ term: "Fall" });
      let fallCourses = [];
      for (let i = 0; i < fall.length; i++) {
        fall[i].split("\n").map(e => fallCourses.push(e));
      }
      return fallCourses;
    }
  }

  dayToNum = (s) => {
    switch (s) {
      case "MO": return 1;
      case "TU": return 2;
      case "WE": return 3;
      case "TH": return 4;
      case "FR": return 5;
      default: break;
    }
  }

  saveCookies = (name, courseList, classTimes) => {
    let nameCookie;
    let courseCookie;
    let classTimesCookie;
    let expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 4)
    if (this.state.nameCookie == "" ||
      this.state.courseCookie == "" ||
      this.state.classTimesCookie) {
      nameCookie = new Cookies();
      courseCookie = new Cookies();
      classTimesCookie = new Cookies();
      nameCookie.set('name', name, { path: '/', expires: expiryDate });
      courseCookie.set('courseList', courseList, { path: '/', expires: expiryDate });
      classTimesCookie.set('classTimes', classTimes, { path: '/', expires: expiryDate });
    }
    else {
      nameCookie = this.state.nameCookie;
      courseCookie = this.state.courseCookie;
      classTimesCookie = this.state.classTimes;
      nameCookie.set('name', name, { path: '/', expires: expiryDate });
      courseCookie.set('courseList', courseList, { path: '/', expires: expiryDate });
      classTimesCookie.set('classTimes', classTimes, { path: '/', expires: expiryDate })
    }
    this.setState({ nameCookie: nameCookie, courseCookie: courseCookie, classTimesCookie: classTimesCookie });
  }

  loadCookies = () => {
    let nameCookie = new Cookies();
    let courseCookie = new Cookies();
    let classTimesCookie = new Cookies();
    try {
      let userCourses = courseCookie.get('courseList');
      let userClassTimes = classTimesCookie.get('classTimes');
      let newCourses = this.state.courses;
      nameCookie = nameCookie.get('name');
      newCourses[0] = { key: nameCookie, courseList: userCourses, classTimes: userClassTimes };
      userCourses = userCourses.map(e => " " + e)
      this.setState({
        userName: nameCookie,
        userCourses: String(userCourses),
        courses: newCourses
      });
      this.nextButton(1);
      document.getElementById('user-name').value = nameCookie;
    } catch (e) {
      console.log("No cookies were loaded.");
    }
  }

  nextButton = (step) => {
    switch (step) {
      case 0:
        this.setState({
          userSubmitState: { disabled: false, color: "primary", text: "Submit" },
          shareQRCodeState: { disabled: true, color: "outline-primary" }
        });
        break;
      case 1:
        this.setState({
          userSubmitState: {
            disabled: true,
            color: "outline-primary",
            text: "✓ " + this.state.courses[0].courseList.length + " loaded sections"
          },
          shareQRCodeState: { disabled: false, color: "primary" },
          pillsState: { disabled: this.state.pillsState.disabled, text: this.state.pillsState.text },
          activeTab: "tab-1"
        });
        break;
      case 2:
        this.setState({ timetablesSubmitState: { color: "primary", text: "Submit" } });
        break;
      case 3:
        this.setState({
          timetablesSubmitState: {
            color: "outline-primary",
            text: "✓ " + (this.state.courses.length - 1) + " timetable(s) loaded"
          },
          pillsState: {
            disabled: false,
            text: "Start course matching! Press one of the buttons under Info to get the information you need."
          },
          activeTab: "tab-1"
        });
        break;
      default: break;
    }
  }

  //------------Course matching functions

  handleView = (view) => {
    switch (view) {
      case "courses":
        this.displayOnTable("courses", this.findSameCourses());
        this.setState({ activeTab: "tab-2" });
        break;
      case "sections": this.displayOnTable("sections", this.findSameSections());
        this.setState({ activeTab: "tab-3" });
        break;
      case "meet": this.displayMeetBlocks(this.findMeetBlocks());
        this.setState({ activeTab: "tab-4" });
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
        let currentCourseName = this.state.courses[i].courseList[a].substring(0, 8);
        let currentCourseFriends = [this.state.courses[i].key];
        //Loop for next students to check if they have the course
        for (let j = i + 1; j < this.state.courses.length; j++) {
          if (this.state.courses[j].courseList.map(e => e.substring(0, 8))
            .indexOf(currentCourseName) != -1)
            currentCourseFriends.push(this.state.courses[j].key);
        }
        //If there are common occurences found, add to sameCourses
        if (currentCourseFriends.length > 1 && //Check if this is not a duplicate of a previous match record
          sameCourses.map(e => { return (e.key === currentCourseName) }).every(e => e === false))
          sameCourses.push({ key: currentCourseName, friends: currentCourseFriends });
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
        //Loop for next students to check if they have the section
        for (let j = i + 1; j < this.state.courses.length; j++) {
          if (this.state.courses[j].courseList.indexOf(currentSectionName) != -1)
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

  findMeetBlocks = () => {
    let blocksToAdd = this.state.courses.map(e => {
      return {
        key: e.key,
        classTimes: this.breakBlocks(e.classTimes.map(e => {
          return {
            col: +e.substring(0, 1),
            rowStart: e.substring(1, e.indexOf("-")),
            rowEnd: e.substring(e.indexOf("-") + 1)
          }
        }))
      }
    })

    return blocksToAdd;
  }

  breakBlocks = (classTimes) => {
    let newClassTimes = [];
    for (let i = 0; i < classTimes.length; i++) {
      let endTime = this.stringToDate(classTimes[i].rowEnd);
      for (let j = this.stringToDate(classTimes[i].rowStart);
        j < endTime;
        j.setMinutes(j.getMinutes() + 30)) {
        let options = { hour: '2-digit', minute: '2-digit', hour12: false };
        let newTime = j.toLocaleTimeString([], options);
        newClassTimes.push({ tdId: "" + classTimes[i].col + newTime });
      }
    }
    newClassTimes = newClassTimes.filter((v, i, a) => a.indexOf(v) === i);

    return newClassTimes;
  }

  stringToDate = (time) => {
    var date = new Date();
    var parts = time.split(':');
    date.setHours(parts[0]);
    date.setMinutes(parts[1]);
    return date;
  }

  isFormValid = () => {
    let newErrorMessage = "";
    if (document.getElementById("user-name").value.trim() == "") {
      newErrorMessage = "Please fill in your name.";
    } else if (document.getElementById("user-file").files.length < 1) {
      newErrorMessage = "Please upload your file.";
    }
    this.displayErrorMessage("user", newErrorMessage);
    if (newErrorMessage != "")
      return false;

    return true;
  }

  isTableValid = () => {
    let courses = this.state.courses;
    let newErrorMessage = "";
    if (courses.length < 2)
      newErrorMessage = "Please upload a file to start matching.";
    if (new Set(courses.map(e => e.key)).size !== courses.length || new Set(courses.map(e => e.courseList)).size !== courses.length)
      newErrorMessage = "There are duplicate names or files."
    this.displayErrorMessage("friends", newErrorMessage);

    if (newErrorMessage != "")
      return false;

    return true;
  }

  //-------------QR Code functions

  handleQrCode = () => {
    if (!this.state.userSubmitState.disabled)
      return;
    this.setState({
      modalDisplay: true,
      modalHeader: this.state.userName + "'s " + this.state.term + " Timetable QR Code",
      qrCodeValue: JSON.stringify(this.state.courses[0])
    });
  }

  handleScanQRCode = () => {
    this.setState({
      QRScannerWidth: "100%",
      closeQRButton: <button type="button" class="btn-close-white" aria-label="Close" onClick={this.handleStopQR}
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
      friendsErrorMessage: ""
    });
    this.nextButton(2);

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

  generateTooltips = () => {
    let newTooltips = {};
    const startTime = new Date();
    const endTime = new Date();
    endTime.setHours(22);
    endTime.setMinutes(0);
    endTime.setSeconds(0);
    let options = { hour: '2-digit', minute: '2-digit', hour12: false };

    // Loop through the time range
    for (let i = 1; i <= 5; i++) {
      startTime.setHours(8);
      startTime.setMinutes(0);
      startTime.setSeconds(0);
      for (let currentTime = startTime;
        currentTime <= endTime;
        currentTime.setMinutes(currentTime.getMinutes() + 30)) {
        let currentLocaleTime = currentTime.toLocaleTimeString([], options);
        newTooltips["" + i + currentLocaleTime] = { text: "Everyone's free!", free: [], notFree: [] };
      }
    }

    this.setState({ tooltips: newTooltips });
  }

  generateMeetTable = () => {
    let newMeetTableText = [];
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
      let options = { hour: '2-digit', minute: '2-digit', hour12: false };
      let currentLocaleTime = currentTime.toLocaleTimeString([], options);
      if (currentTime.getMinutes() == 0) {
        newMeetTableText.push(<tr className='d-flex'>
          <th className='col-2 p-1' scope='row'>{currentLocaleTime}</th>
          {this.generateMeetRow(currentLocaleTime)}
        </tr>);
      } else {
        newMeetTableText.push(<tr className='d-flex'>
          <th className='col-2 p-1' scope='row'><span className='d-flex'></span></th>
          {this.generateMeetRow(currentLocaleTime)}
        </tr>);
      }
    }

    this.setState({ meetTableText: newMeetTableText });
  }


  generateMeetRow = (currentRow) => {
    let meetRows = [];
    for (let i = 1; i <= 5; i++) {
      const tdId = "" + i + currentRow;
      let tooltipText = "";
      if (this.state.tooltips[tdId] && this.state.tooltips[tdId].text != null) {
        tooltipText = this.state.tooltips[tdId].text;
      }
      const tooltip = (<Tooltip>
        {tooltipText}
      </Tooltip>)
      meetRows.push(<td id={tdId} className='col p-0 bg-danger' style={{ opacity: 0 }}><OverlayTrigger
        placement="bottom"
        overlay={tooltip}>
        <span className='d-flex' style={{ opacity: 0 }}>.</span>
      </OverlayTrigger></td>);
    }
    return meetRows;
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
    document.getElementById(table).innerHTML = "";
    if (text.length < 1) return;
    for (let i = 0; i < text.length; i++) {
      document.getElementById(table).innerHTML +=
        `<tr><td>${text[i].key}</td><td>${text[i].friends.toString().replaceAll(",", ", ")}</td></tr>`;
    }
  }

  displayMeetBlocks = (courses) => {
    let friendsList = this.state.courses.map(e => e.key);
    //this.generateTooltips();
    //Display tooltips for who's not free
    for (let i = 0; i < courses.length; i++) {
      courses[i].classTimes.map(e => {
        this.addTooltip(e.tdId, friendsList, courses[i].key);
      })
    }
    this.generateMeetTable();

    //Add shades to table
    this.removeShades();
    for (let i = 0; i < courses.length; i++) {
      courses[i].classTimes.map(e => {
        let cell = document.getElementById(e.tdId);
        this.addShade(cell);
      });
    }
    this.placeNowPointer();
  }

  removeShades = () => {
    var table = document.getElementById("meet-table");
    var tableCells = table.getElementsByTagName("td");
    for (var i = 0; i < tableCells.length; i++) {
      tableCells[i].style.opacity = "0";
    }
  }

  addShade = (cell) => {
    let unit = 1 / this.state.courses.length;
    if (cell.style.opacity == 0) {
      cell.style.opacity = unit;
    } else if (cell.style.opacity < 1) {
      cell.style.opacity = +cell.style.opacity + unit;
    }
  }

  addTooltip = (tooltipId, friendsList, name) => {
    let newTooltips = this.state.tooltips;
    let free = [];
    let notFree = [];
    newTooltips[tooltipId].notFree.push(name);
    if (newTooltips[tooltipId].text == "Everyone's free!") {
      free = friendsList.filter(e => e != name);
      notFree = [name];
      newTooltips[tooltipId].text = ("Free: " + free + ". Not free: " + notFree).replaceAll(",", ", ");
    } else if (newTooltips[tooltipId].free.length == 0) {
      return;
    } else {
      let rawFree = newTooltips[tooltipId].free.filter(e => e != name);
      let rawNotFree = newTooltips[tooltipId].notFree;
      rawNotFree.push(name);
      free = new Set(rawFree);
      free = [...free];
      notFree = new Set(rawNotFree);
      notFree = [...notFree];
      newTooltips[tooltipId].text = ("Free: " + free + ". Not free: " + notFree).replaceAll(",", ", ");

      if (free.length == 0) {
        newTooltips[tooltipId].text = "No one's free";
      }
    }

    newTooltips[tooltipId].free = free;
    newTooltips[tooltipId].notFree = notFree;

    this.setState({ tooltips: newTooltips });
  }

  placeNowPointer = () => {
    var d = new Date();
    var minutes = d.getMinutes();
    var roundDownMinutes = 0;
    if (minutes < 30) {
      roundDownMinutes = 0;
    } else {
      roundDownMinutes = 30;
    }
    d.setMinutes(roundDownMinutes);
    d.setSeconds(0);
    let options = { hour: '2-digit', minute: '2-digit', hour12: false };
    let currentLocaleTime = d.toLocaleTimeString([], options);
    let timeNow = "" + d.getDay() + currentLocaleTime;
    if (document.getElementById(timeNow))
      document.getElementById(timeNow).style.border = "2px solid yellow";
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
                  <p className='text-danger'>{this.state.userErrorMessage}</p>
                </div>
                <p><small className="card-text help-text text-muted">Use the button below to share your Timetable QR code with your friends.</small></p>
                <div className="btn-group d-flex px-2 mb-2">
                  <Button variant={this.state.userSubmitState.color} onClick={this.handleSubmitFile} disabled={this.state.userSubmitState.disabled}>
                    {this.state.userSubmitState.text}
                  </Button>
                  <Button variant={this.state.shareQRCodeState.color} onClick={this.handleQrCode} disabled={this.state.shareQRCodeState.disabled}>
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
                  <Button variant={this.state.timetablesSubmitState.color}
                    onClick={this.handleSubmit}
                    onMouseOver={(e) => this.handleHoverSubmit(e)}
                    onMouseOut={(e) => this.handleOutSubmit(e)}>{this.state.timetablesSubmitState.text}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="view-table" className="fixed col-11 col-md-9 p-0 mx-auto">
          <Tab.Container defaultActiveKey="tab-1" activeKey={this.state.activeTab}>
            <Row>
              <Col md={3} className="mb-3">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="tab-1">
                      Info
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-2" onClick={() => this.handleView("courses")} disabled={this.state.pillsState.disabled}>
                      📚 Courses in common
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-3" onClick={() => this.handleView("sections")} disabled={this.state.pillsState.disabled}>
                      🧑‍🏫 Sections in common
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-4" onClick={() => this.handleView("meet")} disabled={this.state.pillsState.disabled}>
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
                            {this.state.pillsState.text}
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
                        <div className='row mb-2'>
                          <div className="col">
                            <div className="d-inline bg-danger bg-gradient">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-square-fill mb-1" viewBox="0 0 16 16" style={{ opacity: 0 }}>
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z" />
                              </svg>
                            </div>
                            <span className='d-inline'> No. of people not free</span>
                          </div>
                          <div className="col">
                            <div className="d-inline text-warning">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                              </svg>
                            </div>
                            <span className='d-inline'> Time now</span>
                          </div>
                        </div>
                        <table className='table table-bordered table-sm' id='meet-table'>
                          <thead>
                            <tr className='d-flex'>
                              <th className='col-2'></th>
                              <th scope='col' className='col'>Mon</th>
                              <th scope='col' className='col'>Tue</th>
                              <th scope='col' className='col'>Wed</th>
                              <th scope='col' className='col'>Thu</th>
                              <th scope='col' className='col'>Fri</th>
                            </tr>
                          </thead>
                          <tbody id="meet">{this.state.meetTableText}</tbody>
                        </table>
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